(function () {
  "use strict";

  var PHOTO_DIR = "photos/";
  var sizes = window.PHOTO_SIZES || {};
  var gallery = document.getElementById("gallery");
  var eventId = document.body.dataset.event;

  // An event page lists its chosen photos, then everything else in its
  // subfolder of /photos (known from photos/sizes.js), pairing portraits.
  function eventEntries(id) {
    var list = ((window.EVENTS || {})[id] || []).slice();
    var listed = {};
    list.forEach(function (p) { listed[p.file] = true; });
    var heading = document.querySelector("h1");
    var alt = "Photo from " + (heading ? heading.textContent.trim() : id);
    var pairWithPrev = false;
    Object.keys(sizes).sort().forEach(function (file) {
      if (file.indexOf(id + "/") !== 0 || listed[file]) return;
      var portrait = sizes[file][1] > sizes[file][0];
      list.push({ file: file, alt: alt, beside: portrait && pairWithPrev });
      pairWithPrev = portrait && !pairWithPrev;
    });
    return list;
  }

  // Entries are photos plus caption links ({ more, caption }) between them.
  var entries = eventId ? eventEntries(eventId) : (window.PHOTOS || []);
  var photos = entries.filter(function (e) { return e.file; });
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Pixel size of a photo, from photos/sizes.js (written by scripts/optimize.py).
  // Falls back to 3:2 until the real image loads.
  function sizeOf(photo) {
    return sizes[photo.file] || [1500, 1000];
  }

  // ── Build the gallery ────────────────────────────────────────────────────

  var row = null;
  var lastFigure = null;
  var lastPhoto = null;

  // A photo marked `beside` joins the photo above it in a side-by-side row.
  function placeBeside(prevFigure, figure) {
    if (!row) {
      row = document.createElement("div");
      row.className = "photo-row";
      gallery.replaceChild(row, prevFigure);
      row.appendChild(prevFigure);
    }
    row.appendChild(figure);
    var sum = 0;
    Array.prototype.forEach.call(row.children, function (f) {
      sum += parseFloat(f.style.getPropertyValue("--ar"));
    });
    row.style.setProperty("--sum", sum.toFixed(4));
    row.style.setProperty("--count", row.children.length);
    row.dataset.count = row.children.length;
  }

  // A caption under the photos above it, linking to the event's page.
  function addEventLink(entry) {
    var link = document.createElement("a");
    link.className = "event-link";
    link.id = entry.more;
    link.href = entry.more + ".html";

    var title = document.createElement("span");
    title.className = "event-link__title";
    title.textContent = entry.caption;

    var more = document.createElement("span");
    more.className = "event-link__more";
    more.textContent = "More photos \u2192";

    link.appendChild(title);
    link.appendChild(more);
    gallery.appendChild(link);
  }

  function addPhoto(photo, i) {
    var size = sizeOf(photo);
    var figure = document.createElement("figure");
    figure.className = "photo" + (photo.fullBleed ? " photo--bleed" : "");
    figure.style.setProperty("--ar", (size[0] / size[1]).toFixed(4));

    var button = document.createElement("button");
    button.type = "button";
    button.className = "photo__open";
    button.setAttribute("aria-haspopup", "dialog");
    button.addEventListener("click", function () { openViewer(i, button); });

    var img = document.createElement("img");
    img.src = PHOTO_DIR + photo.file;
    img.alt = photo.alt || "";
    img.width = size[0];
    img.height = size[1];
    img.decoding = "async";
    if (i === 0) {
      img.loading = "eager";
      img.setAttribute("fetchpriority", "high");
    } else {
      img.loading = "lazy";
    }
    if (!sizes[photo.file]) {
      img.addEventListener("load", function () {
        figure.style.setProperty("--ar", (img.naturalWidth / img.naturalHeight).toFixed(4));
      });
    }

    button.appendChild(img);
    figure.appendChild(button);

    if (photo.beside && lastPhoto && !lastPhoto.fullBleed && !photo.fullBleed) {
      placeBeside(lastFigure, figure);
    } else {
      row = null;
      gallery.appendChild(figure);
    }
    lastFigure = figure;
    lastPhoto = photo;
    return figure;
  }

  var figures = [];
  entries.forEach(function (entry) {
    if (entry.file) {
      figures.push(addPhoto(entry, figures.length));
    } else if (entry.more) {
      addEventLink(entry);
      row = lastFigure = lastPhoto = null;
    }
  });

  // Coming back from an event page: the gallery didn't exist when the
  // browser looked for the #anchor, so jump to it now.
  if (location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target && gallery.contains(target)) target.scrollIntoView({ behavior: "instant", block: "center" });
  }

  // ── Fade photos in as they scroll into view ─────────────────────────────

  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    var reveal = function (figure) {
      var img = figure.querySelector("img");
      var show = function () { figure.classList.add("is-revealed"); };
      if (img.complete) show();
      else {
        img.addEventListener("load", show, { once: true });
        img.addEventListener("error", show, { once: true });
      }
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          reveal(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });

    figures.forEach(function (figure) {
      figure.classList.add("will-reveal");
      observer.observe(figure);
    });
  }

  // ── Full-screen viewer ───────────────────────────────────────────────────

  var dialog = document.getElementById("lightbox");
  var viewerImg = dialog.querySelector(".lightbox__img");
  var counter = dialog.querySelector(".lightbox__counter");
  var status = dialog.querySelector("[data-status]");
  var current = 0;
  var opener = null;

  function wrap(i) {
    return (i + photos.length) % photos.length;
  }

  function show(i) {
    current = wrap(i);
    var photo = photos[current];
    var size = sizeOf(photo);

    viewerImg.classList.add("is-loading");
    viewerImg.onload = viewerImg.onerror = function () {
      viewerImg.classList.remove("is-loading");
    };
    viewerImg.width = size[0];
    viewerImg.height = size[1];
    viewerImg.alt = photo.alt || "";
    viewerImg.src = PHOTO_DIR + photo.file;
    if (viewerImg.complete) viewerImg.classList.remove("is-loading");

    counter.textContent = (current + 1) + " / " + photos.length;
    status.textContent = "Photo " + (current + 1) + " of " + photos.length +
      (photo.alt ? ": " + photo.alt : "");

    // Warm up the neighbours so next/previous feel instant.
    [current + 1, current - 1].forEach(function (n) {
      new Image().src = PHOTO_DIR + photos[wrap(n)].file;
    });
  }

  function openViewer(i, trigger) {
    if (typeof dialog.showModal !== "function") {
      window.open(PHOTO_DIR + photos[i].file, "_blank", "noopener");
      return;
    }
    opener = trigger;
    show(i);
    dialog.showModal();
    // Focus the viewer itself (not the Close button) so no focus ring
    // flashes for mouse users; Tab still reaches every control.
    dialog.focus();
  }

  function closeViewer() {
    if (dialog.open) dialog.close();
  }

  // Esc is handled by <dialog> itself; focus goes back to the photo.
  dialog.addEventListener("close", function () {
    viewerImg.removeAttribute("src");
    if (opener) {
      opener.focus({ preventScroll: true });
      opener = null;
    }
  });

  dialog.querySelector(".lightbox__close").addEventListener("click", closeViewer);
  dialog.querySelector(".lightbox__prev").addEventListener("click", function () { show(current - 1); });
  dialog.querySelector(".lightbox__next").addEventListener("click", function () { show(current + 1); });

  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
  });

  // Clicking the white space around the photo closes the viewer.
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog || e.target.classList.contains("lightbox__stage")) closeViewer();
  });

  // Swipe left/right on touch screens.
  var touchX = null, touchY = null;
  dialog.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1) { touchX = null; return; }
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });

  dialog.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    var dy = e.changedTouches[0].clientY - touchY;
    touchX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      show(dx < 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

  // ── Footer year ──────────────────────────────────────────────────────────

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
