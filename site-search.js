(function () {
  var PAGES = [
    { title: "Home", href: "index.html", group: "House", keys: "home earth atelier field stone" },
    { title: "About", href: "about.html", group: "House", keys: "morgan sugg founder story metal free miner" },
    { title: "Ethics & Sustainability", href: "ethics.html", group: "House", keys: "ethics sourcing fmc stewardship" },
    { title: "Contact", href: "contact.html", group: "House", keys: "email write contact" },
    { title: "FAQ", href: "faq.html", group: "House", keys: "questions shipping returns" },
    { title: "Journal", href: "blog.html", group: "House", keys: "blog journal tofino whistler posters" },
    { title: "Services", href: "services.html", group: "House", keys: "perspective audit snapshot bundle pricing" },
    { title: "Influencers", href: "influencer-report.html", group: "House", keys: "influencer report" },
    { title: "Filed", href: "filed.html", group: "House", keys: "filed papers archive" },
    { title: "Carry the cut", href: "wear.html", group: "Collection", keys: "jewelry wear pendant wrap agate" },
    { title: "Know the cut", href: "specimens.html", group: "Collection", keys: "specimens cabinet penticton educational" },
    { title: "Minerals", href: "minerals.html", group: "Collection", keys: "minerals stones" },
    { title: "Field & Studio Kits", href: "field-studio-kits.html", group: "Collection", keys: "kits sluice panning highbanker doba dropship mining" },
    { title: "Drop-ship catalog", href: "catalog.html", group: "Collection", keys: "dropship catalog geode quartz blanket wellness" },
    { title: "Shop pointer", href: "shop.html", group: "Collection", keys: "shop redirect" },
    { title: "Live shop", href: "https://shop.uniqueperspective8.com/", group: "Shop", keys: "checkout woocommerce products dropship" },
    { title: "Shop all products", href: "https://shop.uniqueperspective8.com/shop/", group: "Shop", keys: "catalog listings candles jewelry" },
    { title: "Shop jewelry aisle", href: "https://shop.uniqueperspective8.com/shop/jewelry/", group: "Shop", keys: "jewelry ring pendant" },
    { title: "Education Hub", href: "education/", group: "Study", keys: "education hub field guides" },
    { title: "BC Free Miner Stewardship Standard", href: "education/bc-free-miner-stewardship.html", group: "Study", keys: "standard tenure syilx provenance card" },
    { title: "Guide 1 Field code", href: "education/free-miner.html", group: "Study", keys: "free miner field code" },
    { title: "Guide 2 Identification", href: "education/identification.html", group: "Study", keys: "five tests streak hardness" },
    { title: "Guide 3 Regional minerals", href: "education/regional-minerals.html", group: "Study", keys: "okanagan similkameen jasper agate" },
    { title: "Guide 4 Gossan and vein", href: "education/gossan-vein.html", group: "Study", keys: "gossan vein gold pyrite" },
    { title: "Guide 5 Provenance", href: "education/provenance.html", group: "Study", keys: "provenance vein ledger rock id" },
    { title: "Guide 6 Float to vein", href: "education/south-okanagan-similkameen-prospecting.html", group: "Study", keys: "prospecting float outcrop" },
    { title: "Mineral Identification", href: "mineral-identification/", group: "Study", keys: "mineral id" },
    { title: "Diagnostic field testing guide", href: "mineral-identification/diagnostic-field-testing-guide/", group: "Study", keys: "diagnostic protocol gold pyrite" },
    { title: "Guidelines and downloads", href: "guidelines.html", group: "Papers", keys: "downloads files index all pages" },
    { title: "Policies", href: "policies.html", group: "Papers", keys: "policies legal" },
    { title: "Privacy", href: "privacy.html", group: "Papers", keys: "privacy" },
    { title: "Cookies", href: "cookies.html", group: "Papers", keys: "cookies" },
    { title: "Refunds", href: "refund-policy.html", group: "Papers", keys: "refund returns" }
  ];

  var SHOP_SEARCH = "https://shop.uniqueperspective8.com/?s=";

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
      link.href = SHOP_SEARCH + encodeURIComponent(query);
      link.textContent = "Search the live shop for " + query;
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
    var shopItem = document.createElement("li");
    var shopLink = document.createElement("a");
    shopLink.href = SHOP_SEARCH + encodeURIComponent(query);
    shopLink.innerHTML = "<span>Also search the live shop for " + query + "</span><small>Shop</small>";
    shopItem.appendChild(shopLink);
    list.appendChild(shopItem);
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
