import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
// import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 500,
    height: 450
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  }
}));

function LessonsGridList({ tileData }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        {tileData.lessons.length > 0
          ? tileData.lessons.map(tile => (
              <GridListTile key={tile.id + tile.title}>
                <GridListTileBar
                  title={tile.title}
                  actionIcon={
                    <IconButton className={classes.icon}>
                      <EditIcon />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))
          : "No lessons added yet."}
        <GridListTile>
          <GridListTileBar
            title="Add"
            actionIcon={
              <Fab color="primary" aria-label="Add">
                <AddIcon />
              </Fab>
            }
          />
        </GridListTile>
      </GridList>
    </div>
  );
}

export default LessonsGridList;
