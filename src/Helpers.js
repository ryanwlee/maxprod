import {
  amber,
  orange,
  deepOrange,
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green
} from "@material-ui/core/colors";

export function progressTrailColor(percent) {
  if (percent <= 8) {
    return amber[200];
  } else if (percent <= 16) {
    return orange[200];
  } else if (percent <= 24) {
    return deepOrange[200];
  } else if (percent <= 32) {
    return red[200];
  } else if (percent <= 40) {
    return pink[200];
  } else if (percent <= 48) {
    return purple[200];
  } else if (percent <= 56) {
    return deepPurple[200];
  } else if (percent <= 64) {
    return indigo[200];
  } else if (percent <= 72) {
    return blue[200];
  } else if (percent <= 80) {
    return lightBlue[200];
  } else if (percent <= 88) {
    return cyan[200];
  } else if (percent <= 96) {
    return teal[200];
  } else {
    return green[200];
  }
}

export function progressColor(percent) {
  if (percent <= 8) {
    return amber[600];
  } else if (percent <= 16) {
    return orange[600];
  } else if (percent <= 24) {
    return deepOrange[600];
  } else if (percent <= 32) {
    return red[600];
  } else if (percent <= 40) {
    return pink[600];
  } else if (percent <= 48) {
    return purple[600];
  } else if (percent <= 56) {
    return deepPurple[600];
  } else if (percent <= 64) {
    return indigo[600];
  } else if (percent <= 72) {
    return blue[600];
  } else if (percent <= 80) {
    return lightBlue[600];
  } else if (percent <= 88) {
    return cyan[600];
  } else if (percent <= 96) {
    return teal[600];
  } else {
    return green[600];
  }
}

export function timeToPercent(time, timeInterval) {
  return ((time / timeInterval) * 100).toFixed(1);
}

export function secondsToTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec < 10 ? "0" + sec : sec}s`;
}

export function randomColor() {
  const dark = 200;
  const colors = [
    amber[dark],
    orange[dark],
    deepOrange[dark],
    red[dark],
    pink[dark],
    purple[dark],
    deepPurple[dark],
    indigo[dark],
    blue[dark],
    lightBlue[dark],
    cyan[dark],
    teal[dark],
    green[dark]
  ];

  return colors[Math.floor(Math.random() * 13)];
}
