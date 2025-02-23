import { useState, useEffect } from "react";
import { useAccount } from "../../AccountContext";
import { CustomSelect } from "../CustomSelect";

const ChooseAccountStep = () => {

  const { accounts } = useAccount();
  const [enableButtons, setEnableButtons] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (accounts.length > 0) {
      setEnableButtons(true);
    } else {
      setEnableButtons(false);
    }
  }, [accounts]);

  return (
    <>
      <div className="playground-step-container">
        <div className="playground-step-left-col">
          <h3>Account Selection</h3>
          <p>
            Please select an account from the list below:
          </p>
          <CustomSelect
            active={active}
            setActive={setActive}
            enableButtons={enableButtons}
          />
        </div>
      </div>
    </>
  );
};

export default ChooseAccountStep;