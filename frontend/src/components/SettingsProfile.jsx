import React, { useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { useMediaQuery } from "react-responsive";

import fetchUser from "../utils/fetchUser";

import "../stylesheets/SettingsProfile.css";
import { useNavigate } from "react-router";

const SettingsProfile = () => {
  const navigate = useNavigate;
  const userFetcher = fetchUser();
  const userData = userFetcher();

  const isMediumSmallScreen = useMediaQuery({ maxWidth: 1017 });
  useEffect(() => {
    userFetcher(navigate);
  }, [navigate, userFetcher]);
  return (
    <div className="profile-container">
      <div className="profile-title">
        <h2>Account Profile</h2>
        {!isMediumSmallScreen ? (
          <div className="profile-content">
            <div className="profile-column">
              <div className="profile-user-info">
                <h4>Name</h4>
                <p>{userData.name}</p>
              </div>
              <div className="profile-user-info">
                <h4>Email</h4>
                <p>{userData.email}</p>
              </div>
              <div className="profile-user-info">
                <h4>Company</h4>
                <p>{userData.company}</p>
              </div>
            </div>
            <div className="profile-column">
              <div className="profile-user-info">
                <h4>Account Type</h4>
                <p>{userData.accountType}</p>
              </div>
              <div className="profile-user-info">
                <h4>Phone</h4>
                <p>{userData.phone}</p>
              </div>
              <div className="profile-user-info">
                <h4>Role</h4>
                <p>{userData.role}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="profile-content">
            <div className="profile-user-info">
              <h4>Name</h4>
              <p>{userData.name}</p>
            </div>
            <div className="profile-user-info">
              <h4>Email</h4>
              <p>{userData.email}</p>
            </div>
            <div className="profile-user-info">
              <h4>Phone</h4>
              <p>{userData.phone}</p>
            </div>
            <div className="profile-user-info">
              <h4>Account Type</h4>
              <p>{userData.accountType}</p>
            </div>
            <div className="profile-user-info">
              <h4>Company</h4>
              <p>{userData.company}</p>
            </div>
            <div className="profile-user-info">
              <h4>Role</h4>
              <p>{userData.role}</p>
            </div>
          </div>
        )}
        <div className="edit-profile-btn-placement">
          <button type="button" className="edit-profile">
            <AiFillEdit className="edit-profile-icon" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsProfile;
