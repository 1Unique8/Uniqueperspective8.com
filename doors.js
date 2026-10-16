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
    '<a class="up8-shop-button" href="https://shop.uniqueperspective8.com/">Wire-Wrapped Agate Pendant — Similkameen</a>',
    '<a class="up8-shop-button" href="https://shop.uniqueperspective8.com/">Polished Similkameen Agate — Small</a>',
    '<a href="https://uniqueperspective8.com/about.html">About</a>',
    '<a href="https://uniqueperspective8.com/story.html">Our Story</a>',
    '<a href="https://uniqueperspective8.com/provenance.html">Provenance</a>',
    '<a href="https://uniqueperspective8.com/gallery.html">Gallery</a>',
    '<a href="https://uniqueperspective8.com/press.html">Press &amp; Partners</a>',
    '<a href="https://uniqueperspective8.com/ethics.html">Ethics</a>',
    '<a href="https://uniqueperspective8.com/products.html">Available</a>',
    '<a href="https://uniqueperspective8.com/contact.html">Contact</a>',
    '<a href="https://services.uniqueperspective8.com/Services/">Audit Snapshot</a>',
    '<a href="https://services.uniqueperspective8.com/Services/">Audit Bundle</a>',
    '<a href="mailto:customer_service@uniqueperspective8.com">customer_service@</a>'
  ].join("");
  var style = document.createElement("style");
  style.textContent = "#up8-doors{position:sticky;top:0;z-index:50;display:flex;flex-wrap:wrap;gap:14px 18px;align-items:center;padding:10px 16px;background:#0B0D10;color:#FFFFFF;font:13px/1.3 Figtree,Arial,sans-serif}#up8-doors a{color:#CFB53B;text-decoration:none}#up8-doors a:hover{color:#FFFFFF}#up8-doors a.up8-shop-button{background:#CFB53B;color:#0B0D10;border-radius:6px;padding:6px 12px;font-weight:600}#up8-doors a.up8-shop-button:hover{background:#A8922E;color:#0B0D10}";
  document.head.appendChild(style);
  document.body.insertBefore(bar, document.body.firstChild);
})();
