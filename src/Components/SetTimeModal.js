import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Slider, Button, Typography } from "@material-ui/core";

const useStyles = theme => ({
  SetTimeModal: {
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
    textAlign: "center",
    padding: "30px 10px 10px 10px"
  },
  TimeSlider: {
    width: "70%",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "70px"
  },
  TimeSliderBtn: {
    marginTop: "80px"
  }
});

class SetTimeModal extends React.Component {
  render() {
    const { classes } = this.props;
    const marks = [
      { value: 5, label: "5" },
      { value: 10, label: "10" },
      { value: 15, label: "15" },
      { value: 30, label: "30" },
      { value: 60, label: "60" }
    ];

    return (
      <div className={classes.SetTimeModal}>
        <Typography variant="h5" component="p">
          Time for Each Task
        </Typography>
        <Slider
          defaultValue={this.props.timeInterval / 60000}
          step={5}
          marks={marks}
          valueLabelDisplay="on"
          valueLabelFormat={m => `${m} m`}
          max={60}
          min={5}
          onChange={(e, v) => this.props.setTimeInterval(v)}
          className={classes.TimeSlider}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.TimeSliderBtn}
          onClick={this.props.handleSetTimeModalClose}
        >
          Set
        </Button>
      </div>
    );
  }
}

export default withStyles(useStyles)(SetTimeModal);
