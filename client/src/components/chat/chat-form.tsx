"use client";
import React, { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import MessageHeader from "./MessageHeader";
import MessageTool from "./MessageTool";
import InforTrip from "./InforTrip";
// import InforExtraTrip from "./InforExtraTrip";
import UserInfo from "./UserInfor";
import Block from "./Block";
import { BlockUI } from 'primereact/blockui';
// import SideBar from "./SideBar";
//** UI component */
// import { useAuthStore } from "../store/auth";

const ChatForm = ({ tripId }) => {
  const isLogin = true;
  const [isTrip,setisTrip] = useState(true)
  const dummy = useRef<HTMLDivElement>(null)

  const [message, setMessage] = useState("");

  const onSendMessage = () => {
      event.preventDefault();
      // Send the message text
      socket.send(
        JSON.stringify({
          text: message,
        })
      );

      // Clear the input
      setMessage("");
      console.log(messages);
  }

  //Start a connection
  document.cookie = "tripId=" + tripId + "; path=/";
  const socket = new WebSocket("ws://localhost:8888/chat");

  const users = [];
  const messages = [];

  const addMessage = (message) => {
    console.log("message added", message);
    // Create an element for message
    const el = document.createElement("h3");

    // Set text of element to be message
    el.appendChild(
      document.createTextNode(message.username + ": " + message.text)
    );

    // Scroll to bottom of messages element
    const messagesEl = document.getElementById("messages");
    messagesEl.appendChild(el);
    messagesEl.scrollTo(0, messagesEl.scrollHeight);
  };

  const setMessages = (messages) => {
    // Clear messages
    document.getElementById("messages").innerHTML = "";
    // Loop through and add each message
    messages.forEach((message) => addMessage(message));
  };

  const addUser = (username) => {
    // Create an element for username
    const el = document.createElement("h4");

    // Set id of element for easy remove
    el.setAttribute("id", username);

    el.appendChild(document.createTextNode(username));
    document.getElementById("users").appendChild(el);
  };

  const removeUser = (username) => {
    document.getElementById(username).outerHTML = "";
  };

  const setUsers = (usernames) => {
    // Clear usernames
    document.getElementById("users").innerHTML = "";
    // Loop through and add each username
    usernames.forEach((username) => addUser(username));
  };


  useEffect(() => {
    // Listen for messages
    socket.addEventListener("message", (e) => {
      // Data sent will be a string so parse into an object
      const event = JSON.parse(e.data);
      console.log("event message", event);

      // Server sets a type for each message
      switch (event.type) {
        case "MESSAGES_ADD":
          addMessage(event.data);
          break;
        case "MESSAGES_SET":
          setMessages(event.data);
          break;
        case "USERS_ADD":
          addUser(event.data);
          break;
        case "USERS_REMOVE":
          removeUser(event.data);
          break;
        case "USERS_SET":
          setUsers(event.data);
          break;
      }
    });

    // document.getElementById("form").addEventListener("submit", (event) => {
    //   // Prevent from submitting page
    //   event.preventDefault();

    //   const el = event.target.getElementsByTagName("input")[0];

    //   // Send the message text
    //   socket.send(
    //     JSON.stringify({
    //       text: el.value,
    //     })
    //   );

    //   // Clear the input
    //   el.value = "";
    // });
  }, []);
  return (
    <>
      
      <div className="flex sm:px-2 h-full w-full">
      {/* <div className="bg-white h-full w-1/12">
        <SideBar/>
      </div> */}
      { isLogin ?
          <div className="bg-[#F6F8FA] h-full w-11/12 sm:w-4/5 sm:mr-3 flex flex-col rounded-xl">    
             <div className="flex-grow-0">
              <MessageHeader/>
            </div>
            <div className="flex-1 overflow-auto no-scrollbar" ref={dummy}>
              <MessageBox />
            </div>
            <div className="flex-grow-0">
              <MessageTool message={message} setMessage={setMessage} onSendMessage={onSendMessage}/>
            </div>
          </div>
        : 
          <BlockUI template={<Block/>} containerClassName="h-full w-11/12 sm:w-4/5 sm:mr-3 flex flex-col rounded-xl " blocked={true}>
            <div className="blur-sm h-full w-full mr-3 flex flex-col rounded-xl">
              <div className="flex-grow-0">
                <MessageHeader/>
              </div>
              <div className="flex-1 overflow-auto no-scrollbar" ref={dummy}>
                <MessageBox />
              </div>
              <div className="flex-grow-0">
                <MessageTool message={message} setMessage={setMessage} onSendMessage={onSendMessage}/>
              </div>
            </div>
          </BlockUI>
      }
      <div className="h-full sm:flex hidden flex-col sm:gap-1 md:gap-2 sm:w-1/4">
        <div className="flex-1 mb-4 sm:h-2/3">
          {isTrip ?
          (
            <InforTrip func={setisTrip}/>
          )
          : (
            <UserInfo func={setisTrip}/>
          )
        }
        </div>
        <div className="flex-1 bg-white shadow-xl rounded-2xl sm:h-1/3">
          {/* <Note/> */}
        </div>
      </div>
    </div>
    {/* <div className="chat-window">
        <div id="messages"></div>
        <div id="users"></div>
      </div>
      <form className="chat-box" id="form">
        <input name="text" placeholder="Message" />
        <button type="submit">Submit</button>
      </form> */}
    </>
  );
};

export default ChatForm;
