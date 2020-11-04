
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const defaultTheme = {
        color: {
            green: "#27AA83",
            yellow: "#CBCF06",
            gray: "#617D98",
            blue: "#5B5DEC",
            lightGreen: "#8CEDC6",
            lightBlue: "#A2A7FB",
        },
    };
    const createRootTheme = (theme = defaultTheme) => {
        let themeName = "theme";
        if (theme.name) {
            themeName = theme.name;
        }
        document.documentElement.style.setProperty("--theme-name", theme.name);
        if (theme.color) {
            Object.keys(theme.color).forEach((colorKey) => {
                document.documentElement.style.setProperty(`--${themeName}-color-${colorKey}`, theme.color[colorKey]);
            });
        }
    };
    const groupColorMap = {
        [0]: "var(--theme-color-gray)",
        [1]: "var(--theme-color-lightGreen)",
        [2]: "var(--theme-color-lightBlue)",
    };

    /* src\Door.svelte generated by Svelte v3.29.0 */

    const { console: console_1, document: document_1 } = globals;
    const file = "src\\Door.svelte";

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-ivagvb-style";
    	style.textContent = ".container.svelte-ivagvb{width:72px;height:72px;padding:8px;position:relative;display:flex;align-items:flex-end;border-radius:5px;font-family:'Open Sans', sans-serif}.cirlce.svelte-ivagvb{width:50px;height:50px;border-radius:0 100% 0 0;position:relative;background:conic-gradient(from 0turn at 0% 100%, transparent 12deg, var(--theme-color-green) 0deg)}.base.svelte-ivagvb{position:absolute;margin:auto;left:0;bottom:0;background:var(--theme-color-gray);width:5%;border-radius:10px;height:100%;transform-origin:bottom left;transform:rotate(90deg)\r\n    }.inPosition.svelte-ivagvb{background-color:var(--theme-color-yellow);width:10%}.position_container.svelte-ivagvb{position:absolute;top:2px;right:1rem;text-align:right}.position_target.svelte-ivagvb{color:var(--theme-color-gray)}.position_current.svelte-ivagvb{color:var(--theme-color-green)}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vci5zdmVsdGUiLCJzb3VyY2VzIjpbIkRvb3Iuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQgbGFuZz1cInRzXCI+aW1wb3J0IHsgb25EZXN0cm95LCBvbk1vdW50IH0gZnJvbSBcInN2ZWx0ZVwiO1xyXG5pbXBvcnQgeyBjcmVhdGVSb290VGhlbWUsIGdyb3VwQ29sb3JNYXAgfSBmcm9tIFwiLi90aGVtZVwiO1xyXG47XHJcbmV4cG9ydCBsZXQgdmFsdWVDaGFuZ2VFdmVudDtcclxuY3JlYXRlUm9vdFRoZW1lKCk7XHJcbmxldCBoYXNSZWFjaGVkU3RhcnQgPSBmYWxzZTtcclxubGV0IGhhc1JlYWNoZWRFbmQgPSBmYWxzZTtcclxubGV0IHRhcmdldFBvc2l0aW9uID0gXCIwXCI7XHJcbmxldCBjdXJyZW50UG9zaXRpb24gPSBcIjBcIjtcclxubGV0IHNlbGVjdGVkR3JvdXAgPSAwO1xyXG5sZXQgZW5kQW5nbGUgPSA5MDtcclxuJDogY29ycmVjdEVuZEFuZ2xlID0gOTAgLSBlbmRBbmdsZTtcclxubGV0IG9wZW5BbmdsZSA9IDMwO1xyXG4kOiBjb3JyZWN0QW5nbGUgPSA5MCAtIG9wZW5BbmdsZTtcclxub25Nb3VudCgoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHZhbHVlQ2hhbmdlRXZlbnQsIGV2ZW50SGFuZGxlcik7XHJcbn0pO1xyXG5vbkRlc3Ryb3koKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih2YWx1ZUNoYW5nZUV2ZW50LCBldmVudEhhbmRsZXIpO1xyXG59KTtcclxuZnVuY3Rpb24gZXZlbnRIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCB7IGtleSwgdmFsdWUgfSA9IGV2ZW50LmRldGFpbDtcclxuICAgIGNvbnNvbGUubG9nKFwiRVZFTlRcIiwga2V5LCB2YWx1ZSk7XHJcbiAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgIGNhc2UgXCJvcGVuX2FuZ2xlXCI6XHJcbiAgICAgICAgICAgIG9wZW5BbmdsZSA9IGxpbWl0QW5nbGUoTnVtYmVyKHZhbHVlKSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJlbmRfYW5nbGVcIjpcclxuICAgICAgICAgICAgZW5kQW5nbGUgPSBsaW1pdEFuZ2xlKE51bWJlcih2YWx1ZSkpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiZW5kX3Bvc2l0aW9uXCI6XHJcbiAgICAgICAgICAgIGhhc1JlYWNoZWRFbmQgPSBCb29sZWFuKHZhbHVlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInN0YXJ0X3Bvc2l0aW9uXCI6XHJcbiAgICAgICAgICAgIGhhc1JlYWNoZWRTdGFydCA9IEJvb2xlYW4odmFsdWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwidGFyZ2V0X3Bvc2l0aW9uXCI6XHJcbiAgICAgICAgICAgIHRhcmdldFBvc2l0aW9uID0gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdmFsdWUgOiBcIjBcIjtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcImN1cnJlbnRfcG9zaXRpb25cIjpcclxuICAgICAgICAgICAgY3VycmVudFBvc2l0aW9uID0gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdmFsdWUgOiBcIjBcIjtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcImdyb3VwXCI6XHJcbiAgICAgICAgICAgIHNlbGVjdGVkR3JvdXAgPSB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgPyB2YWx1ZSA6IDA7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGxpbWl0QW5nbGUoYW5nbGVWYWx1ZSkge1xyXG4gICAgbGV0IGxpbWl0ZWRWYWx1ZSA9IGFuZ2xlVmFsdWU7XHJcbiAgICBpZiAobGltaXRlZFZhbHVlID4gOTApIHtcclxuICAgICAgICBsaW1pdGVkVmFsdWUgPSA5MDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGxpbWl0ZWRWYWx1ZSA8IDApIHtcclxuICAgICAgICBsaW1pdGVkVmFsdWUgPSAwO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxpbWl0ZWRWYWx1ZTtcclxufVxyXG48L3NjcmlwdD5cclxuXHJcbjxkaXYgY2xhc3M9XCJjb250YWluZXJcIiBzdHlsZT17YGJvcmRlcjogM3B4IHNvbGlkICR7Z3JvdXBDb2xvck1hcFtzZWxlY3RlZEdyb3VwXX07YH0+XHJcbiAgICA8ZGl2IGNsYXNzPVwicG9zaXRpb25fY29udGFpbmVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInBvc2l0aW9uX3RhcmdldFwiPnt0YXJnZXRQb3NpdGlvbn08L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicG9zaXRpb25fY3VycmVudFwiPntjdXJyZW50UG9zaXRpb259PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXZcclxuICAgICAgICBjbGFzcz1cImNpcmxjZVwiXHJcbiAgICAgICAgc3R5bGU9e2BiYWNrZ3JvdW5kOiBjb25pYy1ncmFkaWVudChmcm9tIDB0dXJuIGF0IDAlIDEwMCUsIHRyYW5zcGFyZW50ICR7Y29ycmVjdEFuZ2xlfWRlZywgdmFyKC0tdGhlbWUtY29sb3ItZ3JlZW4pIDBkZWcpYH1cclxuICAgID5cclxuICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgIGNsYXNzPVwiYmFzZVwiXHJcbiAgICAgICAgICAgIGNsYXNzOmluUG9zaXRpb249e2hhc1JlYWNoZWRFbmR9XHJcbiAgICAgICAgICAgIHN0eWxlPXtgdHJhbnNmb3JtOiByb3RhdGUoJHtjb3JyZWN0RW5kQW5nbGV9ZGVnKWB9XHJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibWFya2VyX2VuZFBvc2l0aW9uXCJcclxuICAgICAgICA+PC9kaXY+XHJcbiAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICBjbGFzcz1cImJhc2VcIlxyXG4gICAgICAgICAgICBjbGFzczppblBvc2l0aW9uPXtoYXNSZWFjaGVkU3RhcnR9XHJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibWFya2VyX3N0YXJ0UG9zaXRpb25cIlxyXG4gICAgICAgID48L2Rpdj5cclxuICAgIDwvZGl2PiAgIFxyXG5cclxuPC9kaXY+XHJcblxyXG5cclxuPHN0eWxlPlxyXG5cclxuICAgIC5jb250YWluZXIge1xyXG4gICAgICAgIHdpZHRoOiA3MnB4O1xyXG4gICAgICAgIGhlaWdodDogNzJweDtcclxuICAgICAgICBwYWRkaW5nOiA4cHg7XHJcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgICAgICBmb250LWZhbWlseTogJ09wZW4gU2FucycsIHNhbnMtc2VyaWY7XHJcbiAgICB9XHJcblxyXG4gICAgLmNpcmxjZSB7XHJcbiAgICAgICAgd2lkdGg6IDUwcHg7XHJcbiAgICAgICAgaGVpZ2h0OiA1MHB4O1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDAgMTAwJSAwIDA7XHJcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgIGJhY2tncm91bmQ6IGNvbmljLWdyYWRpZW50KGZyb20gMHR1cm4gYXQgMCUgMTAwJSwgdHJhbnNwYXJlbnQgMTJkZWcsIHZhcigtLXRoZW1lLWNvbG9yLWdyZWVuKSAwZGVnKTtcclxuICAgIH1cclxuXHJcbiAgICAuYmFzZSB7XHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgIG1hcmdpbjogYXV0bztcclxuICAgICAgICBsZWZ0OiAwO1xyXG4gICAgICAgIGJvdHRvbTogMDtcclxuICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS10aGVtZS1jb2xvci1ncmF5KTtcclxuICAgICAgICB3aWR0aDogNSU7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgdHJhbnNmb3JtLW9yaWdpbjogYm90dG9tIGxlZnQ7XHJcbiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpXHJcbiAgICB9XHJcblxyXG4gICAgLmluUG9zaXRpb24ge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRoZW1lLWNvbG9yLXllbGxvdyk7XHJcbiAgICAgICAgd2lkdGg6IDEwJTtcclxuICAgIH1cclxuXHJcbiAgICAucG9zaXRpb25fY29udGFpbmVyIHtcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgdG9wOiAycHg7XHJcbiAgICAgICAgcmlnaHQ6IDFyZW07XHJcbiAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XHJcbiAgICB9XHJcbiAgICAucG9zaXRpb25fdGFyZ2V0IHtcclxuICAgICAgICBjb2xvcjogdmFyKC0tdGhlbWUtY29sb3ItZ3JheSk7XHJcbiAgICB9XHJcbiAgICAucG9zaXRpb25fY3VycmVudCB7XHJcbiAgICAgICAgY29sb3I6IHZhcigtLXRoZW1lLWNvbG9yLWdyZWVuKTtcclxuICAgIH1cclxuPC9zdHlsZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBd0ZJLFVBQVUsY0FBQyxDQUFDLEFBQ1IsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE9BQU8sQ0FBRSxHQUFHLENBQ1osUUFBUSxDQUFFLFFBQVEsQ0FDbEIsT0FBTyxDQUFFLElBQUksQ0FDYixXQUFXLENBQUUsUUFBUSxDQUNyQixhQUFhLENBQUUsR0FBRyxDQUNsQixXQUFXLENBQUUsV0FBVyxDQUFDLENBQUMsVUFBVSxBQUN4QyxDQUFDLEFBRUQsT0FBTyxjQUFDLENBQUMsQUFDTCxLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osYUFBYSxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDekIsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsVUFBVSxDQUFFLGVBQWUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLENBQUMsSUFBSSxDQUFDLEFBQ3ZHLENBQUMsQUFFRCxLQUFLLGNBQUMsQ0FBQyxBQUNILFFBQVEsQ0FBRSxRQUFRLENBQ2xCLE1BQU0sQ0FBRSxJQUFJLENBQ1osSUFBSSxDQUFFLENBQUMsQ0FDUCxNQUFNLENBQUUsQ0FBQyxDQUNULFVBQVUsQ0FBRSxJQUFJLGtCQUFrQixDQUFDLENBQ25DLEtBQUssQ0FBRSxFQUFFLENBQ1QsYUFBYSxDQUFFLElBQUksQ0FDbkIsTUFBTSxDQUFFLElBQUksQ0FDWixnQkFBZ0IsQ0FBRSxNQUFNLENBQUMsSUFBSSxDQUM3QixTQUFTLENBQUUsT0FBTyxLQUFLLENBQUM7SUFDNUIsQ0FBQyxBQUVELFdBQVcsY0FBQyxDQUFDLEFBQ1QsZ0JBQWdCLENBQUUsSUFBSSxvQkFBb0IsQ0FBQyxDQUMzQyxLQUFLLENBQUUsR0FBRyxBQUNkLENBQUMsQUFFRCxtQkFBbUIsY0FBQyxDQUFDLEFBQ2pCLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLEdBQUcsQ0FBRSxHQUFHLENBQ1IsS0FBSyxDQUFFLElBQUksQ0FDWCxVQUFVLENBQUUsS0FBSyxBQUNyQixDQUFDLEFBQ0QsZ0JBQWdCLGNBQUMsQ0FBQyxBQUNkLEtBQUssQ0FBRSxJQUFJLGtCQUFrQixDQUFDLEFBQ2xDLENBQUMsQUFDRCxpQkFBaUIsY0FBQyxDQUFDLEFBQ2YsS0FBSyxDQUFFLElBQUksbUJBQW1CLENBQUMsQUFDbkMsQ0FBQyJ9 */";
    	append_dev(document_1.head, style);
    }

    function create_fragment(ctx) {
    	let div6;
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let div5;
    	let div3;
    	let div3_style_value;
    	let t4;
    	let div4;
    	let div5_style_value;
    	let div6_style_value;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(/*targetPosition*/ ctx[2]);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(/*currentPosition*/ ctx[3]);
    			t3 = space();
    			div5 = element("div");
    			div3 = element("div");
    			t4 = space();
    			div4 = element("div");
    			attr_dev(div0, "class", "position_target svelte-ivagvb");
    			add_location(div0, file, 63, 8, 1915);
    			attr_dev(div1, "class", "position_current svelte-ivagvb");
    			add_location(div1, file, 64, 8, 1976);
    			attr_dev(div2, "class", "position_container svelte-ivagvb");
    			add_location(div2, file, 62, 4, 1873);
    			attr_dev(div3, "class", "base svelte-ivagvb");
    			attr_dev(div3, "style", div3_style_value = `transform: rotate(${/*correctEndAngle*/ ctx[5]}deg)`);
    			attr_dev(div3, "data-testid", "marker_endPosition");
    			toggle_class(div3, "inPosition", /*hasReachedEnd*/ ctx[1]);
    			add_location(div3, file, 70, 8, 2224);
    			attr_dev(div4, "class", "base svelte-ivagvb");
    			attr_dev(div4, "data-testid", "marker_startPosition");
    			toggle_class(div4, "inPosition", /*hasReachedStart*/ ctx[0]);
    			add_location(div4, file, 76, 8, 2437);
    			attr_dev(div5, "class", "cirlce svelte-ivagvb");
    			attr_dev(div5, "style", div5_style_value = `background: conic-gradient(from 0turn at 0% 100%, transparent ${/*correctAngle*/ ctx[6]}deg, var(--theme-color-green) 0deg)`);
    			add_location(div5, file, 66, 4, 2047);
    			attr_dev(div6, "class", "container svelte-ivagvb");
    			attr_dev(div6, "style", div6_style_value = `border: 3px solid ${groupColorMap[/*selectedGroup*/ ctx[4]]};`);
    			add_location(div6, file, 61, 0, 1783);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div6, t3);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*targetPosition*/ 4) set_data_dev(t0, /*targetPosition*/ ctx[2]);
    			if (dirty & /*currentPosition*/ 8) set_data_dev(t2, /*currentPosition*/ ctx[3]);

    			if (dirty & /*correctEndAngle*/ 32 && div3_style_value !== (div3_style_value = `transform: rotate(${/*correctEndAngle*/ ctx[5]}deg)`)) {
    				attr_dev(div3, "style", div3_style_value);
    			}

    			if (dirty & /*hasReachedEnd*/ 2) {
    				toggle_class(div3, "inPosition", /*hasReachedEnd*/ ctx[1]);
    			}

    			if (dirty & /*hasReachedStart*/ 1) {
    				toggle_class(div4, "inPosition", /*hasReachedStart*/ ctx[0]);
    			}

    			if (dirty & /*correctAngle*/ 64 && div5_style_value !== (div5_style_value = `background: conic-gradient(from 0turn at 0% 100%, transparent ${/*correctAngle*/ ctx[6]}deg, var(--theme-color-green) 0deg)`)) {
    				attr_dev(div5, "style", div5_style_value);
    			}

    			if (dirty & /*selectedGroup*/ 16 && div6_style_value !== (div6_style_value = `border: 3px solid ${groupColorMap[/*selectedGroup*/ ctx[4]]};`)) {
    				attr_dev(div6, "style", div6_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function limitAngle(angleValue) {
    	let limitedValue = angleValue;

    	if (limitedValue > 90) {
    		limitedValue = 90;
    	} else if (limitedValue < 0) {
    		limitedValue = 0;
    	}

    	return limitedValue;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Door", slots, []);
    	
    	let { valueChangeEvent } = $$props;
    	createRootTheme();
    	let hasReachedStart = false;
    	let hasReachedEnd = false;
    	let targetPosition = "0";
    	let currentPosition = "0";
    	let selectedGroup = 0;
    	let endAngle = 90;
    	let openAngle = 30;

    	onMount(() => {
    		document.addEventListener(valueChangeEvent, eventHandler);
    	});

    	onDestroy(() => {
    		document.removeEventListener(valueChangeEvent, eventHandler);
    	});

    	function eventHandler(event) {
    		const { key, value } = event.detail;
    		console.log("EVENT", key, value);

    		switch (key) {
    			case "open_angle":
    				$$invalidate(9, openAngle = limitAngle(Number(value)));
    				break;
    			case "end_angle":
    				$$invalidate(8, endAngle = limitAngle(Number(value)));
    				break;
    			case "end_position":
    				$$invalidate(1, hasReachedEnd = Boolean(value));
    				break;
    			case "start_position":
    				$$invalidate(0, hasReachedStart = Boolean(value));
    				break;
    			case "target_position":
    				$$invalidate(2, targetPosition = typeof value === "string" ? value : "0");
    				break;
    			case "current_position":
    				$$invalidate(3, currentPosition = typeof value === "string" ? value : "0");
    				break;
    			case "group":
    				$$invalidate(4, selectedGroup = typeof value === "number" ? value : 0);
    				break;
    		}
    	}

    	const writable_props = ["valueChangeEvent"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Door> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("valueChangeEvent" in $$props) $$invalidate(7, valueChangeEvent = $$props.valueChangeEvent);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		onMount,
    		createRootTheme,
    		groupColorMap,
    		valueChangeEvent,
    		hasReachedStart,
    		hasReachedEnd,
    		targetPosition,
    		currentPosition,
    		selectedGroup,
    		endAngle,
    		openAngle,
    		eventHandler,
    		limitAngle,
    		correctEndAngle,
    		correctAngle
    	});

    	$$self.$inject_state = $$props => {
    		if ("valueChangeEvent" in $$props) $$invalidate(7, valueChangeEvent = $$props.valueChangeEvent);
    		if ("hasReachedStart" in $$props) $$invalidate(0, hasReachedStart = $$props.hasReachedStart);
    		if ("hasReachedEnd" in $$props) $$invalidate(1, hasReachedEnd = $$props.hasReachedEnd);
    		if ("targetPosition" in $$props) $$invalidate(2, targetPosition = $$props.targetPosition);
    		if ("currentPosition" in $$props) $$invalidate(3, currentPosition = $$props.currentPosition);
    		if ("selectedGroup" in $$props) $$invalidate(4, selectedGroup = $$props.selectedGroup);
    		if ("endAngle" in $$props) $$invalidate(8, endAngle = $$props.endAngle);
    		if ("openAngle" in $$props) $$invalidate(9, openAngle = $$props.openAngle);
    		if ("correctEndAngle" in $$props) $$invalidate(5, correctEndAngle = $$props.correctEndAngle);
    		if ("correctAngle" in $$props) $$invalidate(6, correctAngle = $$props.correctAngle);
    	};

    	let correctEndAngle;
    	let correctAngle;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*endAngle*/ 256) {
    			 $$invalidate(5, correctEndAngle = 90 - endAngle);
    		}

    		if ($$self.$$.dirty & /*openAngle*/ 512) {
    			 $$invalidate(6, correctAngle = 90 - openAngle);
    		}
    	};

    	return [
    		hasReachedStart,
    		hasReachedEnd,
    		targetPosition,
    		currentPosition,
    		selectedGroup,
    		correctEndAngle,
    		correctAngle,
    		valueChangeEvent
    	];
    }

    class Door extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document_1.getElementById("svelte-ivagvb-style")) add_css();
    		init(this, options, instance, create_fragment, safe_not_equal, { valueChangeEvent: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Door",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*valueChangeEvent*/ ctx[7] === undefined && !("valueChangeEvent" in props)) {
    			console_1.warn("<Door> was created without expected prop 'valueChangeEvent'");
    		}
    	}

    	get valueChangeEvent() {
    		throw new Error("<Door>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueChangeEvent(value) {
    		throw new Error("<Door>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    window.DoorComponent = function (options) {
        return new Door(options)
    };

}());
