import { Box, Text } from "@0xsequence/design-system";
import { useAccount } from "wagmi";
import ChainInfo from "./ChainInfo";
import Disconnector from "./Disconnector";
import TestSignMessage from "./TestSignMessage";
import TestVerifyMessage from "./TestVerifyMessage";
import TestSendTransaction from "./TestSendTransaction";
import TestConvertToken from "./TestConvertToken";
import { Missing } from "./Missing";
// import { useSignInEmail } from "@0xsequence/kit";
// import { auth } from '../FirebaseConfig';
// import { useDisconnect } from "wagmi";
// import { useEffect } from "react";

const MainConnected = () => {
  // const { disconnect } = useDisconnect();

  // useEffect(() => {
  //   const walletIsValid: boolean = (useSignInEmail() === auth.currentUser?.email);
  //   if (!walletIsValid) {
  //     disconnect();
  //   }
  //   else {
  //     console.log('Wallet is valid, ' + useSignInEmail());
  //   }
  // }, [])

  const { address, chain, chainId } = useAccount();
  if (!address) {
    return <Missing>an address</Missing>;
  }
  if (!chain) {
    return <Missing>a chain</Missing>;
  }
  if (!chainId) {
    return <Missing>a chainId</Missing>;
  }
  return (
    <>
      <Text variant="large" fontWeight="bold" color="text100">
        Connected with address: {address}
      </Text>
      <Disconnector />
      <ChainInfo chain={chain} address={address} />
      <Box display="flex" flexDirection="column" gap="4">
        <TestConvertToken chainId={chainId} />
        <TestSignMessage />
        <TestVerifyMessage chainId={chainId} />
        <TestSendTransaction chainId={chainId} />
      </Box>
    </>
  );
};

export default MainConnected;
