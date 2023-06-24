import React from "react";

const SettingsPersonalize = ({ backgroundImage, setBackgroundImage }) => {
  const defaultImages = {
    ["Wood Desk"]: "/andrej-lisakov-3A4XZUopCJA-unsplash2.jpg",
    ["Bench Accounting"]: "/bench-accounting-xxeAftHHq6E-unsplash.jpg",
    ["Photography"]: "/christopher-gower-vjMgqUkS8q8-unsplash.jpg",
    ["Bronze"]: "/jess-bailey-q10VITrVYUM-unsplash.jpg",
    ["Gold"]: "/leone-venter-VieM9BdZKFo-unsplash.jpg",
  };

  const handleBackgroundChange = (key) => () => {
    setBackgroundImage(defaultImages[key]);
    console.log(`image changed to ${key}`);
  };

  return (
    <div>
      <button type="button" onClick={handleBackgroundChange("Wood Desk")}>
        Wood Desk
      </button>
      <button
        type="button"
        onClick={handleBackgroundChange("Bench Accounting")}
      >
        Bench Accounting
      </button>
      <button type="button" onClick={handleBackgroundChange("Photography")}>
        Photography
      </button>
      <button type="button" onClick={handleBackgroundChange("Bronze")}>
        Bronze
      </button>
      <button type="button" onClick={handleBackgroundChange("Gold")}>
        Gold
      </button>
    </div>
  );
};
export default SettingsPersonalize;
