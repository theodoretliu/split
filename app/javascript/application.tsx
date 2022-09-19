// Entry point for the build script in your package.json
import React from "react";
import { App } from "./src/App";
import * as ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("react")!);
root.render(<App />);
