import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Work from "./components/work/Work";
import Join from "./components/Join/Join";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Join/>} />
        <Route path="/chat" element={<Work/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
