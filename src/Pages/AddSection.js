import React from 'react';
import NewSection from '../components/NewSection';
import Layout from '../components/Layout';

export default function AddSection({ id }) {
  return (
    <Layout>
      <NewSection lessonId={id} />
    </Layout>
  );
}
