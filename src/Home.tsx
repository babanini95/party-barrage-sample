// import { useAccount } from "wagmi";
import { auth } from "./FirebaseConfig";
import { waas } from "./WaasConfig";

import "./Home.css";
import Connector from "./components/Connector";
import MainConnected from "./components/MainConnected";
import { Footer } from "./components/Footer";
import { useEffect, useState } from "react";

const Home = () => {
  // const { isConnected } = useAccount();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const checkSignInStatus = async () => {
    try {
      const signedIn = await waas.isSignedIn();
      console.log("sign in status: ", isSignedIn);
      setIsSignedIn(signedIn); // Update the state with the sign-in status
      console.log("signedIn ", isSignedIn);
      console.log("firebase current user: ", auth.currentUser);
      console.log("network: ", waas.config.network);
    } catch (error) {
      console.error('Error checking sign-in status:', error);
      setIsSignedIn(false); // Default to not signed in if an error occurs
    }
  };

  useEffect(() => {
    checkSignInStatus(); // Perform the sign-in check when the component mounts
  }, []);

  return (
    <div>
      <h1>Party Barrage</h1>
      <h2 className="homepage__marginBtNormal"> Debug: {`isSignedIn: ${isSignedIn}`} </h2>
      {isSignedIn && auth.currentUser ? <MainConnected /> : <Connector setSignIn={setIsSignedIn} />}
      <Footer />
    </div>
  );
};

export default Home;
