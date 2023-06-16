import React from "react";
import { AiOutlinePlus, AiOutlineFileAdd } from "react-icons/ai";
import { TbArrowsDiagonalMinimize, TbArrowsDiagonal } from "react-icons/tb";

import { useMediaQuery } from "react-responsive";

import "../stylesheets/Footer.css";

function Footer({
  handleAddItemClick,
  isDetailsShown,
  setDetailsShown,
  handleAddItemDocumentClick,
}) {
  const isMediumSmallScreen = useMediaQuery({ maxWidth: 1166 });
  const handleCollapseAll = () => {
    // Create a new object where every property is set to false
    const updatedIsDetailsShown = Object.keys(isDetailsShown).reduce(
      (acc, curr) => ({ ...acc, [curr]: false }),
      {}
    );
    setDetailsShown(updatedIsDetailsShown);
  };

  const handleExpandAll = () => {
    // Create a new object where every property is set to true
    const updatedIsDetailsShown = Object.keys(isDetailsShown).reduce(
      (acc, curr) => ({ ...acc, [curr]: true }),
      {}
    );
    setDetailsShown(updatedIsDetailsShown);
  };

  return (
    <div className="footer-placement">
      <button
        type="button"
        className="add-item-btn"
        onClick={handleAddItemClick}
      >
        Add Item <AiOutlinePlus className="add-item-icon" />
      </button>
      <button
        type="button"
        className="add-item-document-btn"
        onClick={handleAddItemDocumentClick}
      >
        Add File <AiOutlineFileAdd className="add-item-icon" />
      </button>
      {isMediumSmallScreen ? (
        <div className="collapse-expand-container">
          <button
            type="button"
            className="collapse-btn"
            onClick={handleCollapseAll}
          >
            <TbArrowsDiagonalMinimize className="col-exp-icons" />
          </button>
          <button
            type="button"
            className="expand-btn"
            onClick={handleExpandAll}
          >
            <TbArrowsDiagonal className="col-exp-icons" />
          </button>
        </div>
      ) : (
        <div className="collapse-expand-container">
          <button
            type="button"
            className="collapse-btn"
            onClick={handleCollapseAll}
          >
            <TbArrowsDiagonalMinimize className="col-exp-icons" />
            Collapse
          </button>
          <button
            type="button"
            className="expand-btn"
            onClick={handleExpandAll}
          >
            <TbArrowsDiagonal className="col-exp-icons" />
            Expand
          </button>
        </div>
      )}
    </div>
  );
}

export default Footer;
