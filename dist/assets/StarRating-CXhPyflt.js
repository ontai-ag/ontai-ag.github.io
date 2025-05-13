import{c as u,j as c,e as i}from"./index-cuAPMHsf.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=u("Star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]),j=({rating:o,maxRating:n=5,size:m="md",onChange:s,className:d})=>{const a=!!s,x={sm:"w-3 h-3",md:"w-5 h-5",lg:"w-6 h-6"}[m],p=t=>{s&&s(t)};return c.jsx("div",{className:i("flex items-center gap-0.5",d),children:[...Array(n)].map((t,e)=>{const r=e+1,l=r<=o;return c.jsx(h,{className:i(x,a&&"cursor-pointer transition-colors",l?"fill-amber-400 text-amber-400":"text-gray-300",a&&!l&&"hover:text-amber-200"),onClick:a?()=>p(r):void 0},e)})})};export{h as S,j as a};
