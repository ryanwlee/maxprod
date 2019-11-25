import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";

const useStyles = theme => ({
  Task: {
    marginTop: "20px",
    marginBottom: "10px"
  }
});

class Task extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.Task}>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {this.props.desc}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(useStyles)(Task);
