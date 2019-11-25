import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import Task from "./Components/Task";

const useStyles = theme => ({
  App: {
    backgroundColor: "yellow"
  }
});

class App extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Container maxWidth="sm" className={classes.App}>
          <Task />
          <Task />
          <Task />
        </Container>
      </div>
    );
  }
}

export default withStyles(useStyles)(App);
