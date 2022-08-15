import {
  __toESM,
  init_react,
  init_react_router_dom,
  require_react,
  useLoaderData,
  useNavigate
} from "/build/_shared/chunk-GSZZPYU2.js";

// browser-route-module:routes/index.tsx?browser
init_react();

// app/routes/index.tsx
init_react();
var import_react2 = __toESM(require_react());
init_react_router_dom();
function Index() {
  const data = useLoaderData();
  const navigate = useNavigate();
  (0, import_react2.useEffect)(() => {
    navigate(`/${data.id}`);
  }, []);
  return null;
}
export {
  Index as default
};
//# sourceMappingURL=/build/routes/index-OSFPYPK2.js.map
