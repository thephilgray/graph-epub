import React from "react";
import Lessons from "./Pages/Lessons";
import Lesson from "./Pages/Lesson";
import { Router } from "@reach/router";

function App() {
  return (
    <Router>
      <Lessons path="/" />
      <Lesson path="/lesson/:id" />
    </Router>
  );
}

export default App;
