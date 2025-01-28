import { useAccount } from "wagmi";
import { auth } from "./FirebaseConfig";

import "./Home.css";
import Connector from "./components/Connector";
import MainConnected from "./components/MainConnected";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";

const Home = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const { isConnected } = useAccount();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Sequence Sample</h1>
      <h2 className="homepage__marginBtNormal"> Token Virtual </h2>
      {isConnected && currentUser ? <MainConnected currentFirebaseUser={currentUser} /> : <Connector />}
    </div>
  );
};

export default Home;
