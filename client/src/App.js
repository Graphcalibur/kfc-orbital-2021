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
import VimTutorial from "./pages/Vim/VimTutorial";
import UploadCode from "./pages/UploadCode/UploadCode";
import VimPractice from "./pages/Vim/VimPractice";

/* TODO:
1) Race doesn't start until at least 2 people are in
2) Race automatically ends after a certain time?
3) Make logging in HTTPS secure
4) Add more languages and code
*/

const socket = socketIOClient("/", {
  transports: ["websocket"],
});

class App extends Component {
  state = {
    race_snippet: { code: "", language: "", id: -1 },
    room_code: "N/A",
  };

  componentDidMount() {
    socket.on("set-snippet", (snippet) => {
      console.log(snippet["snippet"]);
      this.setState({ race_snippet: snippet["snippet"] });
    });

    socket.on("join-room-acknowledge", (data) => {
      this.setState({ room_code: data["room_code"] });
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
            render={(props) => (
              <WaitingRoom
                {...props}
                socket={socket}
                room_code={this.state.room_code}
              />
            )}
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
          <Route path="/vim/tutorial/:part?" component={VimTutorial} />
          <Route path="/vim/practice" component={VimPractice} />
          <Route path="/uploadcode" component={UploadCode} />
          <Route component={Error} />
        </Switch>
      </div>
    );
  }
}

export default App;
