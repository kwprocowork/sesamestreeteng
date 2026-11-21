"""Prepare reusable public game dialogue locally; never read private runtime material.
Run with the headquarters .voice-venv Python. Model files remain Mac-local.
"""
from pathlib import Path
import argparse,ast,hashlib,json,re,subprocess,time

ROOT=Path(__file__).resolve().parents[1]
def normalize(text):
    return re.sub(r'\s+',' ',text.replace('’',"'").replace('‘',"'").replace('…','...')).strip()
def segments(text):
    return [s.strip() for s in re.findall(r'[^.!?]+(?:[.!?]+|$)',normalize(text)) if s.strip()]
def catalog():
    from tree_sitter import Language,Parser
    import tree_sitter_javascript as js
    parser=Parser(Language(js.language()));texts=set()
    for path in (ROOT/'dist').glob('*.js'):
        if path.name in {'narrator.js','sound-models.js'}:continue
        source=path.read_bytes();tree=parser.parse(source)
        def walk(node):
            if node.type in {'string','template_string'}:
                raw=source[node.start_byte:node.end_byte].decode()
                if '${' not in raw:
                    try:text=ast.literal_eval(raw) if raw[0]!='`' else raw[1:-1]
                    except (SyntaxError,ValueError):text=''
                    text=normalize(text)
                    words=re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)?",text)
                    if 3<=len(words)<=65 and not re.search(r'[<>{}=/\\#]|https?:|\b(?:function|const|document|querySelector)\b',text) and re.match(r'[A-Z]',text) and re.search(r'[.!?]',text):
                        texts.update(segments(text))
            for child in node.named_children:walk(child)
        walk(tree.root_node)
    nouns=['apple','ant','ball','butterfly','book','bag','pencil','crayon','cookies','bread','rice','ice cream','juice','milk','bus','car','train','boat','plane','chair','table','bed','toy box','shelf','door','window','cat','dog','rabbit','bird','fish','carrot','head','hair','eyes','ears','nose','mouth','hands','arms','legs','feet']
    for word in nouns:
        article='an' if word[0] in 'aeiou' else 'a'
        texts.add(f'These are {word}.' if word in ['cookies','eyes','ears','hands','arms','legs','feet'] else f'This is {word}.' if word in ['bread','rice','ice cream','juice','milk','hair'] else f'This is {article} {word}.')
        texts.add(f'Where are the {word}?' if word in ['cookies','eyes','ears','hands','arms','legs','feet'] else f'Where is the {word}?')
    for food in ['cookies','bread','rice','ice cream','juice','milk']:
        texts.update([f'Do you want {food}?',f'I want {food}.',f'The baby wants {food}.'])
    for name in ['chair','table','bed','toy box','shelf']:
        for prep in ['under','on','behind','in','next to']:
            texts.add(f'The ball is {prep} the {name}.')
    # Shared guide substitution keeps the audible name consistent with the chosen NPC.
    for text in list(texts):
        if 'Rosita' in text:
            texts.update(text.replace('Rosita',name) for name in ['Grover','Zoe','Julia'])
    node='/Applications/ChatGPT.app/Contents/Resources/cua_node/bin/node'
    if not Path(node).exists():node='node'
    dynamic=json.loads(subprocess.check_output([node,str(ROOT/'tools/voice-lines.mjs')],text=True))
    for text in dynamic:texts.update(segments(text))
    return sorted({normalize(t).lower():t for t in sorted(texts) if t and re.search('[A-Za-z]',t)}.values())
def delivery(text):
    if '?' in text:return 'curious',.94
    if re.search(r'\b(crying|sad|lost|oops|oh no|careful)\b',text,re.I):return 'gentle',.91
    if '!' in text or re.search(r'\b(wonderful|great|hooray|well done|thank you)\b',text,re.I):return 'bright',1.0
    return 'warm',.96

def bake(limit=None):
    import numpy as np,soundfile as sf
    from kokoro_onnx import Kokoro
    model=ROOT.parent/'.voice-models';dest=ROOT/'dist/assets/narration';dest.mkdir(parents=True,exist_ok=True)
    texts=catalog();print(json.dumps({'dialogue_segments':len(texts),'engine':'Kokoro af_heart en-US','mode':'Mac-local cached generation'}),flush=True)
    if limit is not None:texts=texts[:limit]
    manifest={'schema':1,'engine':'Kokoro-82M','voice':'af_heart','accent':'en-US','clips':{}}
    start=time.monotonic();k=None
    for index,text in enumerate(texts):
        mood,speed=delivery(text);key=normalize(text).lower()
        signature='kokoro-v1.0-af_heart-1:'+str(speed)+':'+text
        name=hashlib.sha256(signature.encode()).hexdigest()[:20]+'.m4a';target=dest/name
        if not target.exists() or target.stat().st_size<1000:
            if k is None:k=Kokoro(str(model/'kokoro-v1.0.onnx'),str(model/'voices-v1.0.bin'))
            samples,sr=k.create(text,voice='af_heart',speed=speed,lang='en-us')
            if not len(samples) or not np.isfinite(samples).all() or np.max(np.abs(samples))<.005:raise RuntimeError('Empty/invalid narration: '+text)
            wav=dest/(name+'.wav');sf.write(wav,samples,sr)
            encoded=dest/(name+'.new.m4a')
            subprocess.run(['/usr/bin/afconvert','-f','m4af','-d','aac ','-b','64000',str(wav),str(encoded)],check=True,capture_output=True)
            encoded.replace(target);wav.unlink()
        manifest['clips'][key]={'src':'assets/narration/'+name,'mood':mood}
        if (index+1)%40==0:print(json.dumps({'prepared':index+1,'total':len(texts),'elapsed_seconds':round(time.monotonic()-start)}),flush=True)
    # A complete atomic manifest is the only browser entry point; interrupted baking reuses files.
    output=ROOT/'dist/narration-manifest.json';temp=output.with_suffix('.new');temp.write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':'))+'\n');temp.replace(output)
    used={Path(clip['src']).name for clip in manifest['clips'].values()}
    for path in dest.glob('*.m4a'):
        if re.fullmatch(r'[a-f0-9]{20}\.m4a',path.name) and path.name not in used:path.unlink()
    print(json.dumps({'ready':len(texts),'audio_bytes':sum(p.stat().st_size for p in dest.glob('*.m4a')),'elapsed_seconds':round(time.monotonic()-start)}),flush=True)
if __name__=='__main__':
    args=argparse.ArgumentParser();args.add_argument('--list',action='store_true');args.add_argument('--limit',type=int);opt=args.parse_args()
    if opt.list:print(json.dumps(catalog(),ensure_ascii=False,indent=2))
    else:bake(opt.limit)
