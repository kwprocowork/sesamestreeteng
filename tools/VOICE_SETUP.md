# Mac-prepared game narration

The headquarters workspace contains `.voice-venv` and `.voice-models` beside this checkout. They are private local build tools, not public game assets. On the Mac, run:

```
../.voice-venv/bin/python tools/bake_voices.py
```

Requirements used: kokoro-onnx 0.6.1, soundfile 0.14.0, tree-sitter 0.26.1, tree-sitter-javascript 0.25.0; macOS afconvert with AAC encoding. Install into an isolated environment. Obtain model files from the upstream setup example: https://github.com/thewh1teagle/kokoro-onnx/blob/main/examples/save.py (kokoro-v1.0.onnx and voices-v1.0.bin, model-files-v1.1 release). Do not put the model files or environment into source control.

Model: https://huggingface.co/hexgrad/Kokoro-82M (Apache 2.0). Engine: https://github.com/thewh1teagle/kokoro-onnx (MIT). Voice: af_heart, American English. Model synthesis is not human performance and does not clone the game characters' actors.

Only generated public-source recordings under dist/assets/narration and narration-manifest.json are deployed. Recordings are content cached. Unchanged lines cost no regeneration; dynamic/new text has device speech fallback until the next local bake. Do not feed private user notes, school source pictures, pairing strings or credentials into the public narration library.
