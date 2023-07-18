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
  customerCode: "ABC", // general string cannot be empty
  purchaseOrderNo: getDateTimeStamp(), // order number based on date-time stamp
  addresses: {
    SingleLocation: {
      line1: "123 Main Street",
      city: "Irvine",
      region: "CA",
      country: "US",
      postalCode: "92615", // required at minimum
    },
  },
  lines: [
    {
      number: "1",
      quantity: 1,
      amount: 100, // dynamic price input
      taxCode: "P0000000", // generic tax code, fill dynamically with array
      description: "Yarn", // product name filled
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
