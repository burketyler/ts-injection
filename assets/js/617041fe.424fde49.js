"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[501],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return m}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},s=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,s=u(e,["components","mdxType","originalType","parentName"]),f=l(n),m=o,d=f["".concat(c,".").concat(m)]||f[m]||p[m]||i;return n?r.createElement(d,a(a({ref:t},s),{},{components:n})):r.createElement(d,a({ref:t},s))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=f;var u={};for(var c in t)hasOwnProperty.call(t,c)&&(u[c]=t[c]);u.originalType=e,u.mdxType="string"==typeof e?e:o,a[1]=u;for(var l=2;l<i;l++)a[l]=n[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},2599:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return c},default:function(){return m},frontMatter:function(){return u},metadata:function(){return l},toc:function(){return p}});var r=n(3117),o=n(102),i=(n(7294),n(3905)),a=["components"],u={},c="Setup",l={unversionedId:"setup",id:"setup",title:"Setup",description:"Installation",source:"@site/docs/setup.mdx",sourceDirName:".",slug:"/setup",permalink:"/ts-injection/docs/setup",editUrl:"https://github.com/burketyler/ts-injection/docs/setup.mdx",tags:[],version:"current",frontMatter:{},sidebar:"docs",next:{title:"Usage",permalink:"/ts-injection/docs/usage"}},s={},p=[{value:"Installation",id:"installation",level:2},{value:"Requirements",id:"requirements",level:2}],f={toc:p};function m(e){var t=e.components,n=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"setup"},"Setup"),(0,i.kt)("h2",{id:"installation"},"Installation"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"npm install ts-injection")),(0,i.kt)("p",null,"or"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"yarn add ts-injection")),(0,i.kt)("h2",{id:"requirements"},"Requirements"),(0,i.kt)("p",null,"Make sure your tsconfig.json contains:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "experimentalDecorators": true,\n  "emitDecoratorMetadata": true\n}\n')))}m.isMDXComponent=!0}}]);