import React from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';

export default function LessonFormFields({ values, handleChange, classes }) {
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
          id="audio"
          label="Audio"
          value={values.audio}
          onChange={handleChange('audio')}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="type-simple">Type</InputLabel>
          <Select
            value={values.type}
            onChange={handleChange('type')}
            inputProps={{
              name: 'type',
              id: 'type-simple'
            }}
          >
            <MenuItem value="Listening">Listening</MenuItem>
            <MenuItem value="Reading">Reading</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </>
  );
}
