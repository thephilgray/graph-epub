import React from 'react';
import SingleLesson from '../components/SingleLesson';

export default function Lesson({ id }) {
  return (
    <div>
      <SingleLesson id={id} />
    </div>
  );
}
