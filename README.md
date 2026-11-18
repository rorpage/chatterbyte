# ChatterByte

A retro, 8-bit style web app for practicing foreign languages. It asks multiple-choice questions about vocabulary and grammar, and it can say words out loud.

## Languages

- Afrikaans (beginner)
- German (beginner)
- isiXhosa (beginner)
- Italian (beginner)
- Norwegian Bokmal (intermediate)
- Spanish (intermediate)
- Swedish (beginner)

## Features

- **Levels:** pick BEGINNER, INTERMEDIATE, or ADVANCED for each language. Only content at that level is shown.
- **Words mode:** vocabulary practice. Each question shows a word in English or in the language you are learning, and you pick the translation.
- **Categories:** in Words mode, practice one category at a time, such as numbers, days, months, colors, family, food, animals, or weather. The categories depend on the level.
- **Sentences mode:** grammar practice. Each question is a sentence with one blank. After you answer, you see the English translation and a short grammar note.
- **Tense filter:** in Sentences mode, practice one tense at a time (present, past, future, conditional, and others, depending on the language).
- **Multiple choice only:** you never need to type accented letters.
- **Repeats your mistakes:** words and sentences you get wrong come back more often.
- **Speech:** click the SAY IT button, or click any word in the language you are learning, to hear it. This uses the voices built into your browser. Microsoft Edge has the most voices, including Afrikaans. When there is no isiXhosa voice, the app uses an isiZulu voice. When there is no Afrikaans voice, it uses a Dutch voice.
- **Saved progress:** scores and streaks are saved in your browser for each language.
- **Keyboard support:** press 1 to 4 to answer and Enter to go to the next question.

## Running it

There is no build step and nothing to install. Open `index.html` in a browser.

To host it, deploy the folder as a static site, for example on Vercel or GitHub Pages.

## Adding content

Each language has its own file in `data/`, for example `data/es.js` for Spanish. Each file has two lists:

- `words`: groups of words. Each group has a category `c`, a level `l`, and a list `w` of `[word in the language, English meaning]` pairs.
- `sentences`: objects with these fields:
  - `t`: tag for the tense filter, for example `present` or `past`
  - `l`: level: `beginner`, `intermediate`, or `advanced`
  - `s`: the sentence, with `___` where the blank is
  - `a`: the correct answer
  - `o`: four options, including the correct answer
  - `en`: the English translation
  - `n`: a short grammar note

Keep sentences with the same tag next to each other. The filter buttons appear in the same order as the tags in the list. `AGENTS.md` lists every rule, including the required categories and minimum counts for each level.

After you change a data file, run:

```
node check.js
```

It prints `ok` when the data is valid. Run `node check.js es` to check one language. It reports missing answers, duplicate words, missing categories, levels with too little content, and non-ASCII characters in files outside `data/`.

## Files

- `index.html`: the app (HTML, CSS, and JavaScript)
- `data/`: quiz content, one file per language
- `check.js`: data validation script
- `AGENTS.md`: instructions for AI coding assistants
- `CLAUDE.md`: points to `AGENTS.md`
