import React from "react";
import { v4 as uuidv4 } from "uuid";

const userData = [
  { name: "Caitlyn", email: "caitlyn@email.com", key: uuidv4() },
  { name: "Cooper", email: "Cooper@email.com", key: uuidv4() },
  { name: "Remy", email: "Remy@email.com", key: uuidv4() },
];
export const TempDB = (props) => {
  userData.push(props);
  console.log(userData);
  return (
    <div>
      {userData.map((user) => {
        return <div key={user.key}>{user.name}</div>;
      })}
    </div>
  );
};
