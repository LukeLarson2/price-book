const fetchUser = () => {
  const userInfo =
    localStorage.getItem("userData") !== "undefined"
      ? JSON.parse(localStorage.getItem("userData"))
      : localStorage.clear();

  return (navigate) => {
    if (!userInfo && window.location.pathname !== "/user-registration") {
      navigate("/login", { replace: true });
    } else {
      return userInfo;
    }
  };
};

export default fetchUser;
