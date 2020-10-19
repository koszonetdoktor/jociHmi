
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
    function children(element) {
        return Array.from(element.childNodes);
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
    	style.id = "svelte-9asms9-style";
    	style.textContent = "\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vci5zdmVsdGUiLCJzb3VyY2VzIjpbIkRvb3Iuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgICBpbXBvcnQgeyBvbkRlc3Ryb3ksIG9uTW91bnQgfSBmcm9tIFwic3ZlbHRlXCJcclxuICAgIGV4cG9ydCBsZXQgdmFsdWVDaGFuZ2VFdmVudFxyXG4gICAgbGV0IGFuZ2xlXHJcblxyXG4gICAgb25Nb3VudCgoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJTdWJzY3JpYmUgb24gZXZlbnQ6XCIsIHZhbHVlQ2hhbmdlRXZlbnQpXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih2YWx1ZUNoYW5nZUV2ZW50LCBldmVudEhhbmRsZXIpXHJcbiAgICB9KVxyXG5cclxuICAgIG9uRGVzdHJveSgoKSA9PiB7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGV2ZW50SGFuZGxlcilcclxuICAgIH0pXHJcblxyXG4gICAgZnVuY3Rpb24gZXZlbnRIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc3Qge2tleSwgdmFsdWV9ID0gZXZlbnQuZGV0YWlsXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJldmVudFwiLCBrZXksIHZhbHVlKVxyXG4gICAgfVxyXG5cclxuPC9zY3JpcHQ+XHJcblxyXG48IS0tIDxkaXZcclxuICAgIGNsYXNzPVwiY2lybGNlXCJzXHJcbiAgICBzdHlsZT17YGJhY2tncm91bmQ6IGNvbmljLWdyYWRpZW50KGZyb20gMHR1cm4gYXQgMCUgMTAwJSwgIzFCNzRGOCAke2FuZ2xlfWRlZywgIzEwMkE0MiAwZGVnKWB9XHJcbj5cclxuICAgIDxkaXYgY2xhc3M9XCJwb2ludGVyXCIgc3R5bGU9e2B0cmFuc2Zvcm06IHJvdGF0ZSgke2FuZ2xlfWRlZylgfT48L2Rpdj5cclxuPC9kaXY+IC0tPiAgICBcclxuXHJcbjxkaXY+XHJcbiAgICBEb29yIGNvbXBvbmVudCAvIFNvbWVodGluZyBDaGFuZ2VzIFxyXG48L2Rpdj5cclxuXHJcbjxzdHlsZT5cclxuICAgIC5jaXJsY2Uge1xyXG4gICAgICAgIHdpZHRoOiA1MHB4O1xyXG4gICAgICAgIGhlaWdodDogNTBweDtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiAwIDEwMCUgMCAwO1xyXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICMxQjc0Rjg7XHJcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgIGJhY2tncm91bmQ6IGNvbmljLWdyYWRpZW50KGZyb20gMHR1cm4gYXQgMCUgMTAwJSwgIzFCNzRGOCAxMmRlZywgIzEwMkE0MiAwZGVnKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLnBvaW50ZXIge1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICBtYXJnaW46IGF1dG87XHJcbiAgICAgICAgbGVmdDogMDtcclxuICAgICAgICBib3R0b206IDA7XHJcbiAgICAgICAgYmFja2dyb3VuZDogIzFCNzRGODtcclxuICAgICAgICB3aWR0aDogMiU7XHJcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDU0ZGVnKTtcclxuICAgICAgICB0cmFuc2Zvcm0tb3JpZ2luOiBib3R0b20gbGVmdDtcclxuICAgIH1cclxuPC9zdHlsZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiJ9 */";
    	append_dev(document_1.head, style);
    }

    function create_fragment(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Door component / Somehting Changes";
    			add_location(div, file, 28, 0, 735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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

    function eventHandler(event) {
    	const { key, value } = event.detail;
    	console.log("event", key, value);
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Door", slots, []);
    	let { valueChangeEvent } = $$props;
    	let angle;

    	onMount(() => {
    		console.log("Subscribe on event:", valueChangeEvent);
    		document.addEventListener(valueChangeEvent, eventHandler);
    	});

    	onDestroy(() => {
    		document.removeEventListener(eventName, eventHandler);
    	});

    	const writable_props = ["valueChangeEvent"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Door> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("valueChangeEvent" in $$props) $$invalidate(0, valueChangeEvent = $$props.valueChangeEvent);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		onMount,
    		valueChangeEvent,
    		angle,
    		eventHandler
    	});

    	$$self.$inject_state = $$props => {
    		if ("valueChangeEvent" in $$props) $$invalidate(0, valueChangeEvent = $$props.valueChangeEvent);
    		if ("angle" in $$props) angle = $$props.angle;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [valueChangeEvent];
    }

    class Door extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		if (!document_1.getElementById("svelte-9asms9-style")) add_css();
    		init(this, options, instance, create_fragment, safe_not_equal, { valueChangeEvent: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Door",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*valueChangeEvent*/ ctx[0] === undefined && !("valueChangeEvent" in props)) {
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
