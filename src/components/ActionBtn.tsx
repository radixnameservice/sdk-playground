import { useState } from "react";

export const ActionBtn = ({
  text,
  onClick,
}: {
  text: string;
  onClick: Function;
}) => {

  const [loading, setLoading] = useState(false);

  return (
    <button id="action-button" onClick={() => onClick()} className={loading ? "loading" : ""}>
      {text}
    </button>
  );

};
