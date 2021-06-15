import React, { Component } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";

import Stats from "./components/Stats";

class User extends Component {
  state = {
    user_exists: true,
    name: "",
    all_stats: [0, 0, 0, 0, 0, 0, 0],
    race_stats: [0, 0, 0, 0, 0, 0, 0],
    solo_stats: [0, 0, 0, 0, 0, 0, 0],
    wpm_data: [{ x: new Date(0), y: 0 }],
  };

  componentDidMount() {
    const { user } = this.props.match.params;
    console.log(user);

    this.getSummary(user);
    this.getScorelist(user);
  }

  /* Fetch summary of stats from backend */
  getSummary = (user) => {
    const url = "/api/stats/summary/" + user;

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
          const all_stats = [
            data["speed"]["average"],
            0,
            data["speed"]["maximum"],
            0,
            data["accuracy"]["average"],
            0,
            data["playcount"],
          ];
          this.setState({
            name: user,
            all_stats: all_stats,
          });
        }
      });
  };

  /* Fetch list of scores from backend */
  getScorelist = (user) => {
    const url = "/api/stats/scorelist/" + user;
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
          this.calculateChartData(data["score_window"]);
        }
      });
  };

  /* Calculate x and y data for each data point in the progress chart
    x = Date of data point
    y = Average WPM at that date */
  calculateChartData = (scorelist) => {
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
          y: wpm / (scorelist.length - i) /* Get average so far */,
        });
        prev_date = curr_date;
        console.log(prev_date);
      }

      wpm += scorelist[i]["speed"];
    }

    wpm_data.push({
      x: prev_date,
      y: wpm / scorelist.length,
    });

    this.setState({ wpm_data: wpm_data });
  };

  render() {
    return (
      <Container fluid="sm">
        <h1 className="text">
          {this.state.user_exists
            ? this.state.name + "'s Profile"
            : "The user does not exist."}
        </h1>

        <Container fluid="sm" className="shadow p-3 box">
          <Tabs defaultActiveKey="all">
            <Tab eventKey="all" title="All Stats">
              <Stats
                wpm_data={this.state.wpm_data}
                stats={this.state.all_stats}
              />
            </Tab>
            <Tab eventKey="racing" title="Racing Stats">
              <Stats
                wpm_data={this.state.wpm_data}
                stats={this.state.race_stats}
              />
            </Tab>
            <Tab eventKey="solo" title="Solo Stats">
              <Stats
                wpm_data={this.state.wpm_data}
                stats={this.state.all_stats}
              />
            </Tab>
          </Tabs>
        </Container>
      </Container>
    );
  }
}

export default User;
