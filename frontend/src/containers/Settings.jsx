import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillGearFill } from "react-icons/bs";
import { MdArrowBackIosNew, MdOutlineAccountBalance } from "react-icons/md";
import { AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { HiOutlineDocumentText } from "react-icons/hi";
import { useMediaQuery } from "react-responsive";

import SettingsDisplay from "../components/SettingsDisplay";
import fetchUser from "../utils/fetchUser";

import "../stylesheets/Settings.css";

const Settings = () => {
  const [selectedSetting, setSelectedSetting] = useState("profile");
  const navigate = useNavigate();
  const userFetcher = fetchUser();

  const isMediumSmallScreen = useMediaQuery({ maxWidth: 1017 });

  useEffect(() => {
    userFetcher(navigate);
  }, [navigate, userFetcher]);

  const handleSettingChange = (setting) => {
    setSelectedSetting(setting);
  };

  const handleGoBack = () => {
    navigate("/home", { replace: true });
  };

  return (
    <div className="settings-container">
      <div className="settings-window">
        <div className="settings-sidebar">
          <div className="settings-sidebar-title">
            <BsFillGearFill className="settings-title-icon" />
            {!isMediumSmallScreen && "Settings"}
          </div>
          <div className="settings-sidebar-options">
            <p onClick={() => handleGoBack()} key="goBack">
              <MdArrowBackIosNew className="settings-option-icon" />
              {!isMediumSmallScreen && "Go back"}
            </p>
            <p
              onClick={() => handleSettingChange("profile")}
              className={selectedSetting === "profile" ? "selected" : ""}
              key="profile"
            >
              <AiOutlineUser className="settings-option-icon" />
              {!isMediumSmallScreen && "Profile"}
            </p>
            <p
              onClick={() => handleSettingChange("plans")}
              className={selectedSetting === "plans" ? "selected" : ""}
              key="plans"
            >
              <MdOutlineAccountBalance className="settings-option-icon" />
              {!isMediumSmallScreen && "Explore Plans"}
            </p>
            <p
              onClick={() => handleSettingChange("changePassword")}
              className={selectedSetting === "changePassword" ? "selected" : ""}
              key="changePassword"
            >
              <AiOutlineLock className="settings-option-icon" />
              {!isMediumSmallScreen && "Change Password"}
            </p>
            <p
              onClick={() => handleSettingChange("agreement")}
              className={selectedSetting === "agreement" ? "selected" : ""}
              key="agreement"
            >
              <HiOutlineDocumentText className="settings-option-icon" />
              {!isMediumSmallScreen && "User Agreement"}
            </p>
          </div>
        </div>
        <div className="settings-content">
          <SettingsDisplay control={selectedSetting} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
