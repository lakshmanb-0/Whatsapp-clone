import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import moment from "moment/moment";

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);

  return (
    <div
      className={`rounded bg-white w-fit pl-2 pt-2 pb-4 pr-10 m-2 text-left relative ${
        user === userLoggedIn.email ? "sender" : "receiver"
      }  min-w-[60px] max-w-[50rem]`}
    >
      {message.message}
      <span className="absolute right-0 bottom-0 text-right text-[9px] pb-[1px] pr-[3px] text-stone-400">
        {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
      </span>
    </div>
  );
}

export default Message;
