const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  accountType: { type: String },
  company: { type: String },
  role: { type: String },
  password: { type: String },
  resetToken: { type: String },
  joinDate: { type: Date, default: Date.now },
});

const addProduct = new Schema({
  userKey: { type: String },
  key: { type: String },
  name: { type: String },
  productPrice: { type: Number },
  cityTax: { type: Number },
  stateTax: { type: Number },
  combinedTax: { type: Number },
  totalTax: { type: Number },
  totalPrice: { type: Number },
  state: { type: String },
  zip: { type: String },
  dateAdded: { type: Date, default: Date.now },
});

const taxInfo = new Schema({
  ZipEffDate: { type: String },
  ZipEndDate: { type: String },
  Zip5Lo: { type: String },
  Zip5Hi: { type: String },
  TaxRegionEffDate: { type: String },
  TaxRegionEndDate: { type: String },
  TaxRegionId: { type: String },
  JurisdictionEffDate: { type: String },
  JurisdictionEndDate: { type: String },
  State: { type: String },
  JurisdictionId: { type: String },
  LongName: { type: String },
  JurisdictionTypeId: { type: String },
  TaxRateEffDate: { type: String },
  TaxRateEndDate: { type: String },
  TaxTypeId: { type: String },
  RateTypeId: { type: String },
  Rate: { type: String },
});

const productUpload = new Schema({
  product: { type: String },
  price: { type: Number },
  state: { type: String },
  zip: { type: String },
});

const Users = mongoose.model("Users", userSchema, "users");
const Product = mongoose.model("Product", addProduct, "products");
const Taxes = mongoose.model("Taxes", taxInfo, "tax-by-zip");
const ProductDoc = mongoose.model("ProductDoc", productUpload, "user-uploads");

const mySchemas = {
  Users: Users,
  Products: Product,
  Taxes: Taxes,
  ProductDoc: ProductDoc,
};

module.exports = mySchemas;
