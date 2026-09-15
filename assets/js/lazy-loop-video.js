/**
 * LazyLoopVideo — vídeo mudo em loop que só baixa e reproduz quando
 * entra na viewport. Respeita prefers-reduced-motion e mantém o poster
 * sempre visível como fallback.
 *
 * Markup esperado:
 *   <div class="video-frame">
 *     <video class="lazy-loop-video"
 *            data-src="assets/video/nome.mp4"
 *            poster="assets/img/posters/nome.webp"
 *            muted loop playsinline preload="none"
 *            aria-label="Descrição do vídeo"></video>
 *   </div>
 */
(function (window, document) {
  'use strict';

  var ROOT_MARGIN = '400px';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function loadAndPlay(video) {
    if (video.dataset.loaded === 'true') {
      if (!reduceMotion) {
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      }
      return;
    }
    var src = video.dataset.src;
    if (!src) return;
    video.src = src;
    video.dataset.loaded = 'true';
    video.load();

    if (reduceMotion) return;

    var tryPlay = function () {
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          /* autoplay bloqueado pelo navegador — o poster permanece visível */
        });
      }
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener('loadeddata', tryPlay, { once: true });
    }
  }

  function pause(video) {
    if (video.dataset.loaded === 'true' && !video.paused) {
      video.pause();
    }
  }

  function init(root) {
    var scope = root || document;
    var videos = scope.querySelectorAll('.lazy-loop-video:not([data-lazy-bound])');
    if (!videos.length) return;

    if (!('IntersectionObserver' in window)) {
      videos.forEach(function (v) {
        v.setAttribute('data-lazy-bound', 'true');
        loadAndPlay(v);
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var video = entry.target;
          if (entry.isIntersecting) {
            loadAndPlay(video);
          } else {
            pause(video);
          }
        });
      },
      { rootMargin: ROOT_MARGIN, threshold: 0.01 }
    );

    videos.forEach(function (video) {
      video.setAttribute('data-lazy-bound', 'true');
      observer.observe(video);
    });
  }

  window.LazyLoopVideo = { init: init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); });
  } else {
    init(document);
  }
})(window, document);
