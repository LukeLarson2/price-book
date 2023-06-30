const taxDocument = {
  type: "SalesInvoice",
  companyCode: process.env.COMPANY.CODE,
  date: "2017-04-12",
  customerCode: "ABC",
  purchaseOrderNo: "2017-04-12-001",
  addresses: {
    SingleLocation: {
      line1: "123 Main Street",
      city: "Irvine",
      region: "CA",
      country: "US",
      postalCode: "92615",
    },
  },
  lines: [
    {
      number: "1",
      quantity: 1,
      amount: 100,
      taxCode: "PS081282",
      itemCode: "Y0001",
      description: "Yarn",
    },
  ],
  commit: true,
  currencyCode: "USD",
  description: "Yarn",
};

return client.createTransaction({ model: taxDocument }).then((result) => {
  // response tax document
  console.log(result);
});
