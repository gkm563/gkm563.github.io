/* ==========================================================================
   GKM — Roles & Responsibilities ledger interactions
   Filter + search + deep links + copyable verification IDs.
   ========================================================================== */
(function () {
  "use strict";

  var page = document.querySelector("[data-ledger-page]");
  if (!page) return;

  var filters = Array.prototype.slice.call(page.querySelectorAll("[data-filter]"));
  var cards = Array.prototype.slice.call(page.querySelectorAll(".role-card"));
  var groups = Array.prototype.slice.call(page.querySelectorAll(".role-group"));
  var search = page.querySelector("#roleSearch");
  var clear = page.querySelector("#roleClear");
  var count = page.querySelector("#ledgerCount");
  var empty = page.querySelector("#ledgerEmpty");
  var emptyReset = page.querySelector("#ledgerEmptyReset");
  var copyStatus = page.querySelector("#copyStatus");
  var total = cards.length;
  var activeFilter = "all";

  function normalise(value) {
    return (value || "")
      .toLowerCase()
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/\s+/g, " ")
      .trim();
  }

  function searchIndex(card) {
    if (!card.dataset.searchIndex) {
      card.dataset.searchIndex = normalise(
        card.dataset.search + " " + card.textContent
      );
    }
    return card.dataset.searchIndex;
  }

  function apply() {
    var query = normalise(search ? search.value : "");
    var terms = query ? query.split(" ") : [];
    var visible = 0;

    cards.forEach(function (card) {
      var catMatch = activeFilter === "all" || card.dataset.cat === activeFilter;
      var textMatch = true;
      if (terms.length) {
        var haystack = searchIndex(card);
        textMatch = terms.every(function (term) {
          return haystack.indexOf(term) !== -1;
        });
      }
      var show = catMatch && textMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });

    groups.forEach(function (group) {
      var hasVisible = group.querySelector(".role-card:not([hidden])");
      group.hidden = !hasVisible;
    });

    if (count) {
      count.innerHTML =
        "Showing <b>" + visible + "</b> of <b>" + total + "</b> roles";
    }
    if (empty) empty.hidden = visible !== 0;
    if (clear) clear.hidden = !query;

    filters.forEach(function (button) {
      var on = button.dataset.filter === activeFilter;
      button.classList.toggle("is-active", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function reset() {
    activeFilter = "all";
    if (search) search.value = "";
    apply();
  }

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.dataset.filter || "all";
      apply();
    });
  });

  if (search) {
    search.addEventListener("input", apply);
    search.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        search.value = "";
        apply();
      }
    });
  }
  if (clear) {
    clear.addEventListener("click", function () {
      if (search) {
        search.value = "";
        search.focus();
      }
      apply();
    });
  }
  if (emptyReset) emptyReset.addEventListener("click", reset);

  document.addEventListener("keydown", function (event) {
    if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
    var tag = (event.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || event.target.isContentEditable) return;
    if (!search) return;
    event.preventDefault();
    search.focus();
    search.select();
  });

  /* --- copyable verification links ------------------------------------- */
  var copyButtons = Array.prototype.slice.call(page.querySelectorAll("[data-copy]"));

  function legacyCopy(text) {
    var field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "-9999px";
    document.body.appendChild(field);
    field.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (error) {
      ok = false;
    }
    document.body.removeChild(field);
    return ok;
  }

  function announce(message) {
    if (!copyStatus) return;
    copyStatus.textContent = message;
  }

  copyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var link = button.dataset.copy;
      var label = button.querySelector(".verify-id__label");
      var action = button.querySelector(".verify-id__action");
      var original = action ? action.textContent : "";

      function done(ok) {
        if (!ok) {
          announce("Copy failed. The link is " + link);
          return;
        }
        button.classList.add("is-copied");
        if (action) action.textContent = "Copied";
        announce("Verification link copied: " + link);
        window.setTimeout(function () {
          button.classList.remove("is-copied");
          if (action) action.textContent = original;
        }, 2000);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(link).then(function () {
          done(true);
        }, function () {
          done(legacyCopy(link));
        });
      } else {
        done(legacyCopy(link));
      }
      if (label) label.blur();
    });
  });

  /* --- deep links ------------------------------------------------------- */
  function focusHash() {
    var raw = window.location.hash.replace(/^#/, "");
    if (!raw) return;
    var target = document.getElementById(raw);
    if (!target) {
      target = page.querySelector('[data-alias~="' + raw.replace(/"/g, "") + '"]');
    }
    if (!target) return;

    reset();

    var card = target.classList && target.classList.contains("role-card")
      ? target
      : target.closest(".role-card");
    if (!card) return;

    card.classList.remove("is-target");
    window.requestAnimationFrame(function () {
      card.classList.add("is-target");
      window.setTimeout(function () {
        card.classList.remove("is-target");
      }, 3200);
    });

    if (card.hasAttribute("hidden")) {
      card.hidden = false;
    }
  }

  window.addEventListener("hashchange", focusHash);

  /* --- ?q= search handoff (SearchAction target) ------------------------- */
  try {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    if (q && search) {
      search.value = q;
      activeFilter = "all";
    }
  } catch (error) {
    /* older browser: ignore */
  }

  apply();
  focusHash();
})();
