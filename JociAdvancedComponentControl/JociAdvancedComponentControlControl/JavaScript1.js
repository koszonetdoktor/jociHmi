﻿// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.742.4/runtimes/native1.12-tchmi/TcHmi.d.ts" />

console.log("IMPORTED custom script")

!function () { "use strict"; function t() { } function e(t) { return t() } function n() { return Object.create(null) } function o(t) { t.forEach(e) } function r(t) { return "function" == typeof t } function c(t, e) { return t != t ? e == e : t !== e || t && "object" == typeof t || "function" == typeof t } function u(t, e) { t.appendChild(e) } function l(t) { t.parentNode.removeChild(t) } function i(t) { return document.createElement(t) } function s(t) { return document.createTextNode(t) } function f(t, e, n) { null == n ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n) } function a(t, e) { e = "" + e, t.wholeText !== e && (t.data = e) } let d; function $(t) { d = t } const p = [], h = [], m = [], g = [], b = Promise.resolve(); let y = !1; function x(t) { m.push(t) } let v = !1; const _ = new Set; function k() { if (!v) { v = !0; do { for (let t = 0; t < p.length; t += 1) { const e = p[t]; $(e), w(e.$$) } for ($(null), p.length = 0; h.length;)h.pop()(); for (let t = 0; t < m.length; t += 1) { const e = m[t]; _.has(e) || (_.add(e), e()) } m.length = 0 } while (p.length); for (; g.length;)g.pop()(); y = !1, v = !1, _.clear() } } function w(t) { if (null !== t.fragment) { t.update(), o(t.before_update); const e = t.dirty; t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(x) } } const E = new Set; function A(t, e) { -1 === t.$$.dirty[0] && (p.push(t), y || (y = !0, b.then(k)), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31 } function C(c, u, i, s, f, a, p = [-1]) { const h = d; $(c); const m = u.props || {}, g = c.$$ = { fragment: null, ctx: null, props: a, update: t, not_equal: f, bound: n(), on_mount: [], on_destroy: [], before_update: [], after_update: [], context: new Map(h ? h.$$.context : []), callbacks: n(), dirty: p, skip_bound: !1 }; let b = !1; if (g.ctx = i ? i(c, m, (t, e, ...n) => { const o = n.length ? n[0] : e; return g.ctx && f(g.ctx[t], g.ctx[t] = o) && (!g.skip_bound && g.bound[t] && g.bound[t](o), b && A(c, t)), e }) : [], g.update(), b = !0, o(g.before_update), g.fragment = !!s && s(g.ctx), u.target) { if (u.hydrate) { const t = function (t) { return Array.from(t.childNodes) }(u.target); g.fragment && g.fragment.l(t), t.forEach(l) } else g.fragment && g.fragment.c(); u.intro && ((y = c.$$.fragment) && y.i && (E.delete(y), y.i(v))), function (t, n, c) { const { fragment: u, on_mount: l, on_destroy: i, after_update: s } = t.$$; u && u.m(n, c), x(() => { const n = l.map(e).filter(r); i ? i.push(...n) : o(n), t.$$.on_mount = [] }), s.forEach(x) }(c, u.target, u.anchor), k() } var y, v; $(h) } function j(e) { let n, o, r, c, d, $, p, h, m = 1 === e[1] ? "time" : "times"; return { c() { n = i("button"), o = s("Clicked "), r = s(e[1]), c = s(" "), d = s(m), f(n, "style", $ = "background-color: " + e[0]), f(n, "class", "svelte-1dxv4w") }, m(t, l) { var i, s, f, a; !function (t, e, n) { t.insertBefore(e, n || null) }(t, n, l), u(n, o), u(n, r), u(n, c), u(n, d), p || (i = n, s = "click", f = e[2], i.addEventListener(s, f, a), h = () => i.removeEventListener(s, f, a), p = !0) }, p(t, [e]) { 2 & e && a(r, t[1]), 2 & e && m !== (m = 1 === t[1] ? "time" : "times") && a(d, m), 1 & e && $ !== ($ = "background-color: " + t[0]) && f(n, "style", $) }, i: t, o: t, d(t) { t && l(n), p = !1, h() } } } function B(t, e, n) { let o = 0, { color: r } = e; return console.log("color", r), t.$$set = t => { "color" in t && n(0, r = t.color) }, [r, o, function () { n(1, o += 1) }] } class N extends class { $destroy() { !function (t, e) { const n = t.$$; null !== n.fragment && (o(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []) }(this, 1), this.$destroy = t } $on(t, e) { const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []); return n.push(e), () => { const t = n.indexOf(e); -1 !== t && n.splice(t, 1) } } $set(t) { var e; this.$$set && (e = t, 0 !== Object.keys(e).length) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1) } }{ constructor(t) { var e; super(), document.getElementById("svelte-1dxv4w-style") || ((e = i("style")).id = "svelte-1dxv4w-style", e.textContent = "button.svelte-1dxv4w{background-color:blue}", u(document.head, e)), C(this, t, B, j, c, { color: 0 }) } } window.AddButton = function (t) { return new N(t) } }();
