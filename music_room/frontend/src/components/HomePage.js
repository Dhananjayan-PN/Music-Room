import React, { Component } from "react";
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <Grid container spacing={1} align="center" justify="center">
              <Grid item xs={12} align="center">
                <Typography component="h2" variant="h2">
                  Music Room
                </Typography>
              </Grid>
              <Grid item xs={12} align="center">
                <Typography component="h7" variant="h7">
                  Listen to music along with your friends in real time.
                </Typography>
              </Grid>
              <Grid item xs={2} align="center">
                <Button color="primary" variant="contained" to="/create" component={Link}>
                  Create Room
                </Button>
              </Grid>
              <Grid item xs={2} align="center">
                <Button color="primary" variant="contained" to="/join" component={Link}>
                  Join Room
                </Button>
              </Grid>
            </Grid>
          </Route>
          <Route path="/join" component={RoomJoinPage}></Route>
          <Route path="/create" component={CreateRoomPage}></Route>
        </Switch>
      </Router>
    );
  }
}
