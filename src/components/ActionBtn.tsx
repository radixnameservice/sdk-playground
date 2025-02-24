import { useState } from "react";

export const ActionBtn = ({
  text,
  onClick,
  disabled = false,
}: {
  text: string;
  onClick: Function;
  disabled?: boolean;
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <button
      id="action-button"
      onClick={() => onClick()}
      className={loading ? "loading" : ""}
      disabled={disabled}
    >
      {text}
    </button>
  );
};