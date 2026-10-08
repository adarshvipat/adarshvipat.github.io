# Photography portfolio

A single-page portfolio in plain HTML, CSS, and JavaScript. There's no build step and nothing to install for the site itself.

```
index.html        the page (name, bio, contact links, share-preview tags)
style.css         all styling
main.js           gallery, scroll fade-in, full-screen viewer
photos.js         ← THE PHOTO LIST: order, alt text, full-bleed
photos/           web-sized photos (published)
photos/sizes.js   generated pixel sizes; don't edit by hand
originals/        full-size originals (git-ignored, never published)
scripts/optimize.py
```

## Your details

Your name, bio, email, and Instagram are in `index.html`. The site URL is `https://adarshvipat.github.io`. Search the file for any of these to change them.

## Adding, removing, and reordering photos

1. **Put the full-size original in `originals/`.**
2. **Run the optimizer** (see below). It writes a ~2000px web copy to `photos/` and updates `photos/sizes.js`.
3. **Add one line to `photos.js`**:

   ```js
   { file: "P9010001.jpg", alt: "A fisherman mending nets at dawn" },
   ```

- **Reorder** by moving lines up or down. Order in the list is order on the page.
- **Remove** a photo by deleting its line. You can also delete the file from `photos/` to keep the upload small.
- **Alt text** should say briefly what's in the picture, as if describing it to someone over the phone. Screen readers and search engines use it. It isn't shown on the page.

> The optimizer always saves with a lowercase `.jpg` extension (so `P5267535.JPG` becomes `P5267535.jpg`). Use that name in `photos.js`. GitHub Pages is case-sensitive.

## Putting photos side by side

Add `beside: true` to place a photo in a row next to the one above it. Two or three to a row works best:

```js
{ file: "P3195028.jpg", alt: "Statues against a blue sky" },
{ file: "P3195122.jpg", alt: "A beach at golden hour", beside: true },
```

Photos in a row are sized so they all come out the same height. On phones, a row of three becomes one photo above a pair. Full-bleed photos are always shown on their own.

The list is currently in date order, oldest first, with each shoot grouped into a row. A comment above each group gives the date.

## Making a photo full-bleed (edge to edge)

Add `fullBleed: true`:

```js
{ file: "P6048345.jpg", alt: "Two bears on a hillside", fullBleed: true },
```

Landscape photos work best this way. A few spread through the sequence give the page an editorial rhythm. Single photos stay in a centered column up to 1080px wide, and are capped at about 80% of the screen height so each one fits in view.

## The first photo is your share image

When you paste your link into an email, LinkedIn, or iMessage, the preview shows the **first photo in the list**. If you change which photo comes first, update `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, and `twitter:image` in `index.html` to match. Use the full `https://…` URL, and get the size from `photos/sizes.js`.

## Optimizing photos

You need Python 3 and Pillow (`python3 -m pip install Pillow`).

```sh
python3 scripts/optimize.py                  # originals/ → photos/
python3 scripts/optimize.py ~/Desktop/export # or any folder → photos/
```

For each image the script:

- rotates it according to the camera's orientation flag
- strips EXIF metadata, **including GPS location**
- resizes it to 2000px on the long edge
- saves it as a progressive JPEG at quality 82

Photos that are already up to date are skipped. Every run regenerates `photos/sizes.js`, which lets the page reserve each photo's space before it loads so nothing jumps around.

If you skip the script and drop a file straight into `photos/`, the site still works. That photo just won't have its size reserved in advance.

## Previewing locally

From this folder, run:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Press `Ctrl+C` to stop. Opening `index.html` by double-clicking mostly works too, but a local server matches GitHub Pages more closely.

## Publishing on GitHub Pages

The site is served at `https://adarshvipat.github.io` from a repository named **exactly** `adarshvipat.github.io`.

**Option A: website upload (no git needed)**

1. On GitHub, click **New repository**. Name it `adarshvipat.github.io` , make it **Public**, and create it.
2. Click **uploading an existing file**. Drag in `index.html`, `style.css`, `main.js`, `photos.js`, `.nojekyll`, `README.md`, and the whole `photos` folder. **Don't** upload `originals/`.
   - Finder hides dot-files. Press `Cmd+Shift+.` to show `.nojekyll`.
3. Commit the upload.
4. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, then **main** and **/ (root)**, and save.
5. After a minute or two the site is live at `https://adarshvipat.github.io`.

**Option B: git from the terminal**

```sh
cd path/to/portfolio
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/adarshvipat/adarshvipat.github.io.git
git push -u origin main
```

Then do step 4 above. `.gitignore` already keeps `originals/` out of the repository.

**Updating later:** add photos, edit `photos.js`, and upload or push again. Pages redeploys automatically.

**Checking the link preview:** paste your URL into <https://www.opengraph.xyz> or a LinkedIn post draft. Some apps cache previews for a while after changes.
