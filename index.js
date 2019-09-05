const puppeteer = require("puppeteer");
const fs = require("fs");

async function run() {
  const dt = new Date();
  const ano = dt.getUTCFullYear();
  const mes =
    dt.getUTCMonth() > 8
      ? dt.getUTCMonth() + 1
      : "0" + (dt.getUTCMonth() + 1).toString();
  const folder = "capturas/ppagamento/" + dt.toISOString().split("T")[0];
  const basePath =
    "http://www.transparenciafiscal.am.gov.br/transpprd/mnt/info/";

  if (!fs.existsSync("capturas")) {
    fs.mkdirSync("capturas");
  }

  if (!fs.existsSync("capturas/ppagamento")) {
    fs.mkdirSync("capturas/ppagamento");
  }

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto(
    basePath +
      "RelPagamentos.do?method=Pesquisar&anoexercicio=" +
      ano +
      "&mes=" +
      mes
  );
  const title = await page.title();
  await page.screenshot({
    path: folder + "/" + title + ".png",
    fullPage: true
  });

  const data = await page.$$eval("#item tbody tr td a", tds =>
    tds.map(td => {
      return td.href;
    })
  );

  for (let i = 0; i < data.length; i++) {
    const orgao = await data[i].substring(22, 28);
    await page.goto(
      basePath +
        "RelPagamentosOrgao.do?method=Pesquisar&anoexercicio=" +
        ano +
        "&mes=" +
        mes +
        "&counidadegestora=" +
        orgao
    );
    await page.screenshot({
      path: folder + "/" + orgao + ".png",
      fullPage: true
    });
  }

  await browser.close();
}

run();
