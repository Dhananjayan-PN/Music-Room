import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false
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
      });
  }
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

  render() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h2" component="h2">
            Room Code: {this.roomCode}
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
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" onClick={this.leaveButtonPressed}>
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
}

{
  /* <div>
  <h3>{this.roomCode}</h3>
  <p>Votes: {this.state.votesToSkip}</p>
  <p>GuestCanPause: {this.state.guestCanPause.toString()}</p>
  <p>Host: {this.state.isHost.toString()}</p>
</div>; */
}
