import { useAccount } from "../../AccountContext";
import { ActionBtn } from "../ActionBtn";
import RnsSDK from "@radixnameservice/rns-sdk";

const DomainSearchStep = ({ rns, onRegistration }: { rns: RnsSDK, onRegistration: Function }) => {

  const { selectedAccount } = useAccount();

  return (
    <>
      <div className="playground-step-container">
        <div className="playground-step-left-col">
          <h3>Domain Search & Registration</h3>
          <p>
            Please search for a domain that you'd like to register.
          </p>
          <ActionBtn
            text="Register Domain"
            onClick={() => rns.registerDomain({ callbacks: { onSuccess: onRegistration }), }
          />
        </div>
      </div>
    </>
  );
};

export default DomainSearchStep;