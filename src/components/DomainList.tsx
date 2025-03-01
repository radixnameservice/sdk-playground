import { useState, useEffect } from "react";
import RnsSDK, { DomainDataI, DomainListResponseT, RecordDocketI, RecordItemI } from "@radixnameservice/rns-sdk";
import { useAccount } from "../AccountContext";

interface DomainListProps {
  domains: DomainListResponseT | null;
  rns: RnsSDK;
  onUpdate: () => void;
}

const DomainList = ({ domains, rns, onUpdate }: DomainListProps) => {
  const { selectedAccount, userBadgeId } = useAccount();

  return (
    <div className="playground-step-container">
      <div className="playground-step-left-col">
        <h3>Manage Domains</h3>
        {(!domains || domains.length < 1) && <p>You currently own no domains.</p>}
        {domains && domains.length > 0 && (
          <ul className="domain-list">
            {domains.map((domain: DomainDataI) => (
              <DomainItem
                key={domain.id}
                domain={domain}
                rns={rns}
                accountAddress={selectedAccount}
                onUpdate={onUpdate}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

interface DomainItemProps {
  domain: DomainDataI;
  rns: RnsSDK;
  accountAddress: string;
  onUpdate: () => void;
}

const DomainItem = ({ domain, rns, accountAddress, onUpdate }: DomainItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const [records, setRecords] = useState<RecordItemI[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  // Subdomain states
  const [showAddSubdomain, setShowAddSubdomain] = useState(false);
  const [newSubdomain, setNewSubdomain] = useState("");
  const [subdomainError, setSubdomainError] = useState("");

  // Record states – using a dropdown for the allowed contexts
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    directive: "",
    context: "",
    platformIdentifier: "RNS Playground",
    value: ""
  });
  const [recordError, setRecordError] = useState("");

  // Fetch records when the domain is expanded.
  useEffect(() => {
    if (expanded) {
      const fetchRecords = async () => {
        setLoadingRecords(true);
        try {
          const fetchedRecords = await rns.getRecords({ domain: domain.name });
          if (!("errors" in fetchedRecords)) {
            setRecords(fetchedRecords);
          } else {
            console.error("Error fetching records", fetchedRecords);
          }
        } catch (error) {
          console.error("Error fetching records:", error);
        } finally {
          setLoadingRecords(false);
        }
      };
      fetchRecords();
    }
  }, [expanded, domain.name, rns]);

  // Subdomain functions
  const handleAddSubdomain = async () => {
    setSubdomainError("");
    if (!newSubdomain) return;
    try {
      await rns.createSubdomain({
        subdomain: `${newSubdomain}.${domain.name}`,
        accountAddress
      });
      onUpdate();
      setNewSubdomain("");
      setShowAddSubdomain(false);
    } catch (error) {
      setSubdomainError("Failed to create subdomain.");
    }
  };

  const handleDeleteSubdomain = async (subdomainName: string) => {
    try {
      await rns.deleteSubdomain({
        subdomain: `${subdomainName}`,
        accountAddress
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to delete subdomain", error);
    }
  };

  // Record functions
  const handleAddRecord = async () => {
    setRecordError("");
    if (!newRecord.directive || !newRecord.context) {
      setRecordError("Please fill required fields.");
      return;
    }
    try {
      const docket: RecordDocketI = {
        context: newRecord.context as "receivers" | "delegation" | "navigation" | "social" | "discovery" | "widgets",
        directive: newRecord.directive,
        platformIdentifier: "RNS Playground",
        value: newRecord.value
      };
      await rns.createRecord({
        domain: domain.name,
        accountAddress,
        docket
      });
      onUpdate();
      // Refresh records list after adding
      const updatedRecords = await rns.getRecords({ domain: domain.name });
      if (!("errors" in updatedRecords)) {
        setRecords(updatedRecords);
      }
      setNewRecord({ directive: "", context: "", platformIdentifier: "RNS Playground", value: "" });
      setShowAddRecord(false);
    } catch (error) {
      setRecordError("Failed to add record.");
    }
  };

  // Updated delete record function – we now pass a docket with a directive (record id)
  const handleDeleteRecord = async (record: RecordItemI) => {
    try {
      const docket = { context: record.context, directive: record.directive, value: record.value };
      await rns.deleteRecord({
        domain: domain.name,
        accountAddress,
        docket
      });
      onUpdate();
      const updatedRecords = await rns.getRecords({ domain: domain.name });
      if (!("errors" in updatedRecords)) {
        setRecords(updatedRecords);
      }
    } catch (error) {
      console.error("Failed to delete record", error);
    }
  };

  const handleAmendRecord = async (record: RecordItemI) => {
    const amendedValue = prompt("Enter new value:", record.value || "");
    if (amendedValue === null) return;
    try {
      const docket = {
        context: record.context,
        directive: record.directive,
        platformIdentifier: "RNS Playground",
        value: amendedValue
      };
      await rns.amendRecord({
        domain: domain.name,
        accountAddress,
        docket
      });
      onUpdate();
      const updatedRecords = await rns.getRecords({ domain: domain.name });
      if (!("errors" in updatedRecords)) {
        setRecords(updatedRecords);
      }
    } catch (error) {
      console.error("Failed to amend record", error);
    }
  };

  return (
    <li className="domain-item">
      <div className="domain-header" onClick={() => setExpanded(!expanded)}>
        <svg
          className={`arrow-icon ${expanded ? "rotated" : ""}`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="domain-name">{domain.name}</span>
      </div>
      {expanded && (
        <div className="domain-details">
          {/* Subdomains Section */}
          <div className="subdomains-section">
            <h4>Subdomains</h4>
            {domain.subdomains && domain.subdomains.length > 0 ? (
              <ul className="subdomain-list">
                {domain.subdomains.map((sub) => (
                  <li key={sub.id} className="subdomain-item">
                    <span>{sub.name}</span>
                    <button onClick={() => handleDeleteSubdomain(sub.name)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No subdomains available.</p>
            )}
            {showAddSubdomain ? (
              <div className="add-subdomain-form">
                <input
                  type="text"
                  placeholder="Enter subdomain name"
                  value={newSubdomain}
                  onChange={(e) => setNewSubdomain(e.target.value)}
                />
                <button onClick={handleAddSubdomain}>Create Subdomain</button>
                <button onClick={() => setShowAddSubdomain(false)}>Cancel</button>
                {subdomainError && <p className="error">{subdomainError}</p>}
              </div>
            ) : (
              <button onClick={() => setShowAddSubdomain(true)}>Add Subdomain</button>
            )}
          </div>

          {/* Records Section */}
          <div className="records-section">
            <h4>Records</h4>
            {loadingRecords ? (
              <p>Loading records...</p>
            ) : records && records.length > 0 ? (
              <ul className="record-list">
                {records.map((record) => (
                  <li key={record.record_id} className="record-item">
                    <span>
                      {record.context} - {record.directive} : {record.value}
                    </span>
                    <button onClick={() => handleAmendRecord(record)}>Edit</button>
                    <button onClick={() => handleDeleteRecord(record)}>Delete</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No records available.</p>
            )}
            {showAddRecord ? (
              <div className="add-record-form">
                <select
                  value={newRecord.context}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, context: e.target.value })
                  }
                >
                  <option value="">Select context</option>
                  <option value="receivers">receivers</option>
                  <option value="delegation">delegation</option>
                  <option value="navigation">navigation</option>
                  <option value="social">social</option>
                  <option value="discovery">discovery</option>
                  <option value="widgets">widgets</option>
                </select>
                <input
                  type="text"
                  placeholder="Directive"
                  value={newRecord.directive}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, directive: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Value (optional)"
                  value={newRecord.value}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, value: e.target.value })
                  }
                />
                <button onClick={handleAddRecord}>Create Record</button>
                <button onClick={() => setShowAddRecord(false)}>Cancel</button>
                {recordError && <p className="error">{recordError}</p>}
              </div>
            ) : (
              <button onClick={() => setShowAddRecord(true)}>Add Record</button>
            )}
          </div>
        </div>
      )}
    </li>
  );
};

export default DomainList;
