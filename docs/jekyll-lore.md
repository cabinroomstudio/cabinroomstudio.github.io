# Jekyll: the novella, the name, and the thing that builds this site

Notes written 2026-10-31, after the `_config.yml` question.

Claims below are marked where they are *documented* (someone wrote it down at the
time) versus *commonly repeated* (retold so often it reads as fact, but the trail
is thin). The second kind is most of what makes a good story.

---

## 1. The book

**Strange Case of Dr Jekyll and Mr Hyde**, Robert Louis Stevenson, published
January 1886 by Longmans, Green & Co. in London, with a Scribner's edition in
the United States the same month.

Note the title. No "The". Almost every reprint, poster and school reading list
adds one, and it has been wrong for 140 years.

### What it actually is

It is short, about 25,000 words, and it is structured as a **detective story that
withholds its own premise**. A modern reader knows the twist before opening it,
which is a strange fate for a book: the plot depends on you not knowing that
Jekyll and Hyde are the same man, and you have known since childhood.

The telling is indirect. Most of it follows **Gabriel John Utterson**, a dry,
decent London lawyer who is worried about a friend's will. He is not a detective
and he is not brave. He is a man doing due diligence, and the horror arrives
through paperwork, a door, a cheque, a handwriting sample.

The last two chapters hand the narration over: first a letter from **Dr Lanyon**,
who saw the transformation and did not survive the knowledge, then "Henry
Jekyll's Full Statement of the Case", the confession that explains everything.
So the book is a case file. Hence "Strange Case", like something filed at a
coroner's office, which is part of why the missing "The" matters.

### The part your teacher probably told you

The writing legend, *commonly repeated*, mostly from Stevenson's wife Fanny and
his stepson Lloyd Osbourne: Stevenson was ill in Bournemouth, dreamed the central
scene, woke in excitement, and wrote a complete draft in roughly three days.
Fanny read it and told him he had written it as a straight shocker and missed the
allegory. He burned the manuscript and rewrote the whole thing in another few
days.

Every part of that is disputed in the details, including whether anything was
burned and whether a man in that state could physically write 25,000 words in
three days. Stevenson himself did write, *documented*, about getting plots from
dreams, crediting what he called the "Brownies" of his sleeping mind.

### Where the idea came from

*Commonly repeated, and good:* Edinburgh had a real double life in its civic
memory. **Deacon William Brodie** was a respected cabinetmaker and town
councillor by day and a housebreaker by night, hanged in 1788. Stevenson grew up
with the story, and in 1880 co-wrote a play with W. E. Henley called *Deacon
Brodie, or The Double Life*. It is also often said that a cabinet built by Brodie
stood in Stevenson's childhood bedroom, which is too neat to check and too good
to leave out.

The deeper context is Victorian and *documented* in the criticism rather than in
Stevenson: a culture organised around respectability, with an enormous unspoken
underside, reading Darwin and worrying that civilisation was a thin coat of paint
over an animal. Hyde is smaller, younger and more energetic than Jekyll. The
suppressed self is not a monster from outside. It is fitter.

### The afterlife

- It sold hugely and fast, roughly 40,000 copies in Britain within six months,
  which made Stevenson's name with the general public rather than just readers of
  *Treasure Island*.
- A stage version by Thomas Russell Sullivan, starring **Richard Mansfield**, ran
  in London in 1888, the autumn of the Whitechapel murders. *Commonly repeated:*
  the performance was so convincing that someone wrote to the police suggesting
  Mansfield might be the Ripper, and the run ended early. The chronology is real;
  the causation is folklore.
- "A Jekyll and Hyde" entered the language as shorthand for a split personality,
  which is both the book's greatest success and a small act of violence against
  it, since the book is not about two people sharing a body so much as one man
  discovering he was never single to begin with.
- *Commonly repeated:* Stevenson insisted the name was pronounced "JEE-kyll", not
  "JECK-yll". Nobody has complied.

Stevenson died in Samoa in 1894, aged 44.

---

## 2. The software

**Jekyll** is a static site generator: it takes a folder of text files and turns
them into a folder of finished HTML, with no database and nothing running on the
server afterwards.

### Origins

*Documented:* Tom Preston-Werner, one of GitHub's founders, released Jekyll in
November 2008 and announced the idea in a post titled **"Blogging Like a
Hacker"**. The argument was that a blog should be plain text files under version
control, edited in your own editor, with the publishing step being a push. No
admin panel, no comment spam, no database to restore.

GitHub Pages launched on top of it weeks later, which is why a GitHub repository
can become a website with no build server: Pages has been running Jekyll for you
since the beginning.

It is written in Ruby. It reads Markdown for content, YAML "front matter" at the
top of each file for metadata, and **Liquid**, the templating language Shopify
had open-sourced, for layouts and loops.

### The name

The usual reading is the obvious one: duality. Plain text on one side, a finished
website on the other, one thing with two faces, mild-mannered content and the
transformation that happens when you are not watching.

I have not found Preston-Werner stating this outright, so it is *commonly
repeated* rather than *documented*. What is *documented* is that the joke landed:
when a Python equivalent appeared around 2010, it was called **Hyde**. The pair
has been a standing gag in static site tooling ever since.

### The family tree

- **Jekyll** (2008, Ruby) is still maintained, and is still what GitHub Pages
  builds with by default.
- **Hyde** (around 2010, Python), named as the counterpart.
- **Octopress** (2011) was "a blogging framework for hackers" layered on Jekyll,
  hugely popular for a few years, now largely historical.
- **Hugo** (2013, Go) won on speed. **Eleventy** (2018, JavaScript) won on
  flexibility. **Astro** and friends came later and blurred the line between
  static generation and app frameworks.

The idea outlasted the fashion. A site that is just files is cheap, fast,
archivable and almost impossible to break, which is why this one is built that
way with no generator at all.

---

## 3. What any of this has to do with this repo

This site is hand-written HTML and CSS. It uses no Jekyll features: no front
matter, no layouts, no Liquid. But Pages still runs Jekyll over the repository on
every push, and Jekyll has opinions:

- Anything whose name starts with `_` is ignored by default. That is why Jekyll's
  own config is `_config.yml`, and why its conventional folders are `_posts`,
  `_layouts`, `_includes`, `_data`, with the output landing in `_site`.
- `_config.yml` is where you override those defaults. Ours says exactly one
  thing:

  ```yaml
  exclude: [docs, scripts]
  ```

  which keeps `docs/` (these notes, the session log, the lessons file) and
  `scripts/` (the gate) in the repository but out of the published site. Before
  that line existed, `cabinroomstudio.github.io/docs/SESSION.md` was a live,
  public URL. Now it is a 404, verified after the push.
- The nuclear option, if you ever want Pages to stop processing entirely and just
  serve the files as they are, is an empty file named `.nojekyll` at the root.
  We do not need it: with no Liquid tags in the HTML, Jekyll is only copying
  files through.

So the Victorian doctor is in your build pipeline because a GitHub founder made a
pun in 2008, and the reason your private notes are private is a config file named
after the half of him that stayed respectable.
