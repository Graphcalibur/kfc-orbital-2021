import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";

import ChooseLanguage from "./pages/ChooseLanguage/ChooseLanguage";
import Error from "./pages/Error/Error";
import Home from "./pages/Home/Home";
import NavBar from "./components/NavBar";
import SoloTyping from "./pages/SoloTyping/SoloTyping";
import User from "./pages/User/User";

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/solotyping/:lang?" component={SoloTyping} />
          <Route path="/lang" component={ChooseLanguage} />
          <Route path="/user/:user" component={User} />
          <Route component={Error} />
        </Switch>
      </div>
    );
  }
}

export default App;
