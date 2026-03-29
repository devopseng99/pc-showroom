#!/usr/bin/env bash
set -euo pipefail

# Categorize the 94 "Misc" apps based on their names
# This builds a JSON payload and sends it to the bulk-categorize endpoint

BASE="https://showroom.istayintek.com"

categorize() {
  local name="$1"
  local n="${name,,}" # lowercase

  # Travel & Hospitality
  if [[ "$n" =~ (travel|hotel|charter|yacht|rv.rental|glamping|resort|cruise|hostel|safari|wander|nomad|ski.resort|surf.school|rail) ]]; then
    echo "Travel & Hospitality"; return; fi

  # Legal & Compliance
  if [[ "$n" =~ (law|legal|immigra|notary|mediat|compliance|clause|trademark|ip.law|corporate.law) ]]; then
    echo "Legal & Compliance"; return; fi

  # Financial Services
  if [[ "$n" =~ (fintech|exchange|insurance|tax|wealth|lend|expense|payroll|financial|credit.union|coin|pay|factor) ]]; then
    echo "Financial Services"; return; fi

  # Healthcare
  if [[ "$n" =~ (tele|health|mental|pharmacy|dental|veterinary|therapy|nutri|senior|fertility|optometry|derma|sleep|clinic|heal|med|care) ]]; then
    echo "Healthcare"; return; fi

  # Green & Sustainability
  if [[ "$n" =~ (solar|carbon|sustain|eco|farm|compost|green|aqua|recycle|packaging|earth|zero.trace|loop|pure) ]]; then
    echo "Green & Sustainability"; return; fi

  # Media & Publishing
  if [[ "$n" =~ (podcast|game|record|comic|photo|video|animation|magazine|news|print|cast|media|ink|lens|frame|pixel|pulse|folio) ]]; then
    echo "Media & Entertainment"; return; fi

  # Robotics & Hardware
  if [[ "$n" =~ (robo|drone|agri.bot|sim|ros|warehouse|servo|mech|swarm|bot) ]]; then
    echo "Robotics & Hardware"; return; fi

  # SaaS & Developer Tools
  if [[ "$n" =~ (ci.cd|pipe|forge|collab|newsletter|event|board|chart|anomaly|course|merch|clip|fan|commerce) ]]; then
    echo "SaaS & Developer Tools"; return; fi

  # Food & Beverage
  if [[ "$n" =~ (baker|crumble|kitchen|ghost.kitchen|food|chef|restaurant|cafe) ]]; then
    echo "Food & Beverage"; return; fi

  # Real Estate & Property
  if [[ "$n" =~ (property|prop|real.estate|vault) ]]; then
    echo "Real Estate"; return; fi

  # Automotive
  if [[ "$n" =~ (auto|car.wash|detailing) ]]; then
    echo "Automotive"; return; fi

  # Education
  if [[ "$n" =~ (child|storybook|education|learn|school|tutor) ]]; then
    echo "Education"; return; fi

  # Showroom meta
  if [[ "$n" =~ (showroom|paperclip) ]]; then
    echo "Platform"; return; fi

  echo "Misc"
}

echo "Fetching Misc apps..."
APPS=$(curl -s "$BASE/api/apps?limit=500" | jq -r '.apps[] | select(.category == "Misc") | "\(.appId)\t\(.appName)"')

PAYLOAD="["
FIRST=true
RECATEGORIZED=0

while IFS=$'\t' read -r appId appName; do
  cat=$(categorize "$appName")
  if [[ "$cat" != "Misc" ]]; then
    [[ "$FIRST" != "true" ]] && PAYLOAD+=","
    PAYLOAD+="{\"appId\":$appId,\"category\":\"$cat\"}"
    FIRST=false
    RECATEGORIZED=$((RECATEGORIZED + 1))
    printf "  %-40s -> %s\n" "$appName" "$cat"
  else
    printf "  %-40s -> SKIP (still Misc)\n" "$appName"
  fi
done <<< "$APPS"

PAYLOAD+="]"

if [[ $RECATEGORIZED -gt 0 ]]; then
  echo ""
  echo "Sending $RECATEGORIZED category updates..."
  RESULT=$(curl -s -X POST "$BASE/api/apps/bulk-categorize" -H "Authorization: Bearer showroom-admin-2026" \
    -H "Content-Type: application/json" \
    -d "{\"updates\":$PAYLOAD}")
  echo "Result: $RESULT"
else
  echo "No apps to recategorize."
fi
