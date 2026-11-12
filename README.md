# ChatterByte

A retro, 8-bit style web app for practicing foreign languages. It asks multiple-choice questions about vocabulary and grammar, and it can say words out loud.

## Languages

- Afrikaans (beginner)
- German (beginner)
- isiXhosa (beginner)
- Italian (beginner)
- Norwegian Bokmal (intermediate)
- Spanish (intermediate)

## Features

- **Words mode:** vocabulary practice. Each question shows a word in English or in the language you are learning, and you pick the translation.
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

All words and sentences are in `data.js`. Each language has two lists:

- `words`: pairs of `[word in the language, English meaning]`.
- `sentences`: objects with these fields:
  - `t`: tag for the tense filter, for example `present` or `past`
  - `s`: the sentence, with `___` where the blank is
  - `a`: the correct answer
  - `o`: four options, including the correct answer
  - `en`: the English translation
  - `n`: a short grammar note

Keep sentences with the same tag next to each other. The filter buttons appear in the same order as the tags in the list.

After you change `data.js`, run:

```
node check.js
```

It prints `ok` when the data is valid. It reports missing answers, duplicate words, tags with fewer than 6 sentences, and non-ASCII characters in files other than `data.js`.

## Files

- `index.html`: the app (HTML, CSS, and JavaScript)
- `data.js`: all quiz content
- `check.js`: data validation script
- `AGENTS.md`: instructions for AI coding assistants
- `CLAUDE.md`: points to `AGENTS.md`
