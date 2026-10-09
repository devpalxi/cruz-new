import re, html, sys, importlib.util, os

sys.stdout.reconfigure(encoding="utf8")
SP = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("embed_cfg", os.path.join(SP, "embed.py"))
src = open(os.path.join(SP, "embed.py"), encoding="utf8").read().split("def data_uri")[0]
ns = {}
exec(src, ns)
SHOTS, MBT, CHE, LIVE = ns["SHOTS"], ns["MBT"], ns["CHE"], ns["LIVE"]
ROOT = ns["ROOT"]

HOW = {
    "mbt-01": "Open Manage, then Venues. Pick a venue from your client's list. The venue screen opens with its name at the top and its saved payment settings. An Admin only sees their own client's venues.",
    "mbt-02": "Open Manage, then Venues as a Super Admin (add ?role=super-admin to the link). Every client's venues are listed with a Client column. Select a venue to open its settings. The client and venue name show at the top.",
    "mbt-03": "On the venue screen, turn on Payment File for Your Bank. A Venue Code field appears under it. The help text explains that your team downloads a file and uploads it to the bank's online portal. It is off until you turn it on.",
    "mbt-04": "With Payment File for Your Bank on, type the Venue Code. The help text explains it appears against each payment in the file. Leading zeros are kept (for example 0042).",
    "mbt-05": "Change any setting and select Save. A confirmation message appears. Reload the page and the saved values are still there. Only this venue changes.",
    "mbt-06": "Change a setting, then select Cancel. The screen goes back to the last saved values.",
    "mbt-07": "Turn Payment File for Your Bank off and Save. It stops being offered to Collectors for new payouts. Payouts already submitted keep their payment method.",
    "mbt-08": "Open any payout from the Approver or Authoriser. Payment Method Details shows how the payout was set up to be paid when it was submitted. A payment file payout also says it stays pending until the file is uploaded to the bank.",
    "mbt-09": "On Payment Breakdown, enter the full amount as cash and leave How the Rest Is Paid empty. Next goes straight on, with no payment method details to fill in.",
    "mbt-10": "Choose a payment method, then have the venue switch it off. When the Collector reaches Payment Method Details, a message says the method is no longer available and asks them to choose another. What they typed is kept.",
    "mbt-11": "Choose Payment File for Your Bank on Payment Breakdown, then continue to Payment Method Details. Enter Account Name, BSB and Account Number. Select Validate Account with fields empty or wrong to see the messages.",
    "mbt-12": "Open the Approver or Authoriser review for a payment file payout. The account details and amount are shown. Select Return for Correction, enter a reason, and you are taken to the Collector's correction page showing that reason.",
    "che-01": "On the venue screen, turn Cheque on. Who enters the cheque details appears under it. The same Save and Cancel apply as for the other payment methods.",
    "che-02": "With Cheque on, choose one of three options: Collector Only, Authoriser Only, or Collector and Authoriser Both. Each has a short explanation. Saving with Cheque on and no option chosen shows a message and does not save.",
    "che-03": "Turn Cheque off and Save. Cheque stops being offered for new payouts at that venue. Cheque payouts already submitted keep their details and can still be finished.",
    "che-04": "Open a cheque payout in the Approver or Authoriser review. Payment Method Details shows who enters the cheque details, as chosen when the payout was submitted.",
    "che-06": "On Payment Breakdown, open How the Rest Is Paid. Only the methods the venue has switched on are listed. Choosing one shows an amount box for it.",
    "che-07": "Choose Cheque with Collector and Authoriser Both: the cheque fields are optional. If the venue has since switched a method off, the Collector sees a message and is asked to choose another.",
    "che-08": "With Collector Only, Payment Method Details shows Cheque Number and Cheque Name, both required. The name starts as the winner's name. Select Validate Cheque with a field empty to see the message.",
    "che-09": "Open the Authoriser review for a Collector Only cheque. The cheque details are shown but cannot be changed. Return for Correction sends it back with a reason.",
    "che-10": "After a cheque is returned, the Collector opens the correction page. It shows who returned it and why, with the saved cheque details ready to edit. Send Back for Review checks both fields first.",
    "che-11": "With Authoriser Only, the Collector sees that there is nothing to enter and continues. In the Authoriser review, the Authoriser enters Cheque Number and Cheque Name. Authorise stays off until both are entered and checked.",
    "che-12": "In the Authoriser review, enter Cheque Number and Cheque Name, then select Validate Cheque. The details are shown with a pencil to edit them again. Authorise can be used once the confirm box is ticked.",
    "che-13": "With Collector and Authoriser Both, the Collector can fill in both cheque details, one of them, or neither, and still continue. Anything left blank shows as Not entered yet on the Summary.",
    "che-14": "In the Authoriser review, anything the Collector left blank can be completed. In the example, the Collector entered the number and the Authoriser adds the name. Both are needed before Authorise is available.",
    "che-15": "On the Collector's cheque form, the Cheque Name starts as the winner's name and can be changed. The Cheque Number is typed as text, so leading zeros are kept.",
    "che-16": "Open any cheque payout in the Approver or Authoriser review. Payment Method Details shows Paid By, Amount, who enters the cheque details, the Cheque Number and the Cheque Name.",
}


def tag_of(status):
    return "Built" if status == "built" else "Partly built"


def clean(s):
    s = re.sub(r"<!--proto-start-->.*?<!--proto-end-->", "", s, flags=re.S)
    s = re.sub(r"<!--proto-js-start-->.*?<!--proto-js-end-->", "", s, flags=re.S)
    return s


def story_info(path, sid):
    t = clean(open(path, encoding="utf8").read())
    m = re.search(rf'<h2 id="{sid}">(.*?)</h2>(.*?)(?=<h2 id=|</body>)', t, re.S)
    title = html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).replace(" — ", " ").strip()
    body = m.group(2)
    us = re.search(r"User story:</strong>\s*(.*?)</p>", body, re.S)
    story = html.unescape(re.sub(r"<[^>]+>", "", us.group(1))).strip() if us else ""
    return title, story


out = []
out.append("# Linear updates: new configurable payout screens\n")
out.append(f"Live prototype: {LIVE}\n")
out.append(
    "One entry per story that has a screen in the prototype. Each entry has the issue name, a short description, "
    "the screenshots, and how it works with a live link. Screenshots are the PNG files in `html/screenshots/` "
    "(paths below are relative to this file). Upload them to Linear when you paste an entry.\n"
)
out.append("Stories with no screen yet are listed at the end.\n")
out.append(
    "**Before you paste:** issue names and short descriptions are copied from the story files, so they still say "
    "*Manual Bank Transfer* and *payout destination*. The screens say *Payment File for Your Bank* and *Payment Method "
    "Details*. Pick one set of names, then update the stories (and these entries) to match.\n"
)
out.append(
    "**Live links for the Collector:** Payment Method Details opens from the flow. Choose a method under How the Rest "
    "Is Paid on Payment Breakdown first, then continue. The review pages have a *Prototype only* row at the top to "
    "switch between payouts. Venue settings are kept for the current browser tab only.\n"
)
out.append(
    "**Wording to confirm with Brien or Minosha before sharing:** *Payment File for Your Bank*, *Funds Transfer*, "
    "*How the Rest Is Paid*, *Payment Method Details*, *Account Name Check*, *Return for Correction*.\n"
)

not_built = []
entries = []  # for the HTML version: (group, title, status, story, note, shots, how)
for prefix, stories, file in (("MBT", MBT, "MBT-jira-user-stories.html"), ("CHE", CHE, "CHE-jira-user-stories.html")):
    out.append(f"\n---\n\n## {'Manual Bank Transfer (CRP-250)' if prefix == 'MBT' else 'Cheque (CRP-321)'}\n")
    for sid, (status, shots, note) in stories.items():
        title, story = story_info(os.path.join(ROOT, file), sid)
        if status not in ("built", "partly"):
            not_built.append((title, ns["LABEL"][status], note))
            continue
        out.append(f"### {title}\n")
        tag = "Built" if status == "built" else "Partly built"
        entries.append((prefix, title, tag, story, note, shots, HOW[sid]))
        out.append(f"**Status:** {tag}\n")
        out.append(f"**Short description:** {story}\n")
        if note:
            out.append(f"_Note: {note}_\n")
        out.append("**Screenshots:**\n")
        for s in shots:
            out.append(f"![{SHOTS[s][0]}](../html/screenshots/{s}.png)\n")
        out.append(f"**How it works:** {HOW[sid]}\n")
        links = []
        for s in shots:
            links.append(f"[{SHOTS[s][0]}]({LIVE}{SHOTS[s][1]})")
        out.append("**Live link:**\n")
        for l in links:
            out.append(f"- {l}")
        out.append("")

out.append("\n---\n\n## Stories with no screen yet\n")
out.append("| Story | Status | Note |\n|---|---|---|")
for t, status, note in not_built:
    out.append(f"| {t} | {status} | {note} |")
out.append("")

open(os.path.join(ROOT, "..", "docs", "linear-updates.md"), "w", encoding="utf8").write("\n".join(out))
print("entries:", sum(1 for k in list(MBT.values()) + list(CHE.values()) if k[0] in ("built", "partly")), "not built:", len(not_built))

# ---------- Self-contained HTML version (images embedded once) ----------
import json
esc = html.escape
used = sorted({s for e in entries for s in e[5]})
import base64


def data_uri(name):
    with open(os.path.join(ROOT, "screenshots", name + ".png"), "rb") as f:
        return "data:image/png;base64," + base64.b64encode(f.read()).decode()


images = {n: data_uri(n) for n in used}
groups = {"MBT": "Manual Bank Transfer (CRP-250)", "CHE": "Cheque (CRP-321)"}
body = []
current = None
for prefix, title, tag, story, note, shots, how in entries:
    if prefix != current:
        body.append(f"<h2>{esc(groups[prefix])}</h2>")
        current = prefix
    body.append(f'<section class="entry"><h3>{esc(title)}</h3>')
    body.append(f'<p><span class="badge {"built" if tag == "Built" else "partly"}">{tag}</span></p>')
    body.append(f"<p><strong>Short description:</strong> {esc(story)}</p>")
    if note:
        body.append(f'<p class="note">{esc(note)}</p>')
    for sname in shots:
        cap, path = SHOTS[sname]
        body.append(f'<figure><img data-shot="{sname}" alt="{esc(cap)}"><figcaption>{esc(cap)}</figcaption></figure>')
    body.append(f"<p><strong>How it works:</strong> {esc(how)}</p>")
    body.append("<p><strong>Live link:</strong></p><ul>")
    for sname in shots:
        cap, path = SHOTS[sname]
        body.append(f'<li><a href="{LIVE}{path}">{esc(cap)}</a></li>')
    body.append("</ul></section>")
rows = "".join(f"<tr><td>{esc(t)}</td><td>{esc(st)}</td><td>{esc(n)}</td></tr>" for t, st, n in not_built)
page = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Linear updates: configurable payout screens</title>
<style>
body{{max-width:980px;margin:32px auto;padding:0 20px;font:16px/1.6 system-ui,sans-serif;color:#172b4d;background:#fff}}
h1{{font-size:1.9rem}}h2{{margin-top:44px;padding-top:14px;border-top:2px solid #dfe1e6}}
.entry{{margin:22px 0;padding:16px 18px;border:1px solid #dfe1e6;border-radius:8px;break-inside:avoid-page}}
.entry h3{{margin:0 0 6px}}a{{color:#0052cc}}.note{{color:#6b778c;font-style:italic}}
.badge{{display:inline-block;padding:2px 10px;border-radius:12px;font-size:.82rem;font-weight:600}}
.badge.built{{background:#e3fcef;color:#006644}}.badge.partly{{background:#fff0b3;color:#7a5200}}
figure{{margin:14px 0}}img{{max-width:100%;max-height:900px;object-fit:contain;object-position:top;border:1px solid #c1c7d0;border-radius:4px}}
figcaption{{font-size:.88rem;color:#42526e;margin-top:5px}}
.callout{{background:#fff4ce;border-left:4px solid #d99b00;padding:10px 14px;margin:14px 0}}
table{{border-collapse:collapse;width:100%;font-size:.94rem}}th,td{{border:1px solid #dfe1e6;padding:8px 10px;text-align:left;vertical-align:top}}th{{background:#f4f5f7}}
@media print{{body{{max-width:none;margin:0}}img{{max-height:none}}}}
</style></head><body>
<h1>Linear updates: new configurable payout screens</h1>
<p>Live prototype: <a href="{LIVE}">{LIVE}</a>. One entry per story that has a screen. Each has the issue name, a short description, screenshots, and how it works with live links. This file works on its own: the screenshots are inside it.</p>
<div class="callout"><strong>Before you paste:</strong> issue names and short descriptions are copied from the story files, so they still say <em>Manual Bank Transfer</em> and <em>payout destination</em>. The screens say <em>Payment File for Your Bank</em> and <em>Payment Method Details</em>. Pick one set of names, then update the stories to match. Names to confirm with Brien or Minosha: Payment File for Your Bank, Funds Transfer, How the Rest Is Paid, Payment Method Details, Account Name Check, Return for Correction.</div>
<div class="callout"><strong>Live links for the Collector:</strong> Payment Method Details opens from the flow. Choose a method under How the Rest Is Paid on Payment Breakdown first, then continue. The review pages have a <em>Prototype only</em> row at the top to switch between payouts. Venue settings are kept for the current browser tab only. Links work once this branch is deployed.</div>
{"".join(body)}
<h2>Stories with no screen yet</h2>
<table><thead><tr><th>Story</th><th>Status</th><th>Note</th></tr></thead><tbody>{rows}</tbody></table>
<script>const SHOT_DATA={json.dumps(images)};document.querySelectorAll("img[data-shot]").forEach(function(i){{i.src=SHOT_DATA[i.dataset.shot]}});</script>
</body></html>"""
open(os.path.join(ROOT, "linear-updates.html"), "w", encoding="utf8").write(page)
print("html bytes:", len(page), "images:", len(images))
