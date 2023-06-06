const XLSX = require("xlsx");
const fs = require("fs");

function excelToJson(filePath) {
  // Read the file
  const workbook = XLSX.readFile(filePath);

  // Convert first worksheet to JSON (assuming first worksheet contains relevant data)
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];

  const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

  // Write JSON data to file
  fs.writeFileSync(
    "C:/Users/luke_/OneDrive/Desktop/zip5/ziptax.json",
    JSON.stringify(jsonData, null, 2),
    "utf8"
  );
}

excelToJson("C:/Users/luke_/OneDrive/Desktop/zip5/zip5_05-15-2023.csv"); // replace 'input.xlsx' with your file path
