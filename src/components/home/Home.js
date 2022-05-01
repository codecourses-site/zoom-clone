import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { useHistory } from "react-router-dom";

import Header from "../common/Header";

import * as cometChatService from "../../services/cometchat";
import * as firebaseService from "../../services/firebase";

import Context from "../../context";

const Home = () => {
  const [meetings, setMeetings] = useState([]);

  const meetingsRef = useRef(firebaseService.getRef("meetings"));

  const { cometChat } = useContext(Context);

  const history = useHistory();

  const loadMeetings = useCallback(() => {
    firebaseService.getDataRealtime(meetingsRef, onDataLoaded);
  }, []);

  const onDataLoaded = (val) => {
    if (val) {
      const keys = Object.keys(val);
      const data = keys.map((key) => val[key]);
      setMeetings(data);
    }
  };

  useEffect(() => {
    loadMeetings();
    return () => {
      firebaseService.offRealtimeDatabase(meetingsRef.current);
    };
  }, [loadMeetings]);

  const startMeeting = (meeting) => async () => {
    try {
      await cometChatService.joinGroup(cometChat, meeting.id);
      setUpMeeting(meeting);
    } catch (error) {
      setUpMeeting(meeting);
    }
  };

  const setUpMeeting = (meeting) => {
    localStorage.setItem("meeting", JSON.stringify(meeting));
    history.push("/meeting-detail");
  };

  return (
    <React.Fragment>
      <Header />
      <div className="home">
        <div>
          {meetings?.map((meeting) => (
            <div className="meeting__item" key={meeting.id}>
              <p className="meeting__name">{meeting.name}</p>
              <p className="meeting_id">Meeting ID: {meeting.id}</p>
              <button onClick={startMeeting(meeting)}>Start</button>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
