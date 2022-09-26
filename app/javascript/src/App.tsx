import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Split } from "src/Split";
import { SplitSingle } from "src/SplitSingle";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/splits" element={<Split />} />

        <Route path="/splits/:id" element={<SplitSingle />} />

        <Route path="*" element={<Navigate to="/splits" />} />
      </Routes>
    </BrowserRouter>
  );
};
