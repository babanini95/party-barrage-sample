import { ChangeEvent, useEffect, useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useWalletClient } from "wagmi";
import { Chain } from "viem";
import { Box, Text } from "@0xsequence/design-system";
import { abi } from "../contract-abi";
import { ethers } from "ethers";
import { db } from "../FirebaseConfig";
import { DocumentData, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import ErrorToast from "./ErrorToast";
import chains from "../constants";
import CardButton from "./CardButton";
import { User } from "firebase/auth";

const TestConvertToken = (props: { chainId: number; currentFirebaseUser: User | null }) => {
    const { chainId, currentFirebaseUser } = props;
    const {
        writeContractAsync,
        data: txnData,
        error,
        isPending: isPendingTx,
        reset
    } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash: txnData,
        });
    const { data: walletClient } = useWalletClient();
    const [inputAmount, setInputIngameToken] = useState(0);
    const [ingameTokenAmount, setIngameToken] = useState(0);
    const [lastTransaction, setLastTransaction] = useState<string | null>(null);
    const [network, setNetwork] = useState<Chain | null>(null);
    const [snapshot, setSnapshot] = useState<DocumentData>();

    useEffect(() => {
        if (txnData) {
            setLastTransaction(txnData);
            setIngameToken(0);
        }
        if (error) console.error(error)
    }, [txnData, error]);

    useEffect(() => {
        const chainResult = chains.find((chain) => chain.id === chainId);
        if (chainResult) {
            setNetwork(chainResult);
        }
    }, [chainId]);

    useEffect(() => {
        if (currentFirebaseUser?.displayName !== null && currentFirebaseUser?.displayName !== undefined) {
            const docRef = doc(db, "Players", currentFirebaseUser.displayName);
            const unsubscribe = onSnapshot(docRef, (doc) => {
                console.log("Current data: ", doc.data());
                if (doc.exists()) {
                    setSnapshot(doc.data());
                    const ingameTokenData = doc.data().wallet.virtualTokenBalance;
                    setIngameToken(ingameTokenData);
                    console.log("ingameTokenData", ingameTokenData);
                }
            });
            return () => unsubscribe();
        }
    }, [currentFirebaseUser]);

    useEffect(() => {
        fetchWalletData();
    }, [currentFirebaseUser])

    const onChangeIngameTokenAmount = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.valueAsNumber;
        setInputIngameToken(value);
        if (value < 0) {
            setInputIngameToken(0);
        };
    };

    const addIngameToken = () => {
        const valueToUpdate: number = snapshot?.wallet.virtualTokenBalance + inputAmount;
        updateIngameToken(valueToUpdate).then(() => {
            setInputIngameToken(0);
        });
    };

    const convertToken = async () => {
        if (!walletClient) return;
        const amountTokenConvert = ethers.parseUnits(String(ingameTokenAmount), 18);
        console.log("token convert: " + amountTokenConvert);
        await writeContractAsync({
            abi: abi,
            address: '0x5F5A4a3265b11Ac296Da9B661901D39ACF6217bA',
            functionName: 'claimToken',
            args: [amountTokenConvert]
        });
        updateRealToken(snapshot?.wallet.tokenBalance + ingameTokenAmount);
        updateIngameToken(0);
        console.log("convert success");
    };

    const fetchWalletData = async () => {
        try {
            if (currentFirebaseUser?.displayName !== null && currentFirebaseUser?.displayName !== undefined) {
                const docRef = doc(db, "Players", currentFirebaseUser.displayName);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const docData = docSnap.data();
                    setIngameToken(docData.wallet.virtualTokenBalance);
                    console.log(docData);
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    };

    const updateIngameToken = async (valueToUpdate: number) => {
        try {
            if (currentFirebaseUser?.displayName !== null && currentFirebaseUser?.displayName !== undefined) {
                const docRef = doc(db, "Players", currentFirebaseUser.displayName);
                console.log("valueToUpdate:", valueToUpdate);
                await updateDoc(docRef, {
                    "wallet.virtualTokenBalance": valueToUpdate
                });
                setIngameToken(valueToUpdate);
                console.log("success");
            }
        }
        catch (err) {
            console.error(err);
        }
    };

    const updateRealToken = async (valueToUpdate: number) => {
        try {
            if (currentFirebaseUser?.displayName !== null && currentFirebaseUser?.displayName !== undefined) {
                const docRef = doc(db, "Players", currentFirebaseUser.displayName);
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
        <>
            <Box
                display="flex"
                flexDirection="column"
                gap="8"
            >
                <Box display="inline-flex" flexDirection="row" gap="4" marginBottom="4">
                    <label>
                        Ingame Token:  <input
                            value={inputAmount}
                            onChange={onChangeIngameTokenAmount}
                            type="number"
                        />
                    </label>
                    <button onClick={addIngameToken}>
                        Add Virtual Token
                    </button>
                </Box>
                <Box display="flex" flexDirection="column" gap="4" marginBottom="8">
                    <Text>virtualToken: {snapshot?.wallet.virtualTokenBalance}</Text>
                    <CardButton
                        title="Convert"
                        description="Convert Ingame Token"
                        isPending={isPendingTx}
                        onClick={convertToken}
                    />
                    {isConfirming && <Text>Confirming transaction...</Text>}
                    {isConfirmed && <Text>Transaction Confirmed</Text>}
                </Box>
            </Box>
            {lastTransaction && (
                <Box display="flex" flexDirection="column" gap="4">
                    <Text>Last transaction hash: {lastTransaction}</Text>
                    <button>
                        <a
                            target="_blank"
                            href={`${network?.blockExplorers?.default?.url}/tx/${lastTransaction}`}
                            rel="noreferrer"
                        >
                            Click to view on {network?.name}
                        </a>
                    </button>
                </Box>
            )}
            {error && (
                <ErrorToast message={error.message} onClose={reset} duration={7000} />
            )}
        </>
    );
};

export default TestConvertToken;