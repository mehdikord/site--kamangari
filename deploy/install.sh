#!/usr/bin/env bash
# Installs or updates the systemd service from an existing build:
#   npm ci && npm run build && sudo ./deploy/install.sh
set -euo pipefail

APP=kamangiri
ROOT=/opt/$APP
SOURCE="$(cd "$(dirname "$0")/.." && pwd)"
BUILD="$SOURCE/.next/standalone"

fail() { echo "error: $*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || fail "run with sudo"
[[ -f "$BUILD/server.js" && -d "$BUILD/.next/static" ]] || fail "no build found; run 'npm run build' first"

# sudo drops nvm from PATH, and the service cannot read /home, so a system-wide Node is required
NODE="$(readlink -f "${NODE_BIN:-$(command -v node || echo /usr/bin/node)}")"
[[ -x "$NODE" ]] || fail "Node.js not found; install Node 22+ system-wide or pass NODE_BIN=/path/to/node"
case "$NODE" in
  /home/*|/root/*) fail "$NODE is inside a home directory; install Node 22+ system-wide" ;;
esac
MAJOR="$("$NODE" -p 'process.versions.node.split(".")[0]')"
(( MAJOR >= 22 )) || fail "Node 22 or newer is required (found $MAJOR)"

id -u "$APP" >/dev/null 2>&1 || useradd --system --user-group --no-create-home --shell /usr/sbin/nologin "$APP"

RELEASE="$ROOT/releases/$(date +%Y%m%d-%H%M%S)"
install -d -m 755 "$RELEASE"
cp -a "$BUILD/." "$RELEASE/"
chown -R root:root "$RELEASE"
chmod -R u=rwX,go=rX "$RELEASE"
# only the runtime-written parts belong to the service user
install -d "$RELEASE/.next/cache"
chown -R "$APP:$APP" "$RELEASE/.next/cache"

PREVIOUS="$(readlink -f "$ROOT/current" 2>/dev/null || true)"
ln -sfn "$RELEASE" "$ROOT/current"

sed "s#^ExecStart=.*#ExecStart=$NODE server.js#" "$SOURCE/deploy/$APP.service" > "/etc/systemd/system/$APP.service"
systemctl daemon-reload
systemctl enable "$APP"
systemctl restart "$APP"

PORT=3000
HOST=127.0.0.1
if [[ -f /etc/$APP.env ]]; then
  PORT="$(sed -n 's/^PORT=//p' /etc/$APP.env | tail -1)"
  HOST="$(sed -n 's/^HOSTNAME=//p' /etc/$APP.env | tail -1)"
fi
PORT="${PORT:-3000}"
HOST="${HOST:-127.0.0.1}"
[[ "$HOST" == "0.0.0.0" ]] && HOST=127.0.0.1

healthy() {
  systemctl is-active --quiet "$APP" &&
    "$NODE" -e "fetch('http://$HOST:$PORT/robots.txt').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"
}

for _ in $(seq 1 20); do
  sleep 1
  if healthy; then
    # keep the three newest releases for rollback
    find "$ROOT/releases" -mindepth 1 -maxdepth 1 -type d | sort -r | tail -n +4 | xargs -r rm -rf --
    echo "$APP is running on http://$HOST:$PORT"
    exit 0
  fi
done

if [[ -n "$PREVIOUS" && -d "$PREVIOUS" && "$PREVIOUS" != "$RELEASE" ]]; then
  ln -sfn "$PREVIOUS" "$ROOT/current"
  systemctl restart "$APP"
  echo "rolled back to $PREVIOUS" >&2
fi
fail "health check failed; see: journalctl -u $APP -n 100"
