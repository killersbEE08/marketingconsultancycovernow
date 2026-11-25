// CoverNow site behaviour: mobile menu, FAQ accordion, footer year, contact form.
(function () {
  "use strict";

  var EMAIL = "info@covernow.co.in";
  var WHATSAPP_NUMBER = "917835992238";

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    var setOpen = function (open) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setOpen(!document.body.classList.contains("nav-open"));
    });
    document.querySelectorAll(".mobile-menu a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // FAQ accordion
  document.querySelectorAll(".acc-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".acc-item");
      var open = !item.classList.contains("open");
      item.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  // Contact form: builds an email or WhatsApp message. Nothing is sent to a server.
  var form = document.getElementById("contact-form");
  if (!form) return;

  var params = new URLSearchParams(window.location.search);
  var preset = { audit: "Marketing audit", retainer: "Monthly retainer", partnership: "Quarterly partnership" }[params.get("package")];
  if (preset) form.elements.need.value = preset;

  var hint = form.querySelector(".form-hint");
  var sendVia = "email";
  form.querySelectorAll("[data-send]").forEach(function (b) {
    b.addEventListener("click", function () { sendVia = b.getAttribute("data-send"); });
  });

  function field(name) { return form.elements[name].closest(".field"); }
  function val(name) { return form.elements[name].value.trim(); }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("invalid"); });

    var ok = true;
    if (!val("name")) { field("name").classList.add("invalid"); ok = false; }
    if (!val("message")) { field("message").classList.add("invalid"); ok = false; }
    var email = val("email");
    var emailBad = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if ((!email && !val("phone")) || emailBad) {
      field("email").classList.add("invalid");
      if (!email) field("phone").classList.add("invalid");
      ok = false;
    }
    if (!ok) {
      hint.textContent = "Please check the highlighted fields.";
      var first = form.querySelector(".invalid input, .invalid textarea");
      if (first) first.focus();
      return;
    }

    var lines = [
      "Name: " + val("name"),
      val("company") ? "Business: " + val("company") : "",
      email ? "Email: " + email : "",
      val("phone") ? "Phone: " + val("phone") : "",
      "Interested in: " + val("need"),
      "",
      val("message")
    ].filter(function (l, i) { return l !== "" || i === 5; });
    var text = lines.join("\n");

    if (sendVia === "whatsapp") {
      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      hint.textContent = "WhatsApp should open in a new tab with your message ready to send.";
    } else {
      var subject = "Enquiry from " + val("name") + (val("company") ? " (" + val("company") + ")" : "");
      window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
      hint.textContent = "Your email app should open with the message filled in. If nothing happens, email " + EMAIL + " directly.";
    }
  });
})();
