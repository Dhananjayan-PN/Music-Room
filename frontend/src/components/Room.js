import React, { Component } from "react";
import { Grid, Button, Switch } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import NightsStayIcon from "@material-ui/icons/NightsStay";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
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
      song: {},
      dark: false
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

  playOrPause = () => {
    if (this.state.song.is_playing) {
      fetch("/spotify/pause", { method: "PUT", headers: { "Content-Type": "application/json" } });
    } else {
      fetch("/spotify/play", { method: "PUT", headers: { "Content-Type": "application/json" } });
    }
  };

  skipSong = () => {
    fetch("/spotify/skip", { method: "POST", headers: { "Content-Type": "application/json" } });
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
    if (this.state.dark) {
      document.getElementById("body").style.backgroundColor = "#000";
    } else {
      document.getElementById("body").style.backgroundColor = "#fff";
    }
    return this.state.isSettings ? (
      <CreateRoomPage
        darktheme={this.state.dark}
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
            PaperProps={{
              style: {
                backgroundColor: this.state.dark ? "#000" : "#fff"
              }
            }}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <span style={{ color: this.state.dark ? "white" : "black" }}>Changes have been successfully saved!</span>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color={this.state.dark ? "secondary" : "primary"} autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <Grid item xs={1.5} align="center">
            <Button
              style={{ marginBottom: 20, marginTop: 25 }}
              color={this.state.copied ? "primary" : "secondary"}
              variant="outlined"
              onClick={this.copyToClipboard}
            >
              {this.state.copied ? "Copied" : "Copy Room Code"}
            </Button>
          </Grid>
          <Grid item xs={1.5} align="center" style={{ marginLeft: 20 }}>
            <WbSunnyIcon style={{ color: this.state.dark ? "white" : "black", marginBottom: 20, marginTop: 32 }} />
          </Grid>
          <Grid item xs={1.5} align="center" style={{ marginBottom: 20, marginTop: 25, marginLeft: 0 }}>
            <Switch
              checked={this.state.dark}
              onChange={() => this.setState({ dark: !this.state.dark })}
              color="primary"
              name="checkedB"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          </Grid>
          <Grid item xs={1.5} align="center" style={{ marginLeft: 0 }}>
            <NightsStayIcon style={{ color: this.state.dark ? "white" : "black", marginBottom: 20, marginTop: 31 }} />
          </Grid>
          <Grid item xs={12} align="center">
            <MusicPLayer darktheme={this.state.dark} song={this.state.song} playOrPauseCallback={this.playOrPause} skipCallback={this.skipSong} />
          </Grid>
          {this.state.isHost ? (
            <Grid item xs={1.5} align="center" style={{ marginBottom: 30 }}>
              <Button color="primary" variant={this.state.dark ? "outlined" : "contained"} onClick={this.settingsClickHandle}>
                Settings
              </Button>
            </Grid>
          ) : null}
          <Grid item xs={1.5} align="center" style={{ marginBottom: 30 }}>
            <Button color="secondary" variant={this.state.dark ? "outlined" : "contained"} onClick={this.leaveButtonPressed}>
              Leave Room
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
