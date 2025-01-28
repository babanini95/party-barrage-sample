import { Box, IconButton, Text, RefreshIcon } from "@0xsequence/design-system";
import { SequenceIndexer } from "@0xsequence/indexer";
import { allNetworks } from "@0xsequence/network";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Address, Chain } from "viem";
import { db } from "../../FirebaseConfig";
import { User } from "firebase/auth";

const projectAccessKey = import.meta.env.NEXT_PUBLIC_PROJECT_ACCESS_KEY;

const NativeBalance = (props: { chain: Chain; address: Address; currentFirebaseUser: User | null }) => {
  const { chain, address, currentFirebaseUser } = props;
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
        const balance = normalizeStringBalance(testTokenBalances?.balances[0]?.balance);
        setTokenBalance(balance);
        const balanceNumber = Number(balance);
        updateFirebaseRealToken(balanceNumber);
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

  const updateFirebaseRealToken = async (valueToUpdate: number) => {
    try {
      if (currentFirebaseUser?.displayName !== null && currentFirebaseUser?.displayName !== undefined) {
        const docRef = doc(db, "Players", currentFirebaseUser.displayName);
        console.log("real token update:", valueToUpdate);
        await updateDoc(docRef, {
          "wallet.tokenBalance": valueToUpdate
        });
        console.log("real token update success");
      }
    }
    catch (err) {
      console.error(err);
    }
  };

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
        <IconButton icon={RefreshIcon} onClick={() => getNativeAndTokenBalance(address, chain)} size="xs" marginLeft={"4"} />
      </Box>
    </Box>
  );
};

export default NativeBalance;
