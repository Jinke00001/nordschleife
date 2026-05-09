#!/usr/bin/env python3
"""Slow batch download of Wikimedia Commons thumbnails.

This version is intentionally slow and careful to avoid rate limits.
It downloads 1200px thumbnails and waits 3-5 seconds between requests.
"""
import json
import urllib.request
import urllib.parse
import urllib.error
import os
import sys
import time
import random

API = "https://commons.wikimedia.org/w/api.php"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

# Models organized as (search_query, slug, suggested_search)
# Using more specific search terms
MODELS = [
    ("BMW M Hybrid V8", "bmw-m-hybrid-v8"),
    ("Audi RS 3 8Y", "audi-rs-3"),
    ("Audi RS 6 Avant C8", "audi-rs-6-avant"),
    ("Lamborghini Huracan Performante", "lamborghini-huracan-performante"),
    ("Lamborghini Aventador SVJ", "lamborghini-aventador-svj"),
    ("Lamborghini Huracan STO", "lamborghini-huracan-sto"),
    ("Lamborghini Huracan GT3", "lamborghini-huracan-gt3-evo2"),
    ("Nissan GT-R R35", "nissan-gt-r-r35"),
    ("Nissan GT-R NISMO", "nissan-gt-r-nismo"),
    ("Nissan Z RZ34", "nissan-z"),
    ("Ferrari 458 Italia", "ferrari-458-italia"),
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
]

ASSETS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "assets")
os.makedirs(ASSETS_DIR, exist_ok=True)


def make_request(url, retries=3):
    """Make an HTTP request with retry and exponential backoff."""
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.read()
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = (5 ** attempt) + random.uniform(0, 3)
                print(f"    429 - waiting {wait:.0f}s...")
                time.sleep(wait)
                continue
            print(f"    HTTP {e.code}: {e.reason}")
            return None
        except (urllib.error.URLError, ConnectionError, OSError) as e:
            if attempt < retries - 1:
                wait = (3 ** attempt) + random.uniform(0, 2)
                print(f"    Connection error, retrying in {wait:.1f}s...")
                time.sleep(wait)
                continue
            print(f"    Failed: {e}")
            return None
    return None


def search_images(query):
    """Search for CC images on Wikimedia Commons."""
    params = urllib.parse.urlencode({
        "action": "query",
        "list": "search",
        "srsearch": f'"{query}" filetype:bitmap -poster -drawing -logo -diagram',
        "srnamespace": 6,
        "srlimit": 15,
        "format": "json",
    })
    data = make_request(f"{API}?{params}")
    if not data:
        return []
    try:
        result = json.loads(data)
        return [r["title"] for r in result.get("query", {}).get("search", [])]
    except (json.JSONDecodeError, KeyError):
        return []


def get_image_info(title):
    """Get license and URL from a file title."""
    params = urllib.parse.urlencode({
        "action": "query",
        "titles": title,
        "prop": "imageinfo",
        "iiprop": "url|extmetadata",
        "format": "json",
    })
    data = make_request(f"{API}?{params}")
    if not data:
        return None
    try:
        result = json.loads(data)
        pages = result.get("query", {}).get("pages", {})
        for pid, page in pages.items():
            info = page.get("imageinfo", [{}])[0]
            meta = info.get("extmetadata", {})
            lic = (meta.get("LicenseShortName", {}) or {}).get("value", "")
            url = info.get("url", "")
            artist = (meta.get("Artist", {}) or {}).get("value", "")
            return {"url": url, "license": lic, "artist": artist, "title": page.get("title", "")}
    except (json.JSONDecodeError, KeyError):
        return None
    return None


def make_thumbnail_url(original_url, width=1200):
    """Convert Wikimedia full-res URL to thumbnail URL."""
    if "/commons/" not in original_url:
        return original_url
    idx = original_url.index("/commons/")
    base = original_url[idx:]
    parts = base.rsplit("/", 1)
    filename = parts[1]
    thumb_path = parts[0] + "/thumb/" + filename
    return f"{original_url[:idx]}{thumb_path}/{width}px-{filename}"


def process_model(search_term, slug, filename):
    """Search and download one model's image. Returns True on success."""
    print(f"\n{'='*60}")
    print(f"SEARCH {search_term}")
    print(f"{'='*60}")

    # Step 1: Search
    titles = search_images(search_term)
    if not titles:
        print(f"  No search results")
        return False
    print(f"  Found {len(titles)} results")
    time.sleep(1.0)

    # Step 2: Find CC-licensed image
    for idx, title in enumerate(titles[:10]):
        low = title.lower()
        if any(x in low for x in ["logo", "drawing", "diagram", "icon", "render", "theoretical", "cutaway"]):
            continue

        info = get_image_info(title)
        time.sleep(1.0)
        if not info:
            continue

        lic = info["license"].lower()
        if not any(x in lic for x in ["cc by", "cc0", "public domain", "creative commons"]):
            continue

        print(f"  ✅ [{idx+1}] {title}")
        print(f"     License: {info['license']}")
        print(f"     Artist: {info['artist'][:60]}")

        # Step 3: Download thumbnail
        thumb_url = make_thumbnail_url(info["url"])
        filepath = os.path.join(ASSETS_DIR, filename)

        data = make_request(thumb_url)
        if data and len(data) > 2000:
            with open(filepath, "wb") as f:
                f.write(data)
            print(f"     SAVED {filename} ({len(data):,} bytes)")
            return True
        else:
            # Try original URL as fallback
            print(f"     Thumbnail failed, trying full-res...")
            data = make_request(info["url"])
            if data and len(data) > 2000:
                with open(filepath, "wb") as f:
                    f.write(data)
                print(f"     SAVED {filename} ({len(data):,} bytes)")
                return True
            print(f"     Download failed for this image, trying next...")
            time.sleep(0.5)

    return False


def main():
    success = 0
    failed = 0

    for search_term, slug in MODELS:
        filename = f"{slug}.jpg"
        filepath = os.path.join(ASSETS_DIR, filename)

        # Skip existing valid images
        if os.path.exists(filepath) and os.path.getsize(filepath) > 2000:
            print(f"SKIP {filename} (exists, {os.path.getsize(filepath):,} bytes)")
            success += 1
            continue

        if process_model(search_term, slug, filename):
            success += 1
        else:
            failed += 1
            print(f"  ❌ FAILED: {search_term}")

        # Critical: long delay between models to avoid rate limits
        wait = 3 + random.uniform(0, 2)
        print(f"  Waiting {wait:.0f}s before next model...")
        time.sleep(wait)

    print(f"\n{'='*60}")
    print(f"RESULT: {success} total, {failed} failed")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
