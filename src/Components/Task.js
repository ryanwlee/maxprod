import React from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";

class Task extends React.Component {
  render() {
    return (
      <Card>
        <CardHeader title="I am header" />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            This is task description
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default Task;
