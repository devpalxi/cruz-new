import base64, re, os, json

ROOT = r"D:\DN-75\Edu\DN\Palxi\Cruz-Money-2\cruz\html"
LIVE = "https://cruz-new.vercel.app"

# screenshot name -> (caption, live path)
SHOTS = {
    "01-venues-admin": ("Venues list as an Admin (edit icon shows on hover)", "/admin/venues"),
    "02-venues-super-admin": ("Venues list as a Super Admin, with the Client column", "/admin/venues?role=super-admin"),
    "03-venue-settings-all-on": ("Venue Settings: Funds Transfer, Payment File for Your Bank with Venue Code, and Cheque with who enters the details", "/admin/venues/riverside-rsl-club?role=super-admin"),
    "04-venue-settings-cheque-needs-mode": ("Saving with Cheque on and no choice of who enters the details shows a message", "/admin/venues/northside-sports-club?role=super-admin"),
    "05-venue-settings-saved": ("Settings saved: confirmation message shown", "/admin/venues/northside-sports-club?role=super-admin"),
    "06-venue-no-access": ("An Admin opening another client's venue sees an access message", "/admin/venues/harbourview-hotel"),
    "07-collector-how-rest-is-paid": ("Collector: Payment Breakdown with the venue's available ways to pay the rest", "/collector/payment-breakdown"),
    "08-collector-payment-file-details-errors": ("Collector: Payment File for Your Bank details with messages for missing or invalid fields", "/collector/payment-breakdown"),
    "09-collector-cheque-collector-only": ("Collector: Cheque details when the Collector enters them (both required)", "/collector/payment-breakdown"),
    "10-collector-cheque-authoriser-only": ("Collector: Cheque when the Authoriser enters the details (nothing to enter)", "/collector/payment-breakdown"),
    "11-collector-cheque-both": ("Collector: Cheque when both enter the details (fields optional)", "/collector/payment-breakdown"),
    "12-collector-method-no-longer-available": ("Collector: the chosen method has since been switched off at the venue", "/collector/payment-breakdown"),
    "13-authoriser-funds-transfer": ("Authoriser review: Funds Transfer payout", "/authoriser/payout?scenario=funds-transfer"),
    "14-authoriser-payment-file": ("Authoriser review: Payment File for Your Bank payout", "/authoriser/payout?scenario=payment-file"),
    "15-authoriser-cheque-collector-only": ("Authoriser review: cheque details entered by the Collector, read-only", "/authoriser/payout?scenario=cheque-collector"),
    "16-authoriser-cheque-authoriser-only": ("Authoriser review: the Authoriser enters the cheque details; Authorise stays off until done", "/authoriser/payout?scenario=cheque-authoriser"),
    "17-authoriser-cheque-both": ("Authoriser review: Collector entered the number; the Authoriser completes the name", "/authoriser/payout?scenario=cheque-both"),
    "18-return-for-correction-dialog": ("Return for Correction asks for a reason", "/authoriser/payout?scenario=cheque-both"),
    "19-approver-payment-file": ("Approver review: Payment File for Your Bank payout", "/approver/payout?scenario=payment-file"),
    "20-approver-cheque-collector-only": ("Approver review: cheque details, read-only", "/approver/payout?scenario=cheque-collector"),
    "21-authoriser-cheque-details-checked": ("Authoriser review: cheque details completed and checked", "/authoriser/payout?scenario=cheque-both"),
    "22-collector-returned-cheque": ("Collector: a returned cheque payout with the reviewer's reason", "/collector/returned-payout?type=cheque"),
    "23-collector-returned-payment-file": ("Collector: a returned Payment File for Your Bank payout with the reviewer's reason", "/collector/returned-payout?type=payment-file"),
    "24-collector-cash-only": ("Collector: cash-only payout, nothing chosen under How the Rest Is Paid", "/collector/payment-breakdown"),
    "25-manual-bank-export-existing": ("Existing Manual Bank export page (built earlier; not yet checked against this story)", "/authoriser/manual-bank-export"),
}

BUILT, PARTLY, EXISTING, NOUI, NOTYET, OUT = "built", "partly", "existing", "noui", "notyet", "out"
LABEL = {
    BUILT: "Built in the prototype",
    PARTLY: "Partly built",
    EXISTING: "Existing page, to be checked against this story",
    NOUI: "No screen needed",
    NOTYET: "Screen not built yet",
    OUT: "Out of scope",
}

MBT = {
    "mbt-01": (BUILT, ["01-venues-admin", "03-venue-settings-all-on"], ""),
    "mbt-02": (BUILT, ["02-venues-super-admin", "03-venue-settings-all-on"], ""),
    "mbt-03": (BUILT, ["03-venue-settings-all-on"], ""),
    "mbt-04": (BUILT, ["03-venue-settings-all-on"], ""),
    "mbt-05": (BUILT, ["05-venue-settings-saved"], ""),
    "mbt-06": (BUILT, ["03-venue-settings-all-on"], "Cancel sits beside Save and puts back the saved values."),
    "mbt-07": (BUILT, ["03-venue-settings-all-on"], "Turning the switch off removes the option for new payouts."),
    "mbt-08": (BUILT, ["14-authoriser-payment-file"], "The review shows the method recorded when the payout was submitted."),
    "mbt-09": (BUILT, ["24-collector-cash-only"], ""),
    "mbt-10": (PARTLY, ["12-collector-method-no-longer-available"], "Shows the message when a saved method is no longer available. Saving and reopening drafts is not modelled in the prototype."),
    "mbt-11": (BUILT, ["08-collector-payment-file-details-errors"], ""),
    "mbt-12": (BUILT, ["14-authoriser-payment-file", "19-approver-payment-file", "18-return-for-correction-dialog", "23-collector-returned-payment-file"], ""),
    "mbt-13": (EXISTING, ["25-manual-bank-export-existing"], ""),
    "mbt-14": (NOUI, [], "Backend rule: no screen."),
    "mbt-15": (EXISTING, [], "The export page is reached from the Authoriser's Manage menu. Not yet checked against this story."),
    "mbt-16": (EXISTING, [], "The export page is reached from the Authoriser's Manage menu. Not yet checked against this story."),
    "mbt-17": (NOTYET, [], ""),
    "mbt-18": (NOTYET, [], ""),
    "mbt-19": (EXISTING, ["25-manual-bank-export-existing"], ""),
    "mbt-20": (EXISTING, ["25-manual-bank-export-existing"], "The held and skipped records are not shown yet."),
    "mbt-21": (EXISTING, ["25-manual-bank-export-existing"], ""),
    "mbt-22": (EXISTING, ["25-manual-bank-export-existing"], ""),
    "mbt-23": (NOUI, [], "Backend rule: no screen."),
    "mbt-24": (NOTYET, [], ""),
    "mbt-25": (EXISTING, ["25-manual-bank-export-existing"], ""),
    "mbt-26": (OUT, [], "CSV customisation is out of scope for now."),
    "mbt-27": (OUT, [], "CSV customisation is out of scope for now."),
    "mbt-28": (NOUI, [], "Notification: no screen in the prototype."),
    "mbt-29": (NOUI, [], "Notification: no screen in the prototype."),
    "mbt-30": (NOUI, [], "Verification story: no screen."),
}
CHE = {
    "che-01": (BUILT, ["02-venues-super-admin", "03-venue-settings-all-on"], ""),
    "che-02": (BUILT, ["03-venue-settings-all-on", "04-venue-settings-cheque-needs-mode"], "This is CRP-326."),
    "che-03": (BUILT, ["03-venue-settings-all-on"], ""),
    "che-04": (BUILT, ["15-authoriser-cheque-collector-only", "16-authoriser-cheque-authoriser-only", "17-authoriser-cheque-both"], "Each review shows who enters the cheque details, as recorded at submission."),
    "che-05": (NOTYET, [], "Super Admin setting."),
    "che-06": (BUILT, ["07-collector-how-rest-is-paid"], "Only the methods switched on for the venue are offered."),
    "che-07": (PARTLY, ["12-collector-method-no-longer-available", "11-collector-cheque-both"], "Optional fields and the unavailable-method message are shown. Saving and reopening drafts is not modelled."),
    "che-08": (BUILT, ["09-collector-cheque-collector-only"], ""),
    "che-09": (BUILT, ["15-authoriser-cheque-collector-only", "18-return-for-correction-dialog"], ""),
    "che-10": (BUILT, ["22-collector-returned-cheque"], ""),
    "che-11": (BUILT, ["10-collector-cheque-authoriser-only", "16-authoriser-cheque-authoriser-only"], ""),
    "che-12": (BUILT, ["16-authoriser-cheque-authoriser-only", "21-authoriser-cheque-details-checked"], ""),
    "che-13": (BUILT, ["11-collector-cheque-both"], ""),
    "che-14": (BUILT, ["17-authoriser-cheque-both", "21-authoriser-cheque-details-checked"], ""),
    "che-15": (BUILT, ["09-collector-cheque-collector-only"], "The cheque name starts as the winner's name."),
    "che-16": (BUILT, ["15-authoriser-cheque-collector-only", "16-authoriser-cheque-authoriser-only"], "Shown in the Payment Method Details section."),
    "che-17": (NOTYET, [], "Name match: next to build."),
    "che-18": (NOTYET, [], "Name match: next to build."),
    "che-19": (NOTYET, [], "Name match: next to build."),
    "che-20": (NOTYET, [], "Name match: next to build."),
    "che-21": (NOTYET, [], "Name match: next to build."),
    "che-22": (NOTYET, [], "Name match: next to build."),
    "che-23": (NOTYET, [], ""),
    "che-24": (NOUI, [], "Backend rule: no screen."),
    "che-25": (NOUI, [], "Backend rule: no screen."),
    "che-26": (NOUI, [], "Notification: no screen in the prototype."),
    "che-27": (NOUI, [], "Notification: no screen in the prototype."),
    "che-28": (NOUI, [], "Verification story: no screen."),
}

CSS = """<!--proto-css-start--><style>
.proto{margin:18px 0 8px;padding:14px 16px;border:1px solid #dfe1e6;border-left:4px solid #0052cc;border-radius:6px;background:#fafbfc}
.proto h3{margin:0 0 8px;font-size:1rem}
.badge{display:inline-block;padding:2px 10px;border-radius:12px;font-size:.82rem;font-weight:600;margin-right:8px}
.badge.built{background:#e3fcef;color:#006644}.badge.partly{background:#fff0b3;color:#7a5200}.badge.existing{background:#deebff;color:#0747a6}
.badge.noui{background:#ebecf0;color:#42526e}.badge.notyet{background:#ffebe6;color:#bf2600}.badge.out{background:#ebecf0;color:#42526e}
.proto figure{margin:14px 0 0}.proto img{max-width:100%;max-height:900px;object-fit:contain;object-position:top;border:1px solid #c1c7d0;border-radius:4px;background:#fff}
.proto figcaption{font-size:.88rem;color:#42526e;margin-top:6px}
.summary td.num{text-align:right;font-variant-numeric:tabular-nums}
@media print{.proto{break-inside:avoid}.proto img{max-height:none}}
</style><!--proto-css-end-->"""


def data_uri(name):
    with open(os.path.join(ROOT, "screenshots", name + ".png"), "rb") as f:
        return "data:image/png;base64," + base64.b64encode(f.read()).decode()


def block(sid, status, shots, note):
    parts = [f'<!--proto-start--><div class="proto" id="proto-{sid}"><h3>Prototype</h3>']
    parts.append(f'<p><span class="badge {status}">{LABEL[status]}</span>{note}</p>')
    for s in shots:
        cap, path = SHOTS[s]
        parts.append(
            f'<figure><img data-shot="{s}" alt="{cap}">'
            f'<figcaption>{cap}. <a href="{LIVE}{path}">Open live</a></figcaption></figure>'
        )
    parts.append("</div><!--proto-end-->")
    return "".join(parts)


def process(fname, stories, other_prefix, other_file, own_file):
    p = os.path.join(ROOT, fname)
    s = open(p, encoding="utf8").read()

    # Strip anything added by an earlier run
    s = re.sub(r"<!--proto-start-->.*?<!--proto-end-->", "", s, flags=re.S)
    s = re.sub(r"<!--proto-css-start-->.*?<!--proto-css-end-->", "", s, flags=re.S)
    s = re.sub(r"<!--proto-js-start-->.*?<!--proto-js-end-->", "", s, flags=re.S)
    s = re.sub(r"<!--proto-summary-start-->.*?<!--proto-summary-end-->", "", s, flags=re.S)

    # Wording and links
    s = s.replace("Payout Destination Details", "Payment Method Details")
    s = s.replace('href="../jira-ready-user-stories.html"', 'href="#"').replace('href="product-spec.html"', 'href="#"')
    s = s.replace(f'href="../{other_prefix}/jira-user-stories.html#', f'href="{other_file}#')
    s = s.replace('href="jira-user-stories.html#', 'href="#')
    s = re.sub(r'<a href="#">([^<]+)</a>', r'', s)

    # Per-story blocks, inserted at the end of each story section
    used = set()
    for sid, (status, shots, note) in stories.items():
        m = re.search(rf'<h2 id="{sid}">', s)
        if not m:
            print("missing", sid)
            continue
        nxt = re.search(r'<h2 id="', s[m.end():])
        end = m.end() + nxt.start() if nxt else s.rindex("</body>")
        s = s[:end] + block(sid, status, shots, note) + s[end:]
        used.update(shots)

    # Summary table after the first heading
    counts = {}
    for status, _, _ in stories.values():
        counts[status] = counts.get(status, 0) + 1
    rows = "".join(
        f'<tr><td><span class="badge {k}">{LABEL[k]}</span></td><td class="num">{counts[k]}</td></tr>'
        for k in (BUILT, PARTLY, EXISTING, NOTYET, NOUI, OUT)
        if k in counts
    )
    summary = (
        '<!--proto-summary-start--><div class="proto"><h3>Prototype coverage</h3>'
        f'<p>Screens for these stories are in the prototype at <a href="{LIVE}">{LIVE}</a>. '
        "Under each story below you will find its status, screenshots and a link to open the screen.</p>"
        f'<div class="table-wrap"><table class="summary"><thead><tr><th>Status</th><th>Stories</th></tr></thead><tbody>{rows}</tbody></table></div>'
        "<p>Screenshots are in the page itself, so this file works on its own.</p></div><!--proto-summary-end-->"
    )
    h1_end = s.index("</h1>") + len("</h1>")
    s = s[:h1_end] + summary + s[h1_end:]

    # Styles in the head, images once in a script at the end
    s = s.replace("</head>", CSS + "</head>", 1)
    images = {name: data_uri(name) for name in sorted(used)}
    js = (
        "<!--proto-js-start--><script>const SHOT_DATA="
        + json.dumps(images)
        + ';document.querySelectorAll("img[data-shot]").forEach(function(i){i.src=SHOT_DATA[i.dataset.shot]});</script><!--proto-js-end-->'
    )
    s = s.replace("</body>", js + "</body>", 1)
    open(p, "w", encoding="utf8").write(s)
    print(fname, "stories:", len(stories), "images:", len(images), "bytes:", len(s))


process("MBT-jira-user-stories.html", MBT, "cheque", "CHE-jira-user-stories.html", "MBT-jira-user-stories.html")
process("CHE-jira-user-stories.html", CHE, "manual-bank-transfer", "MBT-jira-user-stories.html", "CHE-jira-user-stories.html")
