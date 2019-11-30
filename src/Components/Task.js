import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Card, CardContent, Typography } from "@material-ui/core";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import MediaQuery from "react-responsive";
import { randomColor } from "../Helpers";
import { grey } from "@material-ui/core/colors";

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
  DeleteIcon: { gridArea: "trash", color: grey[600] }
});

const mobile = 600;

class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = { backgroundColor: randomColor() };
  }

  componentDidMount() {}

  render() {
    const { classes } = this.props;

    return (
      <Card
        className={classes.Task}
        style={{ backgroundColor: this.state.backgroundColor }}
      >
        <CardContent className={classes.TaskContent}>
          <MediaQuery minDeviceWidth={mobile}>
            <Typography
              variant="body1"
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
              variant="body1"
              color="textSecondary"
              component="p"
              className={classes.TaskText}
            >
              {this.props.task && this.props.task.length > 25
                ? this.props.task.slice(0, 25) + " ..."
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
