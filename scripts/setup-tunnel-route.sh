#!/usr/bin/env bash
set -euo pipefail

# Add showroom.istayintek.com route to Cloudflare tunnel config
# The tunnel config is in a ConfigMap in the cfd namespace

HOSTNAME="showroom.istayintek.com"
SERVICE="http://pc-showroom-app.pc-showroom.svc.cluster.local:80"

echo "[tunnel] Adding route: $HOSTNAME -> $SERVICE"

# Get current config
CURRENT=$(kubectl get configmap rke2mgmtonly-cfd-cloudflare-tunnel -n cfd -o jsonpath='{.data.config\.yaml}')

# Check if route already exists
if echo "$CURRENT" | grep -q "$HOSTNAME"; then
  echo "[tunnel] Route for $HOSTNAME already exists"
  exit 0
fi

# Insert new route before the catch-all 404
NEW_ROUTE="  - hostname: ${HOSTNAME}\n    service: ${SERVICE}"
UPDATED=$(echo "$CURRENT" | sed "/service: http_status:404/i\\${NEW_ROUTE}")

# Patch the configmap
kubectl create configmap rke2mgmtonly-cfd-cloudflare-tunnel \
  --from-literal="config.yaml=$UPDATED" \
  -n cfd --dry-run=client -o yaml | kubectl apply -f -

# Restart cloudflared to pick up new config
kubectl rollout restart deployment -n cfd
echo "[tunnel] Cloudflare tunnel updated and restarted"
