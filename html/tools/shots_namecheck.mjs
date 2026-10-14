import puppeteer from "puppeteer-core";
import fs from "node:fs";

const BASE = "http://localhost:3000";
const OUT = "D:/DN-75/Edu/DN/Palxi/Cruz-Money-2/cruz/html/screenshots";
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function reset() {
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  await page.evaluate(() => sessionStorage.clear());
}
async function setVenue(id, changes) {
  await page.goto(BASE + "/admin/venues?role=super-admin", { waitUntil: "networkidle0" });
  await wait(600);
  await page.evaluate(
    (id, changes) => {
      const raw = sessionStorage.getItem("cruz-venues");
      // First load writes nothing, so build from the table text if empty: store only after a save
      const venues = raw ? JSON.parse(raw) : null;
      if (!venues) return;
      Object.assign(venues.find((v) => v.id === id), changes);
      sessionStorage.setItem("cruz-venues", JSON.stringify(venues));
    },
    id,
    changes,
  );
}
// The app only writes venue settings after a save, so seed the full list ourselves
const SEED = [
  { id: "riverside-rsl-club", name: "Riverside RSL Club", client: "Riverside RSL Group", dailyLimit: 30000, paymentFileEnabled: true, venueCode: "0042", chequeEnabled: true, chequeMode: "both" },
  { id: "northside-sports-club", name: "Northside Sports Club", client: "Riverside RSL Group", dailyLimit: 30000, paymentFileEnabled: false, venueCode: "", chequeEnabled: false, chequeMode: "" },
  { id: "harbourview-hotel", name: "Harbourview Hotel", client: "Harbourview Hospitality", dailyLimit: 20000, paymentFileEnabled: true, venueCode: "0107", chequeEnabled: false, chequeMode: "" },
  { id: "bayside-tavern", name: "Bayside Tavern", client: "Harbourview Hospitality", dailyLimit: 15000, paymentFileEnabled: false, venueCode: "", chequeEnabled: true, chequeMode: "collector" },
];
async function prep({ venue = {}, store = {} } = {}) {
  await reset();
  const venues = SEED.map((v) => (v.id === "riverside-rsl-club" ? { ...v, ...venue } : v));
  await page.evaluate(
    (venues, store) => {
      sessionStorage.setItem("cruz-venues", JSON.stringify(venues));
      for (const [k, v] of Object.entries(store)) sessionStorage.setItem(k, JSON.stringify(v));
    },
    venues,
    store,
  );
}
async function go(path) {
  await page.goto(BASE + path, { waitUntil: "networkidle0" });
  await wait(900);
}
async function clickText(text, sel = "button,a") {
  const ok = await page.evaluate(
    (text, sel) => {
      const el = [...document.querySelectorAll(sel)].find((b) => b.textContent.trim() === text);
      if (!el) return false;
      el.click();
      return true;
    },
    text,
    sel,
  );
  if (!ok) throw new Error("No element with text: " + text);
  await wait(400);
}
async function setInput(id, value) {
  await page.evaluate(
    (id, value) => {
      const el = document.getElementById(id);
      const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    },
    id,
    value,
  );
  await wait(200);
}
async function shot(name, fullPage = true) {
  await wait(300);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage });
  console.log("saved", name);
}

// ---------- Cheque name match (new screens only) ----------
// Crops a screenshot from the top of one section to the bottom of another, so a long page shows just what matters
async function shotRange(name, fromText, toText, x = 320, width = 800) {
  await wait(300);
  const box = await page.evaluate(
    (fromText, toText) => {
      const section = (text) => {
        const el = [...document.querySelectorAll("button[aria-expanded]")].find((b) => b.textContent.trim() === text);
        return el ? el.parentElement : null;
      };
      const first = section(fromText);
      const last = section(toText);
      if (!first || !last) return null;
      const top = first.getBoundingClientRect().top + window.scrollY;
      const bottom = last.getBoundingClientRect().bottom + window.scrollY;
      return { top, bottom };
    },
    fromText,
    toText,
  );
  if (!box) throw new Error("Sections not found: " + fromText + " / " + toText);
  await page.screenshot({
    path: `${OUT}/${name}.png`,
    clip: { x, y: box.top - 8, width, height: box.bottom - box.top + 16 },
    captureBeyondViewport: true,
  });
  console.log("saved", name);
}
// Crops from the top of a section to the end of the page (the buttons)
async function shotToEnd(name, fromText, x = 320, width = 800) {
  await wait(300);
  const top = await page.evaluate((fromText) => {
    const el = [...document.querySelectorAll("button[aria-expanded]")].find((b) => b.textContent.trim() === fromText);
    return el.parentElement.getBoundingClientRect().top + window.scrollY;
  }, fromText);
  const bottom = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll("main button")];
    return buttons[buttons.length - 1].getBoundingClientRect().bottom + window.scrollY;
  });
  await page.screenshot({
    path: `${OUT}/${name}.png`,
    clip: { x, y: top - 8, width, height: bottom - top + 24 },
    captureBeyondViewport: true,
  });
  console.log("saved", name);
}

await prep();

await go("/authoriser/payout?scenario=cheque-collector");
await shotRange("26-authoriser-name-match", "Name Verification", "Payment Status");

// The names differ: the Authoriser has to record a rationale, and Authorise stays off until then
await go("/authoriser/payout?scenario=cheque-no-match");
await clickText("Check Name Match");
await shotRange("27-authoriser-name-no-match", "Name Verification", "Payment Status");
await shotToEnd("28-authoriser-name-blocked-actions", "Approvals");

// Rationale and acknowledgement given: the decision is Active in the history, and Authorise can be used
await setInput("name-rationale", "Winner confirmed by phone that the cheque is made out to Vivek Mishra Jr.");
await page.click("#name-acknowledged");
await page.evaluate(() => {
  const box = [...document.querySelectorAll("label")].find((l) => l.textContent.includes("I confirm this payout is authorised"));
  box.querySelector("input").click();
});
await wait(300);
await shotRange("29-authoriser-name-no-match-resolved", "Name Verification", "Payment Status");
await shotToEnd("30-authoriser-name-resolved-actions", "Approvals");

// The names change after a decision: the earlier decision becomes history and the new names are checked afresh
await page.click('button[aria-label="Edit cheque details"]');
await wait(300);
await setInput("authoriser-cheque-name", "Vivek Mishra");
await clickText("Check Name Match");
await shotRange("31-authoriser-name-changed", "Name Verification", "Payment Status");

await go("/authoriser/payout?scenario=cheque-captured-name");
await shotRange("32-authoriser-name-captured", "Name Verification", "Payment Status");

await go("/authoriser/payout?scenario=cheque-unable");
await shotRange("33-authoriser-name-unable", "Name Verification", "Payment Status");

await go("/approver/payout?scenario=cheque-no-match");
await shotRange("34-approver-name-no-match", "Name Verification", "Payment Status");

await prep({ venue: { chequeMode: "collector" }, store: { "cruz.selectedPayoutDestination": "cheque" } });
await go("/collector/payout-destination-details");
await setInput("cheque-number", "000417");
await setInput("cheque-name", "Alex Morgan Jr");
await clickText("Check Name Match");
await shot("35-collector-cheque-name-differs", false);
await clickText("Next");
await wait(1500);
{
  const box = await page.evaluate(() => {
    const first = [...document.querySelectorAll("button[aria-expanded]")].find((b) => b.textContent.trim() === "Payment Method Details").parentElement;
    const card = [...document.querySelectorAll("h3")].find((h) => h.textContent.trim() === "Cheque Name Check").parentElement;
    return { top: first.getBoundingClientRect().top + window.scrollY, bottom: card.getBoundingClientRect().bottom + window.scrollY };
  });
  await page.screenshot({ path: `${OUT}/36-collector-summary-name-check.png`, clip: { x: 440, y: box.top - 8, width: 560, height: box.bottom - box.top + 16 }, captureBeyondViewport: true });
  console.log("saved 36-collector-summary-name-check");
}

await browser.close();
console.log("done");
