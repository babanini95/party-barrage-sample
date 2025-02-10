import { Box, Text } from "@0xsequence/design-system";
import { useAccount } from "wagmi";
import ChainInfo from "./ChainInfo";
import Disconnector from "./Disconnector";
import TestConvertToken from "./TestConvertToken";
import { Missing } from "./Missing";
import { User } from "firebase/auth";

const MainConnected = (props: { currentFirebaseUser: User | null }) => {
  const { address, chain, chainId } = useAccount();
  const { currentFirebaseUser } = props;

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
      <ChainInfo chain={chain} />
      <Box display="flex" flexDirection="column" gap="4">
        <TestConvertToken chain={chain} currentFirebaseUser={currentFirebaseUser} address={address} />
      </Box>
    </>
  );
};

export default MainConnected;
