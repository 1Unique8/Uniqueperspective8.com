(function () {
  if (document.getElementById("up8-doors")) return;
  var bar = document.createElement("nav");
  bar.id = "up8-doors";
  bar.setAttribute("aria-label", "House doors");
  bar.innerHTML = [
    '<a href="https://uniqueperspective8.com/">House</a>',
    '<a href="https://uniqueperspective8.com/education/">Education</a>',
    '<a href="https://community.uniqueperspective8.com/rock-your-perspective">Field to Shelf</a>',
    '<a href="https://community.uniqueperspective8.com/">Community</a>',
    '<a class="up8-shop-button" href="https://shop.uniqueperspective8.com/product/agate-pendant/">Wire-Wrapped Agate Pendant — Similkameen</a>',
    '<a class="up8-shop-button" href="https://shop.uniqueperspective8.com/product/agate-small-specimen/">Polished Similkameen Agate — Small</a>',
    '<a href="https://uniqueperspective8.com/about.html">About</a>',
    '<a href="https://uniqueperspective8.com/ethics.html">Ethics</a>',
    '<a href="https://uniqueperspective8.com/contact.html">Contact</a>',
    '<a href="mailto:services@uniqueperspective8.com">services@</a>',
    '<a href="mailto:community@uniqueperspective8.com?cc=services@uniqueperspective8.com">community@</a>'
  ].join("");
  var style = document.createElement("style");
  style.textContent = "#up8-doors{position:sticky;top:0;z-index:50;display:flex;flex-wrap:wrap;gap:14px 18px;align-items:center;padding:10px 16px;background:#0b1012;color:#f2eadc;font:13px/1.3 Figtree,Arial,sans-serif}#up8-doors a{color:#d0ad5a;text-decoration:none}#up8-doors a:hover{color:#f2eadc}#up8-doors a.up8-shop-button{background:#d0ad5a;color:#0b1012;border-radius:6px;padding:6px 12px;font-weight:600}";
  document.head.appendChild(style);
  document.body.insertBefore(bar, document.body.firstChild);
})();
