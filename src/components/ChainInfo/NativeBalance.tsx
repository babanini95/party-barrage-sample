import { Box, Text } from "@0xsequence/design-system";
import { SequenceIndexer } from "@0xsequence/indexer";
import { allNetworks } from "@0xsequence/network";
import { useEffect, useState } from "react";
import { Address, Chain } from "viem";

const projectAccessKey = import.meta.env.NEXT_PUBLIC_PROJECT_ACCESS_KEY;

const NativeBalance = (props: { chain: Chain; address: Address }) => {
  const { chain, address } = props;
  const [balance, setBalance] = useState<string | undefined>();
  const [testTokenBalance, setTokenBalance] = useState<string | undefined>();
  const TESTTOKEN_ADDRESS = '0x7f61b73da268a0ad18a3c7171653d0c151626f92';

  useEffect(() => {
    getNativeAndTokenBalance(address, chain);
  }, [address, chain]);

  const getNativeAndTokenBalance = (_address: `0x${string}`, _chain: Chain) => {
    if (!_address || !_chain) return;

    const loadNativeNetworkBalance = async (chainId: number) => {
      const chainName = allNetworks.find(
        (chainInfo) => chainInfo.chainId === chainId,
      )?.name;
      if (!chainName) {
        setBalance("ERROR");
        return;
      }
      const indexer = new SequenceIndexer(
        `https://${chainName}-indexer.sequence.app`,
        projectAccessKey,
      );
      const tokenBalances = await indexer.getEtherBalance({
        accountAddress: _address,
      });
      if (tokenBalances) setBalance(normalizeStringBalance(tokenBalances?.balance?.balanceWei));
      const testTokenBalances = await indexer.getTokenBalances({
        contractAddress: TESTTOKEN_ADDRESS,
        accountAddress: _address,
      });
      if (testTokenBalances && _chain.id == 11155111) {
        setTokenBalance(normalizeStringBalance(testTokenBalances?.balances[0]?.balance));
      }
    };

    const normalizeStringBalance = (stringBalance: string) => {
      if (stringBalance)
        return (parseInt(stringBalance) / 1e18).toString();
      else
        return "0";
    }

    loadNativeNetworkBalance(_chain.id).then(() => console.log("Done"));
  }

  return (
    <Box marginBottom="8">
      <Box display="flex">
        <Text variant="large" fontWeight="bold" color="text100">
          {chain.nativeCurrency.name} balance: {balance || "loading..."}
        </Text>
      </Box>
      <Box display="flex">
        <Text variant="large" fontWeight="bold" color="text100">
          Test Token balance: {testTokenBalance || "loading..."}
        </Text>
      </Box>
    </Box>
  );
};

export default NativeBalance;
