import React, { Component } from "react";
import { Grid, Button, Typography, Snackbar, Collapse } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import CreateRoomPage from "./CreateRoomPage";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      isSettings: false,
      updated: false,
      spotifyAuthenticated: false
    };
    this.roomCode = this.props.match.params.roomCode;
    this.getRoomDetails();
  }

  getRoomDetails() {
    fetch("/api/get-room" + "?code=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          this.props.leaveRoomCallback();
          this.props.history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host
        });
        if (this.state.isHost) {
          this.authenticateSpotify();
        }
      });
  }

  authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ spotifyAuthenticated: data.status });
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };

  leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      this.props.leaveRoomCallback();
      this.props.history.push("/");
    });
  };

  settingsClickHandle = () => {
    this.setState({
      isSettings: true
    });
  };

  exitSetttingCallback = (updated) => {
    this.setState({
      isSettings: false,
      updated: updated
    });
    this.getRoomDetails();
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      updated: false
    });
  };

  render() {
    return this.state.isSettings ? (
      <CreateRoomPage
        roomCode={this.roomCode}
        guestCanPause={this.state.guestCanPause}
        votesToSkip={this.state.votesToSkip}
        settings={true}
        callback={this.exitSetttingCallback}
      />
    ) : (
      <div>
        <Grid container spacing={1}>
          <Grid item xs={12} align="center" style={{ marginBottom: "30px", marginLeft: "20px", marginRight: "20px" }}>
            <Collapse in={this.state.updated}>
              <Alert onClose={this.handleClose} severity="success" dismissable>
                Room updated successfully!
              </Alert>
            </Collapse>
          </Grid>
          <Grid item xs={12} align="center">
            <Typography variant="h2" component="h2">
              Code: {this.roomCode}
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Typography variant="h6" component="h6">
              Votes To Skip: {this.state.votesToSkip}
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Typography variant="h6" component="h6">
              Guests Can Pause: {this.state.guestCanPause ? "✓" : "✗"}
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Typography variant="h6" component="h6">
              Host: {this.state.isHost ? "✓" : "✗"}
            </Typography>
          </Grid>
          {this.state.isHost ? (
            <Grid item xs={12} align="center">
              <Button color="primary" variant="contained" onClick={this.settingsClickHandle}>
                Settings
              </Button>
            </Grid>
          ) : null}
          <Grid item xs={12} align="center">
            <Button color="secondary" variant="contained" onClick={this.leaveButtonPressed}>
              Leave Room
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
