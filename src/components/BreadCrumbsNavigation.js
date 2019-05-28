import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  paper: {
    padding: theme.spacing(1, 2)
  }
}));

function BreadCrumbsNavigation({ breadcrumbsData }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Paper elevation={0} className={classes.paper}>
        <Breadcrumbs aria-label="Breadcrumb">
          {breadcrumbsData.map(crumb => (
            <Link key={crumb.text} color="inherit" href={crumb.href}>
              {crumb.text}
            </Link>
          ))}
        </Breadcrumbs>
      </Paper>
    </div>
  );
}

export default BreadCrumbsNavigation;
