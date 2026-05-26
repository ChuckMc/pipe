#!/usr/bin/env bash
set -euo pipefail

INSTALL_DIR="${INSTALL_DIR:-/usr/local/bin}"
BIN_NAME="pipe"
REPO="cm/pipe"

# Detect platform
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64) ARCH="x64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *) echo "Unsupported arch: $ARCH"; exit 1 ;;
esac

# Since it's a Node.js CLI, we install via npm
if command -v npm &>/dev/null; then
  echo "Installing pipe via npm..."
  npm install -g pipe-cli
  echo ""
  echo "✅ pipe installed! Try it:"
  echo "  echo \"hello world\" | pipe \"translate to French\""
  echo ""
  echo "Don't forget to set your API key:"
  echo "  export ANTHROPIC_API_KEY=your-key-here"
  exit 0
fi

echo "npm not found. Install Node.js first: https://nodejs.org"
exit 1
