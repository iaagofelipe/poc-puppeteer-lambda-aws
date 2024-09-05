const awsLambdaFastify = require("@fastify/aws-lambda");
const fastify = require("fastify")({ logger: true });
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const path = require('path');


fastify.get("/generate-pdf", async (request, reply) => {
  let browser = null;
  try {

    browser = await puppeteer.launch({
      ignoreDefaultArgs: ["--disable-extensions"],
      args: [...chromium.args, '--no--sandbox'],
      defaultViewport: chromium.defaultViewport,
      executablePath: chromium.executablePath,
      headless: false,
      ignoreHTTPSErrors: true,
      userDataDir: path.join("/tmp", "user_data_dir"),
    });

    const page = await browser.newPage();
    await page.setContent("<h1>Hello World</h1>");
    const pdfBuffer = await page.pdf({ format: "A4" });

    reply
      .header("Content-Type", "application/pdf")
      .header("Content-Disposition", "attachment; filename=hello-world.pdf")
      .send(pdfBuffer);
  } catch (error) {
    console.error("Error during PDF generation:", error);
    reply.code(500).send("Error generating PDF: " + error.message);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
});

exports.handler = awsLambdaFastify(fastify);
