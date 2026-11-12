# ChatterByte

A single-page app for language practice. The user speaks English and practices these languages:

- Afrikaans (beginner)
- German (beginner)
- isiXhosa (beginner)
- Italian (beginner)
- Norwegian Bokmal (intermediate, maintaining skills)
- Spanish (intermediate)

Language buttons are in alphabetical order. Keep that order when adding a language to `LANGS` in `index.html`.

## Files

- `index.html`: the whole app (HTML, CSS, and JavaScript). No build step and no dependencies.
- `data.js`: all quiz content. `words` are `[target, english]` pairs. `sentences` are fill-in-the-blank grammar items with one `___` blank, an answer `a`, four options `o`, an English translation `en`, a grammar note `n`, and a tag `t` (for example `present`, `past`, `future`, or `other`). Sentences must be grouped by tag; the filter buttons appear in that order. Each tag needs at least 6 sentences.
- `check.js`: validates `data.js` and checks for non-ASCII characters in the other files.
- `README.md`: overview for people who visit the repository. Update it when features or languages change.

## Running

Open `index.html` in a browser. Progress is saved in `localStorage`.

After changing `data.js`, run `node check.js`. It prints `ok` when the data is valid.

## How it works

- Two modes per language: Words (vocabulary, random direction) and Sentences (grammar).
- In Sentences mode, a row of tag buttons filters by tense (ALL, PRESENT, PAST, and so on). The selected tag is saved per language.
- Every question is multiple choice, so the user never has to type special characters.
- Items the user gets wrong appear more often (weighted random choice).
- The "SAY IT" button uses the browser speech API. It only uses a voice that matches the language. For Afrikaans it falls back to a Dutch voice, and for isiXhosa to an isiZulu voice, because isiXhosa voices are rarely available. If no matching voice exists, the button is hidden. Words in the target language are also clickable: each word of a sentence, a whole vocabulary entry, and (after answering) the answer options. Microsoft Edge includes online Afrikaans voices; most other browsers do not.

## Style rules

- Theme: picton blue (`#45B1E8`) on a dark navy background, 8-bit style. Fonts are "Press Start 2P" for headings and buttons and "Space Mono" for body text and language content. VT323 and Pixelify Sans were tried first and were harder to read.
- Use plain, literal language in text, comments, and docs. Do not use idioms or clever wording.
- Do not use Unicode characters (em dashes, ellipsis, emoji, smart quotes) unless the language content needs them, for example accented Spanish, Norwegian, or Afrikaans letters. Those belong only in `data.js`.
- Keep it simple: no frameworks, no build tools, no new files unless needed.
- Make sure all grammar notes and translations are correct. Content for the beginner languages should stay at a beginner level.
