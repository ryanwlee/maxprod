import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, Modal, TextField, Typography } from "@material-ui/core";
import Task from "./Components/Task";
import Header from "./Components/Header";
import SetTimeModal from "./Components/SetTimeModal";
import TaskContainer from "./Components/TaskContainer";
import ErrorContainer from "./Components/ErrorContainer";
import PlayTaskModal from "./Components/PlayTaskModal";
import "react-sweet-progress/lib/style.css";
import { red, grey } from "@material-ui/core/colors";
import Spinner from "./Svg/grid.svg";
import Spinner2 from "./Svg/spinning-circles.svg";

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
  },
  LoadingModal: {
    backgroundColor: grey[100],
    textAlign: "center"
  },
  LoadingModal2: {
    textAlign: "center"
  },
  Spinner: {
    marginTop: "300px",
    outline: "none"
  },
  Spinner2: {
    marginTop: "300px",
    outline: "none"
  }
});

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
      timeInterval: 15 * 60000,
      isPlaying: false,
      getError: false,
      postError: false,
      loading: true,
      taskLoading: false,
      errorModal: false
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
    this.nextTask = this.nextTask.bind(this);
    this.pauseTask = this.pauseTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.handleDeleteIcon = this.handleDeleteIcon.bind(this);
    this.loadingModalOpen = this.loadingModalOpen.bind(this);
    this.loadingModalClose = this.loadingModalClose.bind(this);
    this.displayTask = this.displayTask.bind(this);
  }

  async componentDidMount() {
    const response = await fetch(process.env.REACT_APP_API_SERVER_URL, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    if (response.status !== 200) {
      this.setState({ getError: true, loading: false });
      return;
    }
    const tasks = await response.json();
    setTimeout(() => {
      this.setState({ tasks, loading: false, getError: false });
    }, 1000);
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
            displayTask={this.displayTask}
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

  displayTask(id) {
    let taskIndex = this.state.tasks.findIndex(task => {
      return task._id === id;
    });
    this.setState({ curTask: taskIndex });
    this.handlePlayTaskModalOpen();
  }

  pauseTask() {
    clearInterval(this.intervalHandle);
    this.setState({ isPlaying: false });
  }

  nextTask() {
    const curTask =
      this.state.curTask + 1 === this.state.tasks.length
        ? 0
        : this.state.curTask + 1;
    this.setState({ curTask, seconds: 0 });
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

    this.setState({ taskLoading: true });

    const data = JSON.stringify({ task: this.state.newtask });
    const postResponse = await fetch(process.env.REACT_APP_API_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: data
    });
    if (postResponse.status !== 200) {
      this.setState({
        taskIsNotValid: true,
        errorMsg: "Something went wrong. Try again",
        taskLoading: false
      });
      return;
    }
    const result = await postResponse.json();

    const getResponse = await fetch(process.env.REACT_APP_API_SERVER_URL, {
      headers: {
        "Content-Type": "applicatio/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    if (getResponse.status !== 200) {
      this.setState({
        taskIsNotValid: true,
        errorMsg: "Something went wrong. Please Try again",
        taskLoading: false
      });
      return;
    }
    const tasks = await getResponse.json();

    this.setState({
      tasks,
      newtask: "",
      taskIsNotValid: false,
      taskLoading: false
    });

    this.handleNewTaskModalClose();
  }

  async deleteTask() {
    this.setState({ taskLoading: true });
    clearInterval(this.intervalHandle);
    const deleteResponse = await fetch(
      process.env.REACT_APP_API_SERVER_URL +
        `/${this.state.tasks[this.state.curTask]._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
    if (deleteResponse.status !== 200) {
      this.setState({
        errorModal: true,
        taskLoading: true
      });
      return;
    }
    const result = await deleteResponse.json();

    const getResponse = await fetch(process.env.REACT_APP_API_SERVER_URL, {
      headers: {
        "Content-Type": "applicatio/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    if (getResponse.status !== 200) {
      this.setState({
        errorModal: true,
        taskLoading: true
      });
      return;
    }
    const tasks = await getResponse.json();

    const curTask = this.state.curTask >= tasks.length ? 0 : this.state.curTask;
    this.setState({ tasks, curTask, seconds: 0, taskLoading: false });
    this.countdown();
  }

  async handleDeleteIcon(id) {
    this.setState({ taskLoading: true });
    const deleteResponse = await fetch(
      process.env.REACT_APP_API_SERVER_URL + `/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
    if (deleteResponse.status !== 200) {
      this.setState({
        errorModal: true,
        taskLoading: true
      });
      return;
    }
    const result = await deleteResponse.json();

    const getResponse = await fetch(process.env.REACT_APP_API_SERVER_URL, {
      headers: {
        "Content-Type": "applicatio/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    if (getResponse.status !== 200) {
      this.setState({
        errorModal: true,
        taskLoading: true
      });
      return;
    }
    const tasks = await getResponse.json();
    const curTask = this.state.curTask >= tasks.length ? 0 : this.state.curTask;
    this.setState({ tasks, curTask, seconds: 0, taskLoading: false });
  }

  loadingModalOpen() {
    this.setState({ loading: true });
  }

  loadingModalClose() {}

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
    this.setState({ playTaskOpen: false, isPlaying: false, seconds: 0 });
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
      this.setState({ isPlaying: false });
      return;
    }
    this.setState({ isPlaying: true });
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

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.loading}
          onClose={this.loadingModalClose}
          className={classes.LoadingModal}
        >
          <img src={Spinner} className={classes.Spinner} alt={"spinner"} />
        </Modal>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.taskLoading}
          onClose={this.loadingModalClose}
          className={classes.LoadingModal2}
        >
          {this.state.errorModal ? (
            <React.Fragment>
              <Typography
                variant="h6"
                component="p"
                style={{ marginTop: "300px", color: red[600] }}
              >
                Something went wrong.
              </Typography>
              <Typography
                variant="h6"
                component="p"
                style={{ marginTop: "10px", color: red[600] }}
              >
                Please start again.
              </Typography>
            </React.Fragment>
          ) : (
            <img src={Spinner2} className={classes.Spinner2} alt={"spinner"} />
          )}
        </Modal>

        {/* buttons container */}
        {!this.state.loading && this.state.getError && <ErrorContainer />}
        {!this.state.loading && !this.state.getError && (
          <TaskContainer
            handleSetTimeModalOpen={this.handleSetTimeModalOpen}
            handleNewTaskModalOpen={this.handleNewTaskModalOpen}
            handlePlayTaskModalOpen={this.handlePlayTaskModalOpen}
            displayTasks={this.displayTasks}
            taskLength={this.state.tasks.length}
          />
        )}

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
              nextTask={this.nextTask}
              pauseTask={this.pauseTask}
              resumeTask={this.countdown}
              isPlaying={this.state.isPlaying}
            />
          </React.Fragment>
        </Modal>
      </div>
    );
  }
}

export default withStyles(useStyles)(App);
