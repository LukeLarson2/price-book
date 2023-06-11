import React from "react";

import "../stylesheets/PlanDetails.css";

const FreeAccountDetails = () => {
  const accountDetails = `Our Free Account is perfect for individuals who are just starting out. Get a taste of what our platform has to offer with no obligations.
    Key Features:
    - Limited access to basic features.
    - Access to community support forums.
    - Ability to interact and network with other users.
    - Weekly newsletters and updates on new features and opportunities.
    - Includes advertisements.
    
    Note: The Free Account is not meant for business use and has limitations compared to our premium offerings.`;
  return <div className="account-details-container">{accountDetails}</div>;
};

export default FreeAccountDetails;
