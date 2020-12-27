import React, { Component } from "react";
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";
import { Button, Grid, Typography } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Room from "./Room";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null
    };
  }

  async componentDidMount() {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ roomCode: data.code });
      });
  }

  clearRoomCode = () => {
    this.setState({
      roomCode: null
    });
  };

  renderHome() {
    return (
      <Grid container spacing={1} align="center" justify="center">
        <Grid item xs={12} align="center">
          <Typography variant="h2">Music Room</Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="overline">Listen to music with others in real time.</Typography>
        </Grid>
        <Grid item xs={1.5} align="center" style={{ marginTop: "25px", marginRight: "5px" }}>
          <Button color="primary" variant="contained" to="/create" component={Link}>
            Create Room
          </Button>
        </Grid>
        <Grid item xs={1.5} align="center" style={{ marginTop: "25px", marginLeft: "5px" }}>
          <Button color="primary" variant="contained" to="/join" component={Link}>
            Join Room
          </Button>
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return this.state.roomCode ? <Redirect to={`/room/${this.state.roomCode}`} /> : this.renderHome();
            }}
          />
          <Route path="/join" component={RoomJoinPage}></Route>
          <Route path="/create" component={CreateRoomPage}></Route>
          <Route
            path="/room/:roomCode"
            render={(props) => {
              return <Room {...props} leaveRoomCallback={this.clearRoomCode} />;
            }}
          ></Route>
        </Switch>
      </Router>
    );
  }
}
