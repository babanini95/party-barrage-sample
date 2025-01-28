import { useDisconnect } from "wagmi";
import { auth } from "../FirebaseConfig";
import { signOut } from "firebase/auth";

const Disconnector = () => {
  const { disconnect } = useDisconnect();

  const disconnectButton = () => {
    disconnect();
    disconnectFirebase();
  }

  const disconnectFirebase = async () => {
    try {
      await signOut(auth)
      console.log("sign out success");
    }
    catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="card">
      <button onClick={() => disconnectButton()}>Disconnect</button>
    </div>
  );
};

export default Disconnector;
