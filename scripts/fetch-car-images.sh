#!/usr/bin/env bash
# Batch download Wikimedia Commons CC-licensed car images
# Usage: cd src/assets && bash ../../scripts/fetch-car-images.sh

set -e

MODELS=(
  "BMW M4 CSL:bmw-m4-csl"
  "BMW M5 CS:bmw-m5-cs"
  "BMW E30 M3:bmw-e30-m3"
  "BMW M Hybrid V8:bmw-m-hybrid-v8"
  "Audi R8 LMS GT3:audi-r8-lms-gt3"
  "Audi Sport Quattro S1:audi-sport-quattro-s1"
  "Audi RS 3 8Y:audi-rs-3"
  "Audi RS 6 Avant C8:audi-rs-6-avant"
  "Lamborghini Huracan Performante:lamborghini-huracan-performante"
  "Lamborghini Aventador SVJ:lamborghini-aventador-svj"
  "Lamborghini Huracan STO:lamborghini-huracan-sto"
  "Lamborghini Huracan GT3:lamborghini-huracan-gt3-evo2"
  "Nissan GT-R R35:nissan-gt-r-r35"
  "Nissan GT-R Nismo:nissan-gt-r-nismo"
  "Nissan Skyline GT-R R34:nissan-skyline-gt-r-r34"
  "Nissan Z RZ34:nissan-z"
  "Ferrari 458 Italia:ferrari-458-italia"
  "Ferrari 488 Pista:ferrari-488-pista"
  "Ferrari SF90 Stradale:ferrari-sf90-stradale"
  "Ferrari 499P:ferrari-499p"
  "Volkswagen Golf GTI Mk1:volkswagen-golf-gti-mk1"
  "Volkswagen Golf GTI Clubsport:volkswagen-golf-gti-clubsport"
  "Volkswagen Golf R Mk8:volkswagen-golf-r"
  "Volkswagen ID R:volkswagen-id-r"
  "Lexus LFA:lexus-lfa"
  "Lexus LFA Nurburgring Package:lexus-lfa-nurburgring-package"
  "Lexus RC F Track Edition:lexus-rc-f-track-edition"
  "Lexus LC 500:lexus-lc-500"
)

mkdir -p "$(dirname "$0")/../src/assets"

for entry in "${MODELS[@]}"; do
  search="${entry%%:*}"
  slug="${entry##*:}"
  filename="${slug}.jpg"
  filepath="$(dirname "$0")/../src/assets/${filename}"

  if [ -f "$filepath" ] && [ -s "$filepath" ]; then
    echo "SKIP ${filename} (already exists)"
    continue
  fi

  echo "SEARCH ${search}..."

  # Search Wikimedia Commons with URL-encoded query
  encoded=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${search} filetype:bitmap -poster -drawing -logo'))")

  result=$(curl -s "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encoded}&srnamespace=6&format=json&srlimit=10" 2>/dev/null)

  # Get the first few results and check licenses
  titles=$(echo "$result" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for r in data.get('query', {}).get('search', []):
    print(r['title'])
" 2>/dev/null)

  found=""
  for title in $titles; do
    # Skip if it's a diagram/logo/rendering
    low=$(echo "$title" | tr '[:upper:]' '[:lower:]')
    # Check license
    meta=$(curl -s "https://commons.wikimedia.org/w/api.php?action=query&titles=${title}&prop=imageinfo&iiprop=url%7Cextmetadata&format=json" 2>/dev/null)

    license=$(echo "$meta" | python3 -c "
import json, sys
data = json.load(sys.stdin)
pages = data.get('query', {}).get('pages', {})
for pid, page in pages.items():
    meta = page.get('imageinfo', [{}])[0].get('extmetadata', {})
    lic = meta.get('LicenseShortName', {}).get('value', '')
    print(lic)
" 2>/dev/null)

    # Accept CC BY-SA or CC0
    if echo "$license" | grep -qiE "CC BY|CC0"; then
      url=$(echo "$meta" | python3 -c "
import json, sys
data = json.load(sys.stdin)
pages = data.get('query', {}).get('pages', {})
for pid, page in pages.items():
    info = page.get('imageinfo', [{}])[0]
    print(info.get('url', ''))
" 2>/dev/null)
      if [ -n "$url" ]; then
        found="$url"
        credit=$(echo "$meta" | python3 -c "
import json, sys
data = json.load(sys.stdin)
pages = data.get('query', {}).get('pages', {})
for pid, page in pages.items():
    meta = page.get('imageinfo', [{}])[0].get('extmetadata', {})
    title = page.get('title', '')
    artist = meta.get('Artist', {}).get('value', '')
    lic = meta.get('LicenseShortName', {}).get('value', '')
    print(f'{title}|{artist}|{lic}')
" 2>/dev/null)
        break
    fi
  done

  if [ -z "$found" ]; then
    echo "  NOT FOUND: ${search}"
    continue
  fi

  echo "  FOUND: $found"
  echo "  CREDIT: $credit"

  # Download (use original size by removing /thumb/ from path)
  # The URL from API is already the original
  curl -sL "$found" -o "$filepath" 2>/dev/null

  if [ -f "$filepath" ] && [ -s "$filepath" ]; then
    size=$(stat -f%z "$filepath" 2>/dev/null || stat -c%s "$filepath" 2>/dev/null)
    echo "  SAVED: ${filename} (${size} bytes)"
  else
    echo "  FAILED: ${filename}"
  fi

  # Small delay to be nice to the API
  sleep 0.3
done

echo ""
echo "Done. Files saved to src/assets/"
ls -la "$(dirname "$0")/../src/assets/"*.jpg 2>/dev/null | awk '{print $NF}'
