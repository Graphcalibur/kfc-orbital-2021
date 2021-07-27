import React, { Component } from "react";
import { Container } from "react-bootstrap";

import control_panel from "./images/control_panel.png";
import spaceship from "./images/spaceship.png";
import ufo from "./images/ufo.png";
import vim_logo from "./images/vim.png";
import logo from "./images/logo.png";

import ViewStats from "./components/ViewStats";
import Leaderboard from "./components/Leaderboard";
import HomeContainer from "./components/HomeContainer";
import HomeRow from "./components/HomeRow";

class Home extends Component {
  state = {
    user: null,
    leaderboard: [],
  };

  componentDidMount() {
    fetch("/api/current-login", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const new_curr_user = data === null ? data : data["username"];
        this.setState({ user: new_curr_user });
      });

    fetch("/api/stats/allscores")
      .then((res) => res.json())
      .then(this.generateLeaderboard);
  }

  /* Generates the daily leaderboard based on the given scorelist.
  Only displays users with >= 5 plays and rankings are based on 
  average WPM */
  generateLeaderboard = (scorelist) => {
    const data = {};
    const leaderboard = [];

    /* Creates dictionary of users and their scores and # of plays */
    scorelist.forEach((score) => {
      const username = score["username"];
      const speed = score["speed"];
      const length = 1;

      if (username in data) {
        data[username]["speed"] += speed;
        data[username]["length"] += length;
      } else {
        data[username] = { speed: speed, length: length };
      }
    });

    /* Collect all the users with >= 5 plays and their data into an array */
    Object.keys(data).forEach((key) => {
      if (data[key]["length"] >= 5) {
        leaderboard.push({
          username: key,
          speed:
            Math.round((data[key]["speed"] / data[key]["length"]) * 10) / 10,
        });
      }
    });

    /* Sort array in order of descending speed */
    leaderboard.sort((a, b) => b["speed"] - a["speed"]);
    this.setState({ leaderboard: leaderboard });
  };

  render() {
    return (
      <div>
        <center className="text">
          <img src={logo} alt="" />
          <h5>Making typing code fun, exciting, and competitive.</h5>
        </center>

        <Container className="mt-4">
          <HomeRow
            header="Improve Your Code Typing Skills"
            component_left={
              <HomeContainer
                header="Multiplayer Racing"
                description="Test your code typing skills by racing against other
                  people!"
                btn_link="/rooms"
                btn_text="Race Against Others"
                image={spaceship}
                col_text="7"
                col_img="5"
              />
            }
            component_right={
              <HomeContainer
                header="Solo Practice"
                description="Practice your code typing skills at your own pace."
                btn_link="/lang"
                btn_text="Practice On Your Own"
                image={ufo}
                col_text="6"
                col_img="6"
              />
            }
          />

          <HomeRow
            header="Build Confidence In Using Vim"
            component_left={
              <HomeContainer
                header="Vim Tutorial"
                description="Never tried Vim before? Learn the basics in this tutorial!"
                btn_link="/vim/tutorial"
                btn_text="Learn Vim"
                image={vim_logo}
                col_text="7"
                col_img="5"
              />
            }
            component_right={
              <HomeContainer
                header="Vim Practice"
                description="Practice editing files in Vim as quickly as you can!"
                btn_link="/vim/practice"
                btn_text="Practice Using Vim"
                image={control_panel}
                col_text="6"
                col_img="6"
              />
            }
          />

          <HomeRow
            header="Your Progress and Others'"
            component_left={
              <Leaderboard leaderboard={this.state.leaderboard} />
            }
            component_right={<ViewStats user={this.state.user} />}
          />
        </Container>
      </div>
    );
  }
}

export default Home;
