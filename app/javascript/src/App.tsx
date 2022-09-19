import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

console.log("asdf");
export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/split" element={<div>split</div>} />

        <Route path="/split/:id" element={<div>asdf</div>} />

        <Route path="*" element={<Navigate to="/split" />} />
      </Routes>
    </BrowserRouter>
  );
};
