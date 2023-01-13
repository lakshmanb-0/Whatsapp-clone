import { Avatar, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { db, auth } from "../firebase";
import {
  AttachFile,
  Mic,
  MoreVert,
  SentimentSatisfiedAlt,
} from "@mui/icons-material";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/compat/app";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";
import { useRef } from "react";
import Loading from "./Loading";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [input, setInput] = useState("");
  const emptyMessageRef = useRef(null);
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollBottom = () => {
    emptyMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault(); // prevents refreshing
    // update last seen
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  if (loading) return <Loading />;

  return (
    <main className="w-full flex-1 overflow-scroll h-screen">
      <header className="flex justify-between items-center px-2 border-b-2 border-b-slate-50 sticky top-0 bg-white z-10">
        <div className="flex items-center my-1">
          {recipient ? <Avatar src={recipient?.photoURL} /> : <Avatar />}
          <div className="ml-3 flex flex-col">
            <h6>{getRecipientEmail(chat.users, user)}</h6>
            {recipientSnapshot ? (
              <span className="text-sm">
                Last seen:{" "}
                {recipient?.lastseen?.toDate() ? (
                  <TimeAgo datetime={recipient?.lastseen?.toDate()} />
                ) : (
                  "Unavailable"
                )}
              </span>
            ) : (
              <span className="text-sm">Loading Last active...</span>
            )}
          </div>
        </div>
        <div>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </header>
      <section className="min-h-[90vh] p-3 bg-[#e5ded8]">
        {showMessages()}
        <div className="mb-20" ref={emptyMessageRef}></div>
      </section>
      <form className="flex items-center justify-between px-5 sticky bottom-0 bg-white py-2 z-10">
        <SentimentSatisfiedAlt />
        <input
          type="text"
          placeholder="Type a Message"
          className="outline-0 flex-1 ml-2 bg-slate-200 rounded-sm px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <Mic />
      </form>
    </main>
  );
}

export default ChatScreen;
