module.exports = {
  metaTitle: 'Word Counter Guide: How Characters, Words & Bytes Are Counted',
  description: 'How a word and character counter defines characters, words, sentences and bytes, why Word and websites disagree, common limits like X’s 280 characters, and tips for writing to a limit.',
  h1: 'Word counter guide: what gets counted, why tools disagree, and how to hit a limit',
  updated: '2026-10-15',
  intro: 'Character limits are everywhere: a 500-character application answer, a 280-character post, a meta description that gets cut off after about 155 characters, a school form that measures your text in bytes. A good counter tells you exactly where you stand while you write, so you are not trimming in a panic at the last minute. This guide explains how to use the counter, how each number is defined, why different tools give slightly different totals, which limits you are likely to meet, and how to write comfortably to a target.',
  sections: [
    {
      h: 'How to use the word counter',
      p: [
        'Type straight into the box or paste text from anywhere. The dark bar at the top of the box shows the four numbers people check most often: characters with spaces, characters without spaces, words and bytes. It stays in view while you scroll, so you can keep an eye on it as you edit a long draft. Below the box, the detailed panel adds sentences, paragraphs, lines and estimated reading and speaking time.',
        'If you are writing to a limit, pick 500, 1,000 or 1,500 characters, or type your own number. A progress bar fills as you write, turns amber near the end and red when you go over, and tells you exactly how many characters are left or how many to cut. Use the Count spaces switch to decide whether the limit follows the with-spaces or the no-spaces number. When you are done, press See summary to get a tidy overview you can copy.',
      ],
      list: [
        'Paste or type your text; the counts update on every keystroke.',
        'Set a target and choose whether spaces count toward it.',
        'Pick the byte rule your form uses: UTF-8, UTF-8 + CRLF or Legacy 2-byte.',
        'Use Tidy spaces or Join lines to clean pasted text; Undo brings it back.',
        'Your draft is saved only in this browser, so a reload will not lose it.',
      ],
    },
    {
      h: 'How each number is defined',
      p: [
        'Characters with spaces counts everything a reader would see as one character, plus spaces and line breaks. Each line break counts as 1, even if your system stores it as two invisible codes. The counter works with what Unicode calls grapheme clusters, so an accented letter like é, a Thai syllable with its tone mark, a flag, or a family emoji made of several joined code points each count as one character, the way your eye sees them. Characters without spaces simply removes every space, tab and line break from that total.',
        'Words are found with the browser’s built-in language-aware word breaker. For English and other spaced languages, a word is a run of letters or digits, and hyphenated forms such as well-known or e-mail count once. For Chinese, Japanese and Thai, which do not put spaces between words, the browser uses a dictionary to find word boundaries, so the word count is meaningful there too. Sentences end at full stops, question and exclamation marks (including 。！？), with common abbreviations such as Mr. and Dr. kept together. Paragraphs are blocks separated by a blank line, and lines are the non-empty lines.',
        'Reading time assumes about 238 words per minute for silent reading, the average found across many studies of adult readers, and speaking time assumes about 150 words per minute, a relaxed presentation pace. For Chinese and Japanese characters and Korean syllables the counter uses characters per minute instead, because word counts in those languages are not comparable.',
      ],
      list: [
        'UTF-8: 1 byte for basic Latin letters, digits and spaces, 2 for most accented and Cyrillic letters, 3 for Chinese, Japanese and Korean, 4 for most emoji.',
        'UTF-8 + CRLF: the same, but every line break counts as 2 bytes, like a Windows text file.',
        'Legacy 2-byte: ASCII is 1 byte, every other character 2, and a line break 2, approximating EUC-KR, Shift_JIS and GBK forms.',
      ],
    },
    {
      h: 'Why Word, Google Docs and websites give different counts',
      p: [
        'There is no single official way to count text, so small differences are normal. Microsoft Word does not count paragraph marks in its character totals, while many web forms do count line breaks, sometimes as two characters. Some tools count each Unicode code unit, which makes a single emoji count as two or even seven characters. Word processors differ on whether a hyphenated or slash-joined term is one word or two, and on how they treat numbers, URLs and email addresses.',
        'Online forms add their own twist: a text box may silently convert line breaks, strip trailing spaces, or measure bytes in the encoding the database uses. That is why the safest habit is to read the form’s instructions, match the counter’s settings to them, and leave a small margin of a few characters instead of landing exactly on the limit.',
      ],
    },
    {
      h: 'Limits you will meet: applications, manuscripts and social media',
      p: [
        'In Korea, application essays (jasoseo) usually set limits such as 500 or 1,000 characters including spaces, and some company systems measure bytes instead. School records in the NEIS system count Hangul as 3 bytes, Latin letters, digits and spaces as 1, and each line break as 2, so a 500-character field holds 1,500 bytes. Older forms based on EUC-KR count Hangul as 2 bytes, which is what the Legacy 2-byte mode approximates.',
        'In Japan, essays and entry sheets are often written to the 400-character genkō yōshi grid. On the grid every character and punctuation mark fills a square, a new paragraph starts with an empty square, and the unused squares at the end of each paragraph still count toward the page, so a manuscript page holds fewer real characters than 400. A plain character count is still the best way to check an online entry sheet with a 400-character box.',
        'Social platforms each have their own caps, and they change from time to time. On X a standard post allows 280 characters, but Chinese, Japanese and Korean characters weigh double, so roughly 140 of them fit. Search engines usually show around 155 to 160 characters of a meta description before cutting it off.',
      ],
      list: [
        'X (Twitter): 280 characters, CJK characters count as 2.',
        'Instagram caption: 2,200 characters.',
        'YouTube: 100-character title, 5,000-character description.',
        'SMS: 160 characters, or 70 when the message contains non-Latin characters or emoji.',
        'Meta description: aim for about 150 to 160 characters.',
      ],
    },
    {
      h: 'Tips for writing to a limit',
      p: [
        'Write the full draft first without watching the number, then cut. Trimming a long draft almost always produces tighter writing than padding a short one. Start with the biggest wins: delete sentences that repeat the question, replace phrases like in order to with to, and drop filler words such as really, very and just. The keyword panel helps here, because a word that appears five times in a short answer is usually a sign of repetition rather than emphasis.',
      ],
      list: [
        'Aim for 90 to 100 percent of the limit; reviewers often read a very short answer as low effort.',
        'Keep a margin of a few characters for forms that count line breaks differently.',
        'Use Tidy spaces after pasting from a PDF or email to remove double spaces and stray blank lines.',
        'Read the text aloud and check the speaking time when preparing a speech or video script.',
        'Save the final version somewhere else too; the draft here lives only in this browser.',
      ],
    },
  ],
  cta: 'Count your text now',
};
