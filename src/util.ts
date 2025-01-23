import { mainnet, sepolia } from "viem/chains";

const chains = { mainnet, sepolia }

/**
 * Gets the chain object for the given chain id.
 * @param chainId - Chain id of the target EVM chain.
 * @returns Viem's chain object.
 */
export const getChain = (chainId: number) => {
    for (const chain of Object.values(chains)) {
        if (chain.id === chainId) {
            return chain;
        }
    }

    throw new Error(`Chain with id ${chainId} not found`);
}