import { Box, Text } from "@0xsequence/design-system";
// import { useAccount } from "wagmi";
import ChainInfo from "./ChainInfo";
import Disconnector from "./Disconnector";
import TestSignMessage from "./TestSignMessage";
import TestVerifyMessage from "./TestVerifyMessage";
import TestSendTransaction from "./TestSendTransaction";
import TestConvertToken from "./TestConvertToken";
import { Missing } from "./Missing";
import { waas } from "../WaasConfig";
import { getChain } from "../util";
// import { toNetworkID } from "@0xsequence/waas/dist/declarations/src/networks";
import { useEffect, useState } from "react";
import { Address } from "viem";

const MainConnected = () => {
  // const { address, chain, chainId } = useAccount();
  const [address, setAddress] = useState<Address>();

  useEffect(() => {
    const getAddress = async () => {
      const walletAddress = await waas.getAddress();
      setAddress(walletAddress as Address);
    }
    getAddress();

    return () => {
      setAddress("" as Address);
    }

  }, []);

  function getValueOfNumber(val: string | number): number {
    if (typeof val === 'number') {
      return val.valueOf(); // number.valueOf() returns itself, so this is just for demonstration
    }
    return 0; // if it's a string, return undefined
  }

  const chainId = getValueOfNumber(waas.config.network.valueOf());
  const chain = getChain(chainId);

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
