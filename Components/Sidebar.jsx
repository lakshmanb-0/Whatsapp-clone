import { Avatar, Button, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import { auth, db } from "../firebase";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";
import { useRouter } from "next/router";
import Loading from "./Loading";

function Sidebar() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot, loading] = useCollection(userChatRef);

  const startnewChat = () => {
    const input = prompt(
      "please enter an email address for the user you wish to chat with"
    );
    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      // we add the chat info in the DB 'chats' collection if it doesn't already exist and is valid.
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  const SignOut = () => {
    auth.signOut();
    router.push("/login");
  };
  if (loading) return <Loading />;

  return (
    <div className="border-r-2 border-r-slate-50 h-[100vh]">
      <div className="flex justify-between items-center p-4 border-b-2 border-b-slate-50 sticky top-0 bg-white z-10">
        <Avatar
          className="cursor-pointer hover:opacity-90"
          onClick={() => SignOut()}
          src={user.photoURL}
        />
        <div className="flex gap-3">
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="flex p-4 ">
        <SearchIcon className="opacity-90" />
        <input
          type="text"
          placeholder="Search in chats"
          className="outline-0 ml-3 w-full"
        />
      </div>
      <div className="rounded-md text-stone-700 border-y-2 border-y-slate-50 hover:border-white">
        <Button
          variant="Text"
          className="w-full text-lg"
          onClick={startnewChat}
        >
          Start a New Chart
        </Button>
      </div>
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </div>
  );
}

export default Sidebar;
