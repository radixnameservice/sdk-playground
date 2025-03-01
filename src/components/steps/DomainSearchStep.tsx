import { useState } from "react";
import { useAccount } from "../../AccountContext";
import { ActionBtn } from "../ActionBtn";
import RnsSDK from "@radixnameservice/rns-sdk";
import Spinner from "../Spinner";

const DomainSearchStep = ({ rns, onRegistration }: { rns: RnsSDK, onRegistration: Function }) => {
  const { selectedAccount } = useAccount();
  const [domain, setDomain] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  async function getDomainAvailability() {
    // Reset previous state
    setStatusMessage("");
    setPrice("");
    setIsAvailable(false);

    // Validate the domain using your existing validation
    const isDomainValid = rns.utils.validateDomain({ domain });
    if (isDomainValid !== true) {
      setStatusMessage(isDomainValid.error);
      return;
    }

    setLoading(true);
    try {
      // Call the RNS SDK to check if the domain is available
      const domainStatus = await rns.getDomainStatus({ domain });

      if (domainStatus && 'errors' in domainStatus) {
        setStatusMessage(domainStatus.errors[0].code);
        setIsAvailable(false);
      } else {
        if (domainStatus?.status === "available") {
          setIsAvailable(true);
          setStatusMessage(domainStatus.verbose);
          setPrice(`Price: ${domainStatus.price?.xrd} XRD ($${domainStatus.price?.usd})`);
        } else {
          setIsAvailable(false);
          setStatusMessage(domainStatus?.verbose || "Domain is not available.");
          setPrice("");
        }
      }
    } catch (error) {
      setStatusMessage("Error checking domain availability. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function registrationSuccess() {
    // Reset fields upon successful registration
    setDomain("");
    setPrice("");
    setIsAvailable(false);
    setStatusMessage("");
    onRegistration();
  }

  async function registerDomain() {
    if (!isAvailable) return;
    try {

      const registrationResult = await rns.registerDomain({
        domain,
        accountAddress: selectedAccount,
        callbacks: { onSuccess: registrationSuccess }
      });

    } catch (err) {
      setStatusMessage("Registration failed. Please try again.");
    }
  }

  return (
    <div className="playground-step-container">
      <div className="playground-step-left-col">
        <h3>Domain Search & Registration</h3>
        <p>Please search for a domain that you'd like to register.</p>
        <input
          type="text"
          placeholder="Enter domain name"
          value={domain}
          onChange={(e) => {
            setDomain(e.target.value);
            setPrice("");
            setStatusMessage("");
            setIsAvailable(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getDomainAvailability();
            }
          }}
        />
        <ActionBtn
          disabled={!domain || loading}
          text="Check Availability"
          onClick={getDomainAvailability}
        />
        {loading && (
          <div className="status-spinner">
            <Spinner />
          </div>
        )}
        {statusMessage && (
          <p className="status-message" style={{ color: isAvailable ? "green" : "red" }}>
            {statusMessage}
          </p>
        )}
        {price && (
          <p className="status-message" style={{ color: "black" }}>
            {price}
          </p>
        )}
        <ActionBtn
          disabled={!isAvailable || loading}
          text="Register Domain"
          onClick={registerDomain}
        />
      </div>
    </div>
  );
};

export default DomainSearchStep;
