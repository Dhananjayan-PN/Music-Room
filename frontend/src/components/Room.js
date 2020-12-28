import React, { Component } from "react";
import { Grid, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import CreateRoomPage from "./CreateRoomPage";
import MusicPLayer from "./MusicPlayer";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      isSettings: false,
      updated: false,
      spotifyAuthenticated: false,
      copied: false,
      song: {}
    };
    this.roomCode = this.props.match.params.roomCode;
    this.getRoomDetails();
  }

  componentDidMount() {
    this.interval = setInterval(this.getCurrentSong, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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

  getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((res) => {
        if (!res.ok) {
          return {};
        } else {
          return res.json();
        }
      })
      .then((data) => {
        this.setState({ song: data });
        console.log(data);
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

  copyToClipboard = () => {
    const elem = document.createElement("textarea");
    elem.value = this.roomCode;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 5000);
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
        <Grid container spacing={1} justify="center" align="center">
          <Dialog
            open={this.state.updated}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">Changes have been saved successfully!</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <Grid item xs={12} align="center">
            <Button
              style={{ marginBottom: 15, marginTop: 50 }}
              color={this.state.copied ? "primary" : "secondary"}
              variant="outlined"
              onClick={this.copyToClipboard}
            >
              {this.state.copied ? "Copied" : "Copy Room Code"}
            </Button>
          </Grid>
          <Grid item xs={12} align="center">
            <MusicPLayer song={this.state.song} />
          </Grid>
          {this.state.isHost ? (
            <Grid item xs={1.5} align="center">
              <Button color="primary" variant="contained" onClick={this.settingsClickHandle}>
                Settings
              </Button>
            </Grid>
          ) : null}
          <Grid item xs={1.5} align="center">
            <Button color="secondary" variant="contained" onClick={this.leaveButtonPressed}>
              Leave Room
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
