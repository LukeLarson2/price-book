const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
const router = express.Router();
const bcrypt = require("bcrypt");
const schemas = require("../schemas/schemas");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");

const upload = multer({ dest: "uploads/" }); // specify the path where uploaded files should be stored

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    console.log("something");
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        const customerEmail = paymentIntentSucceeded.customer_details.email;
        const accountType =
          paymentIntentSucceeded.object.amount_subtotal <= 599
            ? "Individual Plan"
            : "Commercial Plan"; // Individual Plan or Commercial Plan
        console.log(paymentIntentSucceeded);

        schemas.Users.findOneAndUpdate(
          { email: customerEmail },
          { accountType },
          { new: true }
        )
          .then(() => {
            response.json({ received: true });
          })
          .catch((err) => {
            console.error(err);
            response
              .status(500)
              .json({ error: "An error occurred while updating the user" });
          });
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

router.post("/create-checkout-session-commercial", async (req, res) => {
  const YOUR_DOMAIN = "http://localhost:3000"; // Replace with your domain

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.PRICE_ID_2,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}/settings`,
    });

    res.redirect(303, session.url);
  } catch (err) {
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

router.post("/create-checkout-session-individual", async (req, res) => {
  const YOUR_DOMAIN = "http://localhost:3000"; // Replace with your domain

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.PRICE_ID_1,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${YOUR_DOMAIN}/settings`,
      cancel_url: `${YOUR_DOMAIN}/settings`,
    });

    res.redirect(303, session.url);
  } catch (err) {
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

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

router.route("/users/:id").get(async (req, res) => {
  try {
    const user = await schemas.Users.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "No user found with this ID" });
    }

    res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// API endpoint to handle user icon update
router.route("/users/:id/icon").put(async (req, res) => {
  try {
    const user = await schemas.Users.findByIdAndUpdate(
      req.params.id,
      { profileImage: req.body.profileImage },
      { new: true } // This option is to return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "No user found with this ID" });
    }

    res.json(user);
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

router.route("/users/update-background").put(async (req, res) => {
  const { userId, backgroundImage } = req.body;

  try {
    const user = await schemas.Users.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.backgroundImage = backgroundImage;

    user
      .save()
      .then(() => res.json({ message: "Background image has been changed" }))
      .catch((err) => res.status(500).json(err));
  } catch (err) {
    return res.status(500).json(err);
  }
});

router
  .route("/users/upload-background-image")
  .post(upload.single("backgroundImage"), async (req, res) => {
    const { userId } = req.body;
    const file = req.file;
    try {
      const user = await schemas.Users.findOne({ _id: userId });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the old backgroundImage exists and try to remove it
      if (user.backgroundImage) {
        fs.unlink(user.backgroundImage, (err) => {
          if (err) {
            console.error(`Failed to remove old background image: ${err}`);
          } else {
            console.log("Old background image was removed.");
          }
        });
      }

      // Replace backslashes with forward slashes
      const formattedPath = file.path.replace(/\\/g, "/");
      user.backgroundImage = formattedPath;

      user
        .save()
        .then(() =>
          res.json({
            message: "Uploaded new background image",
            imagePath: formattedPath, // return formatted path
          })
        )
        .catch((err) => res.status(500).json(err));
    } catch (err) {
      return res.status(500).json(err);
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

router.route("/users/avatax-call").post(async (req, res) => {
  const { product } = req.body;
  const { userKey, name, productPrice, state, zip, client } = product;
  const street = req.body.street ? req.body.street : "";
  const city = req.body.city ? req.body.city : "";
  try {
    const user = await schemas.Users.findOne({ _id: userKey });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const currentDate = new Date();

    const getCurrentDate = () => {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based in JS
      const day = String(currentDate.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    const getDateTimeStamp = () => {
      const hours = String(currentDate.getHours()).padStart(2, "0");
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");
      const seconds = String(currentDate.getSeconds()).padStart(2, "0");

      return `${getCurrentDate()}-${hours}${minutes}${seconds}`;
    };

    const taxDocument = {
      type: "SalesOrder",
      companyCode: process.env.COMPANY.CODE,
      date: getCurrentDate(), // dynamic date
      customerCode: userKey, // general string cannot be empty
      purchaseOrderNo: getDateTimeStamp(), // order number based on date-time stamp
      addresses: {
        SingleLocation: {
          line1: street,
          city: city,
          region: state,
          country: "US",
          postalCode: zip, // required at minimum
        },
      },
      lines: [
        {
          number: "1",
          quantity: 1,
          amount: productPrice, // dynamic price input
          taxCode: "P0000000", // generic tax code, fill dynamically with array
          description: name, // product name filled
        },
      ],
      commit: true,
      currencyCode: "USD",
      description: "Yarn", // product name filled
    };

    return client.createTransaction({ model: taxDocument }).then((result) => {
      // response tax document
      console.log(result);
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
