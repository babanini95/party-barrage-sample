import { createConfig } from "@0xsequence/kit";

// Get your own keys on sequence.build
const projectAccessKey = import.meta.env.VITE_PROJECT_ACCESS_KEY;
const waasConfigKey = import.meta.env.VITE_WAAS_CONFIG_KEY;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const config: any = createConfig("waas", {
  projectAccessKey,
  position: "center",
  defaultTheme: "dark",
  signIn: {
    projectName: "Party Barrage",
  },
  defaultChainId: 11155111,
  chainIds: [11155111],
  appName: "Party Barrage",
  waasConfigKey,
  google: false,
  apple: false,
  walletConnect: false,
  coinbase: false,
  wagmiConfig: {
    multiInjectedProviderDiscovery: false,
  },
  isDev: false,
  enableConfirmationModal: true
});
