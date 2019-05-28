import React from 'react';
import SingleLesson from '../components/SingleLesson';
import Layout from '../components/Layout';

export default function Lesson({ id }) {
  return (
    <Layout>
      <SingleLesson id={id} />
    </Layout>
  );
}
