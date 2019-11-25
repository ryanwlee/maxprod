import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Container, AppBar, Button, Modal, TextField } from "@material-ui/core";
import AlarmIcon from "@material-ui/icons/Alarm";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import blue from "@material-ui/core/colors/blue";
import uniqid from "uniqid";
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newTaskOpen: false,
      tasks: ["I am first task", "I am second task"],
      newtask: ""
    };
    this.displayTasks = this.displayTasks.bind(this);
    this.addTaskButtonHandler = this.addTaskButtonHandler.bind(this);
    this.addTask = this.addTask.bind(this);
    this.handleNewTaskModalOpen = this.handleNewTaskModalOpen.bind(this);
    this.handleNewTaskModalClose = this.handleNewTaskModalClose.bind(this);
    this.taskPlaceholderChooser = this.taskPlaceholderChooser.bind(this);
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
    return this.state.tasks.map(task => {
      return <Task key={uniqid()} desc={task} />;
    });
  }

  onChangeTask(newtask) {
    this.setState({ newtask });
  }

  addTaskButtonHandler() {
    this.handleNewTaskModalOpen();
  }

  addTask() {
    let tasks = this.state.tasks;
    tasks.push(this.state.newtask);
    this.setState({ tasks, newtask: "" });

    this.handleNewTaskModalClose();
  }

  handleNewTaskModalOpen() {
    this.setState({ newTaskOpen: true });
  }

  handleNewTaskModalClose() {
    this.setState({ newTaskOpen: false });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Container maxWidth="sm" className={classes.App}>
          <div className={classes.ButtonContainer}>
            <AlarmIcon className={classes.Button} />
            <AddCircleOutlineIcon
              onClick={this.addTaskButtonHandler}
              className={classes.Button}
            />
            <PlayCircleOutlineIcon className={classes.Button} />
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
      </div>
    );
  }
}

export default withStyles(useStyles)(App);
