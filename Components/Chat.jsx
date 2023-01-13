import { Avatar } from "@mui/material";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail.jsx";

function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const recipientEmail = getRecipientEmail(users, user);

  return (
    <button
      className="flex items-center gap-3 my-3 cursor-pointer w-full text-left px-3 py-2 hover:bg-slate-100"
      onClick={enterChat}
    >
      {recipient ? <Avatar src={recipient?.photoURL} /> : <Avatar />}
      <span>{recipientEmail.replace(/\@.*/, "")}</span>
    </button>
  );
}

export default Chat;
