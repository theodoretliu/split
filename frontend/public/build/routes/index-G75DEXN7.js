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
  if (data.id) {
    return /* @__PURE__ */ React.createElement(Navigate, {
      to: `/${data.id}`
    });
  }
  return null;
}
export {
  Index as default
};
//# sourceMappingURL=/build/routes/index-G75DEXN7.js.map
