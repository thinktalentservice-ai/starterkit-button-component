import{i as e,s as t}from"./preload-helper-BdFrVu1K.js";import{O as n,t as r}from"./iframe-B2LyfoyY.js";function i(e,t){t!==void 0&&o[t]===void 0&&s()&&!c.has(t)&&(c.add(t),console.warn(`[@ib/button] Unknown variant "${t}" — falling back to tone="${a.tone}" fill="${a.fill}". Valid: ${Object.keys(o).join(`, `)}. Or set tone/fill/shape directly.`));let n=t&&o[t]||{};return{tone:e.tone??n.tone??a.tone,fill:e.fill??n.fill??a.fill,shape:e.shape??n.shape??a.shape}}var a,o,s,c,l=e((()=>{a={tone:`mint`,fill:`solid`,shape:`chip`},o={mint:{tone:`mint`,fill:`solid`},violet:{tone:`violet`,fill:`solid`},amber:{tone:`amber`,fill:`solid`},danger:{tone:`danger`,fill:`solid`},blue:{tone:`blue`,fill:`solid`},ghost:{tone:`neutral`,fill:`ghost`},text:{tone:`neutral`,fill:`bare`},pill:{tone:`blue`,fill:`outline`,shape:`pill`},"pill-filled":{tone:`neutral`,fill:`translucent`,shape:`pill`}},s=()=>typeof process<`u`&&!1,c=new Set}));function u(e,t){let{tone:n,fill:r,shape:a,size:o=`md`,variant:s,loading:c=!1,disabled:l=!1,fullWidth:u=!1,startIcon:d,endIcon:m,children:h,className:g,href:_,type:v=`button`,...y}=e,b=i({tone:n,fill:r,shape:a},s),x=l||c,S={className:p(`ib-btn`,g),"data-tone":b.tone,"data-fill":b.fill,"data-shape":b.shape,"data-size":o,...c?{"data-loading":``,"aria-busy":!0}:{},...u?{"data-full-width":``}:{},...x?{}:{"data-interactive":``}},C=(0,f.jsxs)(f.Fragment,{children:[c?(0,f.jsx)(`span`,{className:`ib-btn__spinner`,"aria-hidden":`true`}):d,h,!c&&m]});if(_!==void 0){let{onClick:e,...n}=y,r=x?{role:`link`,"aria-disabled":!0,tabIndex:-1}:{href:_,onClick:e};return(0,f.jsx)(`a`,{ref:t,...n,...S,...r,children:C})}return(0,f.jsx)(`button`,{ref:t,type:v,...y,...S,disabled:x,children:C})}var d,f,p,m,h=e((()=>{d=t(n(),1),l(),f=r(),p=(...e)=>e.filter(Boolean).join(` `),m=(0,d.forwardRef)(u),m.displayName=`Button`,m.__docgenInfo={description:`Ref forwarding is required, not decorative: MUI Tooltip/Menu, Popper,
focus management and scroll-into-view all reach for the underlying node.
A button that swallows its ref silently breaks every one of them.`,methods:[],displayName:`Button`}})),g=e((()=>{h(),l()})),_=e((()=>{}));function v(e){let t=[];for(let n of T){let r=e[n];r!==void 0&&t.push(`${n}="${r}"`)}for(let n of E)e[n]&&t.push(n);return`<Button${t.length>0?` ${t.join(` `)}`:``}>${e.children}</Button>`}function y(e){let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,``),t.style.position=`fixed`,t.style.opacity=`0`,document.body.appendChild(t),t.select(),document.execCommand(`copy`),document.body.removeChild(t)}function b({inverse:e=!1,...t}){let n=v(t),[r,i]=(0,C.useState)(!1),a=(0,C.useRef)(void 0);(0,C.useEffect)(()=>()=>clearTimeout(a.current),[]);let o=async()=>{try{await navigator.clipboard.writeText(n)}catch{y(n)}i(!0),clearTimeout(a.current),a.current=setTimeout(()=>i(!1),1200)},{children:s,href:c,...l}=t;return(0,w.jsxs)(`article`,{className:`ib-specimen`,"data-inverse":e||void 0,"data-wide":t.fullWidth||void 0,children:[(0,w.jsx)(`div`,{className:`ib-specimen__stage`,children:c===void 0?(0,w.jsx)(m,{...l,children:s}):(0,w.jsx)(m,{href:c,...l,children:s})}),(0,w.jsxs)(`button`,{type:`button`,onClick:o,className:`ib-specimen__code`,"data-copied":r||void 0,"aria-label":`Copy code: ${n}`,children:[(0,w.jsxs)(`span`,{className:`ib-specimen__code-meta`,"aria-hidden":`true`,children:[(0,w.jsx)(`span`,{children:`JSX`}),(0,w.jsx)(`span`,{className:`ib-specimen__copy-state`,children:r?(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(S,{}),`Copied`]}):(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(x,{}),`Copy`]})})]}),(0,w.jsx)(`code`,{children:n}),(0,w.jsx)(`span`,{className:`ib-visually-hidden`,"aria-live":`polite`,children:r?`Code copied to clipboard`:``})]})]})}function x(){return(0,w.jsxs)(`svg`,{viewBox:`0 0 16 16`,"aria-hidden":`true`,children:[(0,w.jsx)(`rect`,{x:`5.25`,y:`5.25`,width:`7.5`,height:`7.5`,rx:`1.5`}),(0,w.jsx)(`path`,{d:`M10.75 5.25V4A1.75 1.75 0 0 0 9 2.25H4A1.75 1.75 0 0 0 2.25 4v5A1.75 1.75 0 0 0 4 10.75h1.25`})]})}function S(){return(0,w.jsx)(`svg`,{viewBox:`0 0 16 16`,"aria-hidden":`true`,children:(0,w.jsx)(`path`,{d:`m3 8.25 3.1 3.1L13 4.65`})})}var C,w,T,E,D=e((()=>{C=t(n(),1),h(),_(),w=r(),T=[`variant`,`tone`,`fill`,`shape`,`size`,`href`],E=[`loading`,`disabled`,`fullWidth`],b.__docgenInfo={description:`One button plus the exact JSX that produced it. Click the code to copy it.`,methods:[],displayName:`Swatch`,props:{variant:{required:!1,tsType:{name:`unknown`},description:``},tone:{required:!1,tsType:{name:`union`,raw:`"mint" | "violet" | "amber" | "danger" | "blue" | "neutral"`,elements:[{name:`literal`,value:`"mint"`},{name:`literal`,value:`"violet"`},{name:`literal`,value:`"amber"`},{name:`literal`,value:`"danger"`},{name:`literal`,value:`"blue"`},{name:`literal`,value:`"neutral"`}]},description:``},fill:{required:!1,tsType:{name:`union`,raw:`"solid" | "ghost" | "outline" | "bare" | "translucent"`,elements:[{name:`literal`,value:`"solid"`},{name:`literal`,value:`"ghost"`},{name:`literal`,value:`"outline"`},{name:`literal`,value:`"bare"`},{name:`literal`,value:`"translucent"`}]},description:``},shape:{required:!1,tsType:{name:`union`,raw:`"chip" | "pill"`,elements:[{name:`literal`,value:`"chip"`},{name:`literal`,value:`"pill"`}]},description:``},size:{required:!1,tsType:{name:`union`,raw:`"sm" | "md" | "lg"`,elements:[{name:`literal`,value:`"sm"`},{name:`literal`,value:`"md"`},{name:`literal`,value:`"lg"`}]},description:``},href:{required:!1,tsType:{name:`string`},description:``},loading:{required:!1,tsType:{name:`boolean`},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:``},fullWidth:{required:!1,tsType:{name:`boolean`},description:``},children:{required:!0,tsType:{name:`string`},description:`Restricted to a string so the printed snippet is always the literal JSX.`},inverse:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})),O=e((()=>{}));function k({title:e,description:t,children:n}){return(0,j.jsxs)(`section`,{className:`ib-story-section`,children:[(0,j.jsx)(`div`,{className:`ib-story-section__header`,children:(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h3`,{className:`ib-story-section__title`,children:e}),t?(0,j.jsx)(`p`,{className:`ib-story-section__description`,children:t}):null]})}),n]})}function A({title:e,description:t,children:n}){return(0,j.jsxs)(`main`,{className:`ib-story`,children:[(0,j.jsxs)(`header`,{className:`ib-story__hero`,children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`p`,{className:`ib-story__eyebrow`,children:`IB / component specimen`}),(0,j.jsx)(`h2`,{className:`ib-story__title`,children:e}),(0,j.jsx)(`p`,{className:`ib-story__lede`,children:t})]}),(0,j.jsxs)(`div`,{className:`ib-story__axes`,"aria-label":`Button design axes`,children:[(0,j.jsx)(`span`,{children:`tone`}),(0,j.jsx)(`span`,{children:`fill`}),(0,j.jsx)(`span`,{children:`shape`}),(0,j.jsx)(`span`,{children:`size`})]})]}),(0,j.jsx)(`div`,{className:`ib-story__body`,children:n})]})}var j,M,N,P,F,I,L,R,z,B,V,H,U,W;e((()=>{g(),D(),O(),j=r(),M=[`mint`,`violet`,`amber`,`danger`,`blue`,`neutral`],N=[`solid`,`ghost`,`outline`,`bare`],P=[`sm`,`md`,`lg`],F=[`chip`,`pill`],I=Object.keys(o),L={title:`Components/Button`,component:m,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`A token-driven, polymorphic button with independent tone, fill, shape, and size axes. Pass \`href\` to render an anchor; explicit axis props override named presets.

Every button below prints its own JSX underneath it — click the code to copy it. The story-level **Show code** panel shows the surrounding loop, so the per-button snippet is the one to copy.`}}},args:{children:`Deploy`,size:`md`,disabled:!1,loading:!1,fullWidth:!1},argTypes:{tone:{control:`select`,options:M,description:`Colour identity.`},fill:{control:`select`,options:[...N,`translucent`],description:`How the tone is applied to the surface.`},shape:{control:`inline-radio`,options:F,description:`Corner geometry.`},size:{control:`inline-radio`,options:P,description:`Padding, type scale, and minimum target size.`},variant:{control:`select`,options:[void 0,...I],description:`Named preset. Explicit axis props take precedence.`},href:{control:`text`,description:`When set, renders an anchor instead of a button.`},startIcon:{control:!1},endIcon:{control:!1}}},R={render:({children:e,variant:t,tone:n,fill:r,shape:i,size:a,href:o,loading:s,disabled:c,fullWidth:l})=>(0,j.jsx)(A,{title:`Button workbench`,description:`Tune the axes in Controls. The specimen and its paste-ready JSX update together.`,children:(0,j.jsx)(k,{title:`Live specimen`,description:`Click the dark code panel to copy this exact setup.`,children:(0,j.jsx)(`div`,{className:`ib-story-grid`,children:(0,j.jsx)(b,{variant:t,tone:n,fill:r,shape:i,size:a,href:o,loading:s,disabled:c,fullWidth:l,children:typeof e==`string`?e:`Deploy`})})})})},z={render:()=>(0,j.jsx)(A,{title:`Preset index`,description:`Named shortcuts for common points in the same four-axis system—useful defaults, never a separate styling API.`,children:(0,j.jsx)(k,{title:`Named presets`,description:`Convenience aliases only—each resolves to the same orthogonal axes shown in Controls.`,children:(0,j.jsx)(`div`,{className:`ib-story-grid`,children:I.map(e=>(0,j.jsx)(b,{variant:e,children:e},e))})})})},B={render:()=>(0,j.jsx)(A,{title:`Tone × fill atlas`,description:`Scan the full visual system by surface treatment. Each specimen exposes the exact JSX responsible for it.`,children:N.map(e=>(0,j.jsx)(k,{title:e,children:(0,j.jsx)(`div`,{className:`ib-story-grid`,children:M.map(t=>(0,j.jsx)(b,{tone:t,fill:e,children:t},t))})},e))})},V={render:()=>(0,j.jsx)(A,{title:`Geometry scale`,description:`Compare target size and silhouette without changing the button’s color identity.`,children:F.map(e=>(0,j.jsx)(k,{title:e,children:(0,j.jsx)(`div`,{className:`ib-story-grid`,children:P.map(t=>(0,j.jsx)(b,{shape:e,size:t,tone:`blue`,children:t},t))})},e))})},H={render:()=>(0,j.jsxs)(A,{title:`Behavior states`,description:`Operational states, links, and width behavior shown as real interactive elements—not static approximations.`,children:[(0,j.jsx)(k,{title:`Interaction states`,children:(0,j.jsxs)(`div`,{className:`ib-story-grid`,children:[(0,j.jsx)(b,{tone:`mint`,children:`Ready`}),(0,j.jsx)(b,{tone:`violet`,loading:!0,children:`Saving`}),(0,j.jsx)(b,{tone:`danger`,disabled:!0,children:`Disabled`}),(0,j.jsx)(b,{href:`#button-link`,tone:`blue`,fill:`outline`,children:`Anchor`}),(0,j.jsx)(b,{href:`#disabled-link`,tone:`amber`,fill:`bare`,disabled:!0,children:`Disabled anchor`})]})}),(0,j.jsx)(k,{title:`Width`,children:(0,j.jsx)(b,{fullWidth:!0,tone:`blue`,children:`Full-width action`})})]})},U={render:()=>(0,j.jsx)(A,{title:`Context surfaces`,description:`The translucent fill is tested where it belongs: over an expressive, high-contrast feature surface.`,children:(0,j.jsx)(`div`,{className:`ib-story-context`,children:(0,j.jsx)(k,{title:`Translucent on a coloured surface`,description:`This fill is intentionally white-on-whatever and belongs on heroes or featured cards.`,children:(0,j.jsxs)(`div`,{className:`ib-story-grid`,children:[(0,j.jsx)(b,{fill:`translucent`,inverse:!0,children:`Explore`}),(0,j.jsx)(b,{fill:`translucent`,shape:`pill`,inverse:!0,children:`View details`}),(0,j.jsx)(b,{fill:`translucent`,loading:!0,inverse:!0,children:`Loading`})]})})})})},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: ({
    children,
    variant,
    tone,
    fill,
    shape,
    size,
    href,
    loading,
    disabled,
    fullWidth
  }) => <StoryFrame title="Button workbench" description="Tune the axes in Controls. The specimen and its paste-ready JSX update together.">\r
      <Section title="Live specimen" description="Click the dark code panel to copy this exact setup.">\r
        <div className="ib-story-grid">\r
          <Swatch variant={variant} tone={tone} fill={fill} shape={shape} size={size} href={href} loading={loading} disabled={disabled} fullWidth={fullWidth}>\r
            {typeof children === "string" ? children : "Deploy"}\r
          </Swatch>\r
        </div>\r
      </Section>\r
    </StoryFrame>
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => <StoryFrame title="Preset index" description="Named shortcuts for common points in the same four-axis system—useful defaults, never a separate styling API.">\r
      <Section title="Named presets" description="Convenience aliases only—each resolves to the same orthogonal axes shown in Controls.">\r
        <div className="ib-story-grid">\r
          {presets.map(variant => <Swatch key={variant} variant={variant}>\r
              {variant}\r
            </Swatch>)}\r
        </div>\r
      </Section>\r
    </StoryFrame>
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => <StoryFrame title="Tone × fill atlas" description="Scan the full visual system by surface treatment. Each specimen exposes the exact JSX responsible for it.">\r
      {fills.map(fill => <Section key={fill} title={fill}>\r
          <div className="ib-story-grid">\r
            {tones.map(tone => <Swatch key={tone} tone={tone} fill={fill}>\r
                {tone}\r
              </Swatch>)}\r
          </div>\r
        </Section>)}\r
    </StoryFrame>
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: () => <StoryFrame title="Geometry scale" description="Compare target size and silhouette without changing the button’s color identity.">\r
      {shapes.map(shape => <Section key={shape} title={shape}>\r
          <div className="ib-story-grid">\r
            {sizes.map(size => <Swatch key={size} shape={shape} size={size} tone="blue">\r
                {size}\r
              </Swatch>)}\r
          </div>\r
        </Section>)}\r
    </StoryFrame>
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => <StoryFrame title="Behavior states" description="Operational states, links, and width behavior shown as real interactive elements—not static approximations.">\r
      <Section title="Interaction states">\r
        <div className="ib-story-grid">\r
          <Swatch tone="mint">Ready</Swatch>\r
          <Swatch tone="violet" loading>\r
            Saving\r
          </Swatch>\r
          <Swatch tone="danger" disabled>\r
            Disabled\r
          </Swatch>\r
          <Swatch href="#button-link" tone="blue" fill="outline">\r
            Anchor\r
          </Swatch>\r
          <Swatch href="#disabled-link" tone="amber" fill="bare" disabled>\r
            Disabled anchor\r
          </Swatch>\r
        </div>\r
      </Section>\r
      <Section title="Width">\r
        <Swatch fullWidth tone="blue">\r
          Full-width action\r
        </Swatch>\r
      </Section>\r
    </StoryFrame>
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: () => <StoryFrame title="Context surfaces" description="The translucent fill is tested where it belongs: over an expressive, high-contrast feature surface.">\r
      <div className="ib-story-context">\r
        <Section title="Translucent on a coloured surface" description="This fill is intentionally white-on-whatever and belongs on heroes or featured cards.">\r
          <div className="ib-story-grid">\r
            <Swatch fill="translucent" inverse>\r
              Explore\r
            </Swatch>\r
            <Swatch fill="translucent" shape="pill" inverse>\r
              View details\r
            </Swatch>\r
            <Swatch fill="translucent" loading inverse>\r
              Loading\r
            </Swatch>\r
          </div>\r
        </Section>\r
      </div>\r
    </StoryFrame>
}`,...U.parameters?.docs?.source}}},W=[`Playground`,`Presets`,`AxisMatrix`,`SizesAndShapes`,`States`,`ContextualTranslucent`]}))();export{B as AxisMatrix,U as ContextualTranslucent,R as Playground,z as Presets,V as SizesAndShapes,H as States,W as __namedExportsOrder,L as default};