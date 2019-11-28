import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Card, CardContent, Typography } from "@material-ui/core";

const useStyles = theme => ({
  Task: {
    marginTop: "20px",
    marginBottom: "10px"
  },
  TaskContent: {
    paddingTop: "24px",
    paddingBottom: "24px"
  }
});

class Task extends React.Component {
  render() {
    const { classes } = this.props;

    if (this.props.task) console.log(this.props.task.length);
    return (
      <Card className={classes.Task}>
        <CardContent className={classes.TaskContent}>
          <Typography variant="body2" color="textSecondary" component="p">
            {this.props.task && this.props.task.length > 45
              ? this.props.task.slice(0, 45) + " ..."
              : this.props.task}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(useStyles)(Task);
