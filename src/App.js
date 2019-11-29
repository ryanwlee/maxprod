import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, Modal, TextField, Typography } from "@material-ui/core";
import Task from "./Components/Task";
import Header from "./Components/Header";
import SetTimeModal from "./Components/SetTimeModal";
import ButtonContainer from "./Components/ButtonContainer";
import PlayTaskModal from "./Components/PlayTaskModal";
import "react-sweet-progress/lib/style.css";
import { red } from "@material-ui/core/colors";

import {
  progressColor,
  progressTrailColor,
  timeToPercent,
  secondsToTime
} from "./Helpers";

const useStyles = theme => ({
  NewTaskModal: {
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
    padding: "20px 10px 10px 10px"
  },
  TaskInput: {
    width: "90%",
    marginLeft: "5%",
    marginTop: "7%"
  },
  AddTaskButton: {
    marginTop: "10px"
  },
  ButtonWrapper: {},
  ErrorMsg: {
    float: "left",
    color: red[600],
    width: "67%",
    height: "60px",
    marginLeft: "20px",
    marginTop: "5px"
  }
});

const apiServerUrl = "http://127.0.0.1:4000/api/tasks";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      setTimeOpen: false,
      newTaskOpen: false,
      playTaskOpen: false,
      tasks: [],
      newtask: "",
      taskIsNotValid: false,
      errorMsg: "",
      curTask: 0,
      seconds: 0,
      timeInterval: 15 * 60000
    };

    this.intervalHandle = null;

    this.displayTasks = this.displayTasks.bind(this);
    this.addTask = this.addTask.bind(this);
    this.handleSetTimeModalOpen = this.handleSetTimeModalOpen.bind(this);
    this.handleSetTimeModalClose = this.handleSetTimeModalClose.bind(this);
    this.handleNewTaskModalOpen = this.handleNewTaskModalOpen.bind(this);
    this.handleNewTaskModalClose = this.handleNewTaskModalClose.bind(this);
    this.taskPlaceholderChooser = this.taskPlaceholderChooser.bind(this);
    this.handlePlayTaskModalOpen = this.handlePlayTaskModalOpen.bind(this);
    this.handlePlayTaskModalClose = this.handlePlayTaskModalClose.bind(this);
    this.tick = this.tick.bind(this);
    this.countdown = this.countdown.bind(this);
    this.setTimeInterval = this.setTimeInterval.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.handleDeleteIcon = this.handleDeleteIcon.bind(this);
  }

  async componentDidMount() {
    const response = await fetch(apiServerUrl, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    const tasks = await response.json();
    this.setState({ tasks });
  }

  taskPlaceholderChooser() {
    const taskPlaceholder = [
      "Send text to the parents",
      "Start writing a book",
      "Check all unread emails",
      "Water all plants",
      "Start reading a new book"
    ];
    return taskPlaceholder[Math.floor(Math.random() * taskPlaceholder.length)];
  }

  displayTasks() {
    return this.state.tasks.length > 0 ? (
      this.state.tasks.map(task => {
        return (
          <Task
            key={task._id}
            task={task.task}
            delete={this.handleDeleteIcon}
            id={task._id}
          />
        );
      })
    ) : (
      <Task desc={"There is no task yet"} />
    );
  }

  onChangeTask(newtask) {
    this.setState({ newtask });
  }

  async addTask() {
    if (this.state.newtask.trim().length === 0) {
      this.setState({
        taskIsNotValid: true,
        errorMsg: "Task can't be an empty text."
      });
      return;
    }

    if (this.state.newtask.length > 150) {
      this.setState({
        taskIsNotValid: true,
        errorMsg: "Please put less than 100 characters."
      });
      return;
    }

    const data = JSON.stringify({ task: this.state.newtask });
    const postResponse = await fetch(apiServerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: data
    });
    const result = await postResponse.json();

    const getResponse = await fetch(apiServerUrl, {
      headers: {
        "Content-Type": "applicatio/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    const tasks = await getResponse.json();
    this.setState({ tasks, newtask: "", taskIsNotValid: false });

    this.handleNewTaskModalClose();
  }

  async deleteTask() {
    const deleteResponse = await fetch(
      apiServerUrl + `/${this.state.tasks[this.state.curTask]._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
    const result = await deleteResponse.json();

    const getResponse = await fetch(apiServerUrl, {
      headers: {
        "Content-Type": "applicatio/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    const tasks = await getResponse.json();
    const curTask =
      this.state.curTask === tasks.length ? 0 : this.state.curTask;
    this.setState({ tasks, curTask, seconds: 0 });
  }

  async handleDeleteIcon(id) {
    console.log(id);

    const deleteResponse = await fetch(apiServerUrl + `/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    const result = await deleteResponse.json();

    const getResponse = await fetch(apiServerUrl, {
      headers: {
        "Content-Type": "applicatio/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    const tasks = await getResponse.json();
    this.setState({ tasks });
  }

  handleSetTimeModalOpen() {
    this.setState({ setTimeOpen: true });
  }

  handleSetTimeModalClose() {
    this.setState({ setTimeOpen: false });
  }

  handlePlayTaskModalOpen() {
    this.countdown();
    this.setState({ playTaskOpen: true });
  }

  handlePlayTaskModalClose() {
    clearInterval(this.intervalHandle);
    this.setState({ playTaskOpen: false });
  }

  handleNewTaskModalOpen() {
    this.setState({ newTaskOpen: true });
  }

  handleNewTaskModalClose() {
    this.setState({
      newTaskOpen: false,
      errorMsg: "",
      taskIsNotValid: false,
      newtask: ""
    });
  }

  tick() {
    let seconds = this.state.seconds;
    let curTask = this.state.curTask;

    if (seconds >= this.state.timeInterval) {
      clearInterval(this.intervalHandle);
      this.setState({
        curTask: curTask === this.state.tasks.length - 1 ? 0 : curTask + 1,
        seconds: 0
      });
      this.countdown();
    } else {
      this.setState({ seconds: seconds + 1000 });
    }
  }

  countdown() {
    if (this.state.tasks.length === 0) {
      return;
    }
    this.intervalHandle = setInterval(this.tick, 1000);
  }

  setTimeInterval(timeInMin) {
    this.setState({ timeInterval: timeInMin * 60000 });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        {/* title and subtitle */}
        <Header />

        {/* buttons container */}
        <ButtonContainer
          handleSetTimeModalOpen={this.handleSetTimeModalOpen}
          handleNewTaskModalOpen={this.handleNewTaskModalOpen}
          handlePlayTaskModalOpen={this.handlePlayTaskModalOpen}
          displayTasks={this.displayTasks}
          taskLength={this.state.tasks.length}
        />

        {/* hidden modal for setting time interval (default 15 mins) */}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.setTimeOpen}
          onClose={this.handleSetTimeModalClose}
        >
          <React.Fragment>
            <SetTimeModal
              timeInterval={this.state.timeInterval}
              setTimeInterval={this.setTimeInterval}
              handleSetTimeModalClose={this.handleSetTimeModalClose}
            />
          </React.Fragment>
        </Modal>

        {/* hidden modal for adding new task */}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.newTaskOpen}
          onClose={this.handleNewTaskModalClose}
        >
          <div className={classes.NewTaskModal}>
            <form noValidate autoComplete="off">
              <TextField
                id="outlined-basic"
                label="New Task"
                variant="outlined"
                multiline
                rows="10"
                rowsMax="10"
                placeholder={this.taskPlaceholderChooser()}
                className={classes.TaskInput}
                onChange={e => this.onChangeTask(e.target.value)}
              />
              <div className={classes.ButtonWrapper}>
                <div className={classes.ErrorMsg}>
                  {this.state.taskIsNotValid && (
                    <Typography variant="body2" component="p">
                      {this.state.errorMsg}
                    </Typography>
                  )}
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.AddTaskButton}
                  onClick={this.addTask}
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* hidden modal for working on tasks */}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.playTaskOpen}
          onClose={this.handlePlayTaskModalClose}
        >
          <React.Fragment>
            <PlayTaskModal
              taskLength={this.state.tasks.length}
              curTask={
                this.state.tasks.length > 0
                  ? this.state.tasks[this.state.curTask].task
                  : ""
              }
              secondsText={
                secondsToTime(
                  (this.state.timeInterval - this.state.seconds) / 1000
                ) + " remaining"
              }
              percent={timeToPercent(
                this.state.seconds,
                this.state.timeInterval
              )}
              trailColor={progressTrailColor(
                timeToPercent(this.state.seconds, this.state.timeInterval)
              )}
              color={progressColor(
                timeToPercent(this.state.seconds, this.state.timeInterval)
              )}
              deleteTask={this.deleteTask}
            />
          </React.Fragment>
        </Modal>
      </div>
    );
  }
}

export default withStyles(useStyles)(App);
