# Shared development: Mac headquarters and Interface

This project has ONE shared source repository and ONE Site identity:
`appgprj_6af6c8c19f688191ad390379f609fcc2`.
The Mac headquarters and the browser Interface chat both develop this same project.

## Before any development session

Read `.openai/hosting.json`, reuse its exact Site ID, and follow the Sites skill's existing-source opening workflow. Get the Site and a fresh source credential; open/pull its repository with the source helper before editing. The source repository's current HEAD is authoritative, not the last build remembered in chat. Never create a replacement Site for this project.

On the Mac, headquarters additionally uses `sync_project.py` in the parent workspace. It receives fresh credentials through hidden stdin, records `SYNC_STATE.json`, and refuses uncommitted/divergent source rather than overwriting it. Local Mac OCR/vision services, original photos, prepared briefs, Generated stories and pairing keys are separate runtime data; do not copy cloud repository files over those services.

## During and after work

- Keep one writer to shared source at a time. Check/pull again at handoff and before packaging. If the remote advanced, preserve and reconcile changes before pushing. No force-push or blind reset.
- Push the exact tested source commit, save a matching version/archive, then deploy using the existing Site and audience. Confirm the successful deployment and report its actual version/URL. Do not equate a pushed draft or saved version with a published release.
- A Mac local-play mirror may install only assets matching a successfully deployed source commit. Newer unpublished source can be used for development without replacing the last verified local playable release.
- Interface updates become available to the Mac through the same repository. Mac updates become available to Interface by the same pre-development open/pull step. Chat messages themselves are not shared source or synchronization.
- Record chapter-specific decisions in their story workspace. Shared architecture/settings belong in headquarters. The user has authorized story chats only for genuinely new/changed picture content; empty synchronization checks create no chat or sidebar section.

The Mac checks shared release metadata when an actual development/modification session starts and before publishing. There is no hourly Site synchronization; a local intake queue check with no work performs no source synchronization. Credentials are ephemeral; never store them in source, config, scripts, logs or prompts. An unavailable Mac/app/network/authorization delays synchronization; never claim an offline copy is current without a successful check.

Browser-local progress/preferences are distinct from source version synchronization. Preserve them; do not reset them as part of a source update.
