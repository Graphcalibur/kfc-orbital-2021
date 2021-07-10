import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import socketIOClient from "socket.io-client/dist/socket.io.js";

import ChooseLanguage from "./pages/ChooseLanguage/ChooseLanguage";
import Error from "./pages/Error/Error";
import Home from "./pages/Home/Home";
import NavBar from "./components/NavBar";
import Race from "./pages/Typing/Race";
import Rooms from "./pages/Rooms/Rooms";
import SoloTyping from "./pages/Typing/SoloTyping";
import User from "./pages/User/User";
import WaitingRoom from "./pages/WaitingRoom/WaitingRoom";
import Vim from "./pages/Vim/Vim";

/* BACKEND TODO:
2) Race doesn't start until at least 2 people are in
4) Race automatically ends after a certain time?
*/

const socket = socketIOClient("/", {
  transports: ["websocket"],
});

class App extends Component {
  state = {
    race_snippet: { code: "", language: "", id: -1 },
  };

  componentDidMount() {
    socket.on("set-snippet", (snippet) => {
      console.log(snippet["snippet"]);
      this.setState({ race_snippet: snippet["snippet"] });
    });

    socket.on("check-current-login-return", (user) => {
      console.log(user);
    });
  }

  render() {
    return (
      <div>
        <NavBar socket={socket} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/solotyping/:lang?" component={SoloTyping} />
          <Route path="/lang" component={ChooseLanguage} />
          <Route path="/user/:user" component={User} />
          <Route
            path="/rooms"
            render={(props) => <Rooms {...props} socket={socket} />}
          />
          <Route
            path="/waitingroom"
            render={(props) => <WaitingRoom {...props} socket={socket} />}
          />
          <Route
            path="/race"
            render={(props) => (
              <Race
                {...props}
                snippet={this.state.race_snippet}
                socket={socket}
              />
            )}
          />
          <Route path="/vim" component={Vim} />
          <Route component={Error} />
        </Switch>
      </div>
    );
  }
}

export default App;
