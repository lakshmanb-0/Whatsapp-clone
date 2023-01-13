import Head from "next/head";
import React from "react";
import Sidebar from "../../Components/Sidebar";
import ChatScreen from "../../Components/ChatScreen";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";

function chats({ messages, chat }) {
  const [user] = useAuthState(auth);
  return (
    <main className="flex items-start">
      <Head>
        <title>
          Chat with {getRecipientEmail(chat.users, user).replace(/\@.*/, "")}
        </title>
      </Head>
      <Sidebar />
      <ChatScreen chat={chat} messages={messages} />
    </main>
  );
}

export default chats;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);

  // prep messages on server
  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  // PREP the chats
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}
