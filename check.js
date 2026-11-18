// Validates the quiz data in data/ and the plain-text rules for the other files.
// Run: node check.js        (all languages)
//      node check.js af     (one language)
const assert = require("assert");
const fs = require("fs");

const LANGS = ["af", "de", "es", "it", "nb", "sv", "xh"];
const LEVELS = ["beginner", "intermediate", "advanced"];
const CATEGORIES = ["general", "numbers", "days", "months", "colors", "family", "food", "animals", "body",
  "weather", "clothing", "home", "jobs", "travel", "feelings", "verbs", "adjectives", "time", "questions"];
const REQUIRED_CATEGORIES = {
  beginner: ["general", "numbers", "days", "months", "colors", "family", "food", "animals", "body",
    "verbs", "adjectives", "time", "questions"],
  intermediate: ["general", "numbers", "weather", "clothing", "home", "verbs", "adjectives", "time"],
  advanced: ["general", "numbers", "jobs", "travel", "feelings", "verbs", "adjectives"],
};
const MIN_WORDS = { beginner: 200, intermediate: 120, advanced: 110 };
const MIN_SENTENCES_PER_LEVEL = 36;
const MIN_WORDS_PER_GROUP = 6;
const MIN_SENTENCES_PER_TAG = 6;
const TAGS = ["present", "preterite", "imperfect", "past", "perfect", "future", "conditional", "subjunctive", "other"];
// Punctuation that is never allowed, even in data files: en dash, em dash, ellipsis, smart quotes, arrow.
const FORBIDDEN = new RegExp("[" + [0x2013, 0x2014, 0x2026, 0x2018, 0x2019, 0x201C, 0x201D, 0x2192]
  .map(c => String.fromCharCode(c)).join("") + "]", "g");

globalThis.DATA = {};
const only = process.argv[2];
assert(!only || LANGS.includes(only), `unknown language "${only}"`);

for (const lang of only ? [only] : LANGS) {
  const file = `${__dirname}/data/${lang}.js`;
  const bad = fs.readFileSync(file, "utf8").match(FORBIDDEN);
  assert(!bad, `data/${lang}.js: forbidden characters ${bad}`);
  require(file);
  const { words, sentences } = DATA[lang];

  // Words: groups of { c: category, l: level, w: [[target, english], ...] }.
  const targets = new Set();
  const englishByLevel = Object.fromEntries(LEVELS.map(l => [l, new Set()]));
  const wordCount = Object.fromEntries(LEVELS.map(l => [l, 0]));
  const categoriesByLevel = Object.fromEntries(LEVELS.map(l => [l, new Set()]));
  for (const g of words) {
    const where = `${lang} words ${g.l}/${g.c}`;
    assert(CATEGORIES.includes(g.c), `${where}: unknown category`);
    assert(LEVELS.includes(g.l), `${where}: unknown level`);
    assert(!categoriesByLevel[g.l].has(g.c), `${where}: category appears twice in the same level`);
    categoriesByLevel[g.l].add(g.c);
    assert(g.w.length >= MIN_WORDS_PER_GROUP, `${where}: need at least ${MIN_WORDS_PER_GROUP} words`);
    for (const w of g.w) {
      assert(w.length === 2 && w[0] && w[1], `${where}: bad entry ${JSON.stringify(w)}`);
      assert(!targets.has(w[0]), `${where}: duplicate word "${w[0]}"`);
      targets.add(w[0]);
      assert(!englishByLevel[g.l].has(w[1]), `${where}: duplicate English meaning "${w[1]}" in this level`);
      englishByLevel[g.l].add(w[1]);
      assert(/^[\x00-\x7F]*$/.test(w[1]), `${where}: English meaning "${w[1]}" must be ASCII`);
    }
    wordCount[g.l] += g.w.length;
  }
  for (const l of LEVELS) {
    assert(wordCount[l] >= MIN_WORDS[l], `${lang}: ${l} has ${wordCount[l]} words, need at least ${MIN_WORDS[l]}`);
    for (const c of REQUIRED_CATEGORIES[l]) {
      assert(categoriesByLevel[l].has(c), `${lang}: ${l} is missing the "${c}" category`);
    }
  }

  // Sentences: grouped by tag t, each with a level l.
  const tagCounts = {};
  const levelCounts = Object.fromEntries(LEVELS.map(l => [l, 0]));
  const seen = new Set();
  let lastTag;
  for (const q of sentences) {
    const where = `${lang} sentence "${q.s}"`;
    assert(TAGS.includes(q.t), `${where}: unknown tag "${q.t}"`);
    assert(LEVELS.includes(q.l), `${where}: unknown level "${q.l}"`);
    assert(q.t === lastTag || !(q.t in tagCounts), `${where}: sentences with tag "${q.t}" must be grouped together`);
    assert(!seen.has(q.s), `${where}: duplicate sentence`);
    seen.add(q.s);
    assert(q.s.split("___").length === 2, `${where}: need exactly one blank`);
    assert(q.o.length === 4 && new Set(q.o).size === 4, `${where}: need 4 unique options`);
    assert(q.o.includes(q.a), `${where}: answer missing from options`);
    assert(q.en && q.n, `${where}: missing translation or note`);
    assert(/^[\x00-\x7F]*$/.test(q.en), `${where}: English translation must be ASCII`);
    tagCounts[q.t] = (tagCounts[q.t] || 0) + 1;
    levelCounts[q.l]++;
    lastTag = q.t;
  }
  for (const [tag, count] of Object.entries(tagCounts)) {
    assert(count >= MIN_SENTENCES_PER_TAG, `${lang}: tag "${tag}" has ${count} sentences, need at least ${MIN_SENTENCES_PER_TAG}`);
  }
  for (const l of LEVELS) {
    assert(levelCounts[l] >= MIN_SENTENCES_PER_LEVEL, `${lang}: ${l} has ${levelCounts[l]} sentences, need at least ${MIN_SENTENCES_PER_LEVEL}`);
  }
}

// Only data files may use non-ASCII characters, and only for language content.
for (const f of ["index.html", "check.js", "AGENTS.md", "CLAUDE.md", "README.md"]) {
  const bad = fs.readFileSync(`${__dirname}/${f}`, "utf8").match(/[^\x00-\x7F]/g);
  assert(!bad, `${f}: non-ASCII characters ${bad}`);
}

console.log("ok");
