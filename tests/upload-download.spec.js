import ExcelJs from 'exceljs'
import { test, expect } from "@playwright/test";



async function writeExcelTest(searchText, replaceText,change, filePath) {
  const workbook = new ExcelJs.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet("Sheet1");
  const output = await readExcel(worksheet, searchText);

  const cell = worksheet.getCell(output.row, output.column + change.colChange);
  cell.value = replaceText;

  await workbook.xlsx.writeFile(filePath);
}

async function readExcel(worksheet, searchText) {
  let output = { row: -1, column: -1 };
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, collNumber) => {
      if (cell.value === searchText) {
        console.log("Row: ", (output.row = rowNumber));
        console.log("Column: ", (output.column = collNumber));
      }
    });
  });
  return output;
}

//update Mango Price to 350
//writeExcelTest("Mango", 350,{rowChange: 0, colChange: 2}, "C:\\Users\\leavi\\Downloads\\exceldownloadTest.xlsx");


test('Upload download excel validation',async ({page}) => {
  const searchText = 'Mango';
  const updatedValue = "350";
  
  await page.goto('https://rahulshettyacademy.com/upload-download-test/index.html')

   const [ download ] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download' }).click()
  ]);


  const savedPath = 'C:\\Users\\leavi\\Downloads\\download.xlsx';
  await download.saveAs(savedPath);

  await writeExcelTest(searchText, updatedValue, { rowChange: 0, colChange: 2 }, savedPath);

  await page.locator('#fileinput').setInputFiles(savedPath);
  
  const textLocator = page.getByText(searchText);
  const desiredRow = page.getByRole('row').filter({has:textLocator})
  await expect(desiredRow.locator('#cell-4-undefined')).toContainText(updatedValue);

})
