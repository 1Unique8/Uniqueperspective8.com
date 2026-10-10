(function () {
  var SHOP = "https://shop.uniqueperspective8.com";
  var PAGES = [
    { title: "Home", href: "index.html", group: "House", keys: "home earth atelier field stone" },
    { title: "About", href: "about.html", group: "House", keys: "morgan sugg founder story metal free miner" },
    { title: "Ethics & Sustainability", href: "ethics.html", group: "House", keys: "ethics sourcing fmc stewardship" },
    { title: "Contact", href: "contact.html", group: "House", keys: "email write contact" },
    { title: "FAQ", href: "faq.html", group: "House", keys: "questions shipping returns" },
    { title: "Journal", href: "blog.html", group: "House", keys: "blog journal tofino whistler posters" },
    { title: "Services", href: "services.html", group: "House", keys: "perspective audit snapshot bundle pricing" },
    { title: "Influencers", href: "influencer-report.html", group: "House", keys: "influencer report" },
    { title: "Our Story", href: "story.html", group: "House", keys: "story founder proverb fall seven stand eight okanagan" },
    { title: "Provenance", href: "provenance.html", group: "House", keys: "provenance roadcut fmc 292907 penticton skaha oliver card" },
    { title: "Gallery", href: "gallery.html", group: "House", keys: "gallery photos pieces stones images" },
    { title: "Press & Partners", href: "press.html", group: "House", keys: "press media partners stockists" },
    { title: "Filed", href: "filed.html", group: "House", keys: "filed papers archive" },
    { title: "Carry the cut", href: "wear.html", group: "Collection", keys: "jewelry wear pendant wrap agate bench wire" },
    { title: "Know the cut", href: "specimens.html", group: "Collection", keys: "specimens cabinet penticton educational" },
    { title: "Minerals", href: "minerals.html", group: "Collection", keys: "minerals stones" },
    { title: "Field & Studio Kits", href: "field-studio-kits.html", group: "Collection", keys: "kits sluice panning rockhounding field mining amazon" },
    { title: "Drop-ship catalog", href: "catalog.html", group: "Collection", keys: "dropship catalog geode decor bookends" },
    { title: "Catalog jewelry", href: "jewelry-catalog.html", group: "Collection", keys: "dropship jewelry ring necklace bracelet catalog" },
    { title: "Shop", href: "shop.html", group: "Shop", keys: "shop checkout catalog" },
    { title: "Live shop", href: SHOP + "/", group: "Shop", keys: "checkout shop listings" },
    { title: "Shop — Sourced Series", href: SHOP + "/shop#sourced-series", group: "Shop", keys: "pendant agate similkameen jewelry" },
    { title: "Shop — Rockhounding", href: SHOP + "/shop#rockhounding", group: "Shop", keys: "rockhounding hammer estwing geology kit" },
    { title: "Shop — Creek kits", href: SHOP + "/shop#field-studio-kits", group: "Shop", keys: "sluice panning creek" },
    { title: "Shop — Look closer", href: SHOP + "/shop#look-closer", group: "Shop", keys: "loupe uv identify" },
    { title: "Shop — Cabinet", href: SHOP + "/shop#cabinet", group: "Shop", keys: "display case gem jar" },
    { title: "Shop — Bench", href: SHOP + "/shop#bench", group: "Shop", keys: "wrap wire bench" },
    { title: "Shop — Home decor", href: SHOP + "/shop#home-decor", group: "Shop", keys: "bookends agate decor dyed" },
    { title: "Shop — Rough ground", href: SHOP + "/shop#extreme-sports", group: "Shop", keys: "helmet poles hiking approach" },
    { title: "Shop — Audit", href: SHOP + "/shop#services", group: "Shop", keys: "perspective audit snapshot bundle" },
    { title: "Education Hub", href: "https://community.uniqueperspective8.com/education/", group: "Study", keys: "education hub field guides" },
    { title: "BC Free Miner Stewardship Standard", href: "https://community.uniqueperspective8.com/education/", group: "Study", keys: "standard tenure syilx provenance card" },
    { title: "Guide 1 Field code", href: "https://community.uniqueperspective8.com/education/", group: "Study", keys: "free miner field code" },
    { title: "Guide 2 Identification", href: "https://community.uniqueperspective8.com/education/", group: "Study", keys: "five tests streak hardness" },
    { title: "Guide 3 Regional minerals", href: "https://community.uniqueperspective8.com/education/regional-minerals/", group: "Study", keys: "okanagan similkameen jasper agate" },
    { title: "Guide 4 Gossan and vein", href: "https://community.uniqueperspective8.com/education/", group: "Study", keys: "gossan vein gold pyrite" },
    { title: "Guide 5 Provenance", href: "https://community.uniqueperspective8.com/education/", group: "Study", keys: "provenance vein ledger rock id" },
    { title: "Guide 6 Float to vein", href: "https://community.uniqueperspective8.com/education/south-okanagan-similkameen-prospecting/", group: "Study", keys: "prospecting float outcrop" },
    { title: "Rockhound Starter Guide", href: "https://community.uniqueperspective8.com/education/starter-guide/", group: "Study", keys: "starter guide beginner rockhound" },
    { title: "South Okanagan & Similkameen prospecting", href: "https://community.uniqueperspective8.com/education/south-okanagan-similkameen-prospecting/", group: "Study", keys: "field guide prospecting okanagan similkameen" },
    { title: "Similkameen jasper", href: "https://community.uniqueperspective8.com/education/similkameen-jasper/", group: "Study", keys: "jasper similkameen" },
    { title: "BC agate & chalcedony", href: "https://community.uniqueperspective8.com/education/bc-agate-chalcedony/", group: "Study", keys: "agate chalcedony" },
    { title: "ID confidence tags", href: "https://community.uniqueperspective8.com/education/id-confidence/", group: "Study", keys: "id confidence confirmed probable field id tags" },
    { title: "Mineral Identification", href: "mineral-identification/", group: "Study", keys: "mineral id" },
    { title: "Diagnostic field testing guide", href: "mineral-identification/diagnostic-field-testing-guide/", group: "Study", keys: "diagnostic protocol gold pyrite" },
    { title: "Guidelines and downloads", href: "guidelines.html", group: "Papers", keys: "downloads files index all pages" },
    { title: "Policies", href: "policies.html", group: "Papers", keys: "policies legal" },
    { title: "Privacy", href: "privacy.html", group: "Papers", keys: "privacy" },
    { title: "Cookies", href: "cookies.html", group: "Papers", keys: "cookies" },
    { title: "Refunds", href: "refund-policy.html", group: "Papers", keys: "refund returns" }
  ];

  var SHOP_SEARCH = SHOP + "/shop";

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function searchPages(query) {
    var q = normalize(query);
    if (!q) return [];
    return PAGES.filter(function (page) {
      return normalize(page.title + " " + page.group + " " + page.keys + " " + page.href).indexOf(q) !== -1;
    });
  }

  function render(results, query, status, list) {
    list.innerHTML = "";
    if (!normalize(query)) {
      list.hidden = true;
      status.textContent = "Type a word. Pages filter here. Shop search leaves this host.";
      return;
    }
    list.hidden = false;
    if (!results.length) {
      status.textContent = "No pages matched. Try the shop door.";
      var empty = document.createElement("li");
      var link = document.createElement("a");
      link.href = SHOP_SEARCH;
      link.textContent = "Open the shop";
      empty.appendChild(link);
      list.appendChild(empty);
      return;
    }
    status.textContent = results.length + " page" + (results.length === 1 ? "" : "s") + " on this site.";
    results.forEach(function (page) {
      var item = document.createElement("li");
      var link = document.createElement("a");
      link.href = page.href;
      link.innerHTML = "<span>" + page.title + "</span><small>" + page.group + "</small>";
      item.appendChild(link);
      list.appendChild(item);
    });
  }

  var results = document.querySelector("[data-search-results]");
  var status = document.querySelector("[data-search-status]");
  if (!results || !status) return;

  var inputs = document.querySelectorAll("[data-search-input]");
  inputs.forEach(function (input) {
    input.addEventListener("input", function () {
      var query = input.value;
      inputs.forEach(function (other) {
        if (other !== input) other.value = query;
      });
      render(searchPages(query), query, status, results);
    });
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.metaKey && !event.ctrlKey) {
        var first = results.querySelector("a");
        if (first && searchPages(input.value).length) {
          event.preventDefault();
          window.location.href = first.getAttribute("href");
        }
      }
    });
  });

  document.querySelectorAll("[data-search-pages]").forEach(function (button) {
    button.addEventListener("click", function () {
      var input = document.getElementById("find-q");
      var query = input ? input.value : "";
      render(searchPages(query), query, status, results);
      results.hidden = false;
      if (results.querySelector("a")) results.querySelector("a").focus();
    });
  });
})();
