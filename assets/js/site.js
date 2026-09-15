(function () {
  'use strict';

  var WHATSAPP_NUMBER = '5531993381540';

  function waLink(message) {
    var base = 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER;
    return message ? base + '&text=' + encodeURIComponent(message) : base;
  }
  window.waLink = waLink;

  document.addEventListener('DOMContentLoaded', function () {
    /* ---- Header solid on scroll ---- */
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () {
        if (window.scrollY > 40) header.classList.add('is-solid');
        else header.classList.remove('is-solid');
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---- Mobile nav ---- */
    var toggle = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    var closeBtn = document.querySelector('.mobile-nav-close');
    function openNav() {
      if (!mobileNav) return;
      mobileNav.classList.add('is-open');
      document.body.classList.add('nav-open');
    }
    function closeNav() {
      if (!mobileNav) return;
      mobileNav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    }
    if (toggle) toggle.addEventListener('click', openNav);
    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    if (mobileNav) {
      mobileNav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeNav);
      });
    }

    /* ---- Reveal on scroll ---- */
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach(function (el, i) {
        el.style.transitionDelay = (i % 4) * 70 + 'ms';
        io.observe(el);
      });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---- Accordion ---- */
    document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('.accordion-item');
        var panel = item.querySelector('.accordion-panel');
        var isOpen = item.classList.contains('is-open');
        item.parentElement.querySelectorAll('.accordion-item.is-open').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            openItem.querySelector('.accordion-panel').style.maxHeight = null;
          }
        });
        if (isOpen) {
          item.classList.remove('is-open');
          panel.style.maxHeight = null;
        } else {
          item.classList.add('is-open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });

    /* ---- WhatsApp links (data-wa-msg) ---- */
    document.querySelectorAll('[data-wa-msg]').forEach(function (el) {
      el.href = waLink(el.getAttribute('data-wa-msg'));
      el.target = '_blank';
      el.rel = 'noopener';
    });

    /* ---- Contact form -> WhatsApp handoff ---- */
    var contactForm = document.querySelector('#contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var data = new FormData(contactForm);
        var nome = data.get('nome') || '';
        var servico = data.get('servico') || '';
        var mensagem = data.get('mensagem') || '';
        var texto = 'Olá, Interativa! Meu nome é ' + nome + '.';
        if (servico) texto += ' Tenho interesse em: ' + servico + '.';
        if (mensagem) texto += ' ' + mensagem;
        window.open(waLink(texto), '_blank', 'noopener');
      });
    }

    /* ---- Footer year ---- */
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  });
})();
