import React from "react";

import "../stylesheets/EditUserDetails.css";

const EditUserDetails = ({ modalIsOpen, setModalIsOpen, modalContent }) => {
  const handleCloseModal = () => {
    setModalIsOpen(!modalIsOpen);
  };
  const { name, phone, email, company, role } = modalContent;

  return (
    <div className="edit-user-details-content">
      <h2>Edit User Details</h2>
      <div className="edit-user-details-fields">
        <p>{name}</p>
        <p>{phone}</p>
        <p>{email}</p>
        <p>{company}</p>
        <p>{role}</p>
      </div>
      <div className="edit-user-details-btn-placement">
        <button
          type="submit"
          className="edit-user-details-update-btn"
          onClick={handleCloseModal}
        >
          Update
        </button>
        <button
          type="button"
          className="edit-user-details-cancel-btn"
          onClick={handleCloseModal}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditUserDetails;
