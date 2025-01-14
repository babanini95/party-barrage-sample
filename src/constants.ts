import {
  mainnet,
  sepolia,
  polygon,
  Chain,
  polygonAmoy,
  arbitrumSepolia,
  immutableZkEvmTestnet,
} from "wagmi/chains";

const chains = [
  mainnet,
  sepolia,
  polygon,
  polygonAmoy,
  arbitrumSepolia,
  immutableZkEvmTestnet,
] as [Chain, ...Chain[]];

export default chains;
