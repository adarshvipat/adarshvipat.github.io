// ─────────────────────────────────────────────────────────────────────────
//  THE PHOTO LIST
//
//  One line per photo. Order here = order on the page.
//    file      → the filename inside /photos
//    alt       → a short description for screen readers and search engines
//    fullBleed → optional; true makes the photo run edge to edge
//    beside    → optional; true places the photo in a row next to the one
//                above it (2 or 3 to a row works best)
//
//  A line like { more: "winter-fest", caption: "…" } puts a caption under
//  the photos above it that links to that event's page (winter-fest.html).
//
//  The first photo is also the share image for link previews; if you change
//  it, update the og:image / twitter:image lines in index.html too.
// ─────────────────────────────────────────────────────────────────────────

window.PHOTOS = [
  // March 2025
  { file: "P3300670.jpg", alt: "A lone coyote standing in a wide field of green grass", fullBleed: true },

  // June 2025
  { file: "P6280176.jpg", alt: "A man in a Guy Fawkes mask carries a television through a busy city sidewalk beneath palm trees" },

  // 9 January 2026 — India
  { file: "P1093439.jpg", alt: "Shirts hung to dry over an ornate metal gate in warm afternoon light" },
  { file: "P1093475.jpg", alt: "The shadows of two people in profile cast against a pale textured wall", beside: true },
  { file: "P1093478.jpg", alt: "Looking up at a sunlit ochre apartment block, a striped towel drying over a balcony rail against deep blue sky", beside: true },
  { more: "india", caption: "India 2026" },

  // 27 February 2026 — Ski and Board Winter Fest
  { file: "picture5.jpg", alt: "A skier in a red jacket launches off a jump at night, snow spraying beneath the skis" },
  { file: "picture10.jpg", alt: "A skier blurred by motion against streaks of city light at night" },
  { file: "picture1.jpg", alt: "A snowboarder caught mid-air against a black night sky, lit by a single flash", beside: true },
  { more: "winter-fest", caption: "Ski and Board Winter Fest 2026" },

  // 19 March 2026
  { file: "P3195028.jpg", alt: "Bronze statues of a group of men silhouetted against a cloudless blue sky beside a radio tower" },
  { file: "P3195122.jpg", alt: "A crescent beach at golden hour, scattered with people, tents and long evening shadows", beside: true },

  // 18 April 2026 — PSO Mock Shaadi
  { file: "P4186130.jpg", alt: "Dancers in traditional South Asian dress leap mid-performance across a polished wooden stage", fullBleed: true },
  { file: "P4185338.jpg", alt: "A banquet hall bathed in purple light, guests seated at round tables before a flower-draped stage" },
  { file: "P4186339.jpg", alt: "A jubilant crowd seen from above, arms raised, a phone flash flaring in the corner", beside: true },
  { file: "P4186372.jpg", alt: "A motion-blurred crowd of dancers under purple and red party lights" },
  { file: "P4186742.jpg", alt: "Hands hold a camera with a flash aloft over a dancing crowd, the scene glowing on its screen", beside: true },
  { more: "mock-shaadi", caption: "PSO Mock Shaadi 2026" },

  // 26 May 2026
  { file: "P5267535.jpg", alt: "Two city workers in orange hats and vests push a cleaning cart across a sunny brick plaza" },
  { file: "P5267621.jpg", alt: "A street vendor stands beside food carts outside a glass-fronted transit station", beside: true },

  // 4 June 2026
  { file: "P6048345.jpg", alt: "Two bears foraging on a grassy hillside dotted with yellow wildflowers", fullBleed: true },
  { file: "P6048503.jpg", alt: "Two young bison calves grazing on a bright green meadow" },
  { file: "P6048544.jpg", alt: "A bison and her calf stand in sagebrush on a rolling green hillside", beside: true },

  // 3 July 2026
  { file: "P7039052.jpg", alt: "Fireworks bloom over a lamplit street lined with storefronts at night" },

  // 23 August 2026
  { file: "P8239440.jpg", alt: "An orange butterfly resting on a thistle in a tangle of wild greenery" },
];

// ─────────────────────────────────────────────────────────────────────────
//  EVENT PAGES
//
//  Each event page (india.html, winter-fest.html, mock-shaadi.html) shows
//  the photos listed here first, then EVERY photo in its subfolder of
//  /photos (photos/india/, photos/winter-fest/, …) in filename order, with
//  portrait photos paired side by side. So adding photos needs no edits
//  here: put them in the subfolder and run scripts/optimize.py.
//
//  To give an added photo alt text or a layout, list it here with its
//  folder, e.g. { file: "winter-fest/P2270001.jpg", alt: "…", fullBleed: true }
// ─────────────────────────────────────────────────────────────────────────

window.EVENTS = {
  "india": [
    { file: "P1093439.jpg", alt: "Shirts hung to dry over an ornate metal gate in warm afternoon light" },
    { file: "P1093475.jpg", alt: "The shadows of two people in profile cast against a pale textured wall", beside: true },
    { file: "P1093478.jpg", alt: "Looking up at a sunlit ochre apartment block, a striped towel drying over a balcony rail against deep blue sky", beside: true },
  ],

  "winter-fest": [
    { file: "picture5.jpg", alt: "A skier in a red jacket launches off a jump at night, snow spraying beneath the skis" },
    { file: "picture10.jpg", alt: "A skier blurred by motion against streaks of city light at night" },
    { file: "picture1.jpg", alt: "A snowboarder caught mid-air against a black night sky, lit by a single flash", beside: true },
  ],

  "mock-shaadi": [
    { file: "P4186130.jpg", alt: "Dancers in traditional South Asian dress leap mid-performance across a polished wooden stage", fullBleed: true },
    { file: "P4185338.jpg", alt: "A banquet hall bathed in purple light, guests seated at round tables before a flower-draped stage" },
    { file: "P4186339.jpg", alt: "A jubilant crowd seen from above, arms raised, a phone flash flaring in the corner", beside: true },
    { file: "P4186372.jpg", alt: "A motion-blurred crowd of dancers under purple and red party lights" },
    { file: "P4186742.jpg", alt: "Hands hold a camera with a flash aloft over a dancing crowd, the scene glowing on its screen", beside: true },
  ],
};
