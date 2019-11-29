import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";
import { Progress } from "react-sweet-progress";

const useStyles = theme => ({
  PlayTaskModal: {
    position: "absolute",
    width: "300px",
    height: "300px",
    backgroundColor: theme.palette.background.paper,
    border: "none",
    boxShadow: theme.shadows[5],
    left: "calc(50% - 160px)",
    outline: "none",
    marginTop: "70px",
    borderRadius: "5px",
    padding: "20px 10px 10px 10px",
    textAlign: "center"
  },
  PlayTaskTitle: {},
  PlayTaskBody: {
    padding: "20px 0 20px 0",
    height: "120px",
    overflowWrap: "break-word",
    display: "table-cell",
    verticalAlign: "middle"
  },
  PlayTaskBodyWrapper: {
    display: "table",
    marginLeft: "auto",
    marginRight: "auto"
  },
  PlayTaskTime: {},
  ProgressBar: {
    margin: "5px auto 20px auto",
    width: "70%"
  },
  FinishedBtn: {}
});

class PlayTaskModal extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.PlayTaskModal}>
        <Typography
          variant="h6"
          component="p"
          className={classes.PlayTaskTitle}
        >
          {this.props.taskLength > 0 ? "You are now working on" : "No task"}
        </Typography>
        <div className={classes.PlayTaskBodyWrapper}>
          <Typography
            variant="body1"
            component="p"
            className={classes.PlayTaskBody}
          >
            {this.props.taskLength > 0
              ? this.props.curTask
              : "Let's be active! Add new task!"}
          </Typography>
        </div>
        {this.props.taskLength !== 0 ? (
          <React.Fragment>
            <Typography
              variant="body2"
              component="p"
              className={classes.PlayTaskTime}
            >
              {this.props.secondsText}
            </Typography>
            <Progress
              percent={this.props.percent}
              status={"default"}
              theme={{
                default: {
                  trailColor: this.props.trailColor,
                  color: this.props.color,
                  symbol: ""
                }
              }}
              className={classes.ProgressBar}
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.FinishedBtn}
              onClick={this.props.deleteTask}
            >
              Finished
            </Button>
          </React.Fragment>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default withStyles(useStyles)(PlayTaskModal);
