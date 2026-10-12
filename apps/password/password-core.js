/* apps/password/password-core.js — 비밀번호 생성기 언어 무관 로직 (UMD: 브라우저 window.PASSWORD_CORE + Node 검사 공용)
 *   - 난수: crypto.getRandomValues 32비트 + 거부 샘플링(uniformInt — 모듈로 치우침 없음). JS 기본 난수 함수는 쓰지 않는다.
 *   - 비밀번호: 고른 글자 묶음(대문자·소문자·숫자·기호, 헷갈리는 글자 0 O 1 l I 빼기)의 합집합에서 길이 L 만큼 고르게 뽑고,
 *     고른 묶음이 하나라도 빠졌으면 통째로 다시 뽑는다(거부 샘플링) → "묶음마다 1개 이상"인 문자열 전체에서 정확히 고르게.
 *     엔트로피 = log2(그런 문자열의 수) — 포함·배제 원리로 정확히 계산(passwordEntropy).
 *   - 패스프레이즈: 내장 영어 단어 2048개(= 단어당 11비트)에서 단어 3~8개를 고르게(중복 가능) 뽑아 구분자로 잇는다.
 *     첫 글자 대문자(엔트로피 그대로), 숫자 넣기(무작위 단어 하나 끝에 숫자 0~9 → + log2(10 × 단어 수)).
 *   - 강도: 엔트로피 비트 → weak(<45) · fair(<60) · strong(<80) · veryStrong(≥80).
 *   - 깨는 시간: 초당 1e10번(오프라인 대입 공격 가정) 평균 2^(bits-1) 번 시도 → 초·분·시간·일·년, 우주 나이(1.38e10년)보다 길면 forever.
 *   - 서버로 보내는 것 없음. 만든 비밀번호를 저장하거나 주소에 넣지 않는다(화면 쪽 규칙).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PASSWORD_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var U32 = 4294967296;
  var LEN_MIN = 4, LEN_MAX = 64, LEN_DEFAULT = 16;
  var WORDS_MIN = 3, WORDS_MAX = 8, WORDS_DEFAULT = 5;
  var COUNTS = [1, 5];
  var GUESSES_PER_SEC = 1e10;
  var UNIVERSE_YEARS = 1.38e10;
  var YEAR_SEC = 365.25 * 86400;
  var SIMILAR = '0O1lI';
  var CLASSES = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    digits: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{}?/.,:;~',
  };
  var CLASS_ORDER = ['upper', 'lower', 'digits', 'symbols'];
  var SEPARATORS = { dash: '-', dot: '.', underscore: '_', space: ' ' };
  var SEP_ORDER = ['dash', 'dot', 'underscore', 'space'];
  var DEFAULTS = {
    mode: 'password', length: LEN_DEFAULT, upper: true, lower: true, digits: true, symbols: true, similar: false,
    words: WORDS_DEFAULT, sep: 'dash', capitalize: true, number: true, count: 1,
  };

  // 단어 2048개(영어, 소문자 a-z 3~7글자, 중복 없음, 알파벳순). 2048 = 2^11 → 단어 하나에 정확히 11비트.
  var WORDS = (
    'abbey able accent acid acorn acre actor adapt admit adobe adore adult adverb aerial aflame afloat agate agenda ' +
    'agent agile agree ahead aim air airway aisle alarm album alcove alert algae alien alley allow alloy almanac ' +
    'almond aloft alpha alpine alto amaze amber amble amid amigo amount amp ample amulet anchor angel angle ankle ' +
    'annex antler anvil apart apex apple apricot apron aqua arbor arcade arch archer arctic arena argue aria arm ' +
    'armada armor army aroma arrival arrow art artist ascent ascot ash aspect aspen asset astral astro atlas atom ' +
    'atrium attic audio august aunt aurora autumn avenue avid avocado avoid awake award aware awning axe axis baby ' +
    'back bacon badge badger bagel bagpipe bait baker bakery balcony bale baleen ballad ballet balloon balmy bamboo ' +
    'banana band bandana bandit banjo bank banner barber barge barley barn baron barrel basalt basil basin basket bat ' +
    'batch bath baton bay bayou bazaar beach beacon bead beagle beak beaker beam bean beanbag bear beard beaver bed ' +
    'bedrock bedtime bee beech beef beehive beet beetle begin belfry bell bellhop belt bench beret berry bike bingo ' +
    'birch bird biscuit bison bistro bit blade blank blanket blast blaze blazer blend blender bless blimp blink bliss ' +
    'block blond bloom blossom blue bluff blunt blur blush board boat bobcat bobsled body bolt bond bone bonfire ' +
    'bonnet bonsai bonus book bookend boot booth border boss botany bottle boulder bounce bouquet bow bowl box boxcar ' +
    'boxer bracket brain bramble branch brass brave bravo bread breadth breeze brew brick bride bridge brief brigade ' +
    'bright brim brine brisk brisket broad broker bronze brook broom broth brown brownie brush bubble bucket buckeye ' +
    'buckle bud buddy budget buffalo buffet buggy bugle build bulb bulldog bumper bunch bundle bungee bunny buoy ' +
    'burger burrito burrow bus bush busy butler butter button buyer buzz cabana cabaret cabbage cabin cable cactus ' +
    'caddy cadence cadet cafe cage cake caliber calico calm camel camera camp camper campus canal candle candor candy ' +
    'cane canoe canopy canteen canvas canyon cape capital capsule captain caption car carafe caramel caravan carbon ' +
    'card cargo carol carpet carrot cart carton cascade cash cashew castle cat catalog catch catfish cave cavern ' +
    'caviar cedar ceiling celery cell cellar cello cement census cereal chain chair chalet chalk chamber champ ' +
    'channel chant chapter chariot charm chart charter chase cheddar cheek cheer cheese cheetah chef cherry chess ' +
    'chest chick chief chili chime chimney chin chip chirp chisel choir chord chorus chowder chunk cider cinder ' +
    'cinema circle circus citadel citrus city civic civil clam clap classic clay clean clear clerk click cliff ' +
    'climate climb clinic clock closet cloth cloud clover clown club clue cluster coach coal coast coastal coat ' +
    'cobalt cobble cobbler cobra cocoa coconut cocoon code coffee coil coin cola collar column comet comfort comic ' +
    'comma compact compass concert condo condor cone console convoy cookie copper coral cord cordial core corn corner ' +
    'corral cosmic cosmos costume cottage cotton couch cougar count county coupon court cove cover cow cowboy coyote ' +
    'crab cradle craft crafty crane crate crater crayon cream creamy credit creek crest crew cricket crimson crisp ' +
    'crochet crop croquet crouton crow crown cruise crumb crumble crust crystal cube cubic cubicle cuckoo cumin cup ' +
    'cupcake cupid curb curious curl curry curtain curve cushion custard cycle cyclone cymbal daily dairy daisy dance ' +
    'dancer dapper darling dash date dawn dazzle debut decade decimal deck decor decoy deer delta deluxe denim ' +
    'dentist depot depth deputy desert desk dessert detail dew dial dialog diamond diary diesel digit dime dimple ' +
    'diner dingo dinner diploma dipper direct disco dish ditto diver dock doctor dodge doll dolly dolphin domain dome ' +
    'domino donkey donut doodle door dormant dorsal dose dot dove down dozen draft dragon drama drawer dream dress ' +
    'dresser drift drill drink drive drizzle drum duchess duck duet dugout dune dust duty dwarf dynamic dynamo ' +
    'dynasty eager eagle early earmuff earnest earth easel east easter echo eclair eclipse eddy edge editor eel ' +
    'effort egg eight elbow elder elegant elf elixir elk elm embark embassy ember emblem emerald emerge emperor ' +
    'empire empty enamel encore endless energy engine engrave enigma enjoy entry envoy epic episode equal equator ' +
    'equinox era errand escape essay estate estuary eternal ethic evening event ever everest exact exhibit exit ' +
    'exotic expert extra fable fabric face fact fair fairway fairy faith falafel falcon fame fancy fanfare farm ' +
    'fathom fawn feast feather feline fence fennel fern ferret ferry fiber fiddle fidget field fiesta fig figure film ' +
    'filter final finale finch fire firefly firm fish fist five fjord flag flame flannel flash flask flatbed fleet ' +
    'flicker flint flip float flock flood floor flora florist flour flower fluff flurry flute flutter foam focus fog ' +
    'folio folk fondue font food forest forge fork form fort fortune forty fossil fox foyer frame freckle freeway ' +
    'freight frenzy fresh fridge frisbee frog frost frosty fruit fudge fuel fumble fun fungi funny fur furnace fusion ' +
    'gadget galaxy gale gallant galleon gallery gallon game gamma garage garden garland garlic garnet gate gauge gaze ' +
    'gazebo gazelle gear gecko gelato gem gemini genie gentle gerbil geyser ghost giant gift ginger gingham ginseng ' +
    'giraffe glacier glad gladly glass glide glider glimmer glitter globe glove glow glue gnome goat goblet goblin ' +
    'goggles gold golden golf gondola good goose gopher gorge gorilla gourd gourmet grace grackle grade gradual grain ' +
    'grammar grand granite granola grape graph grass gravel gravy great green grid griffin grill grin grizzly grocery ' +
    'grotto grove grow guard guava guest guide guitar gulf gull gum gumbo gumdrop guru gust gutsy gymnast habit ' +
    'habitat haddock hair half halfway halibut hall hallway halo ham hamlet hammer hammock hamster hand handbag ' +
    'handle handy happy harbor hard harmony harness harp harvest hat hatch haven hawk hay hazel head headset heap ' +
    'heart hearth heat heather hedge heel helium helix helmet help hemlock hen herald herb herbal hermit hero heroic ' +
    'heron hexagon hickory hide high highway hike hill hilltop hint hippo hobbit hobby hockey holiday holly home ' +
    'honest honey hood hoodie hoof hook hope horizon horn hornet horse host hotcake hotdog hotel hound hour house hug ' +
    'hula human humble humming hummus hunt husky hustle hut hydrant ice iceberg icebox icicle icon idea idle igloo ' +
    'igneous image imagine impact imprint inch index indigo indoor infant ink inkling inkwell inlet input insect ' +
    'insight inspire instant intact invent iodine iris iron island isotope ivory ivy jackal jacket jackpot jade ' +
    'jaguar jalopy jam jar jasmine javelin jazz jeans jelly jersey jetty jewel jigsaw jitney job jockey jog jogger ' +
    'joke jolly journal journey jovial joy jubilee judge juggler juice jukebox jumbo jump jumper jungle junior ' +
    'juniper jury kale karate kayak keen kernel ketchup kettle key kick kickoff kid kind kindle king kingdom kinship ' +
    'kiosk kipper kit kitchen kite kitten kiwi knee knife knight knit knob knot knuckle koala label lace ladder lady ' +
    'lagoon lake lamb lambda lamp lance land landing lane lantern lanyard lap laptop larch large lasagna laser lasso ' +
    'latch lattice launch laurel lava lawn layer leaf leaflet ledge leeway legacy legend lemon lens lentil leopard ' +
    'lettuce level lever library lid light lilac lily lilypad limber lime lindy linear linen lingo lion lip list ' +
    'llama loaf lobby lobster local lock locket lodge loft logbook logic longbow loop lotus loud loyal lucid lucky ' +
    'lullaby lumber lumen lunar lunch luxury lynx lyric lyrical macaw madcap magenta magic magnet magpie maid mail ' +
    'mailbox major mallard mammoth mango manor mantle mantra maple maraca marble march marina marlin marmot marquee ' +
    'marsh mascot mask mason masonry match matinee mayor maze meadow meander medal medley mellow melody melon mentor ' +
    'menu merit mermaid mesa mesh metal meteor midday migrate mild mileage mill millet mimic mind mindful minnow mint ' +
    'minute miracle mirror mirth mist mitten mixer moat mobile mocha model modern modest mohair molar mole moment ' +
    'monarch monitor monk monsoon month moon mooring moose mop moral morning mosaic moss moth motor motto mound mount ' +
    'mouse mouth movie mud muffin mug mule mumble mural muscle museum music mustang mustard mystic myth nacho nail ' +
    'name nap napkin narrow narwhal native nature navel navy neat nebula nectar needful needle neon nephew nerve nest ' +
    'net nettle network never new news nibble nice nickel night nimble ninja noble nod noise nomad noodle north nose ' +
    'nostril notary note nougat novel novice nudge nugget number nurse nut nutmeg nylon oak oarsman oasis oat oatmeal ' +
    'obelisk oboe observe ocean octave octopus odd odyssey offbeat offer office oilcan okra olive olympic omega ' +
    'omelet onion onward onyx opal open opener opera optic optimal orange orbit orchard orchid order organ origami ' +
    'origin oriole osprey ostrich otter ounce outback outdoor outer outpost oval oven owl owner oxbow oxygen oyster ' +
    'ozone pace pack paddle paddock page pageant pagoda paint paisley pajama palace palette palm pan pancake panda ' +
    'panel pansy panther pantry papaya paper paprika parade parasol parcel park parka parlor parrot parsley parsnip ' +
    'partner party pasta paste pastel pastry pasture patch path patio patron pause paw peace peach peacock peak ' +
    'peanut pear pearl pebble pecan pedal pelican pen pencil pendant penguin pennant penny pepper perch perfume petal ' +
    'petrel petunia pewter phoenix phone photo piano piccolo pickle picnic pie pier pig pigeon pillow pilot pine pink ' +
    'pint pioneer pipe pirate piston pitch pitcher pivot pixel pizza place plaid plain plan planet plank plant plate ' +
    'plateau playful plaza plover plum plumber plume plus pocket podium poem poet point polar polka pompom poncho ' +
    'pond pony pool popcorn poppy porch port portal pose posture pot potato potion pouch poultry powder prairie ' +
    'praline prawn premier press pretzel primer printer prism prize prodigy promise prose proud prune pudding puffin ' +
    'pulse puma pumice pump pumpkin punch pupil puppet puppy purple purse puzzle quack quail quaint quarry quart ' +
    'quartz quasar queen quench query quest quick quiet quill quilt quiver quiz quokka quota rabbit race radar radio ' +
    'radish raft rafter rail rain raisin rake rally ramp ranch range rapid rascal rattan raven razor reach realm ' +
    'recess recipe reef relay relic remedy remix rent reply rescue resort rhino rhyme ribbon rice riddle ridge ring ' +
    'ringer rinse ripple river road roast robin robot rock rocker rocket rodeo roof room root rope rose rotor round ' +
    'route rover royal rubble ruby rudder rug rugby ruler rumble rumor runway rural rush rust rustic sable sachet ' +
    'saddle safari safe saga sage sail salad salami salmon salon salsa salt sample sand sandal satin saturn sauce ' +
    'sauna savory scale scarf scene scenic scent school scoop score scout screen scroll sea seal season seat sedan ' +
    'seed sequel sequin serene sesame sextet shade shadow shanty shark sheep shelf shell sherpa shield shine ship ' +
    'shirt shoe shore shovel shrimp shrub sienna sierra signal silk silo silver simple siren sister sketch ski skill ' +
    'sky slalom slate sled sleeve sleigh slice slinky slope sloth smile smoke snack snail snake snow soap soccer sock ' +
    'sofa soil solace solar solid sonar song sonnet sorbet sorrel soup south space spark sphinx spice spider spiral ' +
    'sponge spoon sport spray spring sprout spruce spy square squash squid stable stage stair stamp stanza star ' +
    'statue steam steel stem step stew stick stone stool storm story stove straw stream street stripe studio sugar ' +
    'suit summer summit sun sundae sunlit sunny sunset superb supper surf surfer swan sweet swift swing syrup table ' +
    'tablet taco tail talent tamale tangle tango tank tape target tavern taxi tea teacup team teapot teddy tempo ' +
    'tennis tent thatch thick throne thrush thumb ticket tidal tide tiger tile timber tinsel tiny toast today toffee ' +
    'tomato tone tongue tool tooth topaz torch total toucan towel tower town toy track trade trail train tram travel ' +
    'tray treat tree trend tribe trick trio trophy truck trunk trust truth tuba tulip tuna tundra tunnel turkey ' +
    'turnip turtle tutor tutu tuxedo twig twin twist ultra uncle under unfold union unit upbeat upland uplift upper ' +
    'upward urban usher utmost vacuum valley valor value valve van vapor vase vault vector velcro velour velvet ' +
    'vendor venue verse vertex vessel vest veto video view vigor viking villa vine vinyl violet violin viper virtue ' +
    'visa visit visor vista vital vivid vocal voice volume vortex voyage wafer waffle wagon waist walnut walrus wand ' +
    'warm wasabi washer wasp watch water wave wax weave wedge whale wheat wheel whimsy whirl whisk wick wicker wide ' +
    'widget wigwag wild willow wind window wing winter wiper wire wisdom wise wish wizard wolf wombat wood wool ' +
    'woolen word world worm wreath wren wrist xenon yacht yak yam yard yarn year yeast yellow yeoman yeti yield yodel ' +
    'yoga yogurt yolk yonder young yummy zebra zenith zephyr zero zest zigzag zinc zinnia zipper zone zoo zoom ' +    ''
  ).trim().split(' ');

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }

  // nextU32() 가 주는 0 ≤ x < 2^32 로 0 ≤ r < max 를 만든다(거부 샘플링: limit 이상은 버리고 다시 → 모든 값이 정확히 같은 확률).
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('password-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('password-core: random source keeps returning rejected values');
  }
  // 256개씩 미리 받아 두는 crypto 32비트 난수
  var pool = null, poolAt = 256;
  function cryptoU32() {
    if (poolAt >= 256) {
      var c = cryptoObj();
      if (!c) throw new Error('password-core: crypto.getRandomValues is not available');
      if (!pool) pool = new Uint32Array(256);
      c.getRandomValues(pool);
      poolAt = 0;
    }
    var v = pool[poolAt];
    pool[poolAt++] = 0;   // 쓴 값은 지운다
    return v;
  }
  function cryptoInt(max) { return uniformInt(max, cryptoU32); }
  // rnd(max) → 0 ≤ r < max. 검사에서는 결정적 함수를 넣는다.
  function rndOf(rnd) { return typeof rnd === 'function' ? rnd : cryptoInt; }

  // ---------------------------------------------------------------- 옵션
  function clampInt(v, lo, hi, dflt) {
    var n = typeof v === 'number' ? v : parseInt(String(v == null ? '' : v), 10);
    if (!isFinite(n)) return dflt;
    return Math.min(hi, Math.max(lo, Math.round(n)));
  }
  function bool(v, dflt) { return v == null ? dflt : !!v; }
  // 화면에서 온 값을 안전한 옵션으로 (범위 밖은 잘라 낸다)
  function normalize(o) {
    o = o || {};
    var D = DEFAULTS;
    return {
      mode: o.mode === 'passphrase' ? 'passphrase' : 'password',
      length: clampInt(o.length, LEN_MIN, LEN_MAX, D.length),
      upper: bool(o.upper, D.upper), lower: bool(o.lower, D.lower), digits: bool(o.digits, D.digits), symbols: bool(o.symbols, D.symbols),
      similar: bool(o.similar, D.similar),
      words: clampInt(o.words, WORDS_MIN, WORDS_MAX, D.words),
      sep: Object.prototype.hasOwnProperty.call(SEPARATORS, o.sep) ? o.sep : D.sep,
      capitalize: bool(o.capitalize, D.capitalize), number: bool(o.number, D.number),
      count: COUNTS.indexOf(Number(o.count)) >= 0 ? Number(o.count) : D.count,
    };
  }
  // 고른 글자 묶음들 (헷갈리는 글자 빼기 반영). 비어 있으면 [].
  function classesFor(o) {
    var out = [];
    CLASS_ORDER.forEach(function (k) {
      if (!o[k]) return;
      var chars = CLASSES[k];
      if (o.similar) chars = chars.split('').filter(function (ch) { return SIMILAR.indexOf(ch) < 0; }).join('');
      if (chars) out.push({ id: k, chars: chars });
    });
    return out;
  }
  // 옵션 검사: { ok, error } — 비밀번호 모드에서 글자 종류를 하나도 안 골랐으면 needType
  function validate(o) {
    var p = normalize(o);
    if (p.mode === 'password' && !classesFor(p).length) return { ok: false, error: 'needType', p: p };
    return { ok: true, p: p };
  }

  // ---------------------------------------------------------------- 비밀번호
  function generatePassword(o, rnd) {
    var p = normalize(o);
    var cls = classesFor(p);
    if (!cls.length) throw new Error('password-core: no character class');
    var all = cls.map(function (c) { return c.chars; }).join('');
    var r = rndOf(rnd);
    for (var tries = 0; tries < 100000; tries++) {
      var out = '';
      for (var i = 0; i < p.length; i++) out += all.charAt(r(all.length));
      // 고른 묶음마다 1글자 이상 — 아니면 통째로 다시(부분 고치기는 분포를 치우치게 한다)
      var okAll = cls.every(function (c) {
        for (var j = 0; j < out.length; j++) if (c.chars.indexOf(out.charAt(j)) >= 0) return true;
        return false;
      });
      if (okAll) return out;
    }
    throw new Error('password-core: could not satisfy character classes');
  }
  // log2( 길이 L, 묶음 크기 sizes 일 때 묶음마다 1개 이상 들어간 문자열 수 )
  //   = L·log2(N) + log2( Σ_{S ⊆ 묶음} (-1)^|S| (1 - |S의 글자 수|/N)^L )   (포함·배제)
  function log2Valid(sizes, L) {
    var N = sizes.reduce(function (a, b) { return a + b; }, 0);
    if (!N || L < 1) return 0;
    var k = sizes.length;
    var sum = 0;
    for (var mask = 0; mask < (1 << k); mask++) {
      var s = 0, bits = 0;
      for (var i = 0; i < k; i++) if (mask & (1 << i)) { s += sizes[i]; bits++; }
      sum += (bits % 2 ? -1 : 1) * Math.pow(1 - s / N, L);
    }
    if (!(sum > 0)) return 0;
    return L * Math.log2(N) + Math.log2(sum);
  }
  function passwordEntropy(o) {
    var p = normalize(o);
    var cls = classesFor(p);
    if (!cls.length) return 0;
    return log2Valid(cls.map(function (c) { return c.chars.length; }), p.length);
  }

  // ---------------------------------------------------------------- 패스프레이즈
  function cap(w) { return w.charAt(0).toUpperCase() + w.slice(1); }
  function generatePassphrase(o, rnd) {
    var p = normalize(o);
    var r = rndOf(rnd);
    var list = [];
    for (var i = 0; i < p.words; i++) {
      var w = WORDS[r(WORDS.length)];
      list.push(p.capitalize ? cap(w) : w);
    }
    if (p.number) {
      var at = r(list.length);
      list[at] += String(r(10));
    }
    return list.join(SEPARATORS[p.sep]);
  }
  function passphraseEntropy(o) {
    var p = normalize(o);
    return p.words * Math.log2(WORDS.length) + (p.number ? Math.log2(10 * p.words) : 0);
  }

  // ---------------------------------------------------------------- 공통
  function entropy(o) { return normalize(o).mode === 'passphrase' ? passphraseEntropy(o) : passwordEntropy(o); }
  function generate(o, rnd) { return normalize(o).mode === 'passphrase' ? generatePassphrase(o, rnd) : generatePassword(o, rnd); }
  // 여러 개 한꺼번에 (count = 1 | 5)
  function generateMany(o, rnd) {
    var p = normalize(o);
    var out = [];
    for (var i = 0; i < p.count; i++) out.push(generate(p, rnd));
    return out;
  }
  function strength(bits) {
    if (bits < 45) return 'weak';
    if (bits < 60) return 'fair';
    if (bits < 80) return 'strong';
    return 'veryStrong';
  }
  // 평균 깨는 시간: 2^(bits-1) / rate 초 → { unit: instant|second|minute|hour|day|year|forever, value, seconds }
  function crackTime(bits, rate) {
    rate = rate || GUESSES_PER_SEC;
    var sec = Math.pow(2, Math.max(0, bits - 1)) / rate;
    var out = { seconds: sec };
    if (sec < 1) { out.unit = 'instant'; out.value = 0; }
    else if (sec < 60) { out.unit = 'second'; out.value = Math.round(sec); }
    else if (sec < 3600) { out.unit = 'minute'; out.value = Math.round(sec / 60); }
    else if (sec < 86400) { out.unit = 'hour'; out.value = Math.round(sec / 3600); }
    else if (sec < YEAR_SEC) { out.unit = 'day'; out.value = Math.round(sec / 86400); }
    else if (sec / YEAR_SEC <= UNIVERSE_YEARS) { out.unit = 'year'; out.value = sec / YEAR_SEC; }
    else { out.unit = 'forever'; out.value = sec / YEAR_SEC; }
    if (out.unit === 'year') out.value = out.value < 100 ? Math.round(out.value) : Number(out.value.toPrecision(2));
    return out;
  }

  return {
    LEN_MIN: LEN_MIN, LEN_MAX: LEN_MAX, LEN_DEFAULT: LEN_DEFAULT, WORDS_MIN: WORDS_MIN, WORDS_MAX: WORDS_MAX, WORDS_DEFAULT: WORDS_DEFAULT,
    COUNTS: COUNTS, GUESSES_PER_SEC: GUESSES_PER_SEC, UNIVERSE_YEARS: UNIVERSE_YEARS, SIMILAR: SIMILAR, CLASSES: CLASSES, CLASS_ORDER: CLASS_ORDER,
    SEPARATORS: SEPARATORS, SEP_ORDER: SEP_ORDER, DEFAULTS: DEFAULTS, WORDS: WORDS,
    uniformInt: uniformInt, cryptoInt: cryptoInt, normalize: normalize, classesFor: classesFor, validate: validate,
    generatePassword: generatePassword, log2Valid: log2Valid, passwordEntropy: passwordEntropy,
    generatePassphrase: generatePassphrase, passphraseEntropy: passphraseEntropy,
    entropy: entropy, generate: generate, generateMany: generateMany, strength: strength, crackTime: crackTime,
  };
});
