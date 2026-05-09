#!/usr/bin/env python3
"""
Download Wikimedia Commons images for remaining 22 models.
Uses the Commons API to find CC-licensed images, then downloads them.
Waits 3s between requests to avoid rate limiting.
"""
import json
import os
import subprocess
import sys
import time
import re

ASSETS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "assets")
os.makedirs(ASSETS, exist_ok=True)

# Each entry: (search_query, slug, filename_fallback)
MODELS = [
    ("BMW M Hybrid V8", "bmw-m-hybrid-v8"),
    ("Audi RS 3 8Y", "audi-rs-3"),
    ("Audi RS 6 Avant C8", "audi-rs-6-avant"),
    ("Lamborghini Huracan Performante", "lamborghini-huracan-performante"),
    ("Lamborghini Huracan STO", "lamborghini-huracan-sto"),
    ("Lamborghini Huracan GT3", "lamborghini-huracan-gt3-evo2"),
    ("Nissan GT-R R35", "nissan-gt-r-r35"),
    ("Nissan GT-R NISMO", "nissan-gt-r-nismo"),
    ("Nissan Z RZ34", "nissan-z"),
    ("Ferrari 488 Pista", "ferrari-488-pista"),
    ("Ferrari SF90 Stradale", "ferrari-sf90-stradale"),
    ("Ferrari 499P", "ferrari-499p"),
    ("Volkswagen Golf GTI Mk1", "volkswagen-golf-gti-mk1"),
    ("Volkswagen Golf GTI Clubsport", "volkswagen-golf-gti-clubsport"),
    ("Volkswagen Golf R Mk8", "volkswagen-golf-r"),
    ("Volkswagen ID R", "volkswagen-id-r"),
    ("Lexus LFA", "lexus-lfa"),
    ("Lexus LFA Nurburgring Package", "lexus-lfa-nurburgring-package"),
    ("Lexus RC F Track Edition", "lexus-rc-f-track-edition"),
    ("Lexus LC 500", "lexus-lc-500"),
    # These were already downloaded but failed due to wrong URL
    ("Ferrari 458 Italia", "ferrari-458-italia"),
]

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"


def curl(url, timeout=15):
    """Make curl request and return stdout."""
    try:
        result = subprocess.run(
            ["curl", "-s", "-A", UA, "-m", str(timeout), url],
            capture_output=True, text=True, timeout=timeout + 5
        )
        return result.stdout
    except Exception as e:
        print(f"    curl error: {e}", file=sys.stderr)
        return ""


def curl_download(url, filepath, timeout=30):
    """Download file with curl."""
    try:
        result = subprocess.run(
            ["curl", "-sL", "-A", UA, "-m", str(timeout), "-o", filepath, url],
            capture_output=True, timeout=timeout + 5
        )
        return result.returncode == 0
    except Exception as e:
        print(f"    download error: {e}", file=sys.stderr)
        return False


def api_search(query):
    """Search Wikimedia Commons for images."""
    q = f'"{query}" filetype:bitmap -poster -drawing -logo -diagram -icon -cutaway'
    encoded = q.replace(" ", "%20").replace('"', "%22")
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={encoded}&srnamespace=6&format=json&srlimit=10"
    result = curl(url)
    try:
        data = json.loads(result)
        return [r["title"] for r in data.get("query", {}).get("search", [])]
    except (json.JSONDecodeError, KeyError, TypeError):
        return []


def api_image_info(title):
    """Get license and URL for a file."""
    t = title.replace(" ", "_")
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={t}&prop=imageinfo&iiprop=url%7Cextmetadata&format=json"
    result = curl(url)
    try:
        data = json.loads(result)
        pages = data.get("query", {}).get("pages", {})
        for pid, page in pages.items():
            info = page.get("imageinfo", [{}])[0]
            ext = info.get("extmetadata", {}) or {}
            lic = (ext.get("LicenseShortName", {}) or {}).get("value", "") or ""
            img_url = info.get("url", "")
            artist = (ext.get("Artist", {}) or {}).get("value", "") or ""
            return {"url": img_url, "license": lic, "artist": artist}
    except (json.JSONDecodeError, KeyError, TypeError) as e:
        print(f"    JSON error: {e}", file=sys.stderr)
        return None
    return None


def download(search_term, slug):
    """Find and download one image."""
    filename = f"{slug}.jpg"
    filepath = os.path.join(ASSETS, filename)

    if os.path.exists(filepath) and os.path.getsize(filepath) > 2000:
        print(f"  SKIP (exists, {os.path.getsize(filepath):,} bytes)")
        return True

    print(f"\n▶ Searching: {search_term}")
    titles = api_search(search_term)
    if not titles:
        print(f"  No search results")
        return False

    time.sleep(1.0)

    for idx, title in enumerate(titles[:8]):
        low = title.lower()
        if any(x in low for x in ["drawing", "logo", "diagram", "icon", "render", "theoretical", "cutaway"]):
            continue

        print(f"  [{idx+1}] Checking {title.split(':')[-1][:50]}...")
        info = api_image_info(title)
        time.sleep(1.0)

        if not info or not info["url"]:
            continue

        lic = info["license"].lower()
        if not any(x in lic for x in ["cc by", "cc0", "public domain", "creative commons"]):
            print(f"      License: {info['license']} (skip)")
            continue

        print(f"      ✓ {info['license']}")

        print(f"      Downloading...")
        ok = curl_download(info["url"], filepath, timeout=60)
        if ok and os.path.exists(filepath) and os.path.getsize(filepath) > 2000:
            print(f"      ✓ Saved {filename} ({os.path.getsize(filepath):,} bytes)")
            return True
        else:
            print(f"      ✗ Download failed, trying next...")
            time.sleep(0.5)

    return False


def main():
    ok, fail = 0, 0
    start = time.time()

    for search_term, slug in MODELS:
        result = download(search_term, slug)
        if result:
            ok += 1
        else:
            fail += 1

        # Critical delay - wait 3-5 seconds between cars
        delay = 3.0
        print(f"  ⏳ Waiting {delay}s...")
        time.sleep(delay)

    elapsed = time.time() - start
    print(f"\n{'='*50}")
    print(f"Done: {ok} downloaded, {fail} failed ({elapsed:.0f}s)")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
