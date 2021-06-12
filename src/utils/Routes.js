import { Route, Switch } from "react-router-dom";
import Navbar from "../components/Navbar/index.js";
import { useState } from "react";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar/index.js";
import HomeScreen from "../screens/HomeScreen.js";
import JoinRoomScreen from "../screens/JoinRoomScreen.js";
import FeedbackScreen from "../screens/FeedbackScreen.js";
import CreateRoomScreen from "../screens/CreateRoomScreen.js";
import RoomScreen from "../screens/RoomScreen.js";

const Routes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Navbar toggle={toggle} />
      <Sidebar toggle={toggle} isOpen={isOpen} />
      <Switch>
        <Route exact path="/" component={HomeScreen} />
        <Route exact path="/create-room" component={CreateRoomScreen} />
        <Route exact path="/join-room" component={JoinRoomScreen} />
        <Route exact path="/room/:code" component={RoomScreen} />
        <Route exact path="/feedback" component={FeedbackScreen} />
      </Switch>
      <Footer />
    </>
  );
};

export default Routes;
