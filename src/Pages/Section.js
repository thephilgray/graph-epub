import React from 'react';
import SingleSection from '../components/SingleSection';
import Layout from '../components/Layout';

export default function Section({ lessonId, sectionId }) {
  return (
    <Layout>
      <SingleSection lessonId={lessonId} id={sectionId} />
    </Layout>
  );
}
