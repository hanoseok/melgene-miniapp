module.exports = {
  metaTitle: 'Password Generator Guide: Strong Passwords & Passphrases',
  description: 'How to make strong passwords and memorable passphrases, what entropy and time to crack really mean, and why a password manager plus two-factor authentication matter.',
  h1: 'Password generator guide: strong passwords, passphrases and what entropy means',
  updated: '2026-10-13',
  intro: 'Most account break-ins do not start with a genius hacker. They start with a short password, a password reused from another site that leaked, or a guessable pattern like a name plus a year. A password generator removes the human from the part humans are worst at: being random. This guide shows how to use the generator, explains what actually makes a password strong, introduces passphrases, demystifies entropy and time-to-crack numbers, and ends with the two habits that matter even more than the password itself.',
  sections: [
    {
      h: 'How to use the password generator',
      p: [
        'Everything happens on one screen and on your own device. Choose Password or Passphrase at the top. For a password, drag the length slider anywhere from 4 to 64 characters and pick which kinds of characters to include: uppercase letters, lowercase letters, numbers and symbols. Every kind you switch on is guaranteed to appear at least once, which keeps sites with composition rules happy. If you will ever read the password aloud or type it from a screen, turn on Skip look-alikes to leave out 0, O, 1, l and I.',
        'For a passphrase, choose how many words you want (3 to 8), the separator between them, and whether to capitalize each word and add a number. Pick Just one or Five at once, then press Generate. Each result has its own Copy button, and the strength meter below shows the entropy in bits, a strength label and the estimated time to crack.',
      ],
      list: [
        'Pick Password or Passphrase.',
        'Set the length or the number of words.',
        'Choose character types, or separator and options.',
        'Press Generate and copy the one you like.',
        'Save it straight into your password manager.',
      ],
    },
    {
      h: 'What makes a password strong',
      p: [
        'Strength comes from how many possible passwords an attacker would have to try, not from how complicated a password looks. P@ssw0rd! looks messy, but cracking tools try common words with predictable substitutions first, so it falls in seconds. A truly random string is different: every character is an independent choice, and each extra character multiplies the number of possibilities. That is why length beats cleverness. Going from 12 to 16 random characters makes a password tens of millions of times harder to guess.',
        'Randomness is the other half. People choose birthdays, pet names, keyboard walks like qwerty and the same favourite pattern on every site, and attackers know all of these habits. The generator uses your browser’s cryptographic random source, crypto.getRandomValues, and a technique called rejection sampling so that every allowed character is exactly equally likely. There is no pattern to learn and no bias to exploit.',
        'The third ingredient is uniqueness. Even a perfect password becomes weak the moment it is reused, because a breach at one site hands it to attackers who then try it everywhere else. One account, one password.',
      ],
    },
    {
      h: 'Passphrases: strong and easier to remember',
      p: [
        'A passphrase is a handful of random words joined together, such as a short nonsense sentence. The trick is that the words must be chosen by chance, not by you. A line from a song or a famous quote is not random at all. This generator picks each word from a built-in list of 2,048 short English words, so every word adds exactly 11 bits of entropy. Five words give 55 bits, six give 66, and adding a random number contributes a few bits more.',
        'Passphrases shine for the handful of secrets you must actually type or remember: the master password of your password manager, your computer login or your phone backup. They are long, so they are strong, but they are made of real words, so they are far easier to type on a phone keyboard than a jumble of symbols. Capitalizing the words does not add strength because the pattern is predictable, but it can help with sites that insist on an uppercase letter.',
      ],
    },
    {
      h: 'Entropy and time to crack, explained',
      p: [
        'Entropy, measured in bits, counts how many equally likely possibilities a password was drawn from. Each bit doubles the count, so 60 bits means about a quintillion possibilities and 80 bits means a million times more than that. The meter calculates this exactly from your settings. For passwords it counts every string of your chosen length that contains at least one character of each selected kind; for passphrases it multiplies the word choices and the position and value of the added number.',
        'The time to crack assumes a fast offline attack testing 10 billion guesses every second, a rate well within reach of a single modern graphics card attacking a weakly protected leaked password database. On average an attacker finds the password after trying half of the possibilities. The estimate also assumes the attacker knows exactly which settings you used, so it never flatters you. Roughly: under 45 bits is weak, 45 to 60 is fair, 60 to 80 is strong, and 80 or more is very strong.',
      ],
      list: [
        'Throwaway or low-risk accounts: 45 to 60 bits.',
        'Everyday accounts such as shopping and social media: 60 to 80 bits.',
        'Email, banking, work and your password manager: 80 bits or more.',
      ],
    },
    {
      h: 'Password managers and two-factor authentication',
      p: [
        'Nobody can remember dozens of unique random passwords, and nobody should try. A password manager stores them in an encrypted vault, fills them in on the right websites and warns you about reused or leaked ones. Generate a strong password here, paste it into the manager when you create or change an account, and you never need to see it again. Protect the manager itself with a long passphrase that you do memorise.',
        'Two-factor authentication, often called 2FA, adds a second step such as a code from an authenticator app, a passkey or a hardware security key. Even if a password leaks, the attacker still cannot sign in. Turn it on first for your email, because email is how most other accounts are reset.',
      ],
      list: [
        'Use a different password for every account.',
        'Keep passwords in a password manager, not in notes, chats or screenshots.',
        'Turn on 2FA or passkeys wherever they are offered, starting with email.',
        'Change a password right away if a service reports a breach.',
        'Never share a password by message or email, and be wary of login links you did not expect.',
      ],
    },
  ],
  cta: 'Generate a strong password now',
};
