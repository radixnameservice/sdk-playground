import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
import { RadixDappToolkit, RadixNetwork } from "@radixdlt/radix-dapp-toolkit";
import RnsSDK from '@radixnameservice/rns-sdk';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { GatewayApiProvider } from "./context/GatewayApiProvider.js";
import { RdtProvider } from "./context/RdtProvider.js";
import { AccountProvider } from "./AccountContext.js";
import { dAppDefinitionAddress } from "./constants.js";

// Instantiate Radix Dapp Toolkit for connect button and wallet usage.
const rdt = RadixDappToolkit({
  networkId: RadixNetwork.Mainnet,
  applicationVersion: "1.0.0",
  applicationName: "RNS SDK Playground",
  applicationDappDefinitionAddress: "account_rdx12yctqxnlfqjyn68hrtnxjxkqcvs6hcg4sa6fnst9gfkpruzfeanjke",
});

console.log("dApp Toolkit: ", rdt);
// Instantiate Gateway API for network queries
const gateway = GatewayApiClient.initialize(rdt.gatewayApi.clientConfig);
console.log("dApp Toolkit: ", rdt);

const rns = new RnsSDK({ network: 'mainnet', rdt, gateway });

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <RdtProvider value={rdt}>
      <GatewayApiProvider value={gateway}>
        <AccountProvider>
          <App rns={rns} />
        </AccountProvider>
      </GatewayApiProvider>
    </RdtProvider>
  </React.StrictMode>,
);
