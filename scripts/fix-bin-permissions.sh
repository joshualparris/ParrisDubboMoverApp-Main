#!/usr/bin/env sh
# Fix execute permissions for node_modules/.bin on Unix systems
set -e
if [ -d "node_modules/.bin" ]; then
  echo "Setting +x on node_modules/.bin/*"
  chmod -v +x node_modules/.bin/* || true
else
  echo "No node_modules/.bin directory found. Run npm install first."
fi
