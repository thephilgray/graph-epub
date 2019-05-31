import React from 'react';
import Lessons from './Pages/Lessons';
import Lesson from './Pages/Lesson';
import Section from './Pages/Section';
import AddLesson from './Pages/AddLesson';
import AddSection from './Pages/AddSection';
import { Router } from '@reach/router';

function App() {
  return (
    <Router>
      <Lessons path="/" />
      <AddLesson path="/lessons/add" />
      <Lesson path="/lesson/:id" />
      <AddSection path="/lesson/:id/sections/add" />
      <Section path="/lesson/:lessonId/section/:sectionId" />
    </Router>
  );
}

export default App;
