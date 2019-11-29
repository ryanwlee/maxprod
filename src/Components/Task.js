import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Card, CardContent, Typography } from "@material-ui/core";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import MediaQuery from "react-responsive";

const useStyles = theme => ({
  Task: {
    marginTop: "10px",
    marginBottom: "10px"
  },
  TaskContent: {
    paddingTop: "24px",
    paddingBottom: "24px",
    display: "grid",
    gridTemplateColumns: "8fr 1fr",
    gridTemplateAreas: '"task trash"'
  },
  TaskText: {
    gridArea: "task"
  },
  DeleteIcon: { gridArea: "trash" }
});

const mobile = 600;

class Task extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.Task}>
        <CardContent className={classes.TaskContent}>
          <MediaQuery minDeviceWidth={mobile}>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className={classes.TaskText}
            >
              {this.props.task && this.props.task.length > 45
                ? this.props.task.slice(0, 45) + " ..."
                : this.props.task}
            </Typography>
          </MediaQuery>
          <MediaQuery maxDeviceWidth={mobile - 1}>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className={classes.TaskText}
            >
              {this.props.task && this.props.task.length > 30
                ? this.props.task.slice(0, 30) + " ..."
                : this.props.task}
            </Typography>
          </MediaQuery>
          <DeleteOutlineIcon
            className={classes.DeleteIcon}
            onClick={e => this.props.delete(this.props.id)}
          />
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(useStyles)(Task);
