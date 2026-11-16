// HTML check: html-validate must report zero errors on the page.
// Usage: node check/html.ts [file]   (default: index.html)
import { HtmlValidate, formatterFactory } from "html-validate/node";

const file = process.argv[2] ?? "index.html";
const validator = new HtmlValidate({ extends: ["html-validate:recommended"] });
const report = await validator.validateFile(file);

if (!report.valid) {
  console.log(formatterFactory("stylish")(report.results));
  process.exit(1);
}
console.log(`${file}: no HTML errors`);
