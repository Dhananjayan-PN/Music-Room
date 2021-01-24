import React, { Component } from "react";
import { IconButton, Typography } from "@material-ui/core";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Pause from "@material-ui/icons/Pause";
import SkipPrevious from "@material-ui/icons/SkipPrevious";
import SkipNext from "@material-ui/icons/SkipNext";
import LinearProgress from "@material-ui/core/LinearProgress";

export default class Room extends Component {
  constructor(props) {
    super(props);
  }

  msToTime = (s) => {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    if (secs < 10) {
      secs = "0" + secs;
    }
    return mins + ":" + secs;
  };

  render() {
    return (
      <div className="MusicPLayer col">
        <img
          style={{
            opacity: 1,
            minWidth: 300,
            width: "30%",
            boxShadow: this.props.darktheme ? "1px 4px 20px #ffffff12" : "0px 2px 4px #9E9E9E",
            borderRadius: 8
          }}
          src={
            this.props.song.image_url ??
            "https://images.squarespace-cdn.com/content/5d2e2c5ef24531000113c2a4/1564770295807-EJFN4EE3T23YXLMJMVJ5/image-asset.png?content-type=image%2Fpng"
          }
        />
        <Typography style={{ marginTop: 15, color: this.props.darktheme ? "white" : "black" }} variant="h5">
          {this.props.song.title ?? "Title"}
        </Typography>
        <Typography variant="overline" style={{ color: this.props.darktheme ? "#FFFFFF87" : "#00000087" }}>
          {this.props.song.artist ?? "Artist"}
        </Typography>
        <div className="row" style={{ marginLeft: 15 }}>
          <IconButton color="secondary">
            <SkipPrevious />
          </IconButton>
          <IconButton color="secondary" onClick={this.props.playOrPauseCallback}>
            {this.props.song.is_playing ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton color="secondary" onClick={this.props.skipCallback}>
            <SkipNext />
          </IconButton>
          <Typography variant="overline" style={{ marginTop: 5, display: "inline-block", color: this.props.darktheme ? "white" : "black" }}>
            {this.props.song.votes !== undefined ? this.props.song.votes + "/" + this.props.song.votes_required : null}
          </Typography>
        </div>
        <LinearProgress
          style={{ minWidth: 300, width: "35%", marginBottom: 0 }}
          color="secondary"
          variant="determinate"
          value={(this.props.song.time / this.props.song.duration) * 100}
        />
        <div style={{ marginBottom: 15 }} className="row">
          <Typography color="secondary" variant="overline">
            {(this.props.song.time === null) | (this.props.song.time === undefined) ? "0:00" : this.msToTime(this.props.song.time)}
          </Typography>
          <img style={{ minWidth: 240, width: "31%" }}></img>
          <Typography color="secondary" variant="overline">
            {(this.props.song.duration === null) | (this.props.song.duration === undefined) ? "0:00" : this.msToTime(this.props.song.duration)}
          </Typography>
        </div>
      </div>
    );
  }
}
