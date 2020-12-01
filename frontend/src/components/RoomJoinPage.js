import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";

export default class RoomJoinPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toJoin: "",
      error: ""
    };
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleJoinClick = this.handleJoinClick.bind(this);
  }

  handleCodeChange(e) {
    this.setState({
      toJoin: e.target.value
    });
  }

  handleJoinClick() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: this.state.toJoin
      })
    };
    fetch("/api/join-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          this.setState({
            toJoin: ""
          });
          this.props.history.push("/room/" + this.state.toJoin);
        } else {
          this.setState({
            error: "Invalid Room Code!"
          });
        }
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <Grid container spacing={1} align="center" justify="center">
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Join Room
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <FormHelperText>
              <div align="center">Enter Room Code</div>
            </FormHelperText>
            <TextField
              required={true}
              inputProps={{ style: { textAlign: "center" } }}
              onChange={this.handleCodeChange}
              value={this.state.toJoin}
              helperText={this.state.error}
              error={this.state.error}
            />
          </FormControl>
        </Grid>
        <Grid item xs={2} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
        <Grid item xs={2} align="center">
          <Button color="primary" variant="contained" onClick={this.handleJoinClick}>
            Join
          </Button>
        </Grid>
      </Grid>
    );
  }
}
