const express = require("express");
const router = express.Router();
const schemas = require("../schemas/schemas");

router.post("/products", async (req, res) => {
  const { name, productPrice, state, salesTax, totalPrice, zip, key } =
    req.body;

  // Get the logged-in user's ID from localStorage
  const userId = req.body._id;

  if (!userId) {
    console.log(req.body);
    return res.status(401).json("Unauthorized"); // Return error if user is not logged in
  }

  try {
    // Find the user by ID
    const user = await schemas.Users.findById(userId);

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Create a new product object
    const newProduct = {
      name,
      productPrice,
      state,
      salesTax,
      totalPrice,
      zip,
      key,
    };

    // Add the new product to the user's products array
    user.products.push(newProduct);

    // Save the updated user object
    await user.save();

    res.status(200).json("Product added successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

router
  .route("/users")
  .post(async (req, res) => {
    const userData = req.body;
    const users = schemas.Users;

    try {
      const matchedUser = await users.findOne({
        email: userData.email,
        password: userData.password,
      });

      if (matchedUser) {
        res.json(matchedUser);
      } else {
        res.status(404).json("Invalid Email or Password");
      }
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json("Server Error");
    }
  })
  .get((req, res) => {
    const users = schemas.Users;

    users
      .find({})
      .then((profiles) => {
        if (profiles.length === 0) {
          res.status(404).json("No Profiles Found");
        } else {
          res.json(profiles);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json("Server Error");
      });
  })
  .delete(async (req, res) => {
    console.log(req.body);
    const userId = req.body.userId;
    const productId = req.body.productId;

    if (!userId || !productId) {
      return res.status(400).json("Invalid request parameters");
    }

    try {
      const user = await schemas.Users.findById(userId);
      console.log(user);
      if (!user) {
        return res.status(404).json("User not found");
      }

      user.products = user.products.filter(
        (product) => product.key !== productId
      );

      console.log("user products", user.products);

      await user.save();

      res.status(200).json("Product deleted successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal Server Error");
    }
  });

module.exports = router;
