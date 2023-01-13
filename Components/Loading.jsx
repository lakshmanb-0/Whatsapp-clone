import { RotateSpinner } from "react-spinners-kit";

function Loading() {
  return (
    <div className="grid place-items-center h-screen">
      <RotateSpinner />
    </div>
  );
}

export default Loading;
