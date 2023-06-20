const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const schemas = require("../schemas/schemas");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");

const upload = multer({ dest: "uploads/" }); // specify the path where uploaded files should be stored

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetNameList = workbook.SheetNames;
    const jsonData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetNameList[0]]
    );

    res
      .status(200)
      .json({ message: "File processed successfully", data: jsonData });
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("There was an error deleting the file", err);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error processing file" });
  }
});

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
router.route("/users/exists").post(async (req, res) => {
  try {
    const user = await schemas.Users.findOne({ email: req.body.email });
    if (user) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
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
    const sortBy = req.query.sortBy || "name";
    const order = req.query.order || "asc";
    const search = req.query.search || "";
    const searchPattern = new RegExp("^" + search, "i");

    schemas.Products.find({ name: searchPattern })
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
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
    const resetToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // set the token to be expired in 1 hour
    );

    // Save the token into the database (you might need to adjust this depending on your schema)
    user.resetToken = resetToken;
    await user.save();

    // Send email
    const mailOptions = {
      from: "pricebook-no-reply@outlook.com", // sender address
      to: email, // list of receivers
      subject: "Password Reset", // Subject line
      html:
        `Dear ${user.name},<br/><br/>` +
        `We are writing to inform you that a request to reset your account password was received.<br/><br/>` +
        `This could be from you, or potentially another individual.<br/><br/>` +
        `Should you wish to proceed with this password reset, please follow the link provided below:<br/><br/>` +
        `<a href="http://localhost:3000/forgot-password/${resetToken}" target="_blank">Reset Password</a><br/><br/>` +
        `If you prefer, you may also copy and paste the following URL into your internet browser:<br/><br/>` +
        `http://localhost:3000/forgot-password/${resetToken}<br/><br/>` +
        `Please note, for your security, this password reset link will only remain active for one hour following receipt of this email.<br/><br/>` +
        `If you did not initiate this password reset request, please disregard this email.<br/>` +
        `Rest assured, your account password will remain unchanged unless the link above is activated.<br/><br/>` +
        `Best Regards,<br/>` +
        `Price Book Customer Support Team`,
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

router.route("/users/reset-password").put(async (req, res) => {
  const { resetToken, password } = req.body;
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    const user = await schemas.Users.findOne({ _id: decoded._id, resetToken });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = undefined; // Clear the resetToken after use

    user
      .save()
      .then(() => res.json({ message: "Password updated successfully" }))
      .catch((err) => res.status(500).json(err));
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.route("/users/update-profile").put(async (req, res) => {
  const { userId, name, email, phone, company, role } = req.body;
  try {
    const user = await schemas.Users.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.email = email;
    user.phone = phone;
    user.company = company;
    user.role = role;

    user
      .save()
      .then((updatedUser) =>
        res.json({
          message: "User profile updated successfully",
          userData: updatedUser,
        })
      )
      .catch((err) => res.status(500).json(err));
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
