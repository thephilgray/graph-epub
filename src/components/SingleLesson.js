import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { navigate } from '@reach/router';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';

import BreadCrumbsNavigation from '../components/BreadCrumbsNavigation';
import ItemGridList from './ItemGridList';
import LessonFormFields from './LessonFormFields';

const SINGLE_LESSON = gql`
  query getLesson($id: String!) {
    lesson(id: $id) {
      id
      title
      img
      objectives
      sections {
        id
        title
      }
    }
  }
`;

const UPDATE_LESSON = gql`
  mutation UPDATE_LESSON($id: String!, $input: LessonInput) {
    updateLesson(id: $id, input: $input) {
      id
      title
      img
      objectives
    }
  }
`;

const DELETE_SECTION = gql`
  mutation DELETE_SECTION($id: String!) {
    removeSection(id: $id)
  }
`;

// const ADD_SECTION = gql`
//   mutation ADD_SECTION($lessonId: String!, $input: SectionInput) {
//     addSection(lessonId: $lessonId, input: $input) {
//       id
//       title
//     }
//   }
// `;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: '0 auto'
  },
  addObjective: {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  addObjectiveInput: {
    marginLeft: 8,
    flex: 1
  },
  addObjectiveIconButton: {
    padding: 10
  },
  addObjectiveDivider: {
    width: 1,
    height: 28,
    margin: 4
  },
  submitButton: {
    margin: '1em 0'
  }
}));

export default function SingleLesson({ id }) {
  const classes = useStyles();
  const { data, error, loading, refetch } = useQuery(SINGLE_LESSON, {
    variables: { id }
  });

  const [values, setValues] = useState({
    title: '',
    img: '',
    objectives: []
  });

  const updateLesson = useMutation(UPDATE_LESSON, {
    variables: { id, input: { ...values } }
  });
  const deleteSection = useMutation(DELETE_SECTION);

  const [newObjective, setNewObjective] = useState('');
  const [breadcrumbsData, setBreadcrumbsData] = useState([
    {
      href: '/',
      text: 'All Lessons'
    },
    {
      href: ``,
      text: id
    }
  ]);

  useEffect(() => {
    if (data.lesson) {
      setValues({
        title: data.lesson.title || '',
        img: data.lesson.img || '',
        objectives: data.lesson.objectives || []
      });

      let updatedBreadcrumbs = [...breadcrumbsData];
      updatedBreadcrumbs[1].text = data.lesson.title;
      setBreadcrumbsData([...updatedBreadcrumbs]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.lesson]);

  if (loading) {
    return <div>Loading....</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  const { lesson } = data;

  const formSubmitHandler = e => {
    e.preventDefault();
    updateLesson()
      .then(() => {
        navigate(`/`);
      })
      .catch(err => console.error(err));
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
    if (name === 'title') {
      const newBreadCrumbsData = [...breadcrumbsData];
      newBreadCrumbsData[1].text = event.target.value;
      setBreadcrumbsData(newBreadCrumbsData);
    }
  };

  const removeObjective = objectiveId => event => {
    setValues({
      ...values,
      objectives: values.objectives.filter((objective, i) => i !== objectiveId)
    });
  };

  const addObjective = event => {
    setValues({
      ...values,
      objectives: values.objectives.concat(newObjective)
    });
    setNewObjective('');
  };

  return (
    <div className={classes.root}>
      <BreadCrumbsNavigation breadcrumbsData={breadcrumbsData} />
      <form onSubmit={formSubmitHandler}>
        <Grid container spacing={3}>
          <LessonFormFields
            values={values}
            handleChange={handleChange}
            removeObjective={removeObjective}
            newObjective={newObjective}
            setNewObjective={setNewObjective}
            classes={classes}
            addObjective={addObjective}
          />
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Sections
            </Typography>
            <ItemGridList
              itemType="section"
              tileData={lesson.sections}
              deleteItem={deleteSection}
              refetchItems={refetch}
              // updateParent={updateLesson}
              baseUrl={`/lesson/${id}/sections/`}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" size="medium" type="submit">
              <SaveIcon />
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
