import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

import LessonGridList from './LessonsGridList';

const ALL_LESSONS = gql`
  query {
    lessons {
      title
      id
      sections {
        title
        exercises {
          id
          type
          quizType
        }
      }
    }
  }
`;

export default function AllLessons() {
  const { data, error, loading } = useQuery(ALL_LESSONS);
  console.log(data);
  if (loading) {
    return <div>Loading....</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }
  return (
    <>
      <h1>All Lessons</h1>
      <LessonGridList tileData={data} />
    </>
  );
}
