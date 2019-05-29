import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
// import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from '@material-ui/core/IconButton';
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
    width: 500
  },
  gridListTile: {
    // padding: '3em'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  }
}));

function ItemGridList({ tileData, itemType, refetchItems, deleteItem }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        {tileData && tileData.length > 0
          ? tileData.map(tile => (
              <GridListTile
                key={tile.id + tile.title}
                className={classes.gridListTile}
              >
                <img src="https://via.placeholder.com/500x300.png" alt="" />
                <GridListTileBar
                  title={tile.title}
                  actionIcon={
                    <>
                      <Link
                        to={`/${itemType}/${tile.id}`}
                        key={tile.id + tile.title}
                      >
                        <IconButton className={classes.icon}>
                          <EditIcon />
                        </IconButton>
                      </Link>

                      <IconButton
                        className={classes.icon}
                        onClick={() => {
                          deleteItem({ variables: { id: tile.id } }).then(() =>
                            refetchItems()
                          );
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                />
              </GridListTile>
            ))
          : 'No items added yet.'}
        <GridListTile className={classes.gridListTile}>
          <img src="https://via.placeholder.com/500x300.png" alt="" />
          <GridListTileBar
            title="Add"
            actionIcon={
              <Link to={`/${itemType}s/add`}>
                <Fab color="primary" aria-label="Add" size="small">
                  <AddIcon />
                </Fab>
              </Link>
            }
          />
        </GridListTile>
      </GridList>
    </div>
  );
}

export default ItemGridList;
