import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

const SINGLE_LESSON = gql`
  query getLesson($id: String!) {
    lesson(id: $id) {
      id
      title
      img
      objectives
    }
  }
`;
export default function SingleLesson({ id }) {
  const { data, error, loading } = useQuery(SINGLE_LESSON, {
    variables: { id }
  });
  const { lesson } = data;
  if (loading) {
    return <div>Loading....</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <div>
      <p>single lesson view: Lesson {lesson.title}</p>
    </div>
  );
}
