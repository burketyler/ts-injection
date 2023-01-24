"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[668],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return d}});var r=t(7294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var s=r.createContext({}),l=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):c(c({},n),e)),t},p=function(e){var n=l(e.components);return r.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),m=l(t),d=i,f=m["".concat(s,".").concat(d)]||m[d]||u[d]||o;return t?r.createElement(f,c(c({ref:n},p),{},{components:t})):r.createElement(f,c({ref:n},p))}));function d(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,c=new Array(o);c[0]=m;var a={};for(var s in n)hasOwnProperty.call(n,s)&&(a[s]=n[s]);a.originalType=e,a.mdxType="string"==typeof e?e:i,c[1]=a;for(var l=2;l<o;l++)c[l]=t[l];return r.createElement.apply(null,c)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},4650:function(e,n,t){t.r(n),t.d(n,{contentTitle:function(){return p},default:function(){return f},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return m}});var r=t(3117),i=t(102),o=t(7294),c=t(3905),a=function(e){var n=(0,o.useMemo)((function(){return[["https://www.npmjs.com/package/ts-injection","https://img.shields.io/npm/v/ts-injection.svg","npm version"],["https://bundlephobia.com/result?p=ts-injection","https://img.shields.io/bundlephobia/minzip/ts-injection.svg","minzip size"],["#","https://img.shields.io/badge/license-MIT-blue.svg","MIT license"],["#","https://img.shields.io/badge/PRs-welcome-brightgreen.svg","pr's welcome"]]}),[]);return o.createElement("div",{style:{display:"flex",justifyContent:"center",marginBottom:"2em"}},o.createElement("ul",{style:{listStyle:"none"}},n.map((function(e){var n=e[0],t=e[1],r=e[2];return o.createElement("li",{style:{display:"inline",paddingRight:"5px"}},o.createElement("a",{href:n},o.createElement("img",{src:t,alt:r})))}))))},s=["components"],l={},p=void 0,u={type:"mdx",permalink:"/ts-injection/",source:"@site/src/pages/index.mdx",description:"ts-injection is an annotation based dependency injection framework written in Typescript for NodeJS apps. It enables building",frontMatter:{}},m=[{value:"Show me some code",id:"show-me-some-code",level:2},{value:"Features",id:"features",level:2}],d={toc:m};function f(e){var n=e.components,t=(0,i.Z)(e,s);return(0,c.kt)("wrapper",(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,c.kt)("div",{style:{display:"flex",justifyContent:"center",padding:"2rem"}},(0,c.kt)("img",{src:"/ts-injection/img/logo.png",style:{width:"150px"}})),(0,c.kt)(a,{mdxType:"Badges"}),(0,c.kt)("p",null,"ts-injection is an annotation based dependency injection framework written in Typescript for NodeJS apps. It enables building\napplications that have loosely coupled components."),(0,c.kt)("h2",{id:"show-me-some-code"},"Show me some code"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-typescript"},'@Injectable()\nclass ArnyService {\n  public getQuote(): string {\n    return "Get to the choppa!";\n  }\n}\n\n@Injectable()\nclass ArnyApp {\n  @Autowire(ArnyService)\n  private service!: ArnyService;\n\n  public getQuote(): string {\n    return this.service.getQuote();\n  }\n}\n\nconst container = new InjectionContainer();\n\nfunction main(): void {\n  const app = container.resolve(ArnyApp);\n\n  console.log(app.getQuote());\n}\n')),(0,c.kt)("h2",{id:"features"},"Features"),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},"\ud83c\udf3e Field injection"),(0,c.kt)("li",{parentName:"ul"},"\ud83d\udd28 Constructor injection"),(0,c.kt)("li",{parentName:"ul"},"\ud83d\udd22 Environment variable parsing")))}f.isMDXComponent=!0}}]);