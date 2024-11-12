"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[382],{4205:function(e,t,n){n.d(t,{SideMenu:function(){return x}});var r=n(7437);function o(e){let{isOpen:t,setIsOpen:n}=e,o="w-6 h-0.5 bg-black rounded transform transition-transform duration-300 ease-in-out";return(0,r.jsxs)("button",{onClick:()=>n(!t),className:" flex flex-col gap-1 justify-center items-center w-10 h-10 rounded-lg fixed right-3 top-3 active:outline-none p-2 hover:bg-gray-200 transition-all",style:{zIndex:15},children:[(0,r.jsx)("span",{className:"".concat(o," ").concat(t?"rotate-45 translate-y-1.5":"")}),(0,r.jsx)("span",{className:"w-6 h-0.5 bg-black rounded transition-opacity duration-300 ease-in-out ".concat(t?"opacity-0":"opacity-100")}),(0,r.jsx)("span",{className:"".concat(o," ").concat(t?"-rotate-45 -translate-y-1.5":"")})]})}var s=n(2265);function c(e){let{title:t,className:n}=e;return(0,r.jsx)("p",{className:"text-sm text-gray-500 ".concat(n),children:t})}var a=n(231),i=n.n(a);function l(e){let{count:t}=e;return(0,r.jsx)("span",{className:"text-gray-400",children:t})}function u(e){let{icon:t,title:n,count:o,href:s}=e;return(0,r.jsxs)(i(),{href:s,className:" px-2 py-1 mb-1 flex justify-between hover:bg-gray-300 transition-colors rounded-lg ",children:[(0,r.jsxs)("div",{className:"flex items-center",children:[(0,r.jsx)("div",{className:"mr-3 text-xl",children:t}),(0,r.jsx)("div",{className:"",children:n})]}),-1!==o&&(0,r.jsx)(l,{count:o})]})}var f=n(9726);function d(e){let{res:t,params:n,setIsOpen:o}=e;return(0,r.jsx)("div",{className:"pb-5 flex flex-col overflow-y-auto overscroll-contain",children:t.map((e,t)=>e.isOutLine?(0,r.jsxs)(i(),{href:"/".concat(encodeURIComponent(n.subject),"/").concat(encodeURIComponent(e.originalName)),onClick:()=>o(!1),children:[e.order,". ",e.title]},e.order):(0,r.jsxs)(i(),{href:"/".concat(encodeURIComponent(n.subject),"/").concat(encodeURIComponent(e.originalName)),className:"ml-3",onClick:()=>o(!1),children:[e.order,". ",e.title]},e.order))})}function p(e){let{isOpen:t,setIsOpen:n,res:o,params:s}=e;return(0,r.jsxs)("div",{className:"\n                fixed\n                top-0\n                right-0\n                flex\n                flex-col\n                px-5\n                h-full\n                w-7/12\n                bg-white\n                shadow-lg\n                transform\n                transition-transform\n                duration-300\n                ease-in-out\n                ".concat(t?"translate-x-0":"translate-x-full","\n                "),style:{zIndex:10},children:[(0,r.jsx)(c,{title:"메인메뉴",className:"mt-12"}),(0,r.jsxs)("div",{className:"flex flex-col border-b-2 border-gray-300",children:[(0,r.jsx)(u,{href:"/",icon:(0,r.jsx)(f.NM5,{}),title:"소개",count:-1}),(0,r.jsx)(u,{href:"/",icon:(0,r.jsx)(f.oFx,{}),title:"컴퓨터 과학",count:0}),(0,r.jsx)(u,{href:"/",icon:(0,r.jsx)(f.s2,{}),title:"데브",count:0}),(0,r.jsx)(u,{href:"/",icon:(0,r.jsx)(f.PNL,{}),title:"리눅스/도커",count:0}),(0,r.jsx)(u,{href:"/",icon:(0,r.jsx)(f.MG0,{}),title:"깃헙",count:0})]}),o&&s&&(0,r.jsx)(c,{title:"목차",className:"mt-2"}),o&&s&&(0,r.jsx)(d,{res:o,params:s,setIsOpen:n})]})}function m(e){let{isOpen:t,setIsOpen:n}=e;return(0,s.useEffect)(()=>(t?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[t]),(0,r.jsx)("div",{className:"\n        w-screen\n        h-screen\n        bg-white\n        blur-lg\n        fixed\n        left-0\n        top-0\n        transition-opacity\n        duration-300\n        ".concat(t?"opacity-70":"opacity-0 pointer-events-none"),style:{zIndex:5},onClick:()=>n(!1)})}function x(e){let{res:t,params:n}=e,[c,a]=(0,s.useState)(!1);return(0,r.jsxs)("div",{className:"".concat("lg:hidden"),children:[(0,r.jsx)(o,{isOpen:c,setIsOpen:a}),(0,r.jsx)(p,{isOpen:c,setIsOpen:a,res:t,params:n}),(0,r.jsx)(m,{isOpen:c,setIsOpen:a})]})}},1810:function(e,t,n){n.d(t,{w_:function(){return u}});var r=n(2265),o={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},s=r.createContext&&r.createContext(o),c=["attr","size","title"];function a(){return(a=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach(function(t){var r,o;r=t,o=n[t],(r=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=typeof r)return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(r))in e?Object.defineProperty(e,r,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[r]=o}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function u(e){return t=>r.createElement(f,a({attr:l({},e.attr)},t),function e(t){return t&&t.map((t,n)=>r.createElement(t.tag,l({key:n},t.attr),e(t.child)))}(e.child))}function f(e){var t=t=>{var n,{attr:o,size:s,title:i}=e,u=function(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n={};for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){if(t.indexOf(r)>=0)continue;n[r]=e[r]}return n}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],!(t.indexOf(n)>=0)&&Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}(e,c),f=s||t.size||"1em";return t.className&&(n=t.className),e.className&&(n=(n?n+" ":"")+e.className),r.createElement("svg",a({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},t.attr,o,u,{className:n,style:l(l({color:e.color||t.color},t.style),e.style),height:f,width:f,xmlns:"http://www.w3.org/2000/svg"}),i&&r.createElement("title",null,i),e.children)};return void 0!==s?r.createElement(s.Consumer,null,e=>t(e)):t(o)}}}]);