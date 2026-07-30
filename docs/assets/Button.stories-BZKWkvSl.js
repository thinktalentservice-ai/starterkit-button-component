import{i as e,s as t}from"./preload-helper-BdFrVu1K.js";import{O as n,t as r}from"./iframe-CaPG4MC_.js";function i(e,t){t!==void 0&&o[t]===void 0&&s()&&!c.has(t)&&(c.add(t),console.warn(`[@ib/button] Unknown variant "${t}" — falling back to tone="${a.tone}" fill="${a.fill}". Valid: ${Object.keys(o).join(`, `)}. Or set tone/fill/shape directly.`));let n=t&&o[t]||{};return{tone:e.tone??n.tone??a.tone,fill:e.fill??n.fill??a.fill,shape:e.shape??n.shape??a.shape}}var a,o,s,c,l=e((()=>{a={tone:`mint`,fill:`solid`,shape:`chip`},o={mint:{tone:`mint`,fill:`solid`},violet:{tone:`violet`,fill:`solid`},amber:{tone:`amber`,fill:`solid`},danger:{tone:`danger`,fill:`solid`},blue:{tone:`blue`,fill:`solid`},ghost:{tone:`neutral`,fill:`ghost`},text:{tone:`neutral`,fill:`bare`},pill:{tone:`blue`,fill:`outline`,shape:`pill`},"pill-filled":{tone:`neutral`,fill:`translucent`,shape:`pill`}},s=()=>typeof process<`u`&&!1,c=new Set}));function u(e,t){let{tone:n,fill:r,shape:a,size:o=`md`,variant:s,loading:c=!1,disabled:l=!1,fullWidth:u=!1,startIcon:d,endIcon:m,children:h,className:g,href:_,type:v=`button`,...y}=e,b=i({tone:n,fill:r,shape:a},s),x=l||c,S={className:p(`ib-btn`,g),"data-tone":b.tone,"data-fill":b.fill,"data-shape":b.shape,"data-size":o,...c?{"data-loading":``,"aria-busy":!0}:{},...u?{"data-full-width":``}:{},...x?{}:{"data-interactive":``}},C=(0,f.jsxs)(f.Fragment,{children:[c?(0,f.jsx)(`span`,{className:`ib-btn__spinner`,"aria-hidden":`true`}):d,h,!c&&m]});if(_!==void 0){let{onClick:e,...n}=y,r=x?{role:`link`,"aria-disabled":!0,tabIndex:-1}:{href:_,onClick:e};return(0,f.jsx)(`a`,{ref:t,...n,...S,...r,children:C})}return(0,f.jsx)(`button`,{ref:t,type:v,...y,...S,disabled:x,children:C})}var d,f,p,m,h=e((()=>{d=t(n(),1),l(),f=r(),p=(...e)=>e.filter(Boolean).join(` `),m=(0,d.forwardRef)(u),m.displayName=`Button`,m.__docgenInfo={description:`Ref forwarding is required, not decorative: MUI Tooltip/Menu, Popper,
focus management and scroll-into-view all reach for the underlying node.
A button that swallows its ref silently breaks every one of them.`,methods:[],displayName:`Button`}})),g=e((()=>{h(),l()}));function _({title:e,description:t,inverse:n=!1,children:r}){return(0,v.jsxs)(`section`,{style:{display:`grid`,gap:`0.65rem`},children:[(0,v.jsxs)(`div`,{children:[(0,v.jsx)(`h3`,{style:{margin:0,color:n?`#fff`:`#15182a`,fontSize:`0.95rem`},children:e}),t?(0,v.jsx)(`p`,{style:{margin:`0.25rem 0 0`,color:n?`rgb(255 255 255 / 0.72)`:`#626984`,fontSize:`0.8rem`},children:t}):null]}),r]})}var v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N;e((()=>{g(),v=r(),y=[`mint`,`violet`,`amber`,`danger`,`blue`,`neutral`],b=[`solid`,`ghost`,`outline`,`bare`],x=[`sm`,`md`,`lg`],S=[`chip`,`pill`],C=Object.keys(o),w={display:`grid`,gap:`1.5rem`,minWidth:`min(880px, 82vw)`},T={display:`flex`,flexWrap:`wrap`,alignItems:`center`,gap:`0.75rem`},E={title:`Components/Button`,component:m,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:"A token-driven, polymorphic button with independent tone, fill, shape, and size axes. Pass `href` to render an anchor; explicit axis props override named presets."}}},args:{children:`Deploy`,size:`md`,disabled:!1,loading:!1,fullWidth:!1},argTypes:{tone:{control:`select`,options:y,description:`Colour identity.`},fill:{control:`select`,options:[...b,`translucent`],description:`How the tone is applied to the surface.`},shape:{control:`inline-radio`,options:S,description:`Corner geometry.`},size:{control:`inline-radio`,options:x,description:`Padding, type scale, and minimum target size.`},variant:{control:`select`,options:[void 0,...C],description:`Named preset. Explicit axis props take precedence.`},href:{control:`text`,description:`When set, renders an anchor instead of a button.`},startIcon:{control:!1},endIcon:{control:!1}}},D={},O={render:()=>(0,v.jsx)(`div`,{style:w,children:(0,v.jsx)(_,{title:`Named presets`,description:`Convenience aliases only—each resolves to the same orthogonal axes shown in Controls.`,children:(0,v.jsx)(`div`,{style:T,children:C.map(e=>(0,v.jsx)(m,{variant:e,children:e},e))})})})},k={render:()=>(0,v.jsx)(`div`,{style:w,children:b.map(e=>(0,v.jsx)(_,{title:e,children:(0,v.jsx)(`div`,{style:T,children:y.map(t=>(0,v.jsx)(m,{tone:t,fill:e,children:t},t))})},e))})},A={render:()=>(0,v.jsx)(`div`,{style:w,children:S.map(e=>(0,v.jsx)(_,{title:e,children:(0,v.jsx)(`div`,{style:T,children:x.map(t=>(0,v.jsx)(m,{shape:e,size:t,tone:`blue`,children:t},t))})},e))})},j={render:()=>(0,v.jsxs)(`div`,{style:w,children:[(0,v.jsx)(_,{title:`Interaction states`,children:(0,v.jsxs)(`div`,{style:T,children:[(0,v.jsx)(m,{tone:`mint`,children:`Ready`}),(0,v.jsx)(m,{tone:`violet`,loading:!0,children:`Saving`}),(0,v.jsx)(m,{tone:`danger`,disabled:!0,children:`Disabled`}),(0,v.jsx)(m,{href:`#button-link`,tone:`blue`,fill:`outline`,children:`Anchor`}),(0,v.jsx)(m,{href:`#disabled-link`,tone:`amber`,fill:`bare`,disabled:!0,children:`Disabled anchor`})]})}),(0,v.jsx)(_,{title:`Width`,children:(0,v.jsx)(m,{fullWidth:!0,tone:`blue`,children:`Full-width action`})})]})},M={render:()=>(0,v.jsx)(`div`,{style:{minWidth:`min(720px, 80vw)`,padding:`3rem`,borderRadius:`1.5rem`,background:`radial-gradient(circle at 15% 0%, rgb(179 211 53 / 0.28), transparent 45%), linear-gradient(135deg, #171a31, #41306f 55%, #006acc)`,boxShadow:`0 30px 80px rgb(20 18 40 / 0.28)`},children:(0,v.jsx)(_,{title:`Translucent on a coloured surface`,description:`This fill is intentionally white-on-whatever and belongs on heroes or featured cards.`,inverse:!0,children:(0,v.jsxs)(`div`,{style:T,children:[(0,v.jsx)(m,{fill:`translucent`,children:`Explore`}),(0,v.jsx)(m,{fill:`translucent`,shape:`pill`,children:`View details`}),(0,v.jsx)(m,{fill:`translucent`,loading:!0,children:`Loading`})]})})})},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <div style={gridStyle}>\r
      <Section title="Named presets" description="Convenience aliases only—each resolves to the same orthogonal axes shown in Controls.">\r
        <div style={rowStyle}>\r
          {presets.map(variant => <Button key={variant} variant={variant}>\r
              {variant}\r
            </Button>)}\r
        </div>\r
      </Section>\r
    </div>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <div style={gridStyle}>\r
      {fills.map(fill => <Section key={fill} title={fill}>\r
          <div style={rowStyle}>\r
            {tones.map(tone => <Button key={tone} tone={tone} fill={fill}>\r
                {tone}\r
              </Button>)}\r
          </div>\r
        </Section>)}\r
    </div>
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <div style={gridStyle}>\r
      {shapes.map(shape => <Section key={shape} title={shape}>\r
          <div style={rowStyle}>\r
            {sizes.map(size => <Button key={size} shape={shape} size={size} tone="blue">\r
                {size}\r
              </Button>)}\r
          </div>\r
        </Section>)}\r
    </div>
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <div style={gridStyle}>\r
      <Section title="Interaction states">\r
        <div style={rowStyle}>\r
          <Button tone="mint">Ready</Button>\r
          <Button tone="violet" loading>\r
            Saving\r
          </Button>\r
          <Button tone="danger" disabled>\r
            Disabled\r
          </Button>\r
          <Button href="#button-link" tone="blue" fill="outline">\r
            Anchor\r
          </Button>\r
          <Button href="#disabled-link" tone="amber" fill="bare" disabled>\r
            Disabled anchor\r
          </Button>\r
        </div>\r
      </Section>\r
      <Section title="Width">\r
        <Button fullWidth tone="blue">\r
          Full-width action\r
        </Button>\r
      </Section>\r
    </div>
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    minWidth: "min(720px, 80vw)",
    padding: "3rem",
    borderRadius: "1.5rem",
    background: "radial-gradient(circle at 15% 0%, rgb(179 211 53 / 0.28), transparent 45%), " + "linear-gradient(135deg, #171a31, #41306f 55%, #006acc)",
    boxShadow: "0 30px 80px rgb(20 18 40 / 0.28)"
  }}>\r
      <Section title="Translucent on a coloured surface" description="This fill is intentionally white-on-whatever and belongs on heroes or featured cards." inverse>\r
        <div style={rowStyle}>\r
          <Button fill="translucent">Explore</Button>\r
          <Button fill="translucent" shape="pill">\r
            View details\r
          </Button>\r
          <Button fill="translucent" loading>\r
            Loading\r
          </Button>\r
        </div>\r
      </Section>\r
    </div>
}`,...M.parameters?.docs?.source}}},N=[`Playground`,`Presets`,`AxisMatrix`,`SizesAndShapes`,`States`,`ContextualTranslucent`]}))();export{k as AxisMatrix,M as ContextualTranslucent,D as Playground,O as Presets,A as SizesAndShapes,j as States,N as __namedExportsOrder,E as default};