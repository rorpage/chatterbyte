// Validates data.js. Run: node check.js
const assert = require("assert");
const DATA = require("./data.js");

for (const [lang, { words, sentences }] of Object.entries(DATA)) {
  assert(words.length >= 4, `${lang}: need at least 4 words for multiple choice`);
  for (const col of [0, 1]) {
    const seen = new Set();
    for (const w of words) {
      assert(w.length === 2 && w[0] && w[1], `${lang}: bad word entry ${JSON.stringify(w)}`);
      assert(!seen.has(w[col]), `${lang}: duplicate "${w[col]}"`);
      seen.add(w[col]);
    }
  }
  const TAGS = ["present", "preterite", "imperfect", "past", "perfect", "future", "conditional", "subjunctive", "other"];
  const counts = {};
  let lastTag;
  for (const q of sentences) {
    assert(TAGS.includes(q.t), `${lang}: unknown tag "${q.t}" in "${q.s}"`);
    assert(q.t === lastTag || !(q.t in counts), `${lang}: sentences with tag "${q.t}" must be grouped together`);
    counts[q.t] = (counts[q.t] || 0) + 1;
    lastTag = q.t;
  }
  for (const [tag, count] of Object.entries(counts)) {
    assert(count >= 6, `${lang}: tag "${tag}" has only ${count} sentences, need at least 6`);
  }
  for (const q of sentences) {
    assert(q.s.split("___").length === 2, `${lang}: need exactly one blank in "${q.s}"`);
    assert(q.o.length === 4 && new Set(q.o).size === 4, `${lang}: need 4 unique options in "${q.s}"`);
    assert(q.o.includes(q.a), `${lang}: answer missing from options in "${q.s}"`);
    assert(q.en && q.n, `${lang}: missing translation or note in "${q.s}"`);
  }
}

// Only the language data may use non-ASCII characters.
const fs = require("fs");
for (const f of ["index.html", "check.js", "AGENTS.md", "CLAUDE.md", "README.md"]) {
  const bad = fs.readFileSync(`${__dirname}/${f}`, "utf8").match(/[^\x00-\x7F]/g);
  assert(!bad, `${f}: non-ASCII characters ${bad}`);
}

console.log("ok");
