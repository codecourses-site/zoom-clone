import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import CreateMeeting from "./components/create-meeting/CreateMeeting";
import Home from "./components/home/Home";
import Loading from "./components/common/Loading";
import Login from "./components/login/Login";
import MeetingDetail from "./components/meeting-detail/MeetingDetail";
import PrivateRoute from "./components/common/PrivateRoute";

import Context from "./context";

import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [cometChat, setCometChat] = useState(null);

  const context = {
    user,
    setUser,
    cometChat,
    setCometChat,
  };

  const initAuthUser = () => {
    const authenticatedUser = localStorage.getItem("auth");
    if (authenticatedUser) {
      setUser(JSON.parse(authenticatedUser));
    }
  };

  const initCometChat = async () => {
    const { CometChat } = await import("@cometchat-pro/chat");
    const appID = `${process.env.REACT_APP_COMETCHAT_APP_ID}`;
    const region = `${process.env.REACT_APP_COMETCHAT_REGION}`;
    const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();
    CometChat.init(appID, appSetting).then(
      () => {
        setCometChat(() => CometChat);
      },
      (error) => {}
    );
  };

  useEffect(() => {
    initAuthUser();
    initCometChat();
  }, []);

  return (
    <Context.Provider value={context}>
      <Router>
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute
            exact
            path="/create-meeting"
            component={CreateMeeting}
          />
          <PrivateRoute
            exact
            path="/meeting-detail"
            component={MeetingDetail}
          />
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
      <Loading />
    </Context.Provider>
  );
}

export default App;
