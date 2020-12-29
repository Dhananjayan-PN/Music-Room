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
  render() {
    return (
      <div className="MusicPLayer col">
        <img
          style={{ minWidth: 300, width: "60%", boxShadow: "0px 2px 4px #9E9E9E", borderRadius: 5 }}
          src={
            this.props.song.image_url ??
            "https://images.squarespace-cdn.com/content/5d2e2c5ef24531000113c2a4/1564770295807-EJFN4EE3T23YXLMJMVJ5/image-asset.png?content-type=image%2Fpng"
          }
        />
        <Typography style={{ marginTop: 10 }} variant="h5">
          {this.props.song.title ?? "Title"}
        </Typography>
        <Typography variant="overline">{this.props.song.artist ?? "Artist"}</Typography>
        <div className="row">
          <IconButton color="secondary" aria-label="add an alarm">
            <SkipPrevious />
          </IconButton>
          <IconButton color="secondary" aria-label="add an alarm">
            {this.props.song.is_playing ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton color="secondary" aria-label="add an alarm">
            <SkipNext />
          </IconButton>
        </div>
        <LinearProgress
          style={{ minWidth: 300, width: "70%", marginBottom: 0 }}
          color="secondary"
          variant="determinate"
          value={(this.props.song.time / this.props.song.duration) * 100}
        />
        <div style={{ marginBottom: 40 }} className="row">
          <Typography color="secondary" variant="overline">
            {(this.props.song.time === null) | (this.props.song.time === undefined)
              ? "0:00"
              : (Math.floor(this.props.song.time / 60000) + ":" + (this.props.song.time < 10000 ? "0" : "") + (this.props.song.time % 60000)).slice(
                  0,
                  4
                )}
          </Typography>
          <img style={{ minWidth: 240, width: "61%" }}></img>
          <Typography color="secondary" variant="overline">
            {(this.props.song.time === null) | (this.props.song.time === undefined)
              ? "0:00"
              : (
                  Math.floor(this.props.song.duration / 60000) +
                  ":" +
                  (this.props.song.duration < 10000 ? "0" : "") +
                  (this.props.song.duration % 60000)
                ).slice(0, 4)}
          </Typography>
        </div>
      </div>
    );
  }
}
