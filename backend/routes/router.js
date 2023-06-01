const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

router
  .route("/users")
  .post((req, res) => {
    const userData = req.body;
    const updatedUserData = { ...userData, key: uuidv4() };

    // Store the updated data in the server or a database
    // Example: Save the updatedUserData in a database or a file
    res.send(updatedUserData);
  })
  .get((req, res) => {
    const userData = [
      {
        _id: {
          $oid: "64779e61db541890fcb824be",
        },
        name: "Lucas",
        email: "lucas.m.larson2@gmail.com",
        password: "123456",
        accountType: "Personal",
        products: [
          {
            key: uuidv4(),
            name: "Headphones",
            state: "WA",
            zip: "98513",
            productPrice: 10,
            salesTax: 0.065,
            date: "",
          },
          {
            key: uuidv4(),
            name: "Speaker",
            state: "WA",
            zip: "98513",
            productPrice: 30,
            salesTax: 0.065,
            date: "",
          },
        ],
      },
      {
        _id: {
          $oid: "64779e61db541890fcb824bf",
        },
        name: "Bob",
        email: "email@email.com",
        password: "123456",
        accountType: "Personal",
        products: [
          {
            key: uuidv4(),
            name: "Games",
            state: "WA",
            zip: "98513",
            productPrice: 10,
            salesTax: 0.065,
            date: "",
          },
          {
            key: uuidv4(),
            name: "Keyboard",
            state: "WA",
            zip: "98513",
            productPrice: 30,
            salesTax: 0.065,
            date: "",
          },
        ],
      },
    ];

    res.json({ userData });
  });

module.exports = router;
