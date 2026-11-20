#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
if [[ "$(uname -s)" != Darwin ]]; then echo "Run this installer on your Mac mini."; exit 1; fi
umask 077
echo "Choose the folder that contains KW_PROCOWORK, or choose KW_PROCOWORK or Sesame Street Eng itself."
base="$(osascript -e 'POSIX path of (choose folder with prompt "Choose the parent folder, KW_PROCOWORK, or Sesame Street Eng")')"
base="${base%/}"
case "$(basename "$base")" in
 "Sesame Street Eng") project="$base" ;;
 "KW_PROCOWORK") project="$base/Sesame Street Eng" ;;
 *) project="$base/KW_PROCOWORK/Sesame Street Eng" ;;
esac
mkdir -p "$project/Source" "$project/Generated"
app="$HOME/Library/Application Support/Little Street Story Maker"
mkdir -p "$app" "$HOME/Library/LaunchAgents"
py="$(command -v python3 || true)"
if [[ -z "$py" ]] || ! "$py" -c 'import sys; assert sys.version_info >= (3,8)' ; then echo "Install Python 3.8 or newer and run this installer again."; exit 1; fi
if ! command -v ollama >/dev/null; then echo "Install Ollama from https://ollama.com/download/mac and open it, then rerun this installer."; exit 1; fi
if ! ollama list >/dev/null 2>&1; then open -a Ollama; for i in {1..20}; do sleep 1; ollama list >/dev/null 2>&1 && break; done; fi
ollama pull gemma3:4b
echo "Optional iPad sync uploads encrypted chapter text to an unlisted GitHub Gist using your GitHub account. Pictures stay on this Mac."
read -r -p "Enable encrypted sync? [y/N] " sync
gh_path=""
if [[ "$sync" == [Yy]* ]]; then
 gh_path="$(command -v gh || true)"
 if [[ -z "$gh_path" ]]; then echo "Install GitHub CLI from https://cli.github.com, then rerun."; exit 1; fi
 "$gh_path" auth status --hostname github.com || "$gh_path" auth login --hostname github.com --web --scopes gist
 "$py" -m venv "$app/venv"
 "$app/venv/bin/python" -m pip install cryptography
 py="$app/venv/bin/python"
fi
cp watcher.py game.html "$app/"
"$py" - "$app" "$project" "$gh_path" <<'PY'
from pathlib import Path
import json,os,plistlib,sys
app,root=map(Path,sys.argv[1:3]);config=app/"config.json"
current=json.loads(config.read_text()) if config.exists() else {}
current.update(root=str(root),gh=sys.argv[3]);config.write_text(json.dumps(current))
label="com.littlestreet.storymaker"
agent={"Label":label,"ProgramArguments":[sys.executable,str(app/"watcher.py")],"RunAtLoad":True,"StartInterval":60,
"StandardOutPath":str(app/"activity.log"),"StandardErrorPath":str(app/"errors.log"),"EnvironmentVariables":{"PATH":os.environ["PATH"]}}
(Path.home()/"Library/LaunchAgents"/(label+".plist")).write_bytes(plistlib.dumps(agent))
PY
label=com.littlestreet.storymaker
domain="gui/$(id -u)"
launchctl bootout "$domain/$label" 2>/dev/null || true
launchctl bootstrap "$domain" "$HOME/Library/LaunchAgents/$label.plist"
echo "Installed. Put pictures in $project/Source. Open Play.html after the first scan. For sync, open the link in Pair this device.txt once on each device."
open "$project"
