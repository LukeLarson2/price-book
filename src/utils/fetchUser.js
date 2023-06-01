// export const fetchUser = async () => {
//   try {
//     const response = await fetch("http://localhost:4000/users");
//     if (response.ok) {
//       const userData = await response.json();
//       return userData;
//     } else {
//       throw new Error(response.statusText); // Throw an error for non-ok responses
//     }
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return null;
//   }
// };

export const fetchUser = () => {
  const userInfo =
    localStorage.getItem("userData") !== "undefined"
      ? JSON.parse(localStorage.getItem("userData"))
      : localStorage.clear();

  return userInfo;
};
