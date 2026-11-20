Little Street · Mac Story Maker

SET UP ON THE MAC MINI
1. Unzip this kit. Keep game.html beside the installer. Install Python 3.8 or newer and the Ollama app (https://ollama.com/download/mac). Open Ollama. The installer downloads gemma3:4b; allow several GB of disk space. Processing speed depends on your Mac.
2. Open “Install on Mac.command” in Terminal. If Finder does not offer to open it, open Terminal, type bash followed by a space, drag the installer into Terminal, and press Return. Choose the existing Sesame Street Eng folder, KW_PROCOWORK, or the parent where those folders should be created.
3. For the automatically updating live game and iPad, choose y for encrypted sync. This requires GitHub CLI (https://cli.github.com) and your GitHub account with gist permission. Complete the sign-in if asked. No GitHub token goes into the game. Local-only mode uses no GitHub account.
4. For live sync, sign into the private Little Street site first. Open the private link in “Pair this device.txt” on that same browser. Repeat once per device. Anyone with that link and access to the feed can decrypt the chapter text, so send it only to your own devices. Do not paste it into a chat. Existing unpaired browsers keep the original game.

ADD SCHOOL MATERIALS
Inside KW_PROCOWORK/Sesame Street Eng/Source, make one named subfolder per story, for example “A picnic”. Put the photos together in it. Names such as 01.jpg, 02.jpg keep the story order. JPG, PNG, HEIC, HEIF, WEBP and TIFF are accepted if your macOS image converter can read them. Loose images directly in Source also work: newly detected pictures are grouped by scan. Use subfolders for unambiguous batch boundaries.
The watcher checks every minute while the Mac is awake and the installing user is logged in. It waits until the newest picture is at least 75 seconds old before processing. Keep Ollama running or set Ollama to open at login. Generation can take several minutes. If you use a protected or removable folder, allow macOS access when asked and keep the volume mounted. Failed batches retry.
The pictures are processed by the local Ollama model. It proposes a connected story with two to five exploration and speaking turns. The game builds a walk-and-find mission in the existing garden or playroom for each turn. Check proposed sentences in the parent preview before play, especially if book text is hard to read.

PLAY & FINE-TUNE
• Local play: open “Play.html” in Safari or Chrome and choose an adventure. Refresh an already-open local game after generation. “game.html” in the kit is the base game; “Play.html” in your project includes your chapters.
• Live sync: on a paired device, open Choose an adventure. The game checks on entry, on focus, and periodically while the menu is open. Cached chapters remain playable offline after a successful sync. Encrypted text is kept in an unlisted Gist. Source photos are never sent to GitHub. Local copies of chapter JSON and the play page are readable by your user account.
• For changes here: attach the chapter JSON from Generated to this conversation and describe your edits. Replace the same file on the Mac with the revised JSON. The next scan updates the game. Newly added photos in a named batch regenerate that chapter and save the previous JSON under the installer's backups. For a new chapter, use a new subfolder.
• Without sync: send an individual Generated JSON to your iPad and import it from “Parent · Add a Mac story” below the live chapter menu.

CHECK OR STOP
“Story status.txt” shows the last check, number of stories, and problems. If the first scan has not finished, the file may not exist yet. LaunchAgent errors are in ~/Library/Application Support/Little Street Story Maker/errors.log.
Run “Stop watcher.command” to turn off automatic checks. Rerun the installer to resume. Your Source pictures and Generated chapters stay in the project folder. To revoke a shared pairing link, delete its Gist, remove gist from config.json and remove pair.key in the application support folder while stopped, then reinstall and re-pair.
