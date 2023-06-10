import React from "react";
import SettingsChangePassword from "./SettingsChangePassword";
import SettingsPlans from "./SettingsPlans";
import SettingsProfile from "./SettingsProfile";
import SettingsUserAgreement from "./SettingsUserAgreement";

function SettingsDisplay(props) {
  const { control, ...rest } = props;
  switch (control) {
    case "profile":
      return <SettingsProfile {...rest} />;
    case "plans": {
      return <SettingsPlans {...rest} />;
    }
    case "changePassword": {
      return <SettingsChangePassword {...rest} />;
    }
    case "agreement": {
      return <SettingsUserAgreement {...rest} />;
    }
    default:
      return null;
  }
}

export default SettingsDisplay;
