import RnsSDK, { DomainDataI } from "@radixnameservice/rns-sdk";
import { useAccount } from "./AccountContext";
import { useRdt } from "./hooks/useRdt";

import Navbar from "./components/Navbar";

import ConnectWalletStep from "./components/steps/ConnectWalletStep";
import ChooseAccountStep from "./components/steps/ChooseAccountStep";
import DomainSearchStep from "./components/steps/DomainSearchStep";

import "./App.css";
import { useEffect, useState } from "react";
import DomainList from "./components/DomainList";

function App({ rns }: { rns: RnsSDK }) {

  const { selectedAccount } = useAccount();
  const [domainList, setDomainList] = useState<DomainDataI[] | null>(null);
  const rdt = useRdt();

  useEffect(() => {

    fetchUserDomains();

  }, [selectedAccount]);


  async function fetchUserDomains() {

    if (!selectedAccount) return;

    const domainList = await rns.getAccountDomains({ accountAddress: selectedAccount });

    if (!domainList?.errors) {
      return setDomainList(domainList.data);
    }

  }

  const isWalletConnected = rdt?.walletApi.getWalletData()?.accounts.length ? true : false;

  const showStep = {

    walletConnection: !isWalletConnected,
    accountSelection: isWalletConnected && !selectedAccount,
    domainSearch: isWalletConnected && selectedAccount,

  };

  return (
    <>
      <Navbar />
      <main>
        {showStep.walletConnection && <ConnectWalletStep />}
        {showStep.accountSelection && <ChooseAccountStep />}
        {showStep.domainSearch && <DomainSearchStep rns={rns} onRegistration={fetchUserDomains} />}
        {showStep.domainSearch && <DomainList rns={rns} domains={domainList} onUpdate={fetchUserDomains} />}
      </main>
    </>
  );
}

export default App;
