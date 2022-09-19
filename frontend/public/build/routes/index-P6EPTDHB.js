import {
  Navigate,
  React,
  init_react,
  init_react_router_dom,
  useLoaderData
} from "/build/_shared/chunk-ZGOZAIFM.js";

// browser-route-module:routes/index.tsx?browser
init_react();

// app/routes/index.tsx
init_react();
init_react_router_dom();
function Index() {
  const data = useLoaderData();
  return /* @__PURE__ */ React.createElement(Navigate, {
    to: `/${data.id}`
  });
}
export {
  Index as default
};
//# sourceMappingURL=/build/routes/index-P6EPTDHB.js.map
