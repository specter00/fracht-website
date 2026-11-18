"""Makes the demo files to send around, in _share/:
     Website-Vorschau.pdf  every main page as computer view and phone view (opens on any device)
     Website-Demo.zip      clickable demo for a computer: unzip, double-click index.html

Run from freight-site/:   uv run --with pillow python tools/make-share.py
Needs Node.js and Microsoft Edge (Windows). Builds the demo first (node tools/build-demo.js).
"""
import datetime
import os
import shutil
import subprocess
import tempfile
import time
import urllib.parse
import json
import zipfile
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
DEMO = ROOT / "docs"
DEMO_URL = json.loads(subprocess.run(["node", "-e", "process.stdout.write(JSON.stringify(require('./config.js').site.demo.url || ''))"], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
SHARE = ROOT / "_share"
TMP = Path(tempfile.mkdtemp(prefix="share-"))
PROFILE = Path(tempfile.gettempdir()) / "edge-share-profile"
EDGE = next(p for p in [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
] if os.path.exists(p))

INK = (19, 37, 74)
TINT = (238, 243, 250)
PINK = (207, 22, 106)


def font(size, bold=False):
    names = ["bahnschrift.ttf"] + (["segoeuib.ttf"] if bold else ["segoeui.ttf"]) + ["arial.ttf"]
    for n in names:
        p = Path(r"C:\Windows\Fonts") / n
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()


def state(mode, src, dest, rows):
    return "#s=" + urllib.parse.quote(json.dumps({"m": mode, "f": src, "d": dest, "r": rows}, separators=(",", ":")), safe="")


EXAMPLE = [{"n": "4", "l": "60", "b": "40", "h": "40", "w": "12"}, {"n": "1", "l": "120", "b": "80", "h": "100", "w": "250"}]
PAGES = [
    ("Startseite", "index.html"),
    ("Richtwert-Rechner (Beispielsendung China → Deutschland)", "rechner.html" + state("air", "CN", "DE", EXAMPLE)),
    ("Zoll-FAQ", "export-faq.html"),
    ("Dokumenten-Checkliste", "checkliste.html"),
    ("Anfrage (Angaben aus dem Rechner übernommen)", "anfrage.html" + state("air", "CN", "DE", EXAMPLE)),
]


def edge_shot(url, png, w, h, scale):
    if png.exists():
        png.unlink()
    subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=4000",
                    "--allow-file-access-from-files", f"--user-data-dir={PROFILE}",
                    f"--force-device-scale-factor={scale}", f"--window-size={w},{h}",
                    f"--screenshot={png}", url], check=True, timeout=180,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    last = -1
    for _ in range(240):  # Edge can return before the file is fully written
        time.sleep(0.5)
        if png.exists():
            size = png.stat().st_size
            if size > 0 and size == last:
                break
            last = size
    return Image.open(png).convert("RGB")


def content_bottom(im):
    bb = ImageChops.difference(im, Image.new("RGB", im.size, (255, 255, 255))).getbbox()
    return bb[3] if bb else 0


def desktop(url):
    im = edge_shot(url, TMP / "d.png", 1440, 10000, 1)
    return im.crop((0, 0, 1440, min(im.size[1], content_bottom(im) + 24)))


WRAP = TMP / "m.html"
WRAP.write_text("""<!doctype html><meta charset=utf-8><style>html,body{margin:0;background:#fff;overflow:hidden}
#f{border:0;display:block;width:375px;height:16000px}</style><iframe id=f></iframe><script>
const p=new URLSearchParams(location.search),f=document.getElementById('f');
f.style.marginTop='-'+(p.get('o')||0)+'px';f.src=p.get('u');</script>""", encoding="utf-8")


def phone(url):
    seg, parts = 1400, []
    for off in range(0, 16000, seg):
        wrap = WRAP.as_uri() + "?o=" + str(off) + "&u=" + urllib.parse.quote(url, safe="")
        m = edge_shot(wrap, TMP / "m.png", 600, seg, 2).crop((0, 0, 750, seg * 2))
        if content_bottom(m) == 0:  # first fully blank segment: the page has ended
            break
        parts.append(m)
    if parts:  # trim only the last segment; white gaps inside the page are real spacing
        last = parts[-1]
        parts[-1] = last.crop((0, 0, 750, min(last.size[1], content_bottom(last) + 40)))
    out = Image.new("RGB", (750, sum(p.size[1] for p in parts)), (255, 255, 255))
    y = 0
    for p in parts:
        out.paste(p, (0, y))
        y += p.size[1]
    return out


def captioned(title, view, shot):
    """1440 px wide page: caption band on top, the screenshot below (phone view centred)."""
    band = 110
    page = Image.new("RGB", (1440, band + shot.size[1] + 60), (255, 255, 255))
    d = ImageDraw.Draw(page)
    d.rectangle((0, 0, 1440, band), fill=TINT)
    d.text((60, 22), title, font=font(40, True), fill=INK)
    d.text((60, 72), view, font=font(24), fill=(70, 86, 111))
    x = (1440 - shot.size[0]) // 2
    if shot.size[0] < 1440:
        d.rectangle((x - 3, band + 27, x + shot.size[0] + 2, band + 30 + shot.size[1] + 2), outline=INK, width=3)
    page.paste(shot, (x, band + 30))
    return page


def cover(today):
    page = Image.new("RGB", (1440, 1018), (255, 255, 255))
    logo = Image.open(DEMO / "assets/img/logo-full.png").convert("RGBA")
    logo = logo.resize((440, int(440 * logo.size[1] / logo.size[0])))
    page.paste(logo, (120, 110), logo)
    d = ImageDraw.Draw(page)
    d.text((120, 380), "Website-Vorschau", font=font(84, True), fill=INK)
    d.text((120, 490), f"Entwurf, Stand {today}", font=font(36), fill=PINK)
    lines = [
        "Fracht zwischen Deutschland und dem Golf, außerdem von und nach China und Indien",
        "",
        "Jede Seite als Computer-Ansicht und als Handy-Ansicht:",
        "Startseite, Richtwert-Rechner, Zoll-FAQ, Dokumenten-Checkliste, Anfrage.",
        "",
        "Pink gestrichelte Felder sind Platzhalter für Angaben, die noch fehlen.",
        "Draft preview: every page shown as computer and phone view; pink boxes are placeholders.",
        "",
        "Klickbare Demo im Browser: " + DEMO_URL,
    ]
    y = 590
    for ln in lines:
        d.text((120, y), ln, font=font(28), fill=INK if ln and not ln.startswith("Draft") else (70, 86, 111))
        y += 44
    return page


def main():
    subprocess.run(["node", str(ROOT / "tools" / "build-demo.js")], check=True, cwd=ROOT, stdout=subprocess.DEVNULL)
    SHARE.mkdir(exist_ok=True)
    today = datetime.date.today().strftime("%d.%m.%Y")

    pages = [cover(today)]
    for title, rel in PAGES:
        url = (DEMO / rel.split("#")[0]).as_uri() + ("#" + rel.split("#", 1)[1] if "#" in rel else "")
        pages.append(captioned(title, "Computer-Ansicht (1440 Pixel breit)", desktop(url)))
        pages.append(captioned(title, "Handy-Ansicht (375 Pixel breit)", phone(url)))
        print("captured", title)

    pdf = SHARE / "Website-Vorschau.pdf"
    pages[0].save(pdf, "PDF", save_all=True, append_images=pages[1:], resolution=144.0, quality=80)

    zpath = SHARE / "Website-Demo.zip"
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(DEMO.rglob("*")):
            if f.is_file():
                z.write(f, "Website-Demo/" + f.relative_to(DEMO).as_posix())

    shutil.rmtree(TMP, ignore_errors=True)
    for f in (pdf, zpath):
        print(f"{f.name}: {f.stat().st_size / 1_000_000:.1f} MB")
    print("pages in PDF:", len(pages), "| tallest page px:", max(p.size[1] for p in pages))


if __name__ == "__main__":
    main()
