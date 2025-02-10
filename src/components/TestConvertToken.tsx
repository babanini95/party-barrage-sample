import { ChangeEvent, useEffect, useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useWalletClient } from "wagmi";
import { Address, Chain } from "viem";
import { Box, Text } from "@0xsequence/design-system";
import { abi, contractAddress } from "../contract-abi";
import { ethers } from "ethers";
import { db } from "../FirebaseConfig";
import { DocumentData, onSnapshot, doc, updateDoc } from "firebase/firestore";
import ErrorToast from "./ErrorToast";
import CardButton from "./CardButton";
import { User } from "firebase/auth";
import NativeBalance from "./ChainInfo/NativeBalance";

const TestConvertToken = (props: { chain: Chain; currentFirebaseUser: User | null; address: Address; }) => {
    const { chain, currentFirebaseUser, address } = props;
    const { data: walletClient } = useWalletClient();
    const [snapshot, setSnapshot] = useState<DocumentData>();
    const [isNeedToRefresh, setIsNeedToRefresh] = useState<boolean>(false);

    /*//////////////////////////////////////////////////////////////
                        CONVERT SHARD CONSTANTS
    //////////////////////////////////////////////////////////////*/
    const {
        writeContractAsync: writeLimitedTokenAsync,
        data: txnData1,
        error: error1,
        isPending: isPendingTx1,
        reset: reset1,
    } = useWriteContract();
    const {
        isLoading: isConfirmingTx1,
        isSuccess: isConfirmedTx1
    } = useWaitForTransactionReceipt({ hash: txnData1 });
    const [inputShard, setInputShard] = useState(0);
    const [shardAmount, setShardAmount] = useState(0);
    const [lastTransaction1, setLastTransaction1] = useState<string | null>(null);

    /*//////////////////////////////////////////////////////////////
                         CONVERT COIN CONSTANTS
    //////////////////////////////////////////////////////////////*/
    const {
        writeContractAsync: writeUnlimitedTokenAsync,
        data: txnData2,
        error: error2,
        isPending: isPendingTx2,
        reset: reset2,
    } = useWriteContract();
    const {
        isLoading: isConfirmingTx2,
        isSuccess: isConfirmedTx2
    } = useWaitForTransactionReceipt({ hash: txnData2 });
    const [inputCoin, setInputCoin] = useState(0);
    const [coinAmount, setCoinAmount] = useState(0);
    const [lastTransaction2, setLastTransaction2] = useState<string | null>(null);

    useEffect(() => {
        if (txnData1) {
            setLastTransaction1(txnData1);
            setShardAmount(0);
            setIsNeedToRefresh(true);
        }
        if (error1) console.error(error1)
    }, [txnData1, error1]);

    useEffect(() => {
        if (txnData2) {
            setLastTransaction2(txnData2);
            setCoinAmount(0);
            setIsNeedToRefresh(true);
        }
        if (error2) console.error(error2)
    }, [txnData2, error2]);

    useEffect(() => {
        if (currentFirebaseUser?.displayName !== null && currentFirebaseUser?.displayName !== undefined) {
            const docRef = doc(db, "Players", currentFirebaseUser.displayName);
            const unsubscribe = onSnapshot(docRef, (doc) => {
                console.log("Current data: ", doc.data());
                if (doc.exists()) {
                    setSnapshot(doc.data());
                    const shardAmountFromDoc = doc.data().shard;
                    const coinAmountFromDoc = doc.data().coin;
                    setShardAmount(shardAmountFromDoc);
                    setCoinAmount(coinAmountFromDoc);
                    console.log("shardAmountFromDoc", shardAmountFromDoc);
                    console.log("coinAmountFromDoc", coinAmountFromDoc);
                }
            });
            return () => unsubscribe();
        }
    }, [currentFirebaseUser]);

    const onChangeShardAmount = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.valueAsNumber;
        setInputShard(value);
        if (value < 0) {
            setInputShard(0);
        };
    };

    const onChangeCoinAmount = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.valueAsNumber;
        setInputCoin(value);
        if (value < 0) {
            setInputCoin(0);
        };
    };

    const addShard = () => {
        const valueToUpdate: number = snapshot?.shard + inputShard;
        updateShard(valueToUpdate).then(() => {
            setInputShard(0);
        });
    };

    const addCoin = () => {
        const valueToUpdate: number = snapshot?.coin + inputCoin;
        updateCoin(valueToUpdate).then(() => {
            setInputCoin(0);
        });
    };

    const convertShard = async () => {
        if (!walletClient) return;
        const amountShardToConvert = ethers.parseUnits(String(shardAmount), 18);
        console.log("shard to convert: " + amountShardToConvert);
        await writeLimitedTokenAsync({
            abi: abi,
            address: contractAddress,
            functionName: 'claimLimitedToken',
            args: [amountShardToConvert]
        });
        updateShard(0);
        console.log("convert success");
    };

    const convertCoin = async () => {
        if (!walletClient) return;
        const amountCoinToConvert = ethers.parseUnits(String(coinAmount), 18);
        console.log("coin to convert: " + amountCoinToConvert);
        await writeUnlimitedTokenAsync({
            abi: abi,
            address: contractAddress,
            functionName: 'claimUnlimitedToken',
            args: [amountCoinToConvert]
        });
        updateCoin(0);
        console.log("convert success");
    };

    const updateShard = async (valueToUpdate: number) => {
        try {
            if (currentFirebaseUser?.displayName !== null && currentFirebaseUser?.displayName !== undefined) {
                const docRef = doc(db, "Players", currentFirebaseUser.displayName);
                console.log("valueToUpdate:", valueToUpdate);
                await updateDoc(docRef, {
                    "shard": valueToUpdate
                });
                setShardAmount(valueToUpdate);
                console.log("success");
            }
        }
        catch (err) {
            console.error(err);
        }
    };

    const updateCoin = async (valueToUpdate: number) => {
        try {
            if (currentFirebaseUser?.displayName !== null && currentFirebaseUser?.displayName !== undefined) {
                const docRef = doc(db, "Players", currentFirebaseUser.displayName);
                console.log("valueToUpdate:", valueToUpdate);
                await updateDoc(docRef, {
                    "coin": valueToUpdate
                });
                setCoinAmount(valueToUpdate);
                console.log("success");
            }
        }
        catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <NativeBalance chain={chain} address={address} needToRefreshBalance={isNeedToRefresh} setNeedToRefresh={setIsNeedToRefresh} />
            <Box
                display="flex"
                flexDirection="column"
                gap="8"
            >
                <Box display="inline-flex" flexDirection="row" gap="4" marginBottom="4">
                    <Box display="flex" flexDirection="column" gap="4">
                        <label>
                            Generate Shard:  <input
                                value={inputShard}
                                onChange={onChangeShardAmount}
                                type="number"
                            />
                        </label>
                        <Text>Shard: {shardAmount}</Text>
                    </Box>
                    <button onClick={addShard}>
                        Add Shard
                    </button>
                    <Box display="flex" flexDirection="column" gap="4" marginBottom="8">
                        <CardButton
                            title="Convert Shard"
                            description="Convert Shard to Real Token 1"
                            isPending={isPendingTx1}
                            onClick={convertShard}
                        />
                        {isConfirmingTx1 && <Text>Confirming transaction...</Text>}
                        {isConfirmedTx1 && <Text>Transaction Confirmed</Text>}
                    </Box>
                </Box>
                <Box display="inline-flex" flexDirection="row" gap="4" marginBottom="4">
                    <Box display="flex" flexDirection="column" gap="4">
                        <label>
                            Generate Coin:  <input
                                value={inputCoin}
                                onChange={onChangeCoinAmount}
                                type="number"
                            />
                        </label>
                        <Text>Coin: {coinAmount}</Text>
                    </Box>
                    <button onClick={addCoin}>
                        Add Coin
                    </button>
                    <Box display="flex" flexDirection="column" gap="4" marginBottom="8">
                        <CardButton
                            title="Convert Coin"
                            description="Convert Coin to Real Token 2"
                            isPending={isPendingTx2}
                            onClick={convertCoin}
                        />
                        {isConfirmingTx2 && <Text>Confirming transaction...</Text>}
                        {isConfirmedTx2 && <Text>Transaction Confirmed</Text>}
                    </Box>
                </Box>
            </Box>
            {lastTransaction1 && (
                <Box display="flex" flexDirection="column" gap="4">
                    <Text>Last convert shard hash: {lastTransaction1}</Text>
                    <button>
                        <a
                            target="_blank"
                            href={`${chain.blockExplorers?.default?.url}/tx/${lastTransaction1}`}
                            rel="noreferrer"
                        >
                            Click to view on {chain.name}
                        </a>
                    </button>
                </Box>
            )}
            {error1 && (
                <ErrorToast message={error1.message} onClose={reset1} duration={7000} />
            )}
            {lastTransaction2 && (
                <Box display="flex" flexDirection="column" gap="4">
                    <Text>Last convert coin hash: {lastTransaction2}</Text>
                    <button>
                        <a
                            target="_blank"
                            href={`${chain?.blockExplorers?.default?.url}/tx/${lastTransaction2}`}
                            rel="noreferrer"
                        >
                            Click to view on {chain?.name}
                        </a>
                    </button>
                </Box>
            )}
            {error2 && (
                <ErrorToast message={error2.message} onClose={reset2} duration={7000} />
            )}
        </>
    );
};

export default TestConvertToken;