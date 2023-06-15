import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router";
import Modal from "react-modal";

import fetchUser from "../utils/fetchUser";
import EditUserDetails from "./EditUserDetails";

import "../stylesheets/SettingsProfile.css";

const SettingsProfile = () => {
  const navigate = useNavigate;
  const userFetcher = fetchUser();
  const userData = userFetcher();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const formattedPhone = (userData) => {
    if (!userData || !userData.phone) {
      return null;
    }

    const number = userData.phone;
    const formattedNumber =
      number.length === 11
        ? `+${number[0]} (${number.substring(1, 4)}) ${number.substring(
            4,
            7
          )}-${number.substring(7)}`
        : `(${number.substring(0, 3)}) ${number.substring(
            3,
            6
          )}-${number.substring(6)}`;

    return formattedNumber;
  };
  const handleEditUser = () => {
    setModalIsOpen(true);
    setModalContent(userData);
  };

  const isMediumSmallScreen = useMediaQuery({ maxWidth: 1017 });

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  useEffect(() => {
    userFetcher(navigate);
  }, [navigate, userFetcher]);

  return (
    <div className="profile-container">
      <div className="profile-title-container">
        <h2 className="profile-title">Account Profile</h2>
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
                <p>{formattedPhone(userData)}</p>
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
              <p>{formattedPhone(userData)}</p>
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
          <button
            type="button"
            className="edit-profile"
            onClick={handleEditUser}
          >
            <AiFillEdit className="edit-profile-icon" />
            Edit Profile
          </button>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Edit User Details"
          className="edit-user-modal"
          overlayClassName="overlay"
        >
          <EditUserDetails
            modalIsOpen={modalIsOpen}
            setModalIsOpen={setModalIsOpen}
            modalContent={modalContent}
          />
        </Modal>
      </div>
    </div>
  );
};

export default SettingsProfile;
