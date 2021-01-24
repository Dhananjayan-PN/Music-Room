import React, { Component } from "react";
import CreateRoomPage from "./CreateRoomPage";
import Particles from "react-particles-js";
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
    document.getElementById("body").style.backgroundColor = "#fff";
    return (
      <Grid className="center" container spacing={1} align="center" justify="center">
        <Grid item xs={12} align="center">
          <Typography variant="h2">Music Room</Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="overline">Control music with others in the same room</Typography>
        </Grid>
        <Grid item xs={1.5} align="center" style={{ marginTop: "20px", marginRight: "5px" }}>
          <Button color="primary" variant="contained" to="/create" component={Link}>
            Create Room
          </Button>
        </Grid>
        <Grid item xs={1.5} align="center" style={{ marginTop: "20px", marginLeft: "5px" }}>
          <Button color="primary" variant="contained" to="/join" component={Link}>
            Join Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center" style={{ marginTop: "80px" }}>
          <Typography variant="overline">
            &copy; 2021 Built by{" "}
            <a href="https://dhananjayan.tech" style={{ color: "#3f50b5", textDecoration: "none" }}>
              Dhananjayan P N
            </a>
          </Typography>
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <Router key="body">
        <div className="particles">
          <Particles
            style={{ position: "absolute" }}
            height="100%"
            width="100%"
            params={{
              particles: {
                color: {
                  value: "#f50057"
                },
                line_linked: {
                  color: {
                    value: "#f50057"
                  }
                },
                number: {
                  value: window.innerWidth < 700 ? 30 : 80
                },
                size: {
                  value: 2
                }
              },
              interactivity: {
                detectsOn: "window",
                events: {
                  onClick: {
                    enable: true,
                    mode: "repulse"
                  },
                  onHover: {
                    enable: true,
                    mode: "attract"
                  },
                  resize: true
                }
              }
            }}
          />
        </div>
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
