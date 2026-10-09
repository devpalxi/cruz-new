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

// ---------- Venues ----------
await prep();
await go("/admin/venues");
await page.hover("tbody tr");
await shot("01-venues-admin", false);

await go("/admin/venues?role=super-admin");
await page.hover("tbody tr:nth-child(2)");
await shot("02-venues-super-admin", false);

await go("/admin/venues/riverside-rsl-club?role=super-admin");
await shot("03-venue-settings-all-on");

await prep();
await go("/admin/venues/northside-sports-club?role=super-admin");
await page.click("#cheque-enabled");
await wait(300);
await clickText("Save");
await shot("04-venue-settings-cheque-needs-mode");

await page.click("#cheque-mode-authoriser");
await page.click("#payment-file-enabled");
await wait(200);
await setInput("venue-code", "0087");
await clickText("Save");
await shot("05-venue-settings-saved");

await prep();
await go("/admin/venues/harbourview-hotel");
await shot("06-venue-no-access", false);

// ---------- Collector ----------
await prep();
await go("/collector/payment-breakdown");
await setInput("confirm-cash", "");
await page.evaluate(() => {
  const inputs = [...document.querySelectorAll("input")];
  const cash = inputs.find((i) => i.getAttribute("aria-label") === "Cash Amount");
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(cash, "500");
  cash.dispatchEvent(new Event("input", { bubbles: true }));
});
await setInput("confirm-cash", "500");
await page.select("#destination-type", "manual-bank");
await wait(400);
await shot("07-collector-how-rest-is-paid");

await prep({ store: { "cruz.selectedPayoutDestination": "manual-bank" } });
await go("/collector/payout-destination-details");
await clickText("Validate Account");
await shot("08-collector-payment-file-details-errors");

await prep({ venue: { chequeMode: "collector" }, store: { "cruz.selectedPayoutDestination": "cheque" } });
await go("/collector/payout-destination-details");
await setInput("cheque-number", "");
await clickText("Validate Cheque");
await shot("09-collector-cheque-collector-only");

await prep({ venue: { chequeMode: "authoriser" }, store: { "cruz.selectedPayoutDestination": "cheque" } });
await go("/collector/payout-destination-details");
await shot("10-collector-cheque-authoriser-only");

await prep({ venue: { chequeMode: "both" }, store: { "cruz.selectedPayoutDestination": "cheque" } });
await go("/collector/payout-destination-details");
await shot("11-collector-cheque-both");

await prep({ venue: { paymentFileEnabled: false }, store: { "cruz.selectedPayoutDestination": "manual-bank" } });
await go("/collector/payout-destination-details");
await shot("12-collector-method-no-longer-available");

// ---------- Approver / Authoriser ----------
await prep();
for (const [file, path] of [
  ["13-authoriser-funds-transfer", "/authoriser/payout?scenario=funds-transfer"],
  ["14-authoriser-payment-file", "/authoriser/payout?scenario=payment-file"],
  ["15-authoriser-cheque-collector-only", "/authoriser/payout?scenario=cheque-collector"],
  ["16-authoriser-cheque-authoriser-only", "/authoriser/payout?scenario=cheque-authoriser"],
  ["17-authoriser-cheque-both", "/authoriser/payout?scenario=cheque-both"],
  ["19-approver-payment-file", "/approver/payout?scenario=payment-file"],
  ["20-approver-cheque-collector-only", "/approver/payout?scenario=cheque-collector"],
]) {
  await go(path);
  await shot(file);
}

await go("/authoriser/payout?scenario=cheque-both");
await clickText("Return for Correction");
await shot("18-return-for-correction-dialog", false);

// Authoriser enters the missing cheque name, then checks it
await go("/authoriser/payout?scenario=cheque-both");
await setInput("authoriser-cheque-name", "Vivek Mishra");
await clickText("Validate Cheque");
await shot("21-authoriser-cheque-details-checked");

// Return and land on the Collector's correction page
await go("/authoriser/payout?scenario=cheque-authoriser");
await clickText("Return for Correction");
await setInput("return-reason", "The cheque details are missing. Please enter them.");
await clickText("Return Payout");
await wait(1500);
await shot("22-collector-returned-cheque");

await go("/approver/payout?scenario=payment-file");
await clickText("Return for Correction");
await setInput("return-reason", "The BSB does not belong to this account name.");
await clickText("Return Payout");
await wait(1500);
await shot("23-collector-returned-payment-file");

// Cash-only payout: no method chosen under "How the Rest Is Paid"
await prep();
await go("/collector/payment-breakdown");
await page.evaluate(() => {
  const cash = [...document.querySelectorAll("input")].find((i) => i.getAttribute("aria-label") === "Cash Amount");
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(cash, "1000");
  cash.dispatchEvent(new Event("input", { bubbles: true }));
});
await setInput("confirm-cash", "1000");
await shot("24-collector-cash-only");

// Existing export page, for reference
await go("/authoriser/manual-bank-export");
await shot("25-manual-bank-export-existing");

await browser.close();
console.log("done");
