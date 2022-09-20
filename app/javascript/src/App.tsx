import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Split } from "src/Split";
import { SplitSingle } from "src/SplitSingle";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/split" element={<Split />} />

        <Route path="/split/:id" element={<SplitSingle />} />

        <Route path="*" element={<Navigate to="/split" />} />
      </Routes>
    </BrowserRouter>
  );
};
