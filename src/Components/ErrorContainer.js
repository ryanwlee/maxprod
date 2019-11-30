import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
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

class ErrorContainer extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Container maxWidth="sm" className={classes.Container}>
        <NoTask error={true} />
      </Container>
    );
  }
}

export default withStyles(useStyles)(ErrorContainer);
