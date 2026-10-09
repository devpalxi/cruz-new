import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  defaultViewport: { width: 1280, height: 900 },
});
const page = await browser.newPage();
for (const f of ["MBT", "CHE"]) {
  await page.goto(`file:///D:/DN-75/Edu/DN/Palxi/Cruz-Money-2/cruz/html/${f}-jira-user-stories.html`, { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 800));
  const r = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("img[data-shot]")];
    const broken = imgs.filter((i) => !i.naturalWidth).length;
    const ids = new Set([...document.querySelectorAll("[id]")].map((e) => e.id));
    const links = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
    const badAnchors = links.filter((h) => h.startsWith("#") && h.length > 1 && !ids.has(h.slice(1)));
    const fileLinks = [...new Set(links.filter((h) => h.endsWith(".html") || h.includes(".html#")).map((h) => h.split("#")[0]))];
    const stale = document.body.innerText.includes("Payout Destination Details");
    return { images: imgs.length, broken, badAnchors: [...new Set(badAnchors)], fileLinks, stale };
  });
  console.log(f, JSON.stringify(r));
}
await browser.close();
