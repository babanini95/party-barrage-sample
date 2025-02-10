import { Box, IconButton, Text, RefreshIcon } from "@0xsequence/design-system";
import { SequenceIndexer } from "@0xsequence/indexer";
import { allNetworks } from "@0xsequence/network";
import { useEffect, useState } from "react";
import { Address, Chain } from "viem";

const projectAccessKey = import.meta.env.NEXT_PUBLIC_PROJECT_ACCESS_KEY;

const NativeBalance = (props: { chain: Chain; address: Address; needToRefreshBalance: boolean; setNeedToRefresh: (value: React.SetStateAction<boolean>) => void }) => {
  const { chain, address } = props;
  const [etherBalance, setEtherBalance] = useState<string | undefined>();
  const [_realToken1Balance, setRealToken1Balance] = useState<string | undefined>();
  const [_realToken2Balance, setRealToken2Balance] = useState<string | undefined>();
  const REAL_TOKEN_1_ADDRESS = "0x8dc783fae3d1a40a43962eae05861b30bc590618";
  const REAL_TOKEN_2_ADDRESS = "0xa62e75ab8460f2e15517ab81b03992abbcd726a4";

  useEffect(() => {
    getNativeAndTokenBalance(address, chain);
  }, [address, chain]);

  useEffect(() => {
    if (props.needToRefreshBalance) {
      getNativeAndTokenBalance(address, chain);
    }
  }, [props.needToRefreshBalance]);

  const getNativeAndTokenBalance = (_address: `0x${string}`, _chain: Chain) => {
    if (!_address || !_chain) return;

    const loadNativeNetworkBalance = async (chainId: number) => {
      const chainName = allNetworks.find(
        (chainInfo) => chainInfo.chainId === chainId,
      )?.name;
      if (!chainName) {
        setEtherBalance("ERROR");
        return;
      }
      const indexer = new SequenceIndexer(
        `https://${chainName}-indexer.sequence.app`,
        projectAccessKey,
      );
      const tokenBalances = await indexer.getEtherBalance({
        accountAddress: _address,
      });
      if (tokenBalances) setEtherBalance(normalizeStringBalance(tokenBalances?.balance?.balanceWei));
      const realToken1Balances = await indexer.getTokenBalances({
        contractAddress: REAL_TOKEN_1_ADDRESS,
        accountAddress: _address,
      });
      const realToken2Balances = await indexer.getTokenBalances({
        contractAddress: REAL_TOKEN_2_ADDRESS,
        accountAddress: _address,
      })
      if (realToken1Balances && realToken2Balances && _chain.id == 11155111) {
        const realToken1BalanceNormalized = normalizeStringBalance(realToken1Balances.balances[0].balance);
        const realToken2BalanceNormalized = normalizeStringBalance(realToken2Balances.balances[0].balance);
        setRealToken1Balance(realToken1BalanceNormalized);
        setRealToken2Balance(realToken2BalanceNormalized);
      }

      props.setNeedToRefresh(false);
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
          {chain.nativeCurrency.name} balance: {etherBalance || "loading..."}
        </Text>
      </Box>
      <Box display="flex">
        <Text variant="large" fontWeight="bold" color="text100">
          Real Token 1 balance: {_realToken1Balance || "loading..."}
        </Text>
      </Box>
      <Box display="flex">
        <Text variant="large" fontWeight="bold" color="text100">
          Real Token 2 balance: {_realToken2Balance || "loading..."}
        </Text>
        <IconButton icon={RefreshIcon} onClick={() => getNativeAndTokenBalance(address, chain)} size="xs" marginLeft={"4"} />
      </Box>
    </Box>
  );
};

export default NativeBalance;
