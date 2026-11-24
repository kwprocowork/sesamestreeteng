# Sesame Street English Game

Read DESIGN.md before designing or changing a story.

Read SYNC_PROTOCOL.md before editing. Mac headquarters and the browser Interface chat share this same Site repository. Open/pull the latest shared source through the Sites skill before development and before publication; preserve conflicting edits. Never use an old chat snapshot as the source base.

The user's standing direction is immersive play in the master 3D game. Learning missions must happen through walking to characters/objects and interacting with them in the shared world. Do not replace gameplay with a new window, worksheet, human diagram, or separate task panel. Use the existing dock for dialogue, optional pronunciation models, and nearby parent approval. Parent setup, journals, and post-game rewards may use panels. Stories need movement, missions, animation, and a reason to explore, rather than a sequence of word/sentence exercises.

Preserve parent word selection, manual speaking approval, notes, sticker rewards, wardrobe, saved progress, and mandatory character selection unless the user requests otherwise. Left and right refer to the character's own anatomical sides.

Story NPCs must differ from the player’s chosen character. Vary the guide between adventures; update its portrait, dialogue and narration consistently. In particular, do not show Rosita as a story NPC when the player is Rosita. The implemented Phonics chapter and its audio fallback are documented in PHONICS_DESIGN.md. Never substitute a letter-name TTS reading for an isolated phoneme; use a parent-checked clip or explicit parent modelling.


Every verified release must also update the existing public game at https://kwprocowork.github.io/sesamestreeteng/dist/ using the Mac headquarters `install_synced_game.py` / `github_mirror.py --check` workflow. The user explicitly authorizes these ongoing updates to kwprocowork/sesamestreeteng. Preserve private runtime material and credentials; no idle/hourly source polling, no force-push. Confirm Pages deployment before reporting the public page updated.

Narration uses locally baked Kokoro American-English clips. After changing public dialogue, run `tools/bake_voices.py` with the Mac headquarters `.voice-venv` Python; unchanged clips are cached. Ship only generated public game recordings and their manifest, never model weights or private photos/text. Narration, player demos, shorter practice models, NPC replies and repeat playback must all use af_heart recordings. Never substitute browser/device speech. Extend tools/voice-lines.mjs for dynamic public lines and pass verify-voice-coverage.mjs before publication. If recordings fail, preserve captions and offer retry with the same voice; retain interruption, mute, parent acceptance, music ducking and checked isolated phoneme recordings.


New story interactions must use the shared TaskCamera. Register actual prop/NPC focus, approach, size and subjects in storyTaskFocus. Walking near a task must never hide the player or trigger a camera turn. Selecting a nearby task uses a slightly wider, nearly horizontal two-shot with player and NPC/prop on opposite sides. Keep both visible, retain manual camera controls and proximity requirements, and resume normal exploration after the task/animation. Never omit characters during rendering to clear the view. Preserve parent speaking approval. Check portrait and landscape framing and direct interaction rays.


## Latest universal design — short, gentle pattern adventures (November 2026)

This supersedes earlier requirements for 5–10 minutes, a separate oral gate at every event, and mandatory 2–3 sentence free talk. Default to THREE meaningful world actions per visit, with a maximum of four. If the source offers more activities, choose a varied subset for replay; keep necessary story context and the ending through brief animation/dialogue. Target normal play within about three minutes, without a speaking countdown or forced cutoff.

Use ONE simple sentence pattern per game, repeated with small vocabulary substitutions. Keep its model visible and use the same af_heart voice. The child may try or skip each practice and continue immediately; do not require parent approval after each turn. Finish with one easy show-and-tell sentence and an optional second sentence. A nearby parent accepts only this final show-and-tell. Skipping practice must not reduce XP or be recorded as a pronunciation failure.

Make scenes open, spacious and lively: connected outdoor paths, open pavilions, several cute original NPCs, playful short animations and visible consequences. Allow direct object selection and tap-to-walk as well as movement controls. Avoid repetitive multi-tap chores, precise arrival gates, wrong-answer loops, and compulsory trips between the same stations. Keep the selected player visible; compose selected tasks side by side and preserve stable food taps, drag/pinch control and reduced-motion support. Preserve wardrobe, selected words, progress, notes, rewards, private runtime data and all existing chapter identities. Source story references remain factual; label invented supporting play separately.
