import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import AlarmIcon from "@material-ui/icons/Alarm";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import NoTask from "./NoTask";
import { grey } from "@material-ui/core/colors";

const useStyles = theme => ({
  Container: {
    marginTop: "20px",
    marginBottom: "20px"
  },
  ButtonContainer: {
    textAlign: "right"
  },
  Button: {
    color: grey[600],
    width: "35px",
    height: "35px",
    marginLeft: "10px"
  }
});

class ButtonContainer extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Container maxWidth="sm" className={classes.Container}>
        <div className={classes.ButtonContainer}>
          <AlarmIcon
            onClick={this.props.handleSetTimeModalOpen}
            className={classes.Button}
          />
          <AddCircleOutlineIcon
            onClick={this.props.handleNewTaskModalOpen}
            className={classes.Button}
          />
          <PlayCircleOutlineIcon
            onClick={this.props.handlePlayTaskModalOpen}
            className={classes.Button}
          />
        </div>
        {this.props.taskLength > 0 ? this.props.displayTasks() : <NoTask />}
      </Container>
    );
  }
}

export default withStyles(useStyles)(ButtonContainer);
