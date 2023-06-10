import React from "react";

import "../stylesheets/Plans.css";

const SettingsPlans = () => {
  const freeAccount = `Our Free Account is perfect for individuals who are just starting out. Get a taste of what our platform has to offer with no obligations.

Key Features:
- Limited access to basic features.
- Access to community support forums.
- Ability to interact and network with other users.
- Weekly newsletters and updates on new features and opportunities.
- Includes advertisements.

Note: The Free Account is not meant for business use and has limitations compared to our premium offerings.`;

  const personalAccount = `The Personal Account is designed for individuals who want full access to our platform's capabilities. For a monthly or annual fee, enjoy enhanced features, perks and support.

Key Features:
- Full access to all basic and advanced features.
- Priority email support for quick problem resolution.
- No advertisements for an uninterrupted experience.
- Personalized suggestions and insights based on your activity.
- Exclusive access to premium resources, webinars and events.
- Advanced privacy and security features.

Upgrade to the Personal Account for a complete and personalized experience!`;
  const companyAccount = `The Company Account is the ideal solution for businesses of all sizes. From startups to enterprises, enhance team collaboration, productivity, and manage all aspects of your business seamlessly.

Key Features:
- Unlimited access to all features, designed to scale with your business.
- Priority 24/7 support including phone, email, and live chat.
- Administrative tools for user management and access controls.
- Advanced analytics and reporting features for data-driven decision making.
- API integrations to connect with other platforms and services your company uses.
- Customizable settings to fit your company's brand and needs.
- Employee training resources and dedicated account manager.
- Enhanced security features including multi-factor authentication, data encryption, and compliance tools.

Choose the Company Account to drive your business forward and maximize your team's potential!`;

  const formattedFreePlan = freeAccount.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));
  const formattedPersonalPlan = personalAccount.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));
  const formattedCompanyPlan = companyAccount.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div>
      <h2>Account Types</h2>
      <div className="account-type-container">
        <div className="free-account-container">
          <h3>Free Account</h3>
          <p>{formattedFreePlan}</p>
        </div>
        <div className="personal-account-container">
          <h3>Personal Account</h3>
          <p>{formattedPersonalPlan}</p>
        </div>
        <div className="company-account-container">
          <h3>Company Account</h3>
          <p>{formattedCompanyPlan}</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPlans;
