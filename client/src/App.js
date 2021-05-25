import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import SoloTyping from "./pages/SoloTyping/SoloTyping";
import ChooseLanguage from "./pages/ChooseLanguage/ChooseLanguage";
import NavBar from "./components/NavBar";

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/solotyping/:lang?" component={SoloTyping} />
          <Route path="/lang" component={ChooseLanguage} />
        </Switch>
      </div>
    );
  }
}

export default App;
