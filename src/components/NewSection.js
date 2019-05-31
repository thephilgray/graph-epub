import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';
import { navigate } from '@reach/router';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';
import BreadCrumbsNavigation from '../components/BreadCrumbsNavigation';
import SectionFormFields from './SectionFormFields';

const ADD_SECTION = gql`
  mutation ADD_SECTION($lessonId: String!, $input: SectionInput) {
    addSection(lessonId: $lessonId, input: $input) {
      id
      lesson {
        id
      }
    }
  }
`;

const FETCH_LESSON = gql`
  query getLesson($id: String!) {
    lesson(id: $id) {
      title
      id
    }
  }
`;

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
  formControl: {
    margin: '1em 0',
    minWidth: 150
  },
  submitButton: {
    margin: '1em 0'
  }
}));

export default function NewSection({ lessonId }) {
  const { data, error, loading } = useQuery(FETCH_LESSON, {
    variables: { id: lessonId }
  });

  const [values, setValues] = useState({
    title: '',
    name: '',
    type: '',
    audio: ''
  });

  const addSection = useMutation(ADD_SECTION);

  const [newObjective, setNewObjective] = useState('');

  const [breadcrumbsData, setBreadcrumbsData] = useState([
    {
      href: '/',
      text: 'All Lessons'
    },
    {
      href: `/lesson/${lessonId}`,
      text: lessonId
    },
    {
      href: `/lesson/${lessonId}/sections/add`,
      text: 'New Section'
    }
  ]);

  useEffect(() => {
    if (data && data.lesson) {
      const newBreadCrumbsData = [...breadcrumbsData];
      newBreadCrumbsData[1].text = data.lesson.title;
      setBreadcrumbsData(newBreadCrumbsData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const classes = useStyles();

  const formSubmitHandler = e => {
    e.preventDefault();
    console.log(lessonId, values);
    addSection({
      variables: {
        lessonId,
        input: { ...values }
      }
    })
      .then(({ data }) => {
        console.log(data);
        navigate(
          `/lesson/${data.addSection.lesson.id}/section/${data.addSection.id}`
        );
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleChange = name => event => {
    event.preventDefault();
    setValues({ ...values, [name]: event.target.value });
    if (name === 'title') {
      const newBreadCrumbsData = [...breadcrumbsData];
      newBreadCrumbsData[2].text = event.target.value;
      setBreadcrumbsData(newBreadCrumbsData);
    }
  };
  if (loading) {
    return <div>Loading....</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <div className={classes.root}>
      <BreadCrumbsNavigation breadcrumbsData={breadcrumbsData} />
      <form onSubmit={formSubmitHandler}>
        <Grid container spacing={3}>
          <SectionFormFields
            values={values}
            handleChange={handleChange}
            classes={classes}
          />
          <Grid item xs={12}>
            <Button
              variant="contained"
              size="medium"
              type="submit"
              className={classes.submitButton}
            >
              <SaveIcon />
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
