import { DomainDataI, DomainListResponseT } from "@radixnameservice/rns-sdk";

const DomainList = ({ domains }: { domains: DomainListResponseT | null }) => {
  
  return (
    <>
      <div className="playground-step-container">
        <div className="playground-step-left-col">
          <h3>Manage Domains</h3>
          {(!domains || domains.length < 1) &&
            <p>You currently own no domains.</p>
          }

          {domains && domains.length > 0 && (
            <ul>
              {domains.map((domain: DomainDataI) => (
                <li key={domain.id}>{domain.name}</li>
              ))}
            </ul>
          )}

        </div>
      </div>
    </>
  );
};

export default DomainList;

