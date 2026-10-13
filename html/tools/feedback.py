"""Builds html/feedback-changes.html: for each piece of reviewer feedback, the issue, the first build, the feedback,
and the fixed screen with its workflow.

"First build" screenshots come from git commit FIRST_BUILD (the screens the reviewers saw).
"After" screenshots come from git commit AFTER_BUILD (the build after round 1), so regenerating html/screenshots does not change this report.
Needs Pillow (pip install pillow) and git on the PATH. Run from anywhere:  python feedback.py
"""
import base64, html, io, os, subprocess
from PIL import Image

REPO = r"D:\DN-75\Edu\DN\Palxi\Cruz-Money-2\cruz"
SHOTS = os.path.join(REPO, "html", "screenshots")
FIRST_BUILD = "914eb5b"
# The build after round 1 of feedback. Pinned to a commit so later UI changes do not alter this report.
AFTER_BUILD = "158fefc"
LIVE = "https://cruz-new.vercel.app"
esc = html.escape


def before_img(name):
    data = subprocess.check_output(["git", "-C", REPO, "show", f"{FIRST_BUILD}:html/screenshots/{name}.png"])
    return Image.open(io.BytesIO(data)).convert("RGB")


def after_img(name):
    data = subprocess.check_output(["git", "-C", REPO, "show", f"{AFTER_BUILD}:html/screenshots/{name}.png"])
    return Image.open(io.BytesIO(data)).convert("RGB")


# crop id -> (before|after, screenshot, (left, top, right, bottom), caption)
VS = "03-venue-settings-all-on"
CH_BOTH = "17-authoriser-cheque-both"
CH_AUTH = "16-authoriser-cheque-authoriser-only"
CH_DONE = "21-authoriser-cheque-details-checked"
UNAV = "12-collector-method-no-longer-available"
CROPS = {
    "e1_before_top": ("b", VS, (370, 255, 1070, 435), "Top of the screen: a long note under the heading"),
    "e1_before_save": ("b", VS, (370, 1140, 1070, 1215), "Next to Save: no note"),
    "e1_after_top": ("a", VS, (370, 230, 1070, 365), "Top of the screen: the long note is gone"),
    "e1_after_save": ("a", VS, (370, 1015, 1070, 1095), "Next to Save: the note sits right above the buttons"),
    "e2_before": ("b", VS, (387, 440, 1053, 540), "Switch with no word for its state"),
    "e2_after": ("a", VS, (387, 375, 1053, 455), "Switch with On beside it"),
    "e3_before": ("b", VS, (370, 435, 1070, 1150), "Long descriptions on every card"),
    "e3_after": ("a", VS, (370, 370, 1070, 1005), "One short line per card"),
    "e4_before": ("b", VS, (370, 340, 1070, 440), "Funds Transfer styled like the cards you can switch"),
    "e4_after": ("a", VS, (370, 270, 1070, 365), "Funds Transfer in the same card as the others, with an Always available badge"),
    "e8_before": ("b", VS, (370, 165, 1070, 245), "A line under the venue name with the client and daily limit"),
    "e8_after": ("a", VS, (370, 165, 1070, 275), "The venue name is followed straight by the settings"),
    "e5_before": ("b", CH_BOTH, (340, 960, 1100, 1445), "Entered By shows the venue setting, not a person"),
    "e5_after_a": ("a", CH_BOTH, (340, 960, 1100, 1350), "Entered By shows who has entered details so far"),
    "e5_after_b": ("a", CH_DONE, (340, 960, 1100, 1325), "After the Authoriser completes it, both people are listed"),
    "e6_before_a": ("b", CH_AUTH, (340, 960, 1100, 1445), "Authoriser Only: placeholders in the card and a separate form below"),
    "e6_before_b": ("b", CH_DONE, (340, 960, 1100, 1330), "After checking (Collector and Authoriser payout): the same details shown twice"),
    "e6_after_a": ("a", CH_AUTH, (340, 960, 1100, 1350), "Authoriser Only: the fields sit inside the card"),
    "e6_after_b": ("a", CH_DONE, (340, 960, 1100, 1325), "After checking (Collector and Authoriser payout): the details fill the card"),
    "e7_before": ("b", UNAV, (0, 100, 1440, 700), "Collector lands on Payment Method Details and sees the warning there"),
    "e7_after": ("a", UNAV, (0, 100, 1440, 700), "Collector is sent back to Payment Breakdown with the warning"),
}


def crop_uri(cid):
    kind, name, box, _ = CROPS[cid]
    im = (before_img if kind == "b" else after_img)(name).crop(box)
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


# Entries: reviewer, feedback (their words), issue (ours), before crops, after crops, workflow steps, live path, changed files
ENTRIES = [
    dict(
        title="Move the “changes apply to new payouts only” note next to Save",
        where="Venue Settings",
        who="Oshada (Venue Settings feedback, item 1)",
        feedback="Move the “changes apply to new payouts only” note near the Save button so users understand the impact before saving.",
        issue="The note sat in a paragraph under the heading, a full screen away from Save. Someone pressing Save would not have it in view, so the effect of saving was easy to miss.",
        before=["e1_before_top", "e1_before_save"],
        after=["e1_after_top", "e1_after_save"],
        steps=[
            "Open Manage, then Venues, and select a venue.",
            "Change any setting, for example turn Cheque on.",
            "Look at the buttons at the bottom: “Changes apply to new payouts only. Submitted payouts are not affected.” sits directly above Cancel and Save.",
            "Select Save. A confirmation message appears, and reloading the page shows the saved values.",
        ],
        live=("/admin/venues/riverside-rsl-club?role=super-admin", "Venue Settings (Super Admin view)"),
        changed="VenueSettingsForm",
    ),
    dict(
        title="Toggles: clear label, state announced, keyboard, state shown in text",
        where="Venue Settings",
        who="Oshada (Venue Settings feedback, item 2)",
        feedback="Ensure each toggle has a clear label, announces its on/off state, and works with a keyboard. Show the state in text where it helps users understand the impact.",
        issue="The switch was already a real switch control with a label and a visible focus ring, but its state was shown only by colour (blue or grey). Nothing said On or Off in words, and the explanation under each title was not linked to the switch for screen readers.",
        before=["e2_before"],
        after=["e2_after"],
        steps=[
            "Open a venue. Each switch now has the word On or Off beside it.",
            "Press Tab to reach a switch. A focus ring appears.",
            "Press Space or Enter to switch it. The word and the colour change together.",
            "A screen reader reads the method name, On or Off, and the line of description under the title.",
            "Turning Payment File for Your Bank on reveals Venue Code. Turning Cheque on reveals the question about who can enter cheque details. Turning either off hides its extra settings.",
        ],
        live=("/admin/venues/riverside-rsl-club?role=super-admin", "Venue Settings (Super Admin view)"),
        changed="Switch, PaymentMethodRow",
    ),
    dict(
        title="Shorter descriptions, detail only when needed",
        where="Venue Settings",
        who="Oshada (Venue Settings feedback, item 3) and Akila",
        feedback="Reduce reading time with brief descriptions and reveal extra detail only when needed. For example: Funds transfer — Always available; Bank payment file — On/off; Cheque — On/off. Keep the venue-code note (“Included in the file; leading zeros are kept”) and shorten the cheque question to Who can enter cheque details?   (Akila: try to make it less wordy if possible, no need to mention everything, too much text here.)",
        issue="Every card carried a full sentence or two of explanation, the page opened with a paragraph before any control, and the cheque question and its three options were long. The page took a lot of reading for a screen with three settings.",
        before=["e3_before"],
        after=["e3_after"],
        steps=[
            "Open a venue. The intro paragraph under “How Winners Are Paid” is gone.",
            "Each method has one short line: Funds Transfer “Paid into the winner’s bank account automatically.”, Payment File for Your Bank “Your team uploads a payment file to your bank’s online portal.”, Cheque “Winners are paid by cheque.”",
            "Turn Payment File for Your Bank on. Venue Code appears with “Included in the file; leading zeros are kept.”",
            "Turn Cheque on. The question reads “Who can enter cheque details?” with three one-line options: Collector Only, Authoriser Only, Collector and Authoriser Both.",
            "Turn them off again and the extra settings disappear.",
        ],
        live=("/admin/venues/riverside-rsl-club?role=super-admin", "Venue Settings (Super Admin view)"),
        changed="VenueSettingsForm, venue-data (option text), ChequeModeOptions",
    ),
    dict(
        title="Funds Transfer looks like something you can switch",
        where="Venue Settings",
        who="Oshada (Venue Settings feedback, item 4, optional)",
        feedback="Funds Transfer is always available, but its card looks configurable. Label it Always available or style it differently. (Follow-up from the team: keep it looking like the other cards, with a clear Always available badge.)",
        issue="Funds Transfer used the same white card as the two methods that have switches, with no switch. A reader could think it was missing a control, or that it could be turned off.",
        before=["e4_before"],
        after=["e4_after"],
        steps=[
            "Open a venue. Funds Transfer is the same white card as the other two.",
            "Where the others have a switch, it has a green “Always available” badge, so it is clear there is nothing to turn on or off.",
            "The two cards below it, Payment File for Your Bank and Cheque, keep their switches.",
        ],
        live=("/admin/venues/riverside-rsl-club?role=super-admin", "Venue Settings (Super Admin view)"),
        changed="AlwaysAvailableMethodRow (new)",
    ),
    dict(
        title="“Cheque Details Entered By” shows the actual username",
        where="Approver and Authoriser review (Payment Method Details card)",
        who="Oshada (Payout Summary)",
        feedback="Cheque Details Entered By: Should be populated by the actual username other than the available options.",
        issue="The row showed the venue setting (for example “Collector and Authoriser Both”). That says who is allowed to enter the details, not who did, so it could not tell a reviewer who to ask about a cheque.",
        before=["e5_before"],
        after=["e5_after_a", "e5_after_b"],
        steps=[
            "Open the Authoriser review with the Cheque: Collector and Authoriser payout.",
            "Cheque Details Entered By shows M.Santos (Collector), because the Collector entered the cheque number.",
            "Enter the missing Cheque Name and select Validate Cheque.",
            "The row now reads M.Santos (Collector), R.Nguyen (Authoriser). If nobody has entered details yet, it reads Not entered yet.",
            "With Cheque: Authoriser Only it goes from Not entered yet to R.Nguyen (Authoriser). With Cheque: Collector Only it shows M.Santos (Collector) and the details are read-only. The Approver sees the same row, read-only.",
        ],
        live=("/authoriser/payout?scenario=cheque-both", "Authoriser review, Cheque: Collector and Authoriser"),
        changed="RecordedDestination, AuthoriserPayoutView, payout-review-scenarios",
    ),
    dict(
        title="Details the Authoriser enters fill the card, no new placeholders",
        where="Authoriser review (Payment Method Details card)",
        who="Oshada (Authoriser entry)",
        feedback="When the cheque details are entered by Authoriser, the details should be populated in the card instead of showing new placeholders.",
        issue="The card first listed “Not entered yet” for the cheque number and name, with a separate form underneath. After the Authoriser checked the details, the values appeared in a second block, so the same two labels were on screen twice and the first pair still said Not entered yet.",
        before=["e6_before_a", "e6_before_b"],
        after=["e6_after_a", "e6_after_b"],
        steps=[
            "Open the Authoriser review with the Cheque: Authoriser Only payout.",
            "Under Payment Method Details, Cheque Details Entered By says Not entered yet, and the Cheque Number and Cheque Name fields sit inside the card. There is no separate form.",
            "Enter both and select Validate Cheque. Leaving one empty shows a message under that field.",
            "The values now fill the card (Cheque Number, Cheque Name) with “Cheque bearer name matches.” and an edit pencil. Cheque Details Entered By shows R.Nguyen (Authoriser). The second screenshot is the Collector and Authoriser payout, where the card lists both people.",
            "Tick the confirmation box. Authorise is now available. Selecting the pencil reopens the fields and switches Authorise off until the details are checked again.",
        ],
        live=("/authoriser/payout?scenario=cheque-authoriser", "Authoriser review, Cheque: Authoriser Only"),
        changed="ChequeDetailsEditor, RecordedDestination, AuthoriserPayoutView",
    ),
    dict(
        title="A switched-off method sends the Collector straight to Payment Breakdown",
        where="Collector flow (MBT-10, CHE-07)",
        who="Oshada (on MBT-10)",
        feedback="Instead of opening the Payment Method Details page, showing the warning and taking the collector directly to the Payment Breakdown would be ideal.",
        issue="When the venue turned off the method the Collector had chosen, the Collector still opened Payment Method Details, saw a warning there and a disabled Next, and had to find their own way back to choose again. The screen they landed on was one they could not use.",
        before=["e7_before"],
        after=["e7_after"],
        steps=[
            "A Collector chooses a way to pay the rest on Payment Breakdown, for example Payment File for Your Bank, and continues through the steps.",
            "Meanwhile an Admin switches that method off for the venue (Manage, Venues, turn it off, Save).",
            "The Collector reaches the Payment Method Details step.",
            "They are sent straight back to Payment Breakdown. A warning at the top says “Payment File for Your Bank is no longer available at this venue. Choose another way to pay the rest.”",
            "How the Rest Is Paid lists only the methods still available. The earlier choice is cleared. In this prototype the amounts typed on Payment Breakdown are not kept.",
        ],
        live=("/collector/payment-breakdown", "Collector, Payment Breakdown (switch the method off at the venue first)"),
        changed="PayoutDestinationDetailsForm, PaymentBreakdownForm, collector-data",
    ),
    dict(
        title="Remove the client and daily limit line under the venue name",
        where="Venue Settings",
        who="Team request, 2026-10-12",
        feedback="Remove “Client: Riverside RSL Group · Daily limit: $30,000”.",
        issue="The line under the venue name repeated details that the Venues list already shows (the daily limit for everyone, and the client for a Super Admin). It added a line to read before any setting.",
        before=["e8_before"],
        after=["e8_after"],
        steps=[
            "Open Manage, then Venues. The list still shows each venue’s Payment Method and Daily Limit, and the Client column for a Super Admin.",
            "Select a venue. Under the venue name, “How Winners Are Paid” follows straight away. There is no client or daily limit line.",
        ],
        live=("/admin/venues/riverside-rsl-club?role=super-admin", "Venue Settings (Super Admin view)"),
        changed="VenueSettingsForm, VenueSettingsView",
    ),
]


def figure(cid):
    return (
        f'<figure><img src="{crop_uri(cid)}" alt="{esc(CROPS[cid][3])}">'
        f"<figcaption>{esc(CROPS[cid][3])}</figcaption></figure>"
    )


CSS = """
body{max-width:1100px;margin:32px auto;padding:0 22px;font:16px/1.6 system-ui,sans-serif;color:#172b4d;background:#fff}
h1{font-size:2rem;margin-bottom:4px}h2{font-size:1.4rem;margin:0 0 4px}a{color:#0052cc}
.lead{color:#42526e;margin-top:0}
.entry{margin:44px 0;padding-top:20px;border-top:2px solid #dfe1e6;scroll-margin-top:16px}
.meta{color:#6b778c;font-size:.9rem;margin:0 0 14px}
.tag{display:inline-block;padding:2px 10px;border-radius:12px;background:#deebff;color:#0747a6;font-size:.8rem;font-weight:600;margin-right:8px}
.block{margin:16px 0}.block h3{font-size:.85rem;text-transform:uppercase;letter-spacing:.04em;color:#6b778c;margin:0 0 6px}
blockquote{margin:0;padding:10px 14px;background:#fff4ce;border-left:4px solid #d99b00}
.compare{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start}
.col{border:1px solid #dfe1e6;border-radius:8px;padding:12px 14px}
.col.before{background:#fffafa;border-top:4px solid #de350b}.col.after{background:#f7fffb;border-top:4px solid #00875a}
.col h3{margin:0 0 8px}
figure{margin:0 0 14px}img{max-width:100%;border:1px solid #c1c7d0;border-radius:4px;display:block;background:#fff}
figcaption{font-size:.85rem;color:#42526e;margin-top:4px}
.wide .compare{grid-template-columns:1fr}
ol{margin:6px 0 0 22px;padding:0}li{margin:5px 0}
.live{margin-top:10px}.changed{color:#6b778c;font-size:.88rem;margin-top:8px}
table{border-collapse:collapse;width:100%;font-size:.94rem}th,td{border:1px solid #dfe1e6;padding:8px 10px;text-align:left;vertical-align:top}th{background:#f4f5f7}
.callout{background:#f4f5f7;border-left:4px solid #0052cc;padding:10px 14px;margin:16px 0}
@media (max-width:820px){.compare{grid-template-columns:1fr}}
@media print{body{max-width:none;margin:0}.entry{break-inside:avoid-page}}
"""


def build():
    parts = []
    parts.append("<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">")
    parts.append("<title>Reviewer feedback and fixes</title><style>" + CSS + "</style></head><body>")
    parts.append("<h1>Reviewer feedback and the changes we made</h1>")
    parts.append(
        '<p class="lead">For each comment: the issue in the first build, the reviewer’s feedback, and the fixed screen with the steps to try it. '
        f'Live prototype: <a href="{LIVE}">{LIVE}</a>.</p>'
    )
    parts.append(
        '<div class="callout"><strong>How to read this.</strong> <em>First build</em> is the version the reviewers saw (Oct 10). '
        "<em>After</em> is the current version (Oct 12). Screenshots are cropped to the part of the screen the comment is about, and are inside this file, so it works on its own. "
        "Venue settings in the prototype last for the current browser tab only. Live links work once the latest changes are deployed.</div>"
    )
    rows = "".join(
        f'<tr><td><a href="#item-{i}">{i}</a></td><td>{esc(e["title"])}</td><td>{esc(e["where"])}</td><td>{esc(e["who"])}</td></tr>'
        for i, e in enumerate(ENTRIES, 1)
    )
    parts.append(f"<table><thead><tr><th>#</th><th>Change</th><th>Screen</th><th>From</th></tr></thead><tbody>{rows}</tbody></table>")
    for i, e in enumerate(ENTRIES, 1):
        tall = e["before"][0] in ("e7_before",)
        parts.append(f'<section class="entry{" wide" if tall else ""}" id="item-{i}">')
        parts.append(f'<h2>{i}. {esc(e["title"])}</h2>')
        parts.append(f'<p class="meta"><span class="tag">{esc(e["where"])}</span>{esc(e["who"])}</p>')
        parts.append(f'<div class="block"><h3>Issue in the first build</h3><p>{esc(e["issue"])}</p></div>')
        parts.append(f'<div class="block"><h3>Feedback</h3><blockquote>{esc(e["feedback"])}</blockquote></div>')
        parts.append('<div class="compare">')
        parts.append('<div class="col before"><h3>First build</h3>' + "".join(figure(c) for c in e["before"]) + "</div>")
        parts.append('<div class="col after"><h3>After the feedback</h3>' + "".join(figure(c) for c in e["after"]) + "</div>")
        parts.append("</div>")
        parts.append('<div class="block"><h3>Workflow after the feedback</h3><ol>' + "".join(f"<li>{esc(s)}</li>" for s in e["steps"]) + "</ol>")
        path, label = e["live"]
        parts.append(f'<p class="live"><a href="{LIVE}{path}">Open live: {esc(label)}</a></p>')
        parts.append(f'<p class="changed">Changed in: {esc(e["changed"])}</p></div>')
        parts.append("</section>")
    parts.append("</body></html>")
    out = os.path.join(REPO, "html", "feedback-changes.html")
    open(out, "w", encoding="utf8").write("".join(parts))
    return out, os.path.getsize(out)


if __name__ == "__main__":
    print(*build())
