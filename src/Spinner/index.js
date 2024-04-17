import React from "react";
import { css } from "@emotion/react";
import ScaleLoader from "react-spinners/ScaleLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Spinner = ({ loading, size = 50, color, className }) => {
  return (
    <ScaleLoader
      className={`inline-block ${className}`}
      color={color || "#333"}
      loading={loading || true}
      css={override}
      size={size || 42}
      height={size}
    />
  );
};

export default Spinner;
