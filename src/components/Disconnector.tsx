// import { useDisconnect } from "wagmi";
import { auth } from "../FirebaseConfig";
import { waas } from "../WaasConfig";
import { signOut } from "firebase/auth";

const Disconnector = () => {
  // const { disconnect } = useDisconnect();
  const disconnect = () => {
    disconnectFirebase();
    disconnectWallet();
  }

  const disconnectWallet = async () => {
    const sessions = await waas.listSessions()
    console.log(sessions);
    await waas.dropSession({ sessionId: sessions[0].id })
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
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
};

export default Disconnector;
