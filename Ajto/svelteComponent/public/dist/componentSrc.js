
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

    /* src\Door.svelte generated by Svelte v3.29.0 */

    const { console: console_1, document: document_1 } = globals;
    const file = "src\\Door.svelte";

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-d0gv3m-style";
    	style.textContent = ".cirlce.svelte-d0gv3m{width:80px;height:80px;border-radius:0 100% 0 0;position:relative;background:conic-gradient(from 0turn at 0% 100%, transparent 12deg, #109D0D 0deg)}.base.svelte-d0gv3m{position:absolute;margin:auto;left:0;bottom:0;background:#9F9F9F;width:5%;border-radius:10px;height:105%;transform-origin:bottom left;transform:rotate(90deg)\r\n    }.endPosition.svelte-d0gv3m{background-color:#CBCF06;width:10%}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vci5zdmVsdGUiLCJzb3VyY2VzIjpbIkRvb3Iuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgICBpbXBvcnQgeyBvbkRlc3Ryb3ksIG9uTW91bnQgfSBmcm9tIFwic3ZlbHRlXCJcclxuICAgIGV4cG9ydCBsZXQgdmFsdWVDaGFuZ2VFdmVudFxyXG4gICAgZXhwb3J0IGxldCBlbmRBbmdsZSA9IDgwXHJcbiAgICAkOiBjb3JyZWN0RW5kQW5nbGUgPSA5MCAtIGVuZEFuZ2xlXHJcblxyXG4gICAgbGV0IGhhc1JlYWNoZWRTdGFydCA9IGZhbHNlXHJcbiAgICBsZXQgaGFzUmVhY2hlZEVuZCA9IGZhbHNlXHJcblxyXG4gICAgbGV0IGFuZ2xlID0gMzBcclxuICAgICQ6IGNvcnJlY3RBbmdsZSA9IDkwIC0gYW5nbGVcclxuXHJcbiAgICBvbk1vdW50KCgpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlN1YnNjcmliZSBvbiBldmVudDpcIiwgdmFsdWVDaGFuZ2VFdmVudClcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHZhbHVlQ2hhbmdlRXZlbnQsIGV2ZW50SGFuZGxlcilcclxuICAgIH0pXHJcblxyXG4gICAgb25EZXN0cm95KCgpID0+IHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyKVxyXG4gICAgfSlcclxuXHJcbiAgICBmdW5jdGlvbiBldmVudEhhbmRsZXIoZXZlbnQpIHtcclxuICAgICAgICBjb25zdCB7a2V5LCB2YWx1ZX0gPSBldmVudC5kZXRhaWxcclxuICAgICAgICBjb25zb2xlLmxvZyhcImV2ZW50XCIsIGtleSwgdmFsdWUpXHJcbiAgICAgICAgaWYoa2V5ID09PSBcIm9wZW5fYW5nbGVcIikge1xyXG4gICAgICAgICAgICBhbmdsZSA9IHZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuPC9zY3JpcHQ+XHJcblxyXG48ZGl2XHJcbiAgICBjbGFzcz1cImNpcmxjZVwiXHJcbiAgICBzdHlsZT17YGJhY2tncm91bmQ6IGNvbmljLWdyYWRpZW50KGZyb20gMHR1cm4gYXQgMCUgMTAwJSwgdHJhbnNwYXJlbnQgJHtjb3JyZWN0QW5nbGV9ZGVnLCAjMTA5RDBEIDBkZWcpYH1cclxuPlxyXG4gICAgPGRpdiBjbGFzcz1cImJhc2VcIiBjbGFzczplbmRQb3NpdGlvbj17aGFzUmVhY2hlZEVuZH0gc3R5bGU9e2B0cmFuc2Zvcm06IHJvdGF0ZSgke2NvcnJlY3RFbmRBbmdsZX1kZWcpYH0+PC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiYmFzZVwiIGNsYXNzOmVuZFBvc2l0aW9uPXtoYXNSZWFjaGVkU3RhcnR9ID48L2Rpdj5cclxuPC9kaXY+ICAgXHJcblxyXG48ZGl2PlxyXG4gICAgRG9vciBjb21wb25lbnQgLyBTb21laHRpbmcgQ2hhbmdlcyBcclxuPC9kaXY+XHJcblxyXG48c3R5bGU+XHJcbiAgICAuY2lybGNlIHtcclxuICAgICAgICB3aWR0aDogODBweDtcclxuICAgICAgICBoZWlnaHQ6IDgwcHg7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMCAxMDAlIDAgMDtcclxuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgYmFja2dyb3VuZDogY29uaWMtZ3JhZGllbnQoZnJvbSAwdHVybiBhdCAwJSAxMDAlLCB0cmFuc3BhcmVudCAxMmRlZywgIzEwOUQwRCAwZGVnKTtcclxuICAgIH1cclxuXHJcbiAgICAuYmFzZSB7XHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgIG1hcmdpbjogYXV0bztcclxuICAgICAgICBsZWZ0OiAwO1xyXG4gICAgICAgIGJvdHRvbTogMDtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAjOUY5RjlGO1xyXG4gICAgICAgIHdpZHRoOiA1JTtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gICAgICAgIGhlaWdodDogMTA1JTtcclxuICAgICAgICB0cmFuc2Zvcm0tb3JpZ2luOiBib3R0b20gbGVmdDtcclxuICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZylcclxuICAgIH1cclxuXHJcbiAgICAuZW5kUG9zaXRpb24ge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNDQkNGMDY7XHJcbiAgICAgICAgd2lkdGg6IDEwJTtcclxuICAgIH1cclxuPC9zdHlsZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBNENJLE9BQU8sY0FBQyxDQUFDLEFBQ0wsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLGFBQWEsQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ3pCLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLFVBQVUsQ0FBRSxlQUFlLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxBQUN0RixDQUFDLEFBRUQsS0FBSyxjQUFDLENBQUMsQUFDSCxRQUFRLENBQUUsUUFBUSxDQUNsQixNQUFNLENBQUUsSUFBSSxDQUNaLElBQUksQ0FBRSxDQUFDLENBQ1AsTUFBTSxDQUFFLENBQUMsQ0FDVCxVQUFVLENBQUUsT0FBTyxDQUNuQixLQUFLLENBQUUsRUFBRSxDQUNULGFBQWEsQ0FBRSxJQUFJLENBQ25CLE1BQU0sQ0FBRSxJQUFJLENBQ1osZ0JBQWdCLENBQUUsTUFBTSxDQUFDLElBQUksQ0FDN0IsU0FBUyxDQUFFLE9BQU8sS0FBSyxDQUFDO0lBQzVCLENBQUMsQUFFRCxZQUFZLGNBQUMsQ0FBQyxBQUNWLGdCQUFnQixDQUFFLE9BQU8sQ0FDekIsS0FBSyxDQUFFLEdBQUcsQUFDZCxDQUFDIn0= */";
    	append_dev(document_1.head, style);
    }

    function create_fragment(ctx) {
    	let div2;
    	let div0;
    	let div0_style_value;
    	let t0;
    	let div1;
    	let div2_style_value;
    	let t1;
    	let div3;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div3 = element("div");
    			div3.textContent = "Door component / Somehting Changes";
    			attr_dev(div0, "class", "base svelte-d0gv3m");
    			attr_dev(div0, "style", div0_style_value = `transform: rotate(${/*correctEndAngle*/ ctx[0]}deg)`);
    			toggle_class(div0, "endPosition", /*hasReachedEnd*/ ctx[3]);
    			add_location(div0, file, 35, 4, 903);
    			attr_dev(div1, "class", "base svelte-d0gv3m");
    			toggle_class(div1, "endPosition", /*hasReachedStart*/ ctx[2]);
    			add_location(div1, file, 36, 4, 1018);
    			attr_dev(div2, "class", "cirlce svelte-d0gv3m");
    			attr_dev(div2, "style", div2_style_value = `background: conic-gradient(from 0turn at 0% 100%, transparent ${/*correctAngle*/ ctx[1]}deg, #109D0D 0deg)`);
    			add_location(div2, file, 31, 0, 759);
    			add_location(div3, file, 39, 0, 1094);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*correctEndAngle*/ 1 && div0_style_value !== (div0_style_value = `transform: rotate(${/*correctEndAngle*/ ctx[0]}deg)`)) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty & /*hasReachedEnd*/ 8) {
    				toggle_class(div0, "endPosition", /*hasReachedEnd*/ ctx[3]);
    			}

    			if (dirty & /*hasReachedStart*/ 4) {
    				toggle_class(div1, "endPosition", /*hasReachedStart*/ ctx[2]);
    			}

    			if (dirty & /*correctAngle*/ 2 && div2_style_value !== (div2_style_value = `background: conic-gradient(from 0turn at 0% 100%, transparent ${/*correctAngle*/ ctx[1]}deg, #109D0D 0deg)`)) {
    				attr_dev(div2, "style", div2_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Door", slots, []);
    	let { valueChangeEvent } = $$props;
    	let { endAngle = 80 } = $$props;
    	let hasReachedStart = false;
    	let hasReachedEnd = false;
    	let angle = 30;

    	onMount(() => {
    		console.log("Subscribe on event:", valueChangeEvent);
    		document.addEventListener(valueChangeEvent, eventHandler);
    	});

    	onDestroy(() => {
    		document.removeEventListener(eventName, eventHandler);
    	});

    	function eventHandler(event) {
    		const { key, value } = event.detail;
    		console.log("event", key, value);

    		if (key === "open_angle") {
    			$$invalidate(6, angle = value);
    		}
    	}

    	const writable_props = ["valueChangeEvent", "endAngle"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Door> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("valueChangeEvent" in $$props) $$invalidate(4, valueChangeEvent = $$props.valueChangeEvent);
    		if ("endAngle" in $$props) $$invalidate(5, endAngle = $$props.endAngle);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		onMount,
    		valueChangeEvent,
    		endAngle,
    		hasReachedStart,
    		hasReachedEnd,
    		angle,
    		eventHandler,
    		correctEndAngle,
    		correctAngle
    	});

    	$$self.$inject_state = $$props => {
    		if ("valueChangeEvent" in $$props) $$invalidate(4, valueChangeEvent = $$props.valueChangeEvent);
    		if ("endAngle" in $$props) $$invalidate(5, endAngle = $$props.endAngle);
    		if ("hasReachedStart" in $$props) $$invalidate(2, hasReachedStart = $$props.hasReachedStart);
    		if ("hasReachedEnd" in $$props) $$invalidate(3, hasReachedEnd = $$props.hasReachedEnd);
    		if ("angle" in $$props) $$invalidate(6, angle = $$props.angle);
    		if ("correctEndAngle" in $$props) $$invalidate(0, correctEndAngle = $$props.correctEndAngle);
    		if ("correctAngle" in $$props) $$invalidate(1, correctAngle = $$props.correctAngle);
    	};

    	let correctEndAngle;
    	let correctAngle;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*endAngle*/ 32) {
    			 $$invalidate(0, correctEndAngle = 90 - endAngle);
    		}

    		if ($$self.$$.dirty & /*angle*/ 64) {
    			 $$invalidate(1, correctAngle = 90 - angle);
    		}
    	};

    	return [
    		correctEndAngle,
    		correctAngle,
    		hasReachedStart,
    		hasReachedEnd,
    		valueChangeEvent,
    		endAngle
    	];
    }

    class Door extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document_1.getElementById("svelte-d0gv3m-style")) add_css();
    		init(this, options, instance, create_fragment, safe_not_equal, { valueChangeEvent: 4, endAngle: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Door",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*valueChangeEvent*/ ctx[4] === undefined && !("valueChangeEvent" in props)) {
    			console_1.warn("<Door> was created without expected prop 'valueChangeEvent'");
    		}
    	}

    	get valueChangeEvent() {
    		throw new Error("<Door>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueChangeEvent(value) {
    		throw new Error("<Door>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get endAngle() {
    		throw new Error("<Door>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set endAngle(value) {
    		throw new Error("<Door>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    window.DoorComponent = function (options) {
        return new Door(options)
    };

}());
