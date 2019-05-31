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
import SectionFormFields from './SectionFormFields';

const SINGLE_SECTION = gql`
  query getSection($id: String!) {
    section(id: $id) {
      id
      title
      audio
      type
      exercises {
        id
      }
      lesson {
        id
        title
      }
    }
  }
`;

const UPDATE_SECTION = gql`
  mutation UPDATE_SECTION($id: String!, $input: SectionInput) {
    updateSection(id: $id, input: $input) {
      id
      title
      audio
      lesson {
        id
      }
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
  submitButton: {
    margin: '1em 0'
  }
}));

export default function SingleSection({ id, lessonId }) {
  const { data, error, loading } = useQuery(SINGLE_SECTION, {
    variables: { id }
  });

  const [values, setValues] = useState({
    title: '',
    audio: '',
    type: ''
  });

  const updateSection = useMutation(UPDATE_SECTION, {
    variables: { id, input: { ...values } }
  });

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
      href: ``,
      text: id
    }
  ]);

  const classes = useStyles();

  useEffect(() => {
    if (!data.loading && !data.error && data.section) {
      setValues({
        title: data.section.title || '',
        audio: data.section.audio || '',
        type: data.section.type || ''
      });
      let updatedBreadcrumbs = [...breadcrumbsData];
      updatedBreadcrumbs[1].text = data.section.lesson.title;
      updatedBreadcrumbs[2].text = data.section.title;
      setBreadcrumbsData([...updatedBreadcrumbs]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.section]);

  if (loading) {
    return <div>Loading....</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }
  const { section } = data;

  const formSubmitHandler = e => {
    e.preventDefault();
    updateSection()
      .then(() => {
        navigate(`/lesson/${lessonId}`);
      })
      .catch(err => {
        console.error(err);
        navigate(`/`);
      });
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
    if (name === 'title') {
      const newBreadCrumbsData = [...breadcrumbsData];
      newBreadCrumbsData[2].text = event.target.value;
      setBreadcrumbsData(newBreadCrumbsData);
    }
  };

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
            <Typography variant="h6" gutterBottom>
              Exercises
            </Typography>
            <ItemGridList
              itemType="exercise"
              tileData={section.exercises}
              baseUrl={`/lesson/${lessonId}/sections/${id}/exercises/`}
            />
          </Grid>
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
