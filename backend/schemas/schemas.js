const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  accountType: { type: String },
  joinDate: { type: Date, default: Date.now },
});

const addProduct = new Schema({
  userKey: { type: String },
  key: { type: String },
  name: { type: String },
  productPrice: { type: Number },
  salesTax: { type: Number },
  totalPrice: { type: Number },
  state: { type: String },
  zip: { type: String },
  dateAdded: { type: Date, default: Date.now },
});

const Users = mongoose.model("Users", userSchema, "users");
const Product = mongoose.model("Product", addProduct, "products");

const mySchemas = { Users: Users, Products: Product };

module.exports = mySchemas;
