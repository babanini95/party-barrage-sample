import { Box } from "@0xsequence/design-system";
import { Chain } from "viem";
import ActiveChain from "./ActiveChain";

const ChainInfo = (props: { chain: Chain; }) => {
  const { chain } = props;

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
    </Box>
  );
};

export default ChainInfo;
