import React, { Component } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";

import Stats from "./components/Stats";

class User extends Component {
  state = {
    user_exists: true,
    name: "",
    all_stats: [0, 0, 0, 0],
    all_stats_recent: [0, 0, 0],
    multiplayer_stats: [0, 0, 0, 0],
    multiplayer_stats_recent: [0, 0, 0],
    solo_stats: [0, 0, 0, 0],
    solo_stats_recent: [0, 0, 0],
    wpm_data_all: [{ x: new Date(0), y: 0 }],
    wpm_data_multiplayer: [{ x: new Date(0), y: 0 }],
    wpm_data_solo: [{ x: new Date(0), y: 0 }],
  };

  componentDidMount() {
    const { user } = this.props.match.params;

    const contexts = ["", "?context=Multiplayer", "?context=Solo"];

    for (let i = 0; i < 3; i++) {
      this.getSummary(user, contexts[i]);
      this.getScorelist(user, contexts[i]);
    }
  }

  /* Fetch summary of stats from backend */
  getSummary = (user, context) => {
    const url = "/api/stats/" + user + "/summary" + context;

    fetch(url)
      .then((res) => {
        /* Check if user exists */
        if (false) {
          // TODO: Check if user exists
          return null;
        } else {
          return res.json();
        }
      })
      .then((data) => {
        /* Sets user_exists to false if user doesn't exist, otherwise sets the stats */
        if (data === null) {
          this.setState({ user_exists: false });
        } else {
          const stats = [
            data["speed"]["average"],
            data["speed"]["maximum"],
            data["accuracy"]["average"],
            data["playcount"],
          ];

          if (context === "") {
            this.setState({
              name: user,
              all_stats: stats,
            });
          } else if (context === "?context=Multiplayer") {
            this.setState({
              name: user,
              multiplayer_stats: stats,
            });
          } else {
            this.setState({
              name: user,
              solo_stats: stats,
            });
          }
        }
      });

    fetch(url + (context === "" ? "?" : "&") + "recent=2")
      .then((res) => {
        /* Check if user exists */
        if (false) {
          // TODO: Check if user exists
          return null;
        } else {
          return res.json();
        }
      })
      .then((data) => {
        /* Sets user_exists to false if user doesn't exist, otherwise sets the stats */
        if (data === null) {
          return null;
        } else {
          const stats_recent = [
            data["speed"]["average"],
            data["speed"]["maximum"],
            data["accuracy"]["average"],
          ];

          if (context === "") {
            this.setState({
              all_stats_recent: stats_recent,
            });
          } else if (context === "?context=Multiplayer") {
            this.setState({
              multiplayer_stats_recent: stats_recent,
            });
          } else {
            this.setState({
              solo_stats_recent: stats_recent,
            });
          }
        }
      });
  };

  /* Fetch list of scores from backend */
  getScorelist = (user, context) => {
    const url = "/api/stats/" + user + "/scorelist" + context;
    fetch(url)
      .then((res) => {
        if (false) {
          // TODO: Check if user exists
          return null;
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data !== null) {
          /* Don't bother calculating chart data if there is no score data */
          if (data["score_window"].length > 0) {
            this.calculateChartData(data["score_window"], context);
          }
        }
      });
  };

  /* Calculate x and y data for each data point in the progress chart
    x = Date of data point
    y = Average WPM at that date
    So we want to combine typing practices on the same date together */
  calculateChartData = (scorelist, context) => {
    const wpm_data = [];

    let wpm = 0;
    let prev_date = null;
    for (let i = scorelist.length - 1; i >= 0; i--) {
      /* Scorelist object stores time in terms of seconds but Date objects
      expects in it miliseconds, so we have to multiply by 1000 */
      const curr_date = new Date(scorelist[i]["time"] * 1000);

      if (prev_date === null) {
        prev_date = curr_date;
      }

      /* Only push to wpm_data if a score with a new date is found */
      if (curr_date.getDate() !== prev_date.getDate()) {
        wpm_data.push({
          x: prev_date,
          y: wpm / (scorelist.length - i - 1) /* Get average so far */,
        });
        prev_date = curr_date;
      }

      wpm += scorelist[i]["speed"];
    }

    wpm_data.push({
      x: prev_date,
      y: wpm / scorelist.length,
    });

    if (context === "") {
      this.setState({ wpm_data_all: wpm_data });
    } else if (context === "?context=Multiplayer") {
      this.setState({ wpm_data_multiplayer: wpm_data });
    } else {
      this.setState({ wpm_data_solo: wpm_data });
    }
  };

  /* Combines non-recent and recent array into one array */
  combineArrays = (arr1, arr2) => {
    const arr3 = [];
    for (let i = 0; i < arr1.length + arr2.length; i++) {
      arr3.push(0);
    }

    for (let i = 0; i < arr1.length; i++) {
      arr3[i * 2] = arr1[i];
    }

    for (let i = 0; i < arr2.length; i++) {
      arr3[i * 2 + 1] = arr2[i];
    }

    return arr3;
  };

  render() {
    return (
      <Container fluid="lg">
        <h1 className="text">
          {this.state.user_exists
            ? this.state.name + "'s Profile"
            : "The user does not exist."}
        </h1>

        <Container className="p-3 box">
          <Tabs defaultActiveKey="all">
            <Tab eventKey="all" title="All Stats">
              <Stats
                wpm_data={this.state.wpm_data_all}
                stats={this.combineArrays(
                  this.state.all_stats,
                  this.state.all_stats_recent
                )}
              />
            </Tab>
            <Tab eventKey="racing" title="Racing Stats">
              <Stats
                wpm_data={this.state.wpm_data_multiplayer}
                stats={this.combineArrays(
                  this.state.multiplayer_stats,
                  this.state.multiplayer_stats_recent
                )}
              />
            </Tab>
            <Tab eventKey="solo" title="Solo Stats">
              <Stats
                wpm_data={this.state.wpm_data_solo}
                stats={this.combineArrays(
                  this.state.solo_stats,
                  this.state.solo_stats_recent
                )}
              />
            </Tab>
          </Tabs>
        </Container>
      </Container>
    );
  }
}

export default User;
