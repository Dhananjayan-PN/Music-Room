import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default class CreateRoomPage extends Component {
  defaultVotes = 2;

  constructor(props) {
    super(props);
    this.state = {
      guestCanPause: this.props.guestCanPause != null ? this.props.guestCanPause : true,
      votesToSkip: this.props.votesToSkip != null ? this.props.votesToSkip : this.defaultVotes
    };
    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    this.handleVotesChange = this.handleVotesChange.bind(this);
    this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
  }

  handleVotesChange(e) {
    this.setState({
      votesToSkip: e.target.value
    });
  }

  handleGuestCanPauseChange(e) {
    this.setState({
      guestCanPause: e.target.value === "true" ? true : false
    });
  }

  handleRoomButtonPressed() {
    if (this.props.settings) {
      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          votes_to_skip: this.state.votesToSkip,
          guest_can_pause: this.state.guestCanPause,
          code: this.props.roomCode
        })
      };
      fetch("/api/update-room", requestOptions)
        .then((response) => {
          if (response.ok) {
            response.json();
            this.props.callback(true);
          } else {
            console.log(response.json());
            alert("Something went wrong!");
          }
        })
        .then((data) => {});
    } else {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          votes_to_skip: this.state.votesToSkip,
          guest_can_pause: this.state.guestCanPause
        })
      };
      fetch("/api/create-room", requestOptions)
        .then((response) => response.json())
        .then((data) => this.props.history.push("/room/" + data.code));
    }
  }

  render() {
    if (this.props.darktheme) {
      document.getElementById("body").style.backgroundColor = "#000";
    } else {
      document.getElementById("body").style.backgroundColor = "#fff";
    }
    return (
      <Grid className="center" container spacing={1} align="center" justify="center">
        <Grid item xs={12} align="center">
          <Typography style={{ color: this.props.darktheme ? "white" : "black" }} component="h4" variant="h4">
            {this.props.settings ? "Settings" : "Create Room"}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText style={{ color: this.props.darktheme ? "#FFFFFF87" : "#00000087" }}>
              <div align="center">Guest Control of Playback State</div>
            </FormHelperText>
            <RadioGroup row defaultValue={this.state.guestCanPause.toString()} onChange={this.handleGuestCanPauseChange}>
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label={<Typography style={{ color: this.props.darktheme ? "white" : "black" }}>Play/Pause</Typography>}
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="false"
                control={<Radio color="secondary" />}
                label={<Typography style={{ color: this.props.darktheme ? "white" : "black" }}>No Control</Typography>}
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <FormHelperText style={{ color: this.props.darktheme ? "#FFFFFF87" : "#00000087" }}>
              <div align="center">Votes Required To Skip Song</div>
            </FormHelperText>
            <TextField
              required={true}
              type="number"
              defaultValue={this.state.votesToSkip}
              inputProps={{
                min: 1,
                style: { textAlign: "center", color: this.props.darktheme ? "white" : "black" }
              }}
              onChange={this.handleVotesChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={1.5} align="center">
          {this.props.settings ? (
            <Button color="secondary" variant={this.props.darktheme ? "outlined" : "contained"} onClick={this.props.callback.bind(this, false)}>
              Close
            </Button>
          ) : (
            <Button color="secondary" variant="contained" to="/" component={Link}>
              Back
            </Button>
          )}
        </Grid>
        <Grid item xs={1.5} align="center">
          <Button color="primary" variant={this.props.darktheme ? "outlined" : "contained"} onClick={this.handleRoomButtonPressed}>
            {this.props.settings ? "Save" : "Create"}
          </Button>
        </Grid>
      </Grid>
    );
  }
}
