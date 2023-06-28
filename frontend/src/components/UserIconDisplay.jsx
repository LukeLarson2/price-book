import React from "react";
import {
  FaUserAlt,
  FaUserAstronaut,
  FaUserGraduate,
  FaUserMd,
  FaUserNinja,
  FaUserNurse,
  FaUserSecret,
  FaUserTie,
} from "react-icons/fa";

function UserIconDisplay(props) {
  const { control, onClick, ...rest } = props;

  const handleClick = () => {
    if (onClick) {
      onClick(control);
    }
  };

  switch (control) {
    case "basic":
      return <FaUserAlt {...rest} onClick={handleClick} />;
    case "astro":
      return <FaUserAstronaut {...rest} onClick={handleClick} />;
    case "grad":
      return <FaUserGraduate {...rest} onClick={handleClick} />;
    case "doctor":
      return <FaUserMd {...rest} onClick={handleClick} />;
    case "ninja":
      return <FaUserNinja {...rest} onClick={handleClick} />;
    case "nurse":
      return <FaUserNurse {...rest} onClick={handleClick} />;
    case "agent":
      return <FaUserSecret {...rest} onClick={handleClick} />;
    case "tie":
      return <FaUserTie {...rest} onClick={handleClick} />;
    default:
      return null;
  }
}

export default UserIconDisplay;
