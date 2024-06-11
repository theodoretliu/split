import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Split } from "src/Split";
import { SplitSingle } from "src/SplitSingle";
import { SplitShare } from "~/pages/SplitShare";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/splits" element={<Split />} />

        <Route path="/splits/:id" element={<SplitSingle />} />

        <Route path="/splits/:id/view" element={<SplitShare />} />

        <Route path="*" element={<Navigate to="/splits" />} />
      </Routes>
    </BrowserRouter>
  );
};
