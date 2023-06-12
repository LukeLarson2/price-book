const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const schemas = require("../schemas/schemas");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

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

router.route("/users/validate-password").post(async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await schemas.Users.findOne({
      userKey: userId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({ isValid: result });
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});
router.route("/users/update-password").put(async (req, res) => {
  const { userId, password } = req.body;
  try {
    const user = await schemas.Users.findOne({
      userKey: userId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user
      .save()
      .then(() => res.json({ message: "Password updated successfully" }))
      .catch((err) => res.status(500).json(err));
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Set up transporter
const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "pricebook-no-reply@outlook.com",
    pass: "Caloopy2022!",
  },
});
// Send email
router.route("/users/forgot-password").post(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await schemas.Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Generate your password reset token here
    const resetToken = ""; // Replace with your token generating logic

    // Save the token into the database (you might need to adjust this depending on your schema)
    user.resetToken = resetToken;
    await user.save();

    // Send email
    const mailOptions = {
      from: "pricebook-no-reply@outlook.com", // sender address
      to: email, // list of receivers
      subject: "Password Reset", // Subject line
      html:
        `You are receiving this because you (or someone else) have requested the reset of the password for your account.<br/><br/>` +
        `Please click on the following link:<br/><br/>` +
        `<a href="http://localhost:3000/forgot-password/${resetToken}" target="_blank">Reset Password</a><br/><br/>` +
        `or paste the following link in your browser to complete the process one hour of receiving this email:<br/><br/>` +
        `http://localhost:3000/forgot-password/${resetToken}<br/><br/>` +
        `If you did not request this, please ignore this email and your password will remain unchanged.<br/>`,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      } else {
        console.log(info);
        res.json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

module.exports = router;
