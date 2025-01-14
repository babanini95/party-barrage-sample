import { createConfig } from "@0xsequence/kit";

// Get your own keys on sequence.build
const projectAccessKey = import.meta.env.VITE_PROJECT_ACCESS_KEY;
const waasConfigKey = import.meta.env.VITE_WAAS_CONFIG_KEY;
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const appleClientId = import.meta.env.VITE_APPLE_CLIENT_ID;
const appleRedirectURI = window.location.origin + window.location.pathname;
const walletConnectId = import.meta.env.VITE_WALLET_CONNECT_ID;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const config: any = createConfig("waas", {
  projectAccessKey: projectAccessKey,
  chainIds: [1, 11155111, 421614, 13473],
  defaultChainId: 11155111,
  appName: "Kit Starter",
  waasConfigKey: waasConfigKey,
  googleClientId: googleClientId,
  appleClientId: appleClientId,
  appleRedirectURI: appleRedirectURI,
  walletConnectProjectId: walletConnectId,
});

export const firebaseConfig = {
  apiKey: "AIzaSyBS-pvy22Up-GIiQY8ibQRWBeY_mIRenPM",
  authDomain: "battle-barrage.firebaseapp.com",
  databaseURL: "https://battle-barrage-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "battle-barrage",
  storageBucket: "battle-barrage.appspot.com",
  messagingSenderId: "27586835596",
  appId: "1:27586835596:web:773ee5c26517c11aecb7a9",
  measurementId: "G-F9RGB0GWYW"
};
