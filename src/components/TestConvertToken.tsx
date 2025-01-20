import { ChangeEvent, useEffect, useState } from "react";
import { useWalletClient, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Chain } from "viem";
import { Box, Collapsible, Text } from "@0xsequence/design-system";
import { abi } from "../contract-abi";
import { ethers } from "ethers";
import { db } from "../FirebaseConfig";
import { DocumentData, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import ErrorToast from "./ErrorToast";
import chains from "../constants";
import CardButton from "./CardButton";

const TestConvertToken = (props: { chainId: number }) => {
    const { chainId } = props;
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
    const walletDocRef = doc(db, "players/bani/wallet", "wallet");

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
        const unsubscribe = onSnapshot(walletDocRef, (doc) => {
            console.log("Current data: ", doc.data());
            setSnapshot(doc.data());
            const ingameTokenData = snapshot?.virtualToken;
            setIngameToken(ingameTokenData);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        fetchWalletData();
    }, []);

    const onChangeIngameTokenAmount = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.valueAsNumber;
        setInputIngameToken(value);
        if (value < 0) {
            setInputIngameToken(0);
        };
    };

    const addIngameToken = () => {
        const valueToUpdate: number = snapshot?.virtualToken + inputAmount;
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
        updateIngameToken(0);
        console.log("convert success")
    };

    const fetchWalletData = async () => {
        try {
            const docSnap = await getDoc(walletDocRef);

            if (docSnap.exists()) {
                const docData = docSnap.data();
                setIngameToken(docData.virtualToken);
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    const updateIngameToken = async (valueToUpdate: number) => {
        try {
            console.log("valueToUpdate:", valueToUpdate);
            await updateDoc(walletDocRef, {
                virtualToken: valueToUpdate
            });
            setIngameToken(valueToUpdate);
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <Collapsible
                label="Add and Convert Ingame Token"
                display="flex"
                flexDirection="column"
                gap="8"
            >
                <Box display="inline-flex" flexDirection="row" gap="4" marginBottom="8">
                    <label>
                        Ingame Token:  <input
                            value={inputAmount}
                            onChange={onChangeIngameTokenAmount}
                            type="number"
                        />
                    </label>
                    <button onClick={addIngameToken}>
                        Add Ingame Token
                    </button>
                </Box>
                <Box display="flex" flexDirection="column" gap="8" marginBottom="8">
                    <Text color="text100">
                        Ingame Token: {ingameTokenAmount}
                    </Text>
                    <CardButton
                        title="Convert"
                        description="Convert Ingame Token"
                        isPending={isPendingTx}
                        onClick={convertToken}
                    />
                    {isConfirming && <Text>Confirming transaction...</Text>}
                    {isConfirmed && <Text>Transaction Confirmed</Text>}
                </Box>
            </Collapsible>
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
            <div>
                <ul>
                    <li>address: {snapshot?.address}</li>
                    <li>realToken: {snapshot?.realToken}</li>
                    <li>virtualToken: {snapshot?.virtualToken}</li>
                </ul>
            </div>
        </>
    );
};

export default TestConvertToken;