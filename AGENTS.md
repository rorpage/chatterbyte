# ChatterByte

A single-page app for language practice. The user speaks English and practices these languages. The level in parentheses is the default level the app opens with; the user can change it.

- Afrikaans (beginner)
- German (beginner)
- isiXhosa (beginner)
- Italian (beginner)
- Norwegian Bokmal (intermediate, maintaining skills)
- Spanish (intermediate)
- Swedish (beginner)

Language buttons are in alphabetical order. Keep that order when adding a language to `LANGS` in `index.html`.

## Communication rules

These rules apply to everything you write: replies, code, comments, commit messages, docs, and quiz content.

- Use plain, literal language. Never use idioms, figures of speech, metaphors, slang, or clever wording. Say exactly what you mean.
- Never use Unicode characters. This includes em dashes, en dashes, ellipsis characters, smart quotes, arrows, and emoji. Use plain ASCII: a hyphen, three periods, straight quotes.
- The only exception is letters that a language needs, such as accented letters in Spanish, Norwegian, Swedish, German, Italian, or Afrikaans words. Those letters belong only in the files in `data/`.

## Files

- `index.html`: the whole app (HTML, CSS, and JavaScript). No build step and no dependencies.
- `data/<code>.js`: the quiz content for one language, for example `data/af.js`. Each file sets `DATA.<code> = { words, sentences }`. The format is below.
- `check.js`: validates the data files and checks that the other files are plain ASCII.
- `README.md`: overview for people who visit the repository. Update it when features or languages change.

## Data format

### Words

`words` is a list of groups. Each group has a category `c`, a level `l`, and a list of `[word, english]` pairs `w`:

```js
{ c: "colors", l: "beginner", w: [["rojo", "red"], ["azul", "blue"]] },
```

- Levels: `beginner`, `intermediate`, `advanced`.
- Categories: `general`, `numbers`, `days`, `months`, `colors`, `family`, `food`, `animals`, `body`, `weather`, `clothing`, `home`, `jobs`, `travel`, `feelings`.
- Each level must include these categories:
  - beginner: general, numbers (0 to 10), days, months, colors, family, food, animals, body
  - intermediate: general, numbers (11 to 100), weather, clothing, home
  - advanced: general, numbers (hundreds, thousands, a million, and ordinals such as first), jobs, travel, feelings
- A category appears at most once per level. Each group needs at least 6 words.
- Minimum words per level: beginner 80, intermediate 50, advanced 50.
- A word may appear only once in a language. An English meaning may appear only once per level.
- The answer options for a question come from the same category and level, so meanings in a group must be clearly different.

### Sentences

`sentences` is a list of fill-in-the-blank grammar items:

```js
{ t: "present", l: "beginner", s: "Yo ___ en Madrid.", a: "vivo", o: ["vivo", "vives", "vive", "viven"], en: "I live in Madrid.", n: "Vivir: yo vivo." },
```

- `t`: tag for the tense filter: `present`, `preterite`, `imperfect`, `past`, `perfect`, `future`, `conditional`, `subjunctive`, or `other` (grammar that is not about tense).
- `l`: level.
- `s`: the sentence, with exactly one `___` blank.
- `a`: the correct answer. `o`: four different options, including the answer. Only the answer may be correct; the English translation must make the intended answer clear.
- `en`: the English translation. `n`: a short grammar note.
- Sentences with the same tag must be next to each other. The filter buttons appear in that order. `other` goes last.
- Each tag needs at least 6 sentences in total. Each level needs at least 12 sentences.

### Levels

- beginner: everyday words, the present tense, and the most common past and future forms.
- intermediate: less common everyday words and the remaining main tenses.
- advanced: abstract words, the subjunctive and conditional, and complex sentences.

## Running

Open `index.html` in a browser. Progress is saved in `localStorage`.

After changing a data file, run `node check.js` (or `node check.js af` for one language). It prints `ok` when the data is valid.

## How it works

- All options (language, level, mode, and the category or tense filter) are in a side menu. The menu is a full-height panel against the left edge of the window. The menu button is fixed in the top left corner: when the menu is open, it sits at the top of the menu and shows an X; when the menu is closed, it shows three bars. On screens 900px and wider, it is open by default and the page moves right to make room for it. On narrower screens, it is closed by default and covers the page when open. A line above the quiz shows the current choices.
- For each language, the user picks a level (BEGINNER, INTERMEDIATE, ADVANCED) and a mode (WORDS or SENTENCES). Only content at the selected level is shown.
- In Words mode, a row of category buttons filters by category (ALL, NUMBERS, COLORS, and so on). In Sentences mode, the same row filters by tense tag. Only categories and tags with at least 3 items at the selected level are shown; items in smaller groups still appear under ALL. The level, category, and tag are saved per language.
- Every question is multiple choice, so the user never has to type special characters.
- Items the user gets wrong appear more often (weighted random choice).
- The "SAY IT" button uses the browser speech API. It only uses a voice that matches the language. For Afrikaans it falls back to a Dutch voice, and for isiXhosa to an isiZulu voice, because isiXhosa voices are rarely available. If no matching voice exists, the button is hidden. Words in the target language are also clickable: each word of a sentence, a whole vocabulary entry, and (after answering) the answer options. Microsoft Edge includes online Afrikaans voices; most other browsers do not.

## Style rules

- Theme: 8-bit style on a black background. Picton blue (`#45B1E8`) is the main color, with neon pink (`#FF2BD6`) and neon green (`#39FF14`) as accents. The quiz card and buttons are dark navy. The colors are CSS variables at the top of `index.html`. Fonts are "Press Start 2P" for headings and buttons and "Space Mono" for body text and language content. VT323 and Pixelify Sans were tried first and were harder to read.
- Keep it simple: no frameworks, no build tools, no new files unless needed.
- Make sure all grammar notes and translations are correct. Content must match its level.
