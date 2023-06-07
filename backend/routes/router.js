const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const schemas = require("../schemas/schemas");

router.get("/tax-by-zip", async (req, res) => {
  try {
    const zipCode = req.query.Zip5Lo;
    const taxData = await schemas.Taxes.find({
      $or: [{ Zip5Lo: zipCode }, { Zip5Hi: zipCode }],
    });
    if (!taxData) {
      return false;
    }
    res.json(taxData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.route("/users/login").post(async (req, res) => {
  try {
    const user = await schemas.Users.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) return res.status(500).json(err);
      if (result) {
        res.json(user);
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.route("/users/register").post(async (req, res) => {
  try {
    const user = await schemas.Users.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    new schemas.Users({
      ...req.body,
      password: hashedPassword,
    })
      .save()
      .then(() => res.json({ message: "User registered successfully" }))
      .catch((err) => res.status(500).json(err));
  } catch (err) {
    return res.status(500).json(err);
  }
});

router
  .route("/products")
  .post((req, res) => {
    new schemas.Products({
      ...req.body,
    })
      .save()
      .then(() => res.json({ message: "Product added successfully" }))
      .catch((err) => res.status(500).json(err));
  })
  .get((req, res) => {
    const sortBy = req.query.sortBy || "";
    schemas.Products.find({})
      .sort(sortBy)
      .then((products) => res.json(products))
      .catch((err) => res.status(500).json(err));
  })

  .put((req, res) => {
    const { userId, product } = req.body;

    schemas.Products.findOneAndUpdate(
      { key: product.key, userKey: userId },
      { $set: product },
      { new: true } // This option returns the modified document
    )
      .then((updatedProduct) => res.json(updatedProduct))
      .catch((err) => res.status(500).json(err));
  })

  .delete((req, res) => {
    const { key } = req.body;

    schemas.Products.deleteOne({
      key,
    })
      .then(() => res.json({ message: "Product deleted successfully" }))
      .catch((err) => res.status(500).json(err));
  });

module.exports = router;
