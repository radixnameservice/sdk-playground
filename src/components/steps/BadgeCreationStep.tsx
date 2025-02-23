import { useAccount } from "../../AccountContext";
import { ActionBtn } from "../ActionBtn";
import RnsSDK from "@radixnameservice/rns-sdk";

const ChooseAccountStep = ({ rns }: { rns: RnsSDK }) => {

  const { selectedAccount } = useAccount();

  return (
    <>
      <div className="playground-step-container">
        <div className="playground-step-left-col">
          <h3>Badge Creation</h3>
          <p>
            This account does not yet have a Radix Name Service <em>User Badge</em>. Please create a user badge to continue.
          </p>
          <ActionBtn
            text="Create User Badge"
            onClick={() => rns.issueUserBadge({ accountAddress: selectedAccount })}
          />
        </div>
      </div>
    </>
  );
};

export default ChooseAccountStep;