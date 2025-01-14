import { ChangeEvent, useEffect, useState } from "react";
import { useWalletClient, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Chain } from "viem";
import { Box, Collapsible, Text } from "@0xsequence/design-system";
import { abi } from "../contract-abi";
import { ethers } from "ethers";
import ErrorToast from "./ErrorToast";
import chains from "../constants";
import CardButton from "./CardButton";

const TestConvertToken = (props: { chainId: number }) => {
    const { chainId } = props;
    const {
        writeContract,
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

    const onChangeIngameTokenAmount = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.valueAsNumber;
        setInputIngameToken(value);
        if (value < 0) {
            setIngameToken(0);
        };
    };

    const addIngameToken = () => {
        setIngameToken(ingameTokenAmount + inputAmount);
        setInputIngameToken(0);
    };

    const convertToken = async () => {
        if (!walletClient) return;
        const amountTokenConvert = ethers.parseUnits(String(ingameTokenAmount), 18);
        console.log("token convert: " + amountTokenConvert);
        writeContract({
            abi: abi,
            address: '0x5F5A4a3265b11Ac296Da9B661901D39ACF6217bA',
            functionName: 'claimToken',
            args: [amountTokenConvert]
        });
    };

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
                        isPending = {isPendingTx}
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
                <ErrorToast message={error?.message} onClose={reset} duration={7000} />
            )}
        </>
    );
};

export default TestConvertToken;