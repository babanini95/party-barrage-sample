import { Box } from "@0xsequence/design-system";
import { Address, Chain } from "viem";
import ActiveChain from "./ActiveChain";
import NativeBalance from "./NativeBalance";
import { User } from "firebase/auth";

const ChainInfo = (props: { chain: Chain; address: Address; currentFirebaseUser: User | null }) => {
  const { chain, address, currentFirebaseUser } = props;

  return (
    <Box marginBottom="8">
      <Box
        display="flex"
        gap="4"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <ActiveChain chain={chain} />
      </Box>
      <NativeBalance chain={chain} address={address} currentFirebaseUser={currentFirebaseUser} />
    </Box>
  );
};

export default ChainInfo;
