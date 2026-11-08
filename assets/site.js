/* Progressive enhancement: the page is readable without JavaScript. */
(() => {
  const printButton = document.getElementById('print-cv');
  if (printButton) printButton.addEventListener('click', () => window.print());
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const targets = [...document.querySelectorAll('section > h2, .mode, .panel, .project, .job, .flag')];
  const showAll = () => targets.forEach(el => el.classList.remove('is-pending'));
  try {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-pending');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    targets.forEach(el => {
      // Only animate content below the initial viewport; never hide the hero.
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('reveal', 'is-pending');
        observer.observe(el);
      }
    });
    reduced.addEventListener('change', event => {
      if (event.matches) { showAll(); observer.disconnect(); }
    });
    // Fail open if enhancement stalls, including unusual embedded browsers.
    window.setTimeout(showAll, 12000);
  } catch (_) { showAll(); }
})();
