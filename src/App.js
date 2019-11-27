import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Container,
  Button,
  Modal,
  TextField,
  Typography
} from "@material-ui/core";
import AlarmIcon from "@material-ui/icons/Alarm";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import blue from "@material-ui/core/colors/blue";
import Task from "./Components/Task";

const useStyles = theme => ({
  App: {
    marginTop: "20px",
    marginBottom: "20px"
  },
  Button: {
    color: blue[800],
    width: "40px",
    height: "40px",
    marginLeft: "10px"
  },
  ButtonContainer: {
    textAlign: "right"
  },
  NewTaskModal: {
    position: "absolute",
    width: "300px",
    height: "300px",
    backgroundColor: theme.palette.background.paper,
    border: "none",
    boxShadow: theme.shadows[5],
    left: "calc(50% - 150px)",
    outline: "none",
    marginTop: "70px",
    borderRadius: "5px"
  },
  PlayTaskModal: {
    position: "absolute",
    width: "300px",
    height: "300px",
    backgroundColor: theme.palette.background.paper,
    border: "none",
    boxShadow: theme.shadows[5],
    left: "calc(50% - 150px)",
    outline: "none",
    marginTop: "70px",
    borderRadius: "5px"
  },
  TaskInput: {
    width: "90%",
    marginLeft: "5%",
    marginTop: "7%"
  },
  AddTaskButton: {
    marginLeft: "73.5%",
    marginTop: "10px"
  }
});

const apiServerUrl = "http://127.0.0.1:4000/api/tasks";
const timeInterval = 2000;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newTaskOpen: false,
      playTaskOpen: false,
      tasks: [],
      newtask: "",
      curTask: 0,
      seconds: timeInterval
    };

    this.intervalHandle = null;

    this.displayTasks = this.displayTasks.bind(this);
    this.addTask = this.addTask.bind(this);
    this.handleNewTaskModalOpen = this.handleNewTaskModalOpen.bind(this);
    this.handleNewTaskModalClose = this.handleNewTaskModalClose.bind(this);
    this.taskPlaceholderChooser = this.taskPlaceholderChooser.bind(this);
    this.handlePlayTaskModalOpen = this.handlePlayTaskModalOpen.bind(this);
    this.handlePlayTaskModalClose = this.handlePlayTaskModalClose.bind(this);
    this.tick = this.tick.bind(this);
    this.countdown = this.countdown.bind(this);
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
        return <Task key={task._id} task={task.task} />;
      })
    ) : (
      <Task desc={"There is no task yet"} />
    );
  }

  onChangeTask(newtask) {
    this.setState({ newtask });
  }

  async addTask() {
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
    console.log(result);

    const getResponse = await fetch(apiServerUrl, {
      headers: {
        "Content-Type": "applicatio/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    const tasks = await getResponse.json();
    this.setState({ tasks, newtask: "" });

    this.handleNewTaskModalClose();
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
    this.setState({ newTaskOpen: false });
  }

  tick() {
    let seconds = this.state.seconds;
    let curTask = this.state.curTask;

    if (seconds === 0) {
      clearInterval(this.intervalHandle);
      this.setState({
        curTask: curTask === this.state.tasks.length - 1 ? 0 : curTask + 1,
        seconds: timeInterval
      });
      this.countdown();
    } else {
      this.setState({ seconds: seconds - 1000 });
    }
  }

  countdown() {
    this.intervalHandle = setInterval(this.tick, 1000);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Container maxWidth="sm" className={classes.App}>
          <div className={classes.ButtonContainer}>
            <AlarmIcon className={classes.Button} />
            <AddCircleOutlineIcon
              onClick={this.handleNewTaskModalOpen}
              className={classes.Button}
            />
            <PlayCircleOutlineIcon
              onClick={this.handlePlayTaskModalOpen}
              className={classes.Button}
            />
          </div>
          {this.displayTasks()}
        </Container>
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
              <Button
                variant="contained"
                color="primary"
                className={classes.AddTaskButton}
                onClick={this.addTask}
              >
                Add
              </Button>
            </form>
          </div>
        </Modal>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.playTaskOpen}
          onClose={this.handlePlayTaskModalClose}
        >
          <div className={classes.PlayTaskModal}>
            <Typography variant="body2" component="p">
              {this.state.tasks.length > 0
                ? this.state.tasks[this.state.curTask].task
                : "No task"}
            </Typography>
            <Typography variant="body2" component="p">
              {this.state.seconds}
            </Typography>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withStyles(useStyles)(App);
