!function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function c(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function u(t){t.parentNode.removeChild(t)}let i;function a(t){i=t}function s(){if(!i)throw new Error("Function called outside component initialization");return i}const f=[],l=[],d=[],h=[],$=Promise.resolve();let p=!1;function m(t){d.push(t)}let g=!1;const v=new Set;function y(){if(!g){g=!0;do{for(let t=0;t<f.length;t+=1){const n=f[t];a(n),_(n.$$)}for(a(null),f.length=0;l.length;)l.pop()();for(let t=0;t<d.length;t+=1){const n=d[t];v.has(n)||(v.add(n),n())}d.length=0}while(f.length);for(;h.length;)h.pop()();p=!1,g=!1,v.clear()}}function _(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(m)}}const b=new Set;function x(t,n){-1===t.$$.dirty[0]&&(f.push(t),p||(p=!0,$.then(y)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function E(c,s,f,l,d,h,$=[-1]){const p=i;a(c);const g=s.props||{},v=c.$$={fragment:null,ctx:null,props:h,update:t,not_equal:d,bound:e(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(p?p.$$.context:[]),callbacks:e(),dirty:$,skip_bound:!1};let _=!1;if(v.ctx=f?f(c,g,(t,n,...e)=>{const o=e.length?e[0]:n;return v.ctx&&d(v.ctx[t],v.ctx[t]=o)&&(!v.skip_bound&&v.bound[t]&&v.bound[t](o),_&&x(c,t)),n}):[],v.update(),_=!0,o(v.before_update),v.fragment=!!l&&l(v.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);v.fragment&&v.fragment.l(t),t.forEach(u)}else v.fragment&&v.fragment.c();s.intro&&((E=c.$$.fragment)&&E.i&&(b.delete(E),E.i(k))),function(t,e,c){const{fragment:u,on_mount:i,on_destroy:a,after_update:s}=t.$$;u&&u.m(e,c),m(()=>{const e=i.map(n).filter(r);a?a.push(...e):o(e),t.$$.on_mount=[]}),s.forEach(m)}(c,s.target,s.anchor),y()}var E,k;a(p)}function k(n){let e;return{c(){var t;t="div",e=document.createElement(t),e.textContent="Door component / Somehting Changes"},m(t,n){!function(t,n,e){t.insertBefore(n,e||null)}(t,e,n)},p:t,i:t,o:t,d(t){t&&u(e)}}}function w(t){const{key:n,value:e}=t.detail;console.log("event",n,e)}function C(t,n,e){let{valueChangeEvent:o}=n;var r;return r=()=>{console.log("Subscribe on event:",eventName),document.addEventListener(o,w)},s().$$.on_mount.push(r),function(t){s().$$.on_destroy.push(t)}(()=>{document.removeEventListener(eventName,w)}),t.$$set=t=>{"valueChangeEvent"in t&&e(0,o=t.valueChangeEvent)},[o]}class N extends class{$destroy(){!function(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),E(this,t,C,k,c,{valueChangeEvent:0})}}window.DoorComponent=function(t){return new N(t)}}();
