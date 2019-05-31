import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Add from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import CheckBoxOutlineBlankOutlined from '@material-ui/icons/CheckBoxOutlineBlankOutlined';

export default function LessonFormFields({
  values,
  handleChange,
  removeObjective,
  newObjective,
  setNewObjective,
  classes,
  addObjective
}) {
  return (
    <>
      <Grid item xs={12}>
        <TextField
          id="title"
          label="Title"
          value={values.title}
          onChange={handleChange('title')}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="img"
          label="Image"
          value={values.img}
          onChange={handleChange('img')}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Objectives
        </Typography>
        <List dense={false}>
          {values.objectives &&
            values.objectives.map((objective, i) => (
              <ListItem key={objective}>
                <ListItemAvatar>
                  <Avatar>
                    <CheckBoxOutlineBlankOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={objective} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="Delete"
                    onClick={removeObjective(i)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
        </List>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.addObjective}>
          <InputBase
            placeholder="Add Objective"
            className={classes.addObjectiveInput}
            value={newObjective}
            onChange={e => setNewObjective(e.target.value)}
          />
          <Divider className={classes.addObjectiveDivider} />
          <IconButton
            color="primary"
            aria-label="Add to Objectives"
            className={classes.addObjectiveIconButton}
            onClick={addObjective}
          >
            <Add />
          </IconButton>
        </Paper>
      </Grid>
    </>
  );
}
