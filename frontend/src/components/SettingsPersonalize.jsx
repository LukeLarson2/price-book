import React, { useState, useRef } from "react";
import {
  AiOutlineCloudUpload,
  AiOutlineSave,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import Modal from "react-modal";
import axios from "axios";

import fetchUser from "../utils/fetchUser";
import "../stylesheets/SettingsPersonalize.css";

Modal.setAppElement("#root");

const SettingsPersonalize = ({ defaultImages }) => {
  const userFetcher = fetchUser();
  const [backgroundImage, setBackgroundImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(backgroundImage);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userData, setUserData] = useState(userFetcher());
  const fileInput = useRef(null);

  const handleBackgroundChange = (src) => {
    setSelectedImage(src);
  };

  const handleSaveChanges = () => {
    setBackgroundImage(selectedImage);
    axios
      .put("/users/update-background", {
        userId: userData._id,
        backgroundImage: selectedImage,
      })
      .then((response) => {
        setModalMessage(response.data.message);
        setModalIsOpen(true);
      })
      .catch((error) => console.error(error));
  };

  const handleUploadClick = () => {
    fileInput.current.click(); // triggers click event on file input
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("userId", userData._id);
    formData.append("backgroundImage", file);

    axios
      .post("/users/upload-background-image", formData)
      .then((response) => {
        setModalMessage(response.data.message);
        setModalIsOpen(true);

        // If server responds with the new image path, update it locally.
        if (response.data.imagePath) {
          handleBackgroundChange(response.data.imagePath);
          setBackgroundImage(response.data.imagePath);

          // update the userData
          setUserData({
            ...userData,
            backgroundImage: response.data.imagePath,
          });
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="personalize-main-container">
      <h2 className="personalize-title">Personalization</h2>
      <div className="personalize-content">
        <div className="personalize-thumbnails">
          {defaultImages.map(({ name, src }) => (
            <div
              key={name}
              className={`personalize-thumbnail-image-container ${
                selectedImage === src ? "thumbnail-selected" : ""
              }`}
              onClick={() => handleBackgroundChange(src)}
            >
              <div
                className="personalize-thumbnail-image"
                style={{ backgroundImage: `url(${src})` }}
              />
            </div>
          ))}
          <div>
            <div
              className={`personalize-thumbnail-image-upload-container`}
              onClick={handleUploadClick}
            >
              <AiOutlineCloudUpload className="upload-background-image" />
              <h5 className="personalize-upload-image-text">Upload Image</h5>
            </div>
            <input
              ref={fileInput}
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="personalize-btn-placement">
          <button
            className="perzonalize-save-changes-btn"
            onClick={handleSaveChanges}
          >
            <div className="personalize-save-btn-content">
              <AiOutlineSave className="personalize-save-btn-icon" />
              Save Changes
            </div>
          </button>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Update Message"
        className={"personalize-modal-container"}
        overlayClassName={"personalize-modal-overlay"}
      >
        <h2 className="personalize-modal-title">Update Message</h2>
        <p className="personalize-modal-message">{modalMessage}</p>
        <button
          type="button"
          className="personalize-modal-btn"
          onClick={() => setModalIsOpen(false)}
        >
          <div className="personalize-close-btn-content">
            <AiOutlineCloseCircle className="personalize-close-icon" />
            Close
          </div>
        </button>
      </Modal>
    </div>
  );
};

export default SettingsPersonalize;
