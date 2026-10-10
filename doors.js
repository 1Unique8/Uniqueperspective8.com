(function () {
  if (document.getElementById("up8-doors")) return;
  // The home page carries its own four-door dropdown index.
  if (document.querySelector("[data-up8-nav]")) return;
  var bar = document.createElement("nav");
  bar.id = "up8-doors";
  bar.setAttribute("aria-label", "House doors");
  bar.innerHTML = [
    '<a href="https://uniqueperspective8.com/">House</a>',
    '<a href="https://community.uniqueperspective8.com/education/">Education</a>',
    '<a class="up8-shop-button" href="https://shop.uniqueperspective8.com/">Shop</a>',
    '<a href="https://community.uniqueperspective8.com/field-to-shelf/">Field to Shelf</a>',
    '<a href="https://community.uniqueperspective8.com/">Community</a>',
    '<a class="up8-shop-button" href="https://shop.uniqueperspective8.com/shop/sourced-series/agate-pendant/">Wire-Wrapped Agate Pendant — Similkameen</a>',
    '<a class="up8-shop-button" href="https://shop.uniqueperspective8.com/shop/sourced-series/agate-small-specimen/">Polished Similkameen Agate — Small</a>',
    '<a href="https://uniqueperspective8.com/about.html">About</a>',
    '<a href="https://uniqueperspective8.com/story.html">Our Story</a>',
    '<a href="https://uniqueperspective8.com/provenance.html">Provenance</a>',
    '<a href="https://uniqueperspective8.com/gallery.html">Gallery</a>',
    '<a href="https://uniqueperspective8.com/press.html">Press &amp; Partners</a>',
    '<a href="https://uniqueperspective8.com/ethics.html">Ethics</a>',
    '<a href="https://uniqueperspective8.com/products.html">Available</a>',
    '<a href="https://uniqueperspective8.com/contact.html">Contact</a>',
    '<a href="https://shop.uniqueperspective8.com/shop/perspective-audit/perspective-audit-snapshot/">Audit Snapshot</a>',
    '<a href="https://shop.uniqueperspective8.com/shop/perspective-audit/perspective-audit-bundle/">Audit Bundle</a>',
    '<a href="mailto:customer_service@uniqueperspective8.com">customer_service@</a>'
  ].join("");
  var style = document.createElement("style");
  style.textContent = "#up8-doors{position:sticky;top:0;z-index:50;display:flex;flex-wrap:wrap;gap:14px 18px;align-items:center;padding:10px 16px;background:#0b1012;color:#f2eadc;font:13px/1.3 Figtree,Arial,sans-serif}#up8-doors a{color:#d0ad5a;text-decoration:none}#up8-doors a:hover{color:#f2eadc}#up8-doors a.up8-shop-button{background:#d0ad5a;color:#0b1012;border-radius:6px;padding:6px 12px;font-weight:600}";
  document.head.appendChild(style);
  document.body.insertBefore(bar, document.body.firstChild);
})();
