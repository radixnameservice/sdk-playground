import RnsSDK, { ErrorStackResponseI, UserBadgeResponseT } from "@radixnameservice/rns-sdk";
import { useAccount } from "./AccountContext";
import { useRdt } from "./hooks/useRdt";

import Navbar from "./components/Navbar";

import ConnectWalletStep from "./components/steps/ConnectWalletStep";
import ChooseAccountStep from "./components/steps/ChooseAccountStep";
import BadgeCreationStep from "./components/steps/BadgeCreationStep";
import DomainSearchStep from "./components/steps/DomainSearchStep";

import "./App.css";
import { useEffect, useState } from "react";



function App({ rns }: { rns: RnsSDK }) {

  const { selectedAccount, userBadgeId, setUserBadgeId } = useAccount();
  const rdt = useRdt();

  useEffect(() => {

    fetchUserBadge();

  }, [selectedAccount]);

  async function fetchUserBadge() {

    const userBadge = await rns.getUserBadge({ accountAddress: selectedAccount });

    if ('errors' in userBadge) {
      return setUserBadgeId(null);
    }

    setUserBadgeId(userBadge.id);

  }

  const isWalletConnected = rdt?.walletApi.getWalletData()?.accounts.length ? true : false;

  const showStep = {

    walletConnection: !isWalletConnected,
    accountSelection: isWalletConnected && !selectedAccount,
    badgeCreation: isWalletConnected && selectedAccount && !userBadgeId,
    domainSearch: isWalletConnected && selectedAccount && userBadgeId,

  };

  return (
    <>
      <Navbar />
      <main>
        {showStep.walletConnection && <ConnectWalletStep />}
        {showStep.accountSelection && <ChooseAccountStep />}
        {showStep.badgeCreation && <BadgeCreationStep rns={rns} onSuccess={fetchUserBadge} />}
        {showStep.domainSearch && <DomainSearchStep rns={rns} onRegistration={() => null} />}
      </main>
    </>
  );
}

export default App;
