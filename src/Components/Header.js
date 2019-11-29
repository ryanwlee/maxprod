import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = theme => ({
  Header: {
    marginTop: "40px",
    marginBottom: "20px",
    textAlign: "center"
  },
  HeaderSecondry: {
    marginTop: "0",
    marginBottom: "0",
    textAlign: "center"
  }
});

class Header extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Typography
          variant="h2"
          color="textPrimary"
          component="p"
          className={classes.Header}
        >
          MAXPROD
        </Typography>
        <Typography
          variant="h5"
          color="textSecondary"
          component="p"
          className={classes.HeaderSecondry}
        >
          Let's work like Elon Musk!
        </Typography>
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(Header);
