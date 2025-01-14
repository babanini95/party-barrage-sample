import { useOpenConnectModal } from "@0xsequence/kit";
import FirebaseConnector from "./FirebaseConnector";

const Connector = () => {
  const { setOpenConnectModal } = useOpenConnectModal();

  return (
    <>
      <p>Not connected</p>
      <div className="card">
        <button onClick={() => setOpenConnectModal(true)}>Connect</button>        
      </div>   
      <FirebaseConnector/>   
    </>
  );
};

export default Connector;
