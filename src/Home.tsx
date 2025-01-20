import { useAccount } from "wagmi";
import { useSignInEmail } from "@0xsequence/kit";

import "./Home.css";
import Connector from "./components/Connector";
import MainConnected from "./components/MainConnected";
import { Footer } from "./components/Footer";

const Home = () => {
  const { isConnected } = useAccount();

  console.log("wallet current email", useSignInEmail());

  return (
    <div>
      <h1>Party Barrage</h1>
      <h2 className="homepage__marginBtNormal"> </h2>
      {isConnected ? <MainConnected /> : <Connector />}
      <Footer />
    </div>
  );
};

export default Home;
