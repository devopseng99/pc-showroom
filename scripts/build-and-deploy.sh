#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
IMAGE="localhost/pc-showroom:latest"
NS="pc-showroom"
WORKER="mgplcb05"
SSH_KEY="$HOME/.ssh/id_rsa_devops_ssh"

log() { echo "[$(date '+%H:%M:%S')] $*"; }

# --- 1. Build ---
log "Building container image..."
cd "$ROOT"
podman build -t "$IMAGE" .

# --- 2. Export and import to RKE2 containerd on worker ---
log "Exporting image..."
TARBALL="/tmp/pc-showroom-image.tar"
podman save -o "$TARBALL" "$IMAGE"

log "Importing to RKE2 containerd on $WORKER..."
scp -i "$SSH_KEY" "$TARBALL" "$WORKER:/tmp/"
ssh -i "$SSH_KEY" "$WORKER" "sudo ctr -a /run/k3s/containerd/containerd.sock -n k8s.io images import /tmp/pc-showroom-image.tar && rm /tmp/pc-showroom-image.tar"
rm -f "$TARBALL"

# --- 3. Provision PG data dir ---
log "Provisioning PostgreSQL data directory on $WORKER..."
ssh -i "$SSH_KEY" "$WORKER" "sudo mkdir -p /opt/k8s-pers/vol1/showroom-pg && sudo chmod 777 /opt/k8s-pers/vol1/showroom-pg"

# --- 4. Deploy K8s resources ---
log "Applying K8s manifests..."
kubectl apply -f "$ROOT/deploy/namespace.yaml"
kubectl apply -f "$ROOT/deploy/postgres-pv.yaml"
kubectl apply -f "$ROOT/deploy/postgres-secret.yaml"
kubectl apply -f "$ROOT/deploy/postgres-statefulset.yaml"
kubectl apply -f "$ROOT/deploy/rbac.yaml"

# Copy Redis credentials from paperclip-v3
log "Copying Redis credentials..."
kubectl get secret redis-credentials -n paperclip-v3 -o json | \
  jq '.metadata.namespace = "pc-showroom" | del(.metadata.resourceVersion,.metadata.uid,.metadata.creationTimestamp,.metadata.managedFields)' | \
  kubectl apply -f -

# Wait for PG
log "Waiting for PostgreSQL..."
kubectl rollout status statefulset/showroom-pg -n "$NS" --timeout=120s

kubectl apply -f "$ROOT/deploy/app-deployment.yaml"
kubectl apply -f "$ROOT/deploy/app-service.yaml"

# --- 5. Restart app to pick up latest image ---
log "Rolling restart..."
kubectl rollout restart deployment/pc-showroom-app -n "$NS"
kubectl rollout status deployment/pc-showroom-app -n "$NS" --timeout=120s

log "Deployment complete!"
kubectl get pods -n "$NS"
