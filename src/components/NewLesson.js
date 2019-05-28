import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { navigate } from '@reach/router';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';
import BreadCrumbsNavigation from '../components/BreadCrumbsNavigation';
import ItemGridList from './ItemGridList';
import LessonFormFields from './LessonFormFields';

const ADD_LESSON = gql`
  mutation ADD_LESSON($input: LessonInput) {
    addLesson(input: $input) {
      id
      name
      title
      img
      objectives
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

export default function NewLesson() {
  const [values, setValues] = useState({
    title: '',
    name: '',
    img: '',
    objectives: []
  });

  const addLesson = useMutation(ADD_LESSON, {
    variables: {
      input: { ...values }
    }
  });

  const [newObjective, setNewObjective] = useState('');

  const classes = useStyles();

  const formSubmitHandler = e => {
    e.preventDefault();
    addLesson();
    navigate(`/`);
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
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
    console.log(values);
    setNewObjective('');
  };

  const breadcrumbsData = [
    {
      href: '/',
      text: 'All Lessons'
    },
    {
      href: `lessons/add`,
      text: 'New Lesson'
    }
  ];

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
            <ItemGridList itemType="section" tileData={[]} />
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
