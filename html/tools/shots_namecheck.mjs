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
// Crops the top of the page: the payout number, the status and the notes under it
async function shotHeader(name, x = 320, width = 800) {
  await wait(300);
  const box = await page.evaluate(() => {
    const h1 = document.querySelector("main h1");
    const collapse = [...document.querySelectorAll("main button")].find((b) => b.textContent.includes("Collapse All") || b.textContent.includes("Expand All"));
    return { top: h1.getBoundingClientRect().top + window.scrollY, bottom: collapse.getBoundingClientRect().top + window.scrollY };
  });
  await page.screenshot({ path: `${OUT}/${name}.png`, clip: { x, y: box.top - 12, width, height: box.bottom - box.top + 4 }, captureBeyondViewport: true });
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
const NV = "Name Verification";

// CHE-17: the cheque name beside the comparison name, with the result
await go("/authoriser/payout?scenario=cheque-collector");
await shotRange("26-che17-authoriser-match", NV, NV);
await go("/approver/payout?scenario=cheque-no-match");
await shotRange("27-che17-approver-no-match", NV, NV);

await prep({ venue: { chequeMode: "collector" }, store: { "cruz.selectedPayoutDestination": "cheque" } });
await go("/collector/payout-destination-details");
await setInput("cheque-number", "000417");
await setInput("cheque-name", "Alex Morgan Jr");
await clickText("Check Name Match");
await shot("29-che17-collector-cheque-step-differs", false);
await clickText("Next");
await wait(1500);
{
  const box = await page.evaluate(() => {
    const first = [...document.querySelectorAll("button[aria-expanded]")].find((b) => b.textContent.trim() === "Payment Method Details").parentElement;
    const card = [...document.querySelectorAll("h3")].find((h) => h.textContent.trim() === "Cheque Name Check").parentElement;
    return { top: first.getBoundingClientRect().top + window.scrollY, bottom: card.getBoundingClientRect().bottom + window.scrollY };
  });
  await page.screenshot({ path: `${OUT}/28-che17-collector-summary.png`, clip: { x: 440, y: box.top - 8, width: 560, height: box.bottom - box.top + 16 }, captureBeyondViewport: true });
  console.log("saved 28-che17-collector-summary");
}

// CHE-19: no ID document
await prep();
await go("/authoriser/payout?scenario=cheque-captured-name");
await shotRange("30-che19-captured-name", NV, NV);
await go("/authoriser/payout?scenario=cheque-unable");
await shotRange("31-che19-unable-to-compare", NV, NV);

// CHE-20 and CHE-21: the Authoriser records a rationale and acknowledges the difference
await go("/authoriser/payout?scenario=cheque-no-match");
await clickText("Check Name Match");
await shotRange("32-che20-rationale-required", NV, NV);
await shotToEnd("33-che20-authorise-off", "Approvals");
await shotRange("41-che20-approvals-rationale-needed", "Approvals", "Approvals");
await setInput("name-rationale", "Winner confirmed by phone that the cheque is made out to Vivek Mishra Jr.");
await page.click("#name-acknowledged");
await page.evaluate(() => {
  const box = [...document.querySelectorAll("label")].find((l) => l.textContent.includes("I confirm this payout is authorised"));
  box.querySelector("input").click();
});
await wait(300);
await shotRange("34-che21-acknowledged", NV, NV);
await shotRange("42-che21-approvals-resolved", "Approvals", "Approvals");
await shotToEnd("35-che21-authorise-on", "Approvals");

// CHE-18: the names change after a decision, so the check is redone and the earlier decision moves to history
await page.click('button[aria-label="Edit cheque details"]');
await wait(300);
await setInput("authoriser-cheque-name", "Vivek Mishra");
await clickText("Check Name Match");
await shotRange("36-che18-names-changed", NV, "Payout History");

// CHE-22: the saved decision, read-only, and earlier decisions in the payout history
await go("/authoriser/payout?scenario=cheque-resolved");
await shotRange("37-che22-authoriser-saved-decision", NV, "Payout History");
await go("/approver/payout?scenario=cheque-resolved");
await shotRange("38-che22-approver-saved-decision", NV, "Payout History");

// CHE-23: the status line under the payout status
await go("/authoriser/payout?scenario=cheque-no-match");
await shotHeader("39-che23-pending-payment-waiting");
await go("/approver/payout?scenario=cheque-collector");
await shotHeader("40-che23-pending-payment-all-met");

await browser.close();
console.log("done");
