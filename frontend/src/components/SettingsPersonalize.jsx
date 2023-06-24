import React from "react";

const SettingsPersonalize = ({ backgroundImage, setBackgroundImage }) => {
  const defaultImages = {
    woodDesk: "/andrej-lisakov-3A4XZUopCJA-unsplash2.jpg",
    benchAccounting: "/bench-accounting-xxeAftHHq6E-unsplash.jpg",
    photography: "/christopher-gower-vjMgqUkS8q8-unsplash.jpg",
    bronzePen: "/jess-bailey-q10VITrVYUM-unsplash.jpg",
    goldPen: "/leone-venter-VieM9BdZKFo-unsplash.jpg",
  };

  const handleBackgroundChange = (key) => () => {
    setBackgroundImage(defaultImages[key]);
    console.log(`image changed to ${key}`);
  };

  return (
    <div>
      <button type="button" onClick={handleBackgroundChange("woodDesk")}>
        Wood Desk
      </button>
      <button type="button" onClick={handleBackgroundChange("benchAccounting")}>
        Bench Accounting
      </button>
      <button type="button" onClick={handleBackgroundChange("photography")}>
        Photography
      </button>
      <button type="button" onClick={handleBackgroundChange("bronzePen")}>
        Bronze
      </button>
      <button type="button" onClick={handleBackgroundChange("goldPen")}>
        Gold
      </button>
    </div>
  );
};
export default SettingsPersonalize;
