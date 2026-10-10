module.exports = {
  metaTitle: 'QR Code Generator Guide: Make, Print & Scan QR Codes',
  description: 'How QR codes work, how to make one for a link or Wi-Fi, printing tips for size, contrast and error correction, the story behind the QR code and how to scan safely.',
  h1: 'How to make a QR code that scans every time',
  updated: '2026-10-11',
  intro: 'QR codes are everywhere: on restaurant tables, concert tickets, parcels and posters. They look like random noise, but every square has a job. This guide explains what a QR code really stores, how to make one for a link, a message or your Wi-Fi network, how to print it so it scans on the first try, where the idea came from and how to stay safe when you scan codes made by other people.',
  sections: [
    {
      h: 'What a QR code is',
      p: [
        'QR stands for Quick Response. A QR code is a two-dimensional barcode: instead of a single row of lines, it stores information in a square grid of dark and light cells called modules. The three large squares in the corners are finder patterns. They tell a camera where the code is, how it is rotated and how big it is, which is why you can scan a code upside down or at an angle.',
        'The rest of the grid holds your data plus extra error correction data calculated with Reed–Solomon codes, the same mathematics used on CDs and in deep-space probes. Thanks to this redundancy, a reader can rebuild the content even when part of the code is dirty, torn or covered. The smallest code, version 1, is 21 by 21 modules; the largest, version 40, is 177 by 177 and can hold almost three thousand bytes. Longer content simply needs a bigger, denser grid.'
      ]
    },
    {
      h: 'How to make a QR code here',
      p: [
        'The generator works entirely in your browser. The code is calculated on your own device the moment you type, so nothing you enter is uploaded, logged or stored, and there is no account to create.'
      ],
      list: [
        'Choose what the code should hold: a link, plain text, a Wi-Fi login, an email or a phone number.',
        'Fill in the fields. If you type a web address without https://, it is added for you so phones open it as a link.',
        'Watch the live preview. Open the options to change colors, error correction, image size or the quiet zone.',
        'Download a PNG for screens and documents, or an SVG for print. On supported browsers you can also copy the image straight to the clipboard.',
        'Scan the result with your own phone before you share or print it.'
      ]
    },
    {
      h: 'Wi-Fi QR codes for guests',
      p: [
        'A Wi-Fi QR code saves your guests from typing a long password. It stores the network name, the password and the security type in a standard text format that starts with WIFI:. The camera apps built into iPhone and Android recognise this format and offer to join the network with one tap.',
        'Pick the same security setting your router uses. Almost every modern router uses WPA2 or WPA3, which both belong under WPA. Choose No password only for open networks, and tick Hidden network if your router does not broadcast its name. Special characters such as semicolons, commas, colons and quotation marks are escaped automatically, so unusual passwords still work. If you change your Wi-Fi password later, make a new code, because the old one will stop working.'
      ]
    },
    {
      h: 'Printing tips: size, contrast and error correction',
      p: [
        'Most scanning problems come from printing, not from the code itself. A few simple rules make a huge difference.'
      ],
      list: [
        'Size: as a rule of thumb, the code should be at least one tenth of the scanning distance. A code read from 30 cm away needs to be about 3 cm wide, while a poster read from 3 m away needs roughly 30 cm.',
        'Contrast: use a dark code on a light background. Black on white is safest. Pale colors, gradients and light codes on dark backgrounds confuse many scanners, which is why the generator warns you about low contrast.',
        'Quiet zone: keep an empty border around the code. The standard asks for four modules, and text or images pushed right against the edge are a common cause of failed scans.',
        'Error correction: level L recovers about 7 percent of damage, M about 15, Q about 25 and H about 30. Use M for everyday use, Q or H for stickers, outdoor signs or codes with a small logo on top, and L when you need a long text to fit in a small code on screen.',
        'Content length: shorter content means bigger modules at the same print size, so prefer a short link to a very long one.'
      ]
    },
    {
      h: 'A short history of the QR code',
      p: [
        'The QR code was invented in 1994 by Masahiro Hara and his team at Denso Wave, then a division of the Japanese car-parts maker Denso, part of the Toyota group. Car factories were tracking parts with ordinary barcodes, and workers had to scan many labels per box because each barcode held only about twenty characters. Hara wanted a code that could hold far more data and be read very quickly from any direction.',
        'The finder squares were designed with a light and dark ratio that rarely appears in printed text or pictures, so a scanner can find them instantly. Denso Wave owned the patent but chose not to enforce it, and the format became an international ISO standard in 2000. When smartphone cameras learned to read QR codes natively, the codes spread into payments, boarding passes, menus and much more. The word QR Code is still a registered trademark of Denso Wave.'
      ]
    },
    {
      h: 'Scanning safely',
      p: [
        'A QR code is only a container, and anyone can print one. Criminals sometimes stick fake codes over real ones on parking meters, posters or restaurant tables to send people to look-alike payment or login pages. Before you open a link from a code, read the address your camera shows and make sure it belongs to the business you expect. Be careful with codes that ask for card details, passwords or app downloads, and never scan a code that arrived in an unexpected message urging you to act quickly.',
        'When you make your own codes, the same idea applies in reverse. Use links you control, test the code before printing and, if you put it in a public place, check now and then that nobody has covered it with a sticker.'
      ]
    }
  ],
  cta: 'Make a QR code now'
};
