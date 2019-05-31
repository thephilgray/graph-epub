import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { ImportContactsTwoTone } from '@material-ui/icons';

// import ListSubheader from "@material-ui/core/ListSubheader";
import { Link } from '@reach/router';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 800
  },
  gridListTile: {
    // padding: '3em'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  }
}));

function ItemList({ tileData, itemType, baseUrl, refetchItems, deleteItem }) {
  const classes = useStyles();

  const deleteItemAndRefetch = id => {
    deleteItem({ variables: { id } }).then(() => {
      refetchItems();
    });
  };

  return (
    <div className={classes.root}>
      <List dense={false}>
        {tileData &&
          tileData.map((section, i) => (
            <ListItem key={section.id}>
              <ListItemAvatar>
                <Avatar>
                  <ImportContactsTwoTone />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={section.title} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="Delete Section"
                  onClick={deleteItemAndRefetch(section.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
    </div>
  );
}

export default ItemList;
