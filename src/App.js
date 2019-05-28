import React from 'react';
import Lessons from './Pages/Lessons';
import Lesson from './Pages/Lesson';
import AddLesson from './Pages/AddLesson';
import { Router } from '@reach/router';

function App() {
  return (
    <Router>
      <Lessons path="/" />
      <AddLesson path="/lessons/add" />
      <Lesson path="/lesson/:id" />
    </Router>
  );
}

export default App;
