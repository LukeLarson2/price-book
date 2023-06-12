import React from "react";
import { TailSpin } from "react-loader-spinner";

const EmailSpinner = () => {
  return (
    <div className="loader-spinner-container">
      <TailSpin
        height="80"
        width="80"
        color="#ff6600"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default EmailSpinner;
