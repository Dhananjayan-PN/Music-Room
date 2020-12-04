import React, { Component } from "react";
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";
import { Button, ButtonGroup, Grid, Typography } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Room from "./Room";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {}

  rederHome = () => {
    return (
      <Grid container spacing={1} align="center" justify="center">
        <Grid item xs={12} align="center">
          <Typography variant="h2">Music Room</Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="overline">Listen to music with others in real time.</Typography>
        </Grid>
        <Grid item xs={3} align="center" style={{ marginTop: "25px" }}>
          <Button color="primary" variant="contained" to="/create" component={Link}>
            Create Room
          </Button>
        </Grid>
        <Grid item xs={3} align="center" style={{ marginTop: "25px" }}>
          <Button color="primary" variant="contained" to="/join" component={Link}>
            Join Room
          </Button>
        </Grid>
      </Grid>
    );
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            {this.rederHome}
          </Route>
          <Route path="/join" component={RoomJoinPage}></Route>
          <Route path="/create" component={CreateRoomPage}></Route>
          <Route path="/room/:roomCode" component={Room}></Route>
        </Switch>
      </Router>
    );
  }
}
