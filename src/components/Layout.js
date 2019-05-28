import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  appBar: {},
  toolbar: {
    flexWrap: 'wrap'
  },
  toolbarTitle: {
    flexGrow: 1
  }
}));

function SimpleContainer(props) {
  const classes = useStyles();
  return (
    <>
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.AppBar}
      >
        <Toolbar className={classes.Toolbar}>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            Content Editor
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">{props.children}</Container>
    </>
  );
}

export default function Layout(props) {
  return <SimpleContainer {...props} />;
}
