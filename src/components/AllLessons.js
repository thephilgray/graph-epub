import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

import ItemGridList from './ItemGridList';

const ALL_LESSONS = gql`
  query {
    lessons {
      title
      id
      img
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
  const { data, error, loading } = useQuery(ALL_LESSONS, {
    fetchPolicy: 'network-only'
  });
  if (loading) {
    return <div>Loading....</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }
  return (
    <>
      <h1>All Lessons</h1>
      <ItemGridList tileData={data.lessons} itemType="lesson" />
    </>
  );
}
