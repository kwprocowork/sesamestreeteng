#!/bin/bash
label=com.littlestreet.storymaker
launchctl bootout "gui/$(id -u)/$label" 2>/dev/null || true
rm -f "$HOME/Library/LaunchAgents/$label.plist"
echo "Automatic scanning stopped. Your pictures, chapters, and game remain in place."
