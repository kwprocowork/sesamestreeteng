# Letter Garden Delivery

Rosita has four surprises to deliver to two garden houses: A/a and B/b. The child chooses her own unlocked character, then helps each item find its letter family.

| Round | Hear and recognise | Find in the 3D garden | Speaking target |
| --- | --- | --- | --- |
| 1 | Capital A among A, a, B, b | Apple | Capital A. Apple. |
| 2 | Small a among A, a, B, b | Ant | Small a. Ant. |
| 3 | Capital B among A, a, B, b | Ball | Capital B. Ball. |
| 4 | Small b among A, a, B, b | Butterfly | Small b. Butterfly. |

Letter choices change position on each round. Each successful recognition opens a short walk to the corresponding 3D object. The child tries the speaking task before hearing a model. A parent confirms her response or chooses a shorter practice phrase. Speaking never times out. A successful delivery makes the object disappear from its pedestal.

After all four deliveries, the game revises the words in order: apple, ant, ball, butterfly. A picture is shown and a voice pronounces the word. The child chooses among four written words. The distractors are not any of the other learning targets:

| Picture / spoken word | Same-initial distractor | Two unrelated distractors |
| --- | --- | --- |
| apple | airplane | cat, sun |
| ant | alligator | fish, moon |
| ball | banana | dog, hat |
| butterfly | boat | car, tree |

Choices are shuffled on each question. A wrong answer stays on the same picture and offers another listen. A correct answer receives a short confirmation before moving on. This chapter is classified as a vocabulary game; the earlier capital/lowercase tasks remain its lead-in.

After the parent confirms notes and XP, the child sees one memory card at a time. “I know this word — save it!” explicitly adds that word to the vocabulary bank as learnt/remembered, attributed to the child's own action. A practice button repeats the word; a Save later action leaves the remainder queued. Saved words are unique, repeat saves update the existing entry, and the save queue survives reloads. The bank offers pictures, pronunciation, and checkboxes for named reusable word sets. The bank and word sets are browser-local; a new game generator from those sets is not included yet.

Rosita stays at a marked yellow side station during gameplay. Two tiny robot helpers remain at the edges and cheer on successful actions. NPCs fade if the dragged camera puts them across the sightline to the player or task target. A fuller, louder original soundtrack plays on the welcome page and trailer. Gameplay music is softer and ducks further during narration and child speaking turns. The planned adventure remains short, with unlimited speaking time; saving words is a separate closing activity.

Progression adds surprise without failure: on each level-up, choose one of three mystery boxes, every one containing a still-locked friend. Only one opens and is claimed; the other candidates remain available for later levels. Unopened rewards and the generated choices are persistent, so leaving the page cannot lose a reward or reroll its choices.

## 3D park trailer and varied vocabulary rounds
The front page is a 40-second cinematic montage: 20 two-second solo scenes, using exactly four random friends selected from the full 19-character roster per page arrival/restart. Every character has five distinct authored actions in `CHARACTER_ANIMATIONS`; every selected friend gets five appearances. Clips combine character rigs with props (cookies, guitar, flowers, kite, cooking pan, juggling balls, bubbles and magic sparkles). Tango and Snuffy have body-motion adaptations; Oscar stays grounded in his can. Five exclusive park decoration groups, changing sky palettes, camera angles, subtle dolly movement and short shaded dissolves distinguish the cuts. Captions and cast names remain below the canvas. Pause, reduced motion, visibility and parent-panel behaviour are preserved. The story is general playful fun, independent of the lessons. Navigation works with a labelled still-photo fallback without WebGL. Trailer casting does not unlock gameplay friends.

Vocabulary world placements, guided practice order, final review order and four-choice answer positions are randomized independently. All four letter forms and words are still covered exactly once; matching letter/word targets and parent speaking gates stay intact. The guide remains at the side.

## Stickers and one-item outfits
Completing any adventure earns three golden stickers bearing Elmo's smiling face. The celebration shows all three arriving and the updated wallet. Replays keep the full sticker reward; XP still follows its existing rules. The sticker shop contains eight visible, fixed-price items at 1–3 stickers. Each bought item is owned permanently in the wardrobe; a child chooses whether to equip it. A single equipped-item ID guarantees only one item is worn/carried at a time. Equipment is visible on the 3D playable character and survives switching friends. No default character choice is introduced. Clear prices, affordability states and ownership labels avoid duplicate or unaffordable transactions. The shop returns to the same celebration so learning-word saves and earned character reveals can continue.

## Chapter 03 — What do you want?
Source learning targets from the supplied book: cookies, bread, rice, ice cream, juice and milk, and the six food questions “Do you want …?” The new story features Rosita and a baby brother in a cozy pretend kitchen/nursery. The guide stays at the existing side station. The grown-up puppet helps with milk at the ending; the player handles pretend props on low stands.

The opening invites “What do you want?” Then each of the six food rounds combines a spoken/picture match, a short walk to a randomized prop position, and a parent-confirmed question. The baby politely declines the first five and accepts milk. The child next makes a free choice and says “I want [choice].” A final “The baby wants milk” turn supports show-and-tell. There are nine speaking turns, each with optional full/short pronunciation models, unlimited response time and direct parent acceptance in the speaking dock. Roughly five minutes is a pacing target, never a cutoff. Three stickers and the usual XP are granted once at parent-confirmed completion. Six words can be explicitly saved one by one; memory-card batches now support varying lesson sizes and preserve earlier unsaved words.

## Baby, Mama and house label refinement
Replace the initial simplified family meshes with dedicated, proportioned models. Facial detail is positioned on each ellipsoidal head. Mouths are closed three-dimensional curves with positive surface clearance; expression changes switch stable frown/smile geometry, never distort an oval mouth. Mama has a warm closed smile, soft bob hairstyle, collar, dress, shaped arms/hands and shoes. Baby wears a cotton-coloured romper and white bib, with seated limbs and soft brown curls. The high-chair back sits below the head.

All nine house labels have high-resolution text fitted to the available texture width, matched texture/board aspect ratios, generous padding and 11.3:1 ink/background contrast. Raised food labels remain above their props, and separate Baby/Mama name cards identify the family. Labels face the camera with bounded distance-aware scaling; depth testing remains enabled so they do not appear through furniture or walls.

## Manual pronunciation and nearby parent approval
Automatic microphone detection is removed. Every speaking turn presents Try first, Hear pronunciation, Shorter phrase, and Parent: accept answer in a fixed dock below the 3D scene. The complete model is optional and never auto-advances or reduces XP. Parent approval is direct, without opening a menu or waiting for detected sound. Parent approval stays available during narration/model playback; accepting stops that playback. Rapid duplicate parent taps cannot skip the following turn. American-English model playback honours an explicit request even when automatic story voice is muted.

The welcome/trailer soundtrack cycles four melodies with bass, chords and light percussion, using a louder front mix and a quieter gameplay mix. Music ducks during all speech and child speaking turns, has an independent mute button, and starts from a visible Play music or navigation gesture. No autoplay or microphone permission is requested.


## Standing design direction — immersive story missions
Every future learning story must fit the master game: keep tasks in the shared 3D world and use movement, characters, objects and missions. Do not open a separate learning window, worksheet panel, or full-screen task card to carry out a mission. Parents may use setup/review panels; gameplay prompts, pronunciation and parent approval remain in the existing dock below the scene. Include meaningful walking between objectives and direct interaction with the actual characters/objects. Retain engaging story motivation, animation and mission progress rather than a succession of vocabulary exercises.

Chapter 04 replaces its human-figure window with a park detective mission. Rosita asks for a part; the player walks to Bert or Ernie, uses the existing proximity action, and taps the part on the actual 3D puppet. Small features use a closer camera in that same scene. Left/right means the friend’s anatomical side, with optional parent setup to omit directional language. A second relay revisits selected words on the opposite side when paired. The player must walk to the dance stage before celebrating. Standard speaking practice waits for nearby parent approval, and the full pronunciation model remains optional. Word selection, notes, stickers and vocabulary saving persist.

## Phonics proposal and character casting
See PHONICS_DESIGN.md for the implemented Sound Safari Parade chapter based on the family's A–H worksheets. It is the fifth playable chapter. Use two distinct random parent-enabled letters and four source words, with all missions in the master 3D world.

Story guides rotate among suitable friends and must differ from the player. In particular, choosing Rosita must never leave a Rosita story NPC. Apply guide names consistently to the 3D actor, portrait, dialogue, narration and parent previews. Bert has a substantial upright black tuft; Ernie has a fuller tousled black hairstyle. Their shared 3D puppet builder carries this design into gameplay, mission NPCs, and the trailer. Keep the body-part hair target aligned with the larger geometry.

## Phonics open-park revision
The current Chapter 05 is the two-round open-space search documented in PHONICS_DESIGN.md. Round 1 accepts either not-yet-found word for the requested sound and covers all four school words. Round 2 uses two or three words on large NPC-held spelling cards with a coloured initial. Four slowly roaming park companions include one Sesame Street guide distinct from the player. NPCs wait eight seconds before searching and never claim an answer. Animals wander, fish stay in the pond, and static objects sit on furniture or ground. Keep fish/fin on the same model and preserve the card if the player switches character mid-game.

## Version 19 — living environments
All five chapters and the trailer use a shared LivingEnvironment layer. Preserve the existing game actors, task coordinates, raycast targets, movement and parent controls. This is environment art, never a new task window.

Locally generated wood grain, woven cloth, masonry, bark, grass and water textures add surface detail and bump response without external asset requests. Outdoor scenes have a gradient sky, an extended terrain skirt, a distant residential streetscape, branching trees with instanced leaves, a bandstand, slatted benches, flower borders and a decorative pond. Existing large green sphere tree crowns are replaced with leaf clusters. Clouds drift, birds circle, leaves sway and pond rings expand. Indoor chapters receive pleated fabric curtains, wall joinery, cornices, ceiling pendants and woven storage seats. Lighting has lower ambient fill for clearer modelling and shadows.

Scenery is cached per chapter, with only the active set visible. Decorative movement pauses with parent panels and honours reduced motion; objects remain in the world and out of mission routes. Learning meshes, cards, actors and shared actor materials are excluded from material changes. No changes to progression or saved data. Browser preview infrastructure was unavailable for this release, so actual tablet appearance and frame rate require device review; scene assembly, material isolation, motion, all phonics walking routes, trailer casting and existing learning controls have automated coverage.

## Chapter 07 — Comparison: Abby’s Toy Parade
Abby hosts in her home toy theatre, or Grover hosts if Abby is the player. Each two-visit cycle covers the four acts in randomized order, with both slots eligible for any act on the first visit. Each session features two pairs. Children open the toy chest, start the act, identify both toys in the world, and say one adjective sentence per toy. A favorite toy is carried to the stage for a fifth speaking turn and a victory lap. Optional models, parent confirmation, a free-text note and ordinary chapter rewards use the shared controls.

## Family picture stories
A Mac LaunchAgent turns settled photo batches into validated story data with a local vision model. Each chapter uses the shared 3D game, a character choice, a parent preview, physical stops, optional pronunciation and parent approval. The Mac builds a local play page. Paired browsers can read an optional encrypted chapter catalog; an unpaired browser can import an individual generated JSON. Picture data and GitHub write credentials are kept off the hosted site.

## Version 37 — Little Rabbit, the whole book

The chosen Sesame Street character helps a separate Little Rabbit actor. Direct inspection of all 15 source photographs establishes 14 story spreads after the cover. `rabbit-delivery.js` maps every spread to 22 ordered events, 38 physical actions, and 16 short parent-approved speaking turns. The intended session is 5–10 minutes with unlimited speaking time.

Events: water and pull the family's carrot; admire it; accept Mum's errand; tie the bow; carry it out; march left/right; rest on the hot hill and answer Cat; drink by the stream and answer Fish; rest and let Rabbit nibble grass in the forest, then answer Bird; arrive at Grandma's tree house; knock and see Grandma at the window; welcome/hug; deliver the intact carrot; make music/dance together; wave goodbye; return past the animal friends; greet the waiting parents; report that Grandma is happy. The hungry Rabbit never eats Grandma's carrot. No child is instructed to eat wild grass or mushrooms.

Nine scenery groups change with the story, keeping master-world movement and camera controls. Water droplets/growth, rising carrot, bow, carried gift, fish motion, bird motion, opening door, Grandma's appearance, actual gift transfer and interactive musical notes provide visible consequences. Missions require proximity to their physical destination and repeated actions have a cooldown. Parent panels pause animations; speech waits for manual acceptance. Character selection, wardrobe, XP, replay accounting, notes and three-sticker completion remain shared.

This authored chapter replaces the earlier generic five-marker chapter at its existing ID. It is included in the game itself so ordinary game links show it; paired feed refreshes cannot overwrite the authored reconstruction. Other generated chapters still use the existing generic renderer. Source photographs are not published. `verify-rabbit.mjs` exercises the complete sequence, page coverage, gift continuity, proximity/duplicate guards, pause, replay reset and reachable destinations.

## Little Street town

The trailer leads to character selection inside the player's house. The same
chosen character explores the house and streets, travels to each destination,
and plays the existing 3D story. The house has three landmarks: the front
door, the Activity Corner, and the bedroom. The street connects two rows of
destinations with a main path, a fountain, benches and flower beds.

| Destination | Adventure | Landmark |
| --- | --- | --- |
| Discovery Playroom | Can you find the ball? | Red ball over the door |
| Letter Garden | Letter Garden Delivery | A and B planter blocks |
| Sound Safari Park | Sound Safari Parade | Rainbow chimes |
| Boogie Bandstand | Body Boogie | Drums at the entrance |
| Cat’s Hideaway | Can you see the cat? | Paw-print door decorations |
| Little Playhouse | What do you want? | Striped awning |
| Toy Theatre | Abby’s Toy Parade | Marquee and curtains |
| Rabbit’s Farm | Little Rabbit’s Special Delivery | Carrot planters |
| Story Cottages | Imported family picture stories | Individual doors in the north extension |

Walk with the keyboard, touch pad or joystick. The map shows the player’s
position and lets the player place a gold marker at a destination. Use the
hand or Space near a door to enter. The Activity Corner also lists every
story and takes the player there along the town paths. Both entry routes use
a three-second travel scene before the destination’s existing parent preview.
Closing a preview returns the player to the door. Completing a story brings
the player back outside after notes, rewards and optional word saves.

Each day has 10 minutes of active play, including walking and travel. Parent
panels, background tabs, and the story’s wrap-up pause the clock. On expiry,
a story in progress can finish with its existing parent controls. Outside a
story, expiry immediately starts the bedtime sequence. The character goes
back to the house, walks to the bed, and lies down. The allowance persists
in the browser and renews at 06:00 Hong Kong time. Learning records, stickers,
and outfits are independent of the daily allowance.

## Sesame Street Town expansion

The house opens onto an original theme-park town inspired by the family's
reference photos. The rainbow gateway opens onto Welcome Plaza and its
fountain. A central promenade and two outer walks connect Main Street,
Wonder Park, and Adventure Gardens. Imported family stories extend the north
end at Storybook Lane. The streetscape uses curved pavilions, striped
awnings, painted marquees, park lamps, and the glass-roofed Rainbow Arcade.

| District | Adventure entrances | Walk-up attractions |
| --- | --- | --- |
| Welcome Plaza | My House and the Activity Corner | Rainbow Carousel, Cookie Café, Bubble Bay |
| Main Street | Discovery Playroom, Cat’s Hideaway, Little Playhouse | Storybook Library |
| Wonder Park | Letter Garden, Abby’s Toy Theatre | Starlight Dome, Skywheel |
| Adventure Gardens | Sound Safari Park, Boogie Bandstand, Rabbit’s Farm | Rainbow Station |
| Storybook Lane | One signed cottage per imported story | |

Approach an attraction and use the hand or Space to activate its in-world
effect. The map and nearby HUD use the same full names as the high-contrast
entrance signs. Family cottage signs wrap from the full story title. The
map lists attractions and stories by district, and the house’s Activity
Corner continues to launch stories with the three-second trip.

## The player’s house

The player selects a character immediately after pressing START, then enters
the house. The low, unlabelled main entrance is centred in the foreground exterior wall.
The house and town map can guide the player to the door. The Activity Corner
still starts the three-second journey, showing the route through the house.
The white play fence has clear gates. The wardrobe stands along the left
wall with its doors facing right, leaving a straight aisle to the bed.
The house legend and shortcuts sit in a strip above the 3D view.

The plain padded play mat has a toy kitchen, a vehicle and a small piano.
The house has cartoon clouds, scalloped trim, a wall rainbow and two framed posters picked
from the ten supplied images on every entry. Consecutive visits do not show
the same pair. The glass-front cabinet draws eight collectibles from the existing
Sesame Street character roster. Figurines, standees and portrait medallions
use different scales and display bases.
The bedroom's bed and bedside lamp are part of the bedtime sequence.

| Station | Interaction |
| --- | --- |
| Parent Notes | Read the existing parent journal from the desktop computer. |
| Wardrobe | Equip or remove an owned accessory. |
| Word Library | View saved words and hear their pronunciation. The shelf shows 24 named books at a time, with pages available in the library. |
| Figure Cabinet | Choose an unlocked character using the existing picker. |
| Activity Corner | Choose a story and travel from home. |
| Main Door | Leave the house for Welcome Plaza. |

## Home storage and the Sticker Shop

The house has four full-height walls and a high ceiling. The camera
stays inside that shell, including when the player drags, zooms, or
changes the house view. The camera starts at half optical magnification
so more of the interior fits. The plain play mat has no sign and sits
against the rear wall. The front door transitions directly to town.

The toy cupboard displays bought toys on its shelves. The separate
walk-in Store Room holds furniture and decorations and provides access to
bedding. Furnishing spots line the perimeter walls and turn each piece
toward the open floor. Existing saved pieces carry over to those spots
and automatically face inward. Returning a piece to storage frees the
spot. The central floor stays open, with clear routes to the interactive
stations and the bedside.
Bedsheets and one plush can be displayed together.

The Sticker Shop has departments for accessories, clothes, furniture,
toys, decorations, and bedding and teddies. Existing stickers and
purchases carry over. Purchases and house arrangements use the same
browser-local save. Clothes and accessories use the existing single-item
wardrobe, toys go straight to the cupboard, and other home goods go to
storage until placed.


## Town access and attraction scenery

The Main Door shortcut leaves the house directly. On foot, the house
entrance accepts the hand action from a wider approach area. The house
path is wider and marked by two lights. The town camera frames more of
the street.

Only the player's house and story destinations accept entry actions.
Other landmarks appear as scenery on the map. Bubble Bay has a complete
perimeter, a filled ball basin, and a continuous slide connected to a
supported platform and steps. Flower planters add colour at the street
edges.


## Shared depth and surface rendering

The house, town and story scenes share a directional key light,
hemisphere fill, cool rim light and a soft ground contact shadow under
the player. The house key stays below the ceiling. The outdoor shadow
camera follows the player to preserve nearby depth while walking
through town. Night uses a reduced exposure.

Painted scenery gains a subtle procedural bump finish. Low furniture
surfaces use a fine grain, and the bed quilt has woven surface detail.
Town domes and rounded props use smoother geometry. Building entrances
have layered base trim and pilasters, with individual paving blocks
on their approach paths. The material cache excludes actor rigs,
existing textured surfaces, signs and learning targets.


## Build 50: street reference and house gallery
The town now uses continuous blue-grey roads with cream raised sidewalks, marked zebra crossings, corner traffic signals and dashed lane markings. Colourful pitched roofs, flower boxes, mixed pink/green/conifer trees, a distant neighbourhood skyline and rounded hills reinforce the playful 3D street direction of the supplied references. The following camera is lower (6.8 world units) and looks farther ahead; the town fog recedes to preserve the streetscape. Main Street remains open overhead. The home access lane sits at z38 so its pavement clears the home footprint. Street and backdrop meshes are instanced in their own groups.
The house displays six distinct random posters from the existing ten uploaded images: four on the back wall and two high on inward-facing side walls. Portrait and landscape artwork remains contained without cropping. Furniture functions and house navigation are retained.
Validation: house geometry/navigation and all poster draws; town geometry/navigation, destination entry rules, travel timing and daily budget; front flow. Rendered browser verification could not run because the preview relay was unavailable.


## Interactive original-adventure expansion (Build 58)

The original lesson coverage remains, with new practical scenes in the same world. Letter Garden now requires physically carrying each named surprise to its matching A/a or B/b house. Sound Safari and Letter Garden default to full sentences, while optional shorter practice remains available. Cat uses full negative answers. Rabbit keeps all 22 book events, with fuller oral sentences and extra drinking, pulling and waving motion. Body Boogie adds a playable-character dance.

After their existing story, seven adventures have a new three-stop play scene with Pip, an original leaf-eared seed helper: collect a tool, ask permission, walk to a work station, perform three animated actions, describe the result, walk to Pip and tell 2–3 sentences. Safari waters a welcome flower bed; Letter Garden plants a welcome garden; Boogie plays a drum; Theatre opens curtains and animates a toy; Cat rolls yarn for a playful kitten; Rabbit grows another gift after the complete book; Discovery bounces a celebration ball. These are invented extension scenes, not additional factual events from source photographs. Native geometry is reused, without external images or generated video. Parent panels pause action effects; reduced motion uses still changes; each oral turn has manual parent acceptance and no timeout.

Little Playhouse replaces the six prescribed picture-choice rounds. Three foods are randomly assigned to real fridge shelves and three to a table on every visit. The child walks to either area, uses the hand to open/close the hinged fridge, and taps an actual food. Three different non-milk trials come before milk. Each food is named in a full sentence, carried to Baby, and offered with “Do you want …?”. Baby gently shakes his head or smiles for milk. The grown-up helps with pretend milk. A personal food preference and supported 2–3 sentence free-talk ending follow. No food-selection quiz panel is used.

Discovery has an extended 24-by-24 floor and expanded movement bounds, with six hiding places: box, table, chair, basket, tent and stool. Basket lid and tent curtain animate open; the basket is hollow so its ball is visible. Each game searches three shuffled empty locations before the chosen final location, keeping sessions short. Search sparkles and a bouncing found ball add consequences.

Validation: `verify-interactive-rebuild.mjs` tests all extension routes, real Three.js rigs, proximity, action cooldowns, pause, replay, every parent gate and 12 randomized child-choice kitchen runs. Updated chapter, speaking, scene and walking checks retain the existing controls, words, clothing, progress, notes and rewards. Mac-local Ollama supplied a compact initial planning draft; its suggestions were reviewed against existing source coverage. No private pictures or runtime data are part of this release.


## Build 59 — short openings, playable shop toys, shorter Rabbit route

Every adventure now starts with a short animated introduction in the shared 3D scene. The new common opening has two narrated/captioned beats over roughly eight seconds and a Skip intro button. It previews the practical task with native props and the selected player; Cat, Baby, Safari and Rabbit reuse their actual chapter models. The camera cuts to the opening immediately. Parent panels and background tabs pause it, reduced motion retains still changes, and replay/skip callbacks cannot restart a different session. The existing authored “What’s your name?” introduction remains. Generic imported chapters receive a brief based on their own title/intro.

Purchased toys can be taken from the actual Toy Cupboard, carried to the fenced playmat, and placed using the hand near its centre. Up to six owned toys remain on the mat across reloads. Taking a toy removes its shelf display; Return to shelf puts it back. Walking near a mat toy offers the hand action, and directly tapping the toy plays its three-second animation: train/bus driving, rocket launch, bouncing blocks, duck waddling/hopping, or tapping drumsticks. Pause/reduced-motion preferences apply. Ownership is checked; this adds no purchases, XP/sticker costs or unlock changes. The cupboard explains the complete carry/place/tap flow.

At the user’s request, Rabbit’s Farm now draws exactly one of Cat, Fish or Bird per visit. An 18-stop route keeps growing/wrapping/carrying the gift, the selected animal’s rest/drink/snack scene, Grandma’s welcome and delivery, music and the return to the parents. The two other encounter scene pairs are skipped; only the chosen animal appears in the return scene. All 22 original authored events remain available in source, but the shorter route supersedes the previous all-encounters default. The carrot stays intact for Grandma; the in-game preview explains the shortened route.

Mac-local Ollama prepared compact animation ideas, while existing engine-native models were reused. `verify-intros-toys.mjs` covers all opening variants, skip/pause/replay, ownership/persistence/carry/place/return, all six toy ray hits and animations, reachable mat locations and all three Rabbit routes with gift continuity. Existing chapter, house, town and learning-control checks remain in place. Browser QA confirmed an opening and its handoff, and touch-to-play using the same six toy models in a disposable local fixture; no test fixture ships in the release.


## Build 60 — complete, compact word labels

Shared 3D word boards now use measured full-string font fitting and matching canvas/board proportions. The common board is slimmer, with no truncation or ellipsis. Existing individually fitted town signs and phonics cards retain their own layouts.

Little Playhouse uses compact food-specific name tags at the table edge and centred on each fridge shelf. The middle table tag sits lower to separate all three food names. Food labels take priority over decorative/family labels; overlapping secondary tags are suppressed. Compact tags scale using camera-space depth, have bounded screen width, and shrink or hide at the screen edge instead of clipping words or filling the view. Collected foods and closed-fridge labels remain hidden. The fridge door opens farther to clear the shelf labels. Labels keep depth testing and never become food hit targets; selected food practice still shows its full word in the existing dock.

Validation: full-string fitting, landscape/tablet/phone bounds, collision decluttering, requested visibility, existing playhouse/scene and gameplay checks. Browser QA checked the actual food world at room and fridge distances, with all fridge words readable and table tags separated. A disposable local preview was removed before packaging.


## Build 61 — The Wonder Isles town redesign

The town is rebuilt as a larger connected storybook theme-park world. With the current chapters its walkable bounds cover 71,272 world-square units, approximately five times the earlier map area. Five named districts organize the house and venues: Friendship Harbour, Discovery Quarter, Enchanted Gardens, Adventure Heights and Storybook Village. Existing destination IDs, chapters and saved progress remain authoritative. New stories extend the village north.

The Mac bakes a deterministic 13,248-triangle island terrain locally with Python (`tools/bake_town_terrain.py`). Reusable native geometry creates the canal, pedestrian bridges, clock tower, harbour lighthouse, landscaped lagoons, woodland mushroom cottages, pavilion, flower courts, farm plots, windmill, distant castle and mountain skyline, floating sky gardens, balloon couriers and a perimeter train. Boats stay between bridges and the train remains beyond walking bounds. A lightweight gradient sky gives atmospheric depth. No external image/model downloads or private picture assets are required. Repeated props, vegetation and route dots use instancing. Parent panels/background tabs pause town animation; reduced motion uses stationary poses.

All seven existing scenic attractions now accept nearby hand interactions: carousel, café bell, bubbles, library book, stars, Skywheel and station train. These use the existing animated native models and do not spend stickers or award new XP. Doors still lead to the existing stories; house furnishings, toy play, wardrobe and daily play allowance are preserved.

The new World Atlas provides a spatial map, complete destination names, district search, the player position, route preview, keyboard/touch pins, a walking-trail action and a short shuttle ride to stories, attractions or home. Nearby map and north indicator support street exploration; the map stays hidden on smaller screens to protect the playfield. Follow and Panorama cameras offer close play and wider neighborhood views. Collision lookup uses a spatial grid, and recent trails are cached so repeated atlas searches do not repeat pathfinding. Walking trails use bounded A* with clearance checks against the same collision map as the player, including buildings, water, trees and park structures. Canal crossings are possible only on bridges.

Validation includes all fixed destination routes, cross-district routes, bridge/water restrictions, dynamic geometry, atlas pin coverage, native attraction activation, instanced route dots, cached construction and house/story regressions. The reference geometry check has roughly 4,300 instanced props and under 0.7 million triangles; these are geometry checks, not measured iPad frame rates. Browser review verified town entry, the atlas, shuttle arrival, a Skywheel interaction and Panorama, plus the final landscape/sky render. Disposable preview files were removed before publication.


## Build 62 — Entrance clearance and camera comfort

House, town-building and Rabbit-story entrances now provide 4.4 units of headroom and 3.4 units of width, with matching frames and higher signs/awnings. The house wall opening matches its door; Rabbit's frame is open behind the animated leaf. This covers all selectable characters with allowance for hair and accessories without changing story destinations, room routes or saved progress.

During active exploration the camera gently returns its manual orbit and zoom to the follow view every five seconds. Pointer/pinch/wheel input restarts that interval. Parent panels, hidden tabs, speaking turns, learning detail views and authored cinematic shots reset the interval and remain steady. Reduced-motion users receive a direct adjustment instead of a sweep. The camera continues following the character between adjustments. Story exploration defaults to a 1.26 distance multiplier (about 10.5% farther than 1.14); detailed task and portrait views retain their previous distance. Town/house framing retains its existing safe camera bounds.

Validation: actual character/door clearance, house shell and routes, town navigation/scenery, story gameplay and camera timing/protection regressions. Private runtime data and player saves are untouched.


## Build 64 — Warm American-English narration

Mac-local Kokoro-82M (af_heart) prepares cached 24 kHz neural speech for public game dialogue. Warm narration, curious questions, gentle concern and bright encouragement use punctuation-aware delivery and modest speed variation, without imitating a Sesame Street actor. Recordings are AAC in M4A containers for iPad playback, fetched on demand through a sentence manifest. No speech API key, microphone, inference server or running Mac is required while playing the published game. Narration is AI-generated; the parent panel states this.

The shared narrator handles every normal `speak` call. Uncached/dynamic sentences and failed downloads fall back to the best available US-English device voice, preferring enhanced/natural voices. Native delivery also varies naturally rather than using the old uniform 0.85 speed. Speaking models remain optional; nearby parent acceptance stops playback immediately. New speech, muted voice and page exit cancel old audio/callbacks. Tab visibility retains the prior narration lifecycle so callback-driven story introductions can finish safely. Music retains its speech ducking. Isolated phonemes continue using checked clips or parent modelling, not text-to-speech letter names.

`tools/bake_voices.py` reads only public source literals and reusable sentence patterns. Cache signatures include voice/model, wording and delivery speed. Models, Python environments and OCR/source material remain Mac-local. Browser audio failures cannot block gameplay; cancellation and exactly-once completion are tested alongside speaking controls and chapter regressions.


Build 65 completes the narration release by retaining the existing tab-visibility lifecycle and revalidating the small voice manifest once per page load, preventing new dialogue libraries from remaining behind a browser cache. Hashed voice recordings remain reusable.


## Build 66 — Clear task views throughout the stories

A shared TaskCamera composes near-task and interaction views around the actual food, prop, person, word card or body detail. It tests side angles against projected bounds of the selected player's animated rig/outfit and other visible supporting characters. Stable angle selection avoids repeated left/right switching. If a character still crosses the important task area, only that obstructing actor is omitted for that render and immediately restored; its position, equipment, physics and saved state remain unchanged. The NPC involved in the task and the spelling-card holder are protected from this omission. Models in inactive scenery are ignored. No avatar or NPC is moved to clear a camera view.

Coverage includes fridge/table choices, carried food and Baby conversations; Stationery drawing, class conversations and the full sticker poster; Safari objects, the held word card and fish fin; Body Boogie parts; Letter Garden collection/delivery; Cat's search/answers; Abby's toy interactions; Rabbit's complete task route; imported-story stops; Discovery's hiding places; and extension tasks/free talk. Authored gallery portraits, transportation demonstrations, opening sequences and finales retain their own shots. Existing transportation/gallery actor clearance remains in place. Discovery and Cat use lower views when looking under furniture. Rabbit's door, gift, animal and family shots use their real scene objects rather than only their walking marker.

Task composition reacts immediately instead of waiting for the five-second free-exploration recenter. That recenter is suspended for active task views. Dragging/pinching keeps a short manual grace period; camera-relative walking holds the current heading and follows translation until movement is released. Parent panels/background pauses freeze composition; reduced motion avoids a moving transition. The wider story default remains for free exploration, and precise part/card shots retain their authored scale. Speaking never has a deadline or a camera-driven acceptance.

The fridge now places food on the actual shelf surfaces, with clearance below the next shelf, and uses a separate column for complete labels. A near-level front/side camera reveals every compartment. Table randomness, free food choice, three trials before milk, parent acceptance and the narrator are unchanged. A pre-existing circular entity-reference error in the Safari opening was resolved by cloning the display model rather than its runtime interaction root, allowing that chapter's camera flow to start reliably.

Validation: 30 task/phase adapters, 75 portrait/landscape obstruction scenarios, 84 actual selectable-character compositions, visible/selectable food rays across 12 randomized layouts, stable/manual/movement/restore behavior, plus chapter/voice/house regressions. Local browser review exercised fridge, NPC face, sticker poster, word card, fin, low chair and Baby views, including portrait tablet framing. Disposable preview controls are removed before publication.


## Build 67 — One voice for narration, demos and NPC replies

Every spoken word and sentence uses the same Mac-prepared Kokoro af_heart American-English recordings. This includes pronunciation demos, shorter practice, vocabulary playback, guide instructions, NPC answers, gallery relatives, food choices, body-part sides and repeated lines. The previous browser/device speech fallback is removed. A delayed manifest is awaited rather than switching speaker. A failed recording leaves captions and parent controls available, offers retry and never substitutes another voice. Checked isolated phoneme recordings, including parent-supplied checked sounds, remain a separate learning resource so sounds are not replaced by letter names.

The public speech catalog now evaluates actual chapter data and gallery round variants, includes short NPC answers and enumerates generated demo/clue patterns. The Mac reuses the existing audio cache. verify-voice-coverage.mjs verifies public speech segments and asset presence; verify-narrator.mjs covers manifest readiness, speaker validation, same-file retry, unavailable audio, cancellation and exactly-once completion. Question-based shorter workshop models retain their punctuation. Future story releases must bake and verify new dialogue before publishing. This supersedes earlier device-voice fallback instructions.


## Latest universal design — short, gentle pattern adventures (November 2026)

This supersedes earlier requirements for 5–10 minutes, a separate oral gate at every event, and mandatory 2–3 sentence free talk. Default to THREE meaningful world actions per visit, with a maximum of four. If the source offers more activities, choose a varied subset for replay; keep necessary story context and the ending through brief animation/dialogue. Target normal play within about three minutes, without a speaking countdown or forced cutoff.

Use ONE simple sentence pattern per game, repeated with small vocabulary substitutions. Keep its model visible and use the same af_heart voice. The child may try or skip each practice and continue immediately; do not require parent approval after each turn. Finish with one easy show-and-tell sentence and an optional second sentence. A nearby parent accepts only this final show-and-tell. Skipping practice must not reduce XP or be recorded as a pronunciation failure.

Make scenes open, spacious and lively: connected outdoor paths, open pavilions, several cute original NPCs, playful short animations and visible consequences. Allow direct object selection and tap-to-walk as well as movement controls. Avoid repetitive multi-tap chores, precise arrival gates, wrong-answer loops, and compulsory trips between the same stations. Keep the selected player visible; compose selected tasks side by side and preserve stable food taps, drag/pinch control and reduced-motion support. Preserve wardrobe, selected words, progress, notes, rewards, private runtime data and all existing chapter identities. Source story references remain factual; label invented supporting play separately.


## Latest headquarters decision — Schoolbus visuals, Version 69 layout (28 November 2026)

Use KW Schoolbus v223 as the source for rounded/bevel geometry, generated materials, lighting, renderer/post-processing, original NPC rig and playmat prop animations. Retain the Sesame Version 69 HOUSE AND TOWN LAYOUT and chapter identities. Only the Schoolbus PLAYMAT area applies to this house; do not copy its other rooms, floor plan, household furniture or district layout. Preserve Sesame characters, wardrobe/unlocks, bought toys, shop, progress, oral content and existing audio. See the checked-in `docs/SCHOOLBUS_ASSET_MAP.json` for inspected builders and the selected port. There are no GLB/GLTF assets in either inspected backup family; the reference uses procedural meshes.

The approved daily flow is three active minutes at home, a bicycle/walking journey with optional help for at most two neighbours, a short Version 69 story, an optional second story, then home/night and rewards. Keep energy/hygiene recovery at the fridge and washing station. No speaking deadline; one simple pattern, optional practice, final parent-accepted show-and-tell. New narration was explicitly authorized in the same cached Kokoro `af_heart` voice. Never claim a numerical visual-match percentage without measurement.
