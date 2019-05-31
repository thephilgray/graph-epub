import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo-hooks';

import ItemGridList from './ItemGridList';

const ALL_LESSONS = gql`
  query {
    lessons {
      title
      id
      img
      sections {
        id
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

const DELETE_LESSON = gql`
  mutation DELETE_LESSON($id: String!) {
    removeLesson(id: $id)
  }
`;

export default function AllLessons() {
  const { data, error, loading, refetch } = useQuery(ALL_LESSONS);

  const deleteLesson = useMutation(DELETE_LESSON);

  if (loading) {
    return <div>Loading....</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }
  return (
    <>
      <h1>All Lessons</h1>
      <ItemGridList
        tileData={data.lessons}
        itemType="lesson"
        refetchItems={refetch}
        deleteItem={deleteLesson}
        baseUrl={`lessons/`}
      />
    </>
  );
}
