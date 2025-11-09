// GSAP animations and interactive effects
gsap.registerPlugin(ScrollTrigger);

// Brand logo click: navigate to home or scroll to top
const brandLink = document.getElementById('brand-link');
if(brandLink){
  brandLink.addEventListener('click', function(e){
    const homeUrl = document.querySelector('nav').getAttribute('data-home-url');
    const currentUrl = window.location.pathname;
    // If already on home page, scroll to top; otherwise navigate to home
    if(currentUrl === homeUrl || currentUrl === homeUrl + '/'){
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// Page load: typewriter for brand, then reveal tagline and CTA
const brandEl = document.querySelector('.hero-brand');
if(brandEl){
  const brandText = 'Coding Crusaders';
  const typed = document.createElement('span'); typed.className = 'typed';
  const caret = document.createElement('span'); caret.className = 'caret';
  // prepare elements
  brandEl.innerHTML = '';
  brandEl.appendChild(typed);
  brandEl.appendChild(caret);

  // hide tagline and cta until typing finishes
  gsap.set(['.hero-tagline', '.hero-sub', '.btn.primary'], {opacity:0, y:10});

  let i = 0; const speed = 80;
  const t = setInterval(()=>{
    typed.textContent += brandText.charAt(i);
    i++;
    if(i >= brandText.length){
      clearInterval(t);
      // small pause then animate tagline and CTAs
      gsap.to('.hero-tagline', {opacity:1, y:0, duration:0.7, delay:0.12, ease:'power3.out'});
      gsap.to('.hero-sub', {opacity:1, y:0, duration:0.7, delay:0.22, ease:'power3.out'});
      gsap.to('.btn.primary', {opacity:1, y:0, duration:0.9, delay:0.32});
      // remove caret after a short blink
      setTimeout(()=>{ caret.style.opacity = '0'; }, 900);
    }
  }, speed);
}

// Scroll-triggered card reveals
gsap.utils.toArray('.card, .project-card, .profile-card').forEach((el)=>{
  gsap.from(el, {
    scrollTrigger:{trigger:el, start:'top 80%'},
    y:30, opacity:0, duration:0.9, ease:'power2.out',
  });
});

// Parallax background subtle movement based on scroll
gsap.to('#bg-canvas', {
  backgroundPosition: '50% 30%',
  ease: 'none',
  scrollTrigger: { scrub: 0.6 }
});

// Horizontal pin for projects gallery (desktop)
if(window.innerWidth > 900){
  let gallery = document.querySelector('.projects-gallery');
  if(gallery){
    gsap.to(gallery, {
      x: () => `-${gallery.scrollWidth - document.documentElement.clientWidth + 120}`,
      ease: 'none',
      scrollTrigger: {
        trigger: '.projects-gallery',
        scrub: true,
        start: 'top center',
        end: () => `+=${gallery.scrollWidth}`,
        pin: true,
      }
    });
  }
}

// 3D tilt effect for leader card
const leader = document.getElementById('leader-card');
if(leader){
  leader.addEventListener('mousemove', (e)=>{
    const rect = leader.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(leader, {rotationY: x * 12, rotationX: -y * 12, transformPerspective:800, transformOrigin:'center', duration:0.4});
  });
  leader.addEventListener('mouseleave', ()=>{
    gsap.to(leader, {rotationY:0, rotationX:0, duration:0.6, ease:'power2.out'});
  });
}

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    const href = this.getAttribute('href');
    if(href.length>1){
      e.preventDefault(); e.stopPropagation();
      // Use scroll-margin-top (set from CSS var) if available, otherwise fallback to manual offset
      const target = document.querySelector(href);
      if(!target) return;
      // If browser honors CSS scroll-margin-top this will already offset; use smooth scroll to element
      const scrollMargin = parseInt(getComputedStyle(target).getPropertyValue('scroll-margin-top')) || 0;
      const rect = target.getBoundingClientRect();
      const offset = window.scrollY + rect.top - scrollMargin;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// Compute header height and set CSS var for scroll offset so anchors and ScrollTrigger align properly
(function(){
  function updateScrollOffset(){
    const nav = document.getElementById('navbar');
    if(!nav) return;
    // include small extra spacing so the section content isn't flush under the header
    // increase extra slightly to avoid edge overlap on certain sections
    const extra = 18;
    const h = nav.offsetHeight + extra;
    document.documentElement.style.setProperty('--scroll-offset', h + 'px');
    if(typeof ScrollTrigger !== 'undefined'){
      // refresh ScrollTrigger to update start/end positions based on new offset
      ScrollTrigger.refresh();
    }
  }
  // update on load and resize
  window.addEventListener('load', updateScrollOffset);
  window.addEventListener('resize', updateScrollOffset);
  // in case header changes (mobile open/close), also update when mobile nav toggles
  const mobBtn = document.getElementById('hamburger-btn');
  if(mobBtn){ mobBtn.addEventListener('click', ()=> setTimeout(updateScrollOffset, 280)); }
  // run once now
  updateScrollOffset();
})();

// Global: ripple effect for buttons and scroll-to-top behavior
(function(){
  // ripple on any element with .btn
  document.addEventListener('click', function(e){
    const btn = e.target.closest && e.target.closest('.btn');
    if(!btn) return;
    // create ripple element
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 1.2;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    btn.appendChild(ripple);
    // remove after animation
    setTimeout(()=>{ ripple.remove(); }, 620);
  });

  // Scroll-to-top button behavior
  const scrollBtn = document.getElementById('scroll-top');
  if(!scrollBtn) return;
  function updateScrollBtn(){
    if(window.scrollY > window.innerHeight / 2){ scrollBtn.classList.add('show'); }
    else { scrollBtn.classList.remove('show'); }
  }
  window.addEventListener('scroll', updateScrollBtn);
  window.addEventListener('load', updateScrollBtn);
  scrollBtn.addEventListener('click', ()=>{ window.scrollTo({top:0, behavior:'smooth'}); });
  // keyboard accessibility: Enter / Space
  scrollBtn.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); } });
})();

// Lightbox for gallery images
(function(){
  const lightbox = document.getElementById('lightbox');
  if(!lightbox) return;
  const imgEl = lightbox.querySelector('#lightbox-img');
  const capEl = lightbox.querySelector('.lightbox-caption');

  // Use event delegation to handle gallery links (including dynamically loaded ones)
  let currentIndex = -1;
  
  function getGalleryLinks(){
    return Array.from(document.querySelectorAll('.gallery-link'));
  }

  function showImageAtIndex(index){
    const galleryLinks = getGalleryLinks();
    if(index < 0 || index >= galleryLinks.length) return;
    currentIndex = index;
    const a = galleryLinks[currentIndex];
    const src = a.getAttribute('href');
    const caption = a.dataset.caption || '';
    // set a low-opacity placeholder while loading for smooth transition
    imgEl.style.opacity = '0';
    imgEl.src = src;
    imgEl.alt = caption || '';
    capEl.textContent = caption || '';
    // update download link
    const dl = document.getElementById('lightbox-download');
    if(dl) { dl.href = src; dl.setAttribute('download', ''); }
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    // ensure prev/next buttons visible state
    updateArrowState();
    // When image finishes loading, fade it in
    imgEl.onload = function(){ imgEl.style.opacity = '1'; imgEl.onload = null; };
    // preload next image for snappier navigation
    (function preloadNext(){
      const galleryLinks = getGalleryLinks();
      if(!galleryLinks.length) return;
      const nextIndex = (currentIndex + 1) % galleryLinks.length;
      const nextSrc = galleryLinks[nextIndex] && galleryLinks[nextIndex].getAttribute('href');
      if(nextSrc){ const pre = new Image(); pre.src = nextSrc; }
    })();
  }

  function openLightboxAtLink(a){
    const galleryLinks = getGalleryLinks();
    const idx = galleryLinks.indexOf(a);
    if(idx === -1) return;
    showImageAtIndex(idx);
  }

  function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
    imgEl.src = '';
    capEl.textContent = '';
    document.body.style.overflow = '';
  }

  function nextImage(){
    const galleryLinks = getGalleryLinks();
    if(galleryLinks.length === 0) return;
    const next = (currentIndex + 1) % galleryLinks.length;
    showImageAtIndex(next);
  }

  function prevImage(){
    const galleryLinks = getGalleryLinks();
    if(galleryLinks.length === 0) return;
    const prev = (currentIndex - 1 + galleryLinks.length) % galleryLinks.length;
    showImageAtIndex(prev);
  }

  function updateArrowState(){
    // could disable arrows at ends if desired; currently wrap-around so nothing to do
  }

  // Use event delegation: click on gallery grid or parent, then check if target is a gallery link
  const gridParent = document.querySelector('.gallery-grid') || document.body;
  gridParent.addEventListener('click', function(e){
    const link = e.target.closest('.gallery-link');
    if(link){
      e.preventDefault();
      openLightboxAtLink(link);
    }
  });

  // close triggers
  lightbox.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click', closeLightbox));
  // prev / next buttons
  const prevBtn = lightbox.querySelector('[data-prev]');
  const nextBtn = lightbox.querySelector('[data-next]');
  if(prevBtn) prevBtn.addEventListener('click', prevImage);
  if(nextBtn) nextBtn.addEventListener('click', nextImage);

  // Touch-swipe support for lightbox (mobile swipes)
  (function(){
    let startX = 0, startY = 0, endX = 0, endY = 0;
    const threshold = 40; // px
    lightbox.addEventListener('touchstart', (e)=>{
      const t = e.touches[0]; startX = t.clientX; startY = t.clientY; endX = startX; endY = startY;
    }, {passive:true});
    lightbox.addEventListener('touchmove', (e)=>{ const t = e.touches[0]; endX = t.clientX; endY = t.clientY; }, {passive:true});
    lightbox.addEventListener('touchend', ()=>{
      const dx = endX - startX; const dy = endY - startY;
      if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold){ if(dx < 0) nextImage(); else prevImage(); }
    });
  })();
  // keyboard navigation: Esc to close, left/right to navigate, 'd' to download
  window.addEventListener('keydown', (e)=>{
    if(lightbox.getAttribute('aria-hidden') === 'false'){
      if(e.key === 'Escape') closeLightbox();
      else if(e.key === 'ArrowRight') nextImage();
      else if(e.key === 'ArrowLeft') prevImage();
      else if(e.key.toLowerCase() === 'd'){
        const dl = document.getElementById('lightbox-download');
        if(dl && dl.href){ window.open(dl.href, '_blank'); }
      }
    }
  });
  
  // Load more functionality: reveal images in batches to avoid long initial render
  (function(){
    const grid = document.querySelector('.gallery-grid');
    if(!grid) return;
    const items = Array.from(grid.querySelectorAll('.gallery-item'));
    const pageSize = 12;
    let visible = 0;
    
    function showNextBatch(){
      const next = items.slice(visible, visible + pageSize);
      next.forEach(it => { 
        it.style.display = 'block'; 
        // Load image when visible
        const img = it.querySelector('img'); 
        if(img){
          const src = img.getAttribute('data-src') || img.src;
          if(src && src.startsWith('data:')) {
            // Has placeholder, try to load real image
            const realSrc = img.getAttribute('data-src');
            if(realSrc) {
              img.src = realSrc;
              img.onload = function() {
                img.classList.add('loaded');
                img.onload = null;
              };
            }
          } else if(src) {
            // Already has real src, ensure it loads
            img.src = src;
            img.onload = function() {
              img.classList.add('loaded');
              img.onload = null;
            };
          }
          img.removeAttribute('data-src');
        }
      });
      visible += next.length;
      if(visible >= items.length){
        const btnWrap = document.querySelector('.gallery-loadmore'); 
        if(btnWrap) btnWrap.remove();
      }
    }
    
    // Hide all initially except first batch
    items.forEach(it => it.style.display = 'none');
    showNextBatch();
    
    // Add "Load more" button if needed
    if(items.length > visible){
      const wrap = document.createElement('div'); 
      wrap.className = 'gallery-loadmore';
      const btn = document.createElement('a'); 
      btn.className = 'btn ghost'; 
      btn.href = '#'; 
      btn.textContent = 'Load more';
      btn.addEventListener('click', (e)=>{ e.preventDefault(); showNextBatch(); });
      wrap.appendChild(btn);
      grid.parentNode.insertBefore(wrap, grid.nextSibling);
    }
  })();
})();

// Subtle reactive particle-like background using canvas
(() => {
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas-canvas';
  const container = document.getElementById('bg-canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let cw, ch;
  const particles = [];

  function resize(){
    cw = canvas.width = window.innerWidth;
    ch = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function create(){
    for(let i=0;i<60;i++){
      particles.push({x:Math.random()*cw,y:Math.random()*ch,r:Math.random()*2+0.6, vel: (Math.random()*0.6)+0.15, hue: 180+Math.random()*120});
    }
  }
  create();

  function draw(){
    ctx.clearRect(0,0,cw,ch);
    particles.forEach(p=>{
      p.y -= p.vel;
      if(p.y < -10){ p.y = ch + 10; p.x = Math.random()*cw; }
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*12);
      g.addColorStop(0, `hsla(${p.hue},90%,60%,0.14)`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r*6,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();

  // Mouse reactive push
  window.addEventListener('mousemove', (e)=>{
    particles.forEach(p=>{
      const dx = p.x - e.clientX; const dy = p.y - e.clientY; const d = Math.sqrt(dx*dx+dy*dy);
      if(d < 140){ p.x += dx*0.02; p.y += dy*0.02; }
    });
  });
})();

/* Theme color tweening per-section using GSAP + ScrollTrigger */
(function(){
  if(typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const root = document.documentElement;

  const themeMap = {
    home:    { accent: '#6ee7ff', accent2: '#7b61ff', bg1: '#0b0f17', bg2: '#071023' },
    about:   { accent: '#a78bfa', accent2: '#7b61ff', bg1: '#071026', bg2: '#06091c' },
    team:    { accent: '#7CFC6B', accent2: '#4BB543', bg1: '#07120a', bg2: '#041008' },
    projects:{ accent: '#ffb86b', accent2: '#ff7a59', bg1: '#120b07', bg2: '#160f07' },
    contact: { accent: '#2dd4bf', accent2: '#6ee7ff', bg1: '#061821', bg2: '#021216' },
    achievements: { accent: '#9b8cff', accent2: '#7b61ff', bg1:'#0b0812', bg2:'#05040a' }
  };

  function cssVarsFor(theme){
    const o = {};
    if(theme.accent) o['--accent'] = theme.accent;
    if(theme.accent2) o['--accent-2'] = theme.accent2;
    if(theme.bg1) o['--bg-1'] = theme.bg1;
    if(theme.bg2) o['--bg-2'] = theme.bg2;
    return o;
  }

  // Ensure ScrollTrigger is aware (already registered earlier)
  Object.keys(themeMap).forEach(id => {
    const el = document.getElementById(id);
    if(!el) return;
    // compute offset from CSS var (set earlier by updateScrollOffset)
    const offsetPx = parseInt(getComputedStyle(root).getPropertyValue('--scroll-offset')) || 88;
    // use a slightly reduced trigger offset so the color tween occurs when the
    // section is visually prominent. This helps fix slight misalignment for
    // About/Achievements where the header/padding caused off-by-a-few-pixels.
    const triggerOffset = Math.max(0, offsetPx - 6);
    ScrollTrigger.create({
      trigger: el,
      start: `top top+=${triggerOffset}`,
      end: `bottom top+=${triggerOffset}`,
      onEnter: () => gsap.to(root, { ...cssVarsFor(themeMap[id]), duration: 0.9, ease: 'power2.out' }),
      onEnterBack: () => gsap.to(root, { ...cssVarsFor(themeMap[id]), duration: 0.9, ease: 'power2.out' })
    });
  });

  // Optional: set initial theme based on first visible section
  const first = document.querySelector('main section[id]');
  if(first && themeMap[first.id]){
    gsap.set(root, cssVarsFor(themeMap[first.id]));
  }
})();

// Member modal interactions
(function(){
  const modal = document.getElementById('member-modal');
  const dialog = modal && modal.querySelector('.modal-dialog');
  const backdrop = modal && modal.querySelector('.modal-backdrop');
  const nameEl = modal && modal.querySelector('#member-name');
  const titleEl = modal && modal.querySelector('.member-title');
  const bioEl = modal && modal.querySelector('.member-bio');
  const avatarEl = modal && modal.querySelector('.avatar-large');
  const socialsEl = modal && modal.querySelector('.modal-socials');

  function buildSocialLink(href, type){
    if(!href) return null;
    const a = document.createElement('a');
    a.className = 'social-icon';
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = type;
    let svg = '';
    if(type === 'Instagram') svg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm4.29-10.195c-.798 0-1.45.652-1.45 1.45s.652 1.45 1.45 1.45 1.45-.652 1.45-1.45-.652-1.45-1.45-1.45z" fill="currentColor" /></svg>';
    if(type === 'LinkedIn') svg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>';
    if(type === 'X') svg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.807-5.989 6.807H2.423l7.723-8.835L1.228 2.25h6.837l4.759 6.289 5.419-6.289Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" /></svg>';
    a.innerHTML = svg;
    return a;
  }

  function openModal(data){
    if(!modal) return;
    nameEl.textContent = data.name || '';
    titleEl.textContent = data.title || '';
    bioEl.textContent = data.bio || '';
    // style avatar (we keep gradient)
    // clear socials
    socialsEl.innerHTML = '';
    const ins = buildSocialLink(data.instagram, 'Instagram'); if(ins) socialsEl.appendChild(ins);
    const li = buildSocialLink(data.linkedin, 'LinkedIn'); if(li) socialsEl.appendChild(li);
    const x = buildSocialLink(data.x, 'X'); if(x) socialsEl.appendChild(x);

    modal.setAttribute('aria-hidden','false');
    // animate backdrop and dialog
    gsap.killTweensOf([backdrop, dialog]);
    gsap.timeline()
      .to(backdrop, {opacity:1, duration:0.28, ease:'power2.out'})
      .to(dialog, {opacity:1, scale:1, duration:0.45, ease:'back.out(1.1)'}, '-=0.18');
    // trap focus to close button
    const closeBtn = dialog.querySelector('[data-close]');
    if(closeBtn) closeBtn.focus();
  }

  function closeModal(){
    if(!modal) return;
    gsap.killTweensOf([backdrop, dialog]);
    gsap.timeline()
      .to(dialog, {opacity:0, scale:0.98, duration:0.22, ease:'power2.in'})
      .to(backdrop, {opacity:0, duration:0.22, ease:'power2.in'}, '-=0.16')
      .call(()=>modal.setAttribute('aria-hidden','true'));
  }

  // attach click to profile card(s)
  document.querySelectorAll('.profile-card').forEach(card => {
    card.addEventListener('click', ()=>{
      const data = {
        name: card.dataset.name,
        title: card.dataset.title,
        bio: card.dataset.bio,
        instagram: card.dataset.instagram,
        linkedin: card.dataset.linkedin,
        x: card.dataset.x
      };
      openModal(data);
    });
  });

  // close triggers
  modal && modal.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click', closeModal));
  // close on Escape
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });
  // close on click outside dialog
  backdrop && backdrop.addEventListener('click', closeModal);

})();

// Navbar behavior: always navigate to page URLs (do not intercept home clicks)
(function(){
  // We intentionally do NOT intercept clicks on `a[data-section]`.
  // This lets the browser navigate to the target page or to the home+anchor
  // so users always reach the dedicated pages rather than only scrolling sections.

  // Neon pulse on active nav using GSAP subtle scale/pulse
  const active = document.querySelector('.nav nav a.active');
  if(active){
    gsap.fromTo(active, {boxShadow:'0 0 0px rgba(123,97,255,0.0)'}, {boxShadow:'0 0 30px rgba(123,97,255,0.12)', duration:1.8, repeat:-1, yoyo:true, ease:'sine.inOut'});
  }

  // Brand glow pulse for hero (if present)
  const brand = document.querySelector('.hero-brand');
  if(brand){
    gsap.to(brand, {"--glow": '18px', duration:1.8, repeat:-1, yoyo:true, ease:'sine.inOut', onUpdate:function(){
      const v = parseFloat(getComputedStyle(brand).getPropertyValue('--glow')) || 0;
      brand.style.transform = `translateY(${-(v/90)}px)`;
    }});
  }
})();

// Profile dropdown toggle
(function(){
  const btn = document.getElementById('profile-btn');
  const dropdown = document.getElementById('profile-dropdown');
  if(!btn || !dropdown) return;

  let repositionHandler = null;

  function positionDropdown(){
    const rect = btn.getBoundingClientRect();
    // small offset between button and dropdown
    const offset = 8;
    // mobile: full-width-ish under the header
    if(window.innerWidth <= 700){
      dropdown.style.left = offset + 'px';
      dropdown.style.right = offset + 'px';
      dropdown.style.top = (rect.bottom + offset) + 'px';
      dropdown.style.width = 'auto';
    } else {
      // position by distance from right edge to avoid needing dropdown width measurement
      const right = Math.max(8, Math.round(window.innerWidth - rect.right + offset));
      dropdown.style.right = right + 'px';
      dropdown.style.left = 'auto';
      dropdown.style.top = (rect.bottom + offset) + 'px';
    }
  }

  function open(){
    btn.setAttribute('aria-expanded','true');
    // If the dropdown is inside a parent that may clip it, move it to body while open
    if(dropdown.parentNode !== document.body){
      dropdown.__originalParent = dropdown.parentNode;
      dropdown.__originalNext = dropdown.nextSibling;
      document.body.appendChild(dropdown);
    }
    // position before revealing
    positionDropdown();
    dropdown.setAttribute('aria-hidden','false');
    // reposition while open on resize/scroll
    repositionHandler = ()=> positionDropdown();
    window.addEventListener('resize', repositionHandler);
    window.addEventListener('scroll', repositionHandler, {passive:true});
    // focus the first focusable element for keyboard users
    const focusable = dropdown.querySelector('a,button,input,[tabindex]:not([tabindex="-1"])');
    if(focusable) setTimeout(()=> focusable.focus(), 60);
  }

  function close(){
    btn.setAttribute('aria-expanded','false');
    dropdown.setAttribute('aria-hidden','true');
    // restore dropdown to original parent to keep DOM structure stable
    if(dropdown.__originalParent){
      try{
        if(dropdown.__originalNext) dropdown.__originalParent.insertBefore(dropdown, dropdown.__originalNext);
        else dropdown.__originalParent.appendChild(dropdown);
      } catch(e){ /* ignore */ }
      delete dropdown.__originalParent; delete dropdown.__originalNext;
    }
    if(repositionHandler){ window.removeEventListener('resize', repositionHandler); window.removeEventListener('scroll', repositionHandler); repositionHandler = null; }
  }

  btn.addEventListener('click', (e)=>{ e.stopPropagation(); const expanded = btn.getAttribute('aria-expanded') === 'true'; if(expanded) close(); else open(); });
  // close when clicking outside
  document.addEventListener('click', (e)=>{ if(!dropdown.contains(e.target) && !btn.contains(e.target)) close(); });
  // close on escape
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') { close(); } });
})();

// Mobile hamburger toggle
(function(){
  const btn = document.getElementById('hamburger-btn');
  const mobile = document.getElementById('mobile-nav');
  if(!btn || !mobile) return;
  function open(){ btn.setAttribute('aria-expanded','true'); mobile.setAttribute('aria-hidden','false'); mobile.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close(){ btn.setAttribute('aria-expanded','false'); mobile.setAttribute('aria-hidden','true'); mobile.classList.remove('open'); document.body.style.overflow = ''; }
  btn.addEventListener('click', (e)=>{ e.stopPropagation(); const expanded = btn.getAttribute('aria-expanded') === 'true'; if(expanded) close(); else open(); });
  // close when clicking outside the inner container
  mobile.addEventListener('click', (e)=>{ if(e.target === mobile) close(); });
  // close on escape
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });
  // close when navigating a mobile link
  mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{ close(); }));
})();

// Project swap: swap featured <-> mini card on click with smooth GSAP animation
(function(){
  if(typeof gsap === 'undefined') return;

  let isSwapping = false;

  // Attach listeners to mini-project elements
  function attachSwapListener(miniEl){
    miniEl.addEventListener('click', (e) => {
      // Only trigger on the mini-project card or its children
      if(!e.target.closest('.mini-project')) return;
      e.preventDefault();
      e.stopPropagation();
      performSwap(miniEl);
    });
  }

  // Find and attach listeners to all mini projects
  function setupSwapListeners(){
    document.querySelectorAll('.mini-project').forEach(miniEl => attachSwapListener(miniEl));
  }

  function performSwap(miniEl){
    if(isSwapping) return;
    isSwapping = true;

    const featured = document.getElementById('featured-project');
    if(!featured || !miniEl) {
      isSwapping = false;
      return;
    }

    // Extract data from both cards
    const fData = {
      id: featured.dataset.id,
      title: featured.dataset.title,
      desc: featured.dataset.desc,
      link: featured.dataset.link,
      img: featured.dataset.img
    };
    const mData = {
      id: miniEl.dataset.id,
      title: miniEl.dataset.title,
      desc: miniEl.dataset.desc,
      link: miniEl.dataset.link,
      img: miniEl.dataset.img
    };

    // Get DOM elements for animation
    const fRect = featured.getBoundingClientRect();
    const mRect = miniEl.getBoundingClientRect();

    // Calculate transform deltas
    const dx = mRect.left - fRect.left;
    const dy = mRect.top - fRect.top;
    const scaleX = mRect.width / fRect.width || 0.5;
    const scaleY = mRect.height / fRect.height || 0.5;

    // Create animated clones positioned absolutely
    const fClone = featured.cloneNode(true);
    const mClone = miniEl.cloneNode(true);

    // Position clones as fixed to freeze them in their current viewport position
    [fClone, mClone].forEach(el => el.style.pointerEvents = 'none');
    Object.assign(fClone.style, {
      position: 'fixed',
      left: fRect.left + 'px',
      top: fRect.top + 'px',
      width: fRect.width + 'px',
      height: fRect.height + 'px',
      zIndex: '9999',
      margin: 0,
      boxSizing: 'border-box'
    });
    Object.assign(mClone.style, {
      position: 'fixed',
      left: mRect.left + 'px',
      top: mRect.top + 'px',
      width: mRect.width + 'px',
      height: mRect.height + 'px',
      zIndex: '9998',
      margin: 0,
      boxSizing: 'border-box'
    });

    // Add clones to body
    document.body.appendChild(fClone);
    document.body.appendChild(mClone);

    // Hide originals
    featured.style.visibility = 'hidden';
    miniEl.style.visibility = 'hidden';

    // Animate clones to swap positions/sizes, then update DOM
    const timeline = gsap.timeline({
      onComplete: () => {
        // Update featured card with mini's data
        featured.dataset.id = mData.id;
        featured.dataset.title = mData.title;
        featured.dataset.desc = mData.desc;
        featured.dataset.link = mData.link;
        featured.dataset.img = mData.img;
        updateFeaturedCard(featured, mData);

        // Update mini card with featured's data
        miniEl.dataset.id = fData.id;
        miniEl.dataset.title = fData.title;
        miniEl.dataset.desc = fData.desc;
        miniEl.dataset.link = fData.link;
        miniEl.dataset.img = fData.img;
        updateMiniCard(miniEl, fData);

        // Restore visibility
        featured.style.visibility = 'visible';
        miniEl.style.visibility = 'visible';

        // Clean up clones and reset swap flag
        fClone.remove();
        mClone.remove();
        isSwapping = false;
      }
    });

    // Animate clones: featured shrinks to mini's size/position, mini grows to featured's
    timeline.to(
      fClone,
      { x: dx, y: dy, scaleX: scaleX, scaleY: scaleY, duration: 0.5, ease: 'power2.inOut' },
      0
    );
    timeline.to(
      mClone,
      { x: -dx, y: -dy, scaleX: 1 / scaleX, scaleY: 1 / scaleY, duration: 0.5, ease: 'power2.inOut' },
      0
    );
  }

  function updateFeaturedCard(card, data){
    // Update title, description, CTA link, and image
    const titleEl = card.querySelector('.featured-title');
    const descEl = card.querySelector('.featured-desc');
    const ctaEl = card.querySelector('.featured-cta');
    const imgEl = card.querySelector('.featured-img');

    if(titleEl) titleEl.textContent = data.title;
    if(descEl) descEl.textContent = data.desc ? (data.desc.length > 180 ? data.desc.substring(0, 177) + '...' : data.desc) : '';
    if(ctaEl) ctaEl.href = data.link;
    if(imgEl && data.img) imgEl.src = data.img;
  }

  function updateMiniCard(card, data){
    // Update mini card title, desc, and image
    const titleEl = card.querySelector('.mini-title');
    const descEl = card.querySelector('.mini-desc');
    const imgEl = card.querySelector('.mini-img');

    if(titleEl) titleEl.textContent = data.title;
    if(descEl) descEl.textContent = data.desc ? (data.desc.length > 100 ? data.desc.substring(0, 97) + '...' : data.desc) : '';
    if(imgEl && data.img) imgEl.src = data.img;
  }

  // Initialize on page load
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', setupSwapListeners);
  } else {
    setupSwapListeners();
  }
})();

// Project swap for Projects page (featured-project-page / mini-project-page)
(function(){
  if(typeof gsap === 'undefined') return;

  let isSwapping = false;

  function attachSwapListener(miniEl){
    miniEl.addEventListener('click', (e) => {
      if(!e.target.closest('.mini-project-page')) return;
      e.preventDefault();
      e.stopPropagation();
      performSwap(miniEl);
    });
  }

  function setupSwapListeners(){
    document.querySelectorAll('.mini-project-page').forEach(miniEl => attachSwapListener(miniEl));
  }

  function performSwap(miniEl){
    if(isSwapping) return;
    isSwapping = true;

    const featured = document.getElementById('featured-project-page');
    if(!featured || !miniEl) {
      isSwapping = false;
      return;
    }

    const fData = {
      id: featured.dataset.id,
      title: featured.dataset.title,
      desc: featured.dataset.desc,
      link: featured.dataset.link,
      img: featured.dataset.img
    };
    const mData = {
      id: miniEl.dataset.id,
      title: miniEl.dataset.title,
      desc: miniEl.dataset.desc,
      link: miniEl.dataset.link,
      img: miniEl.dataset.img
    };

    const fRect = featured.getBoundingClientRect();
    const mRect = miniEl.getBoundingClientRect();

    const dx = mRect.left - fRect.left;
    const dy = mRect.top - fRect.top;
    const scaleX = mRect.width / fRect.width || 0.5;
    const scaleY = mRect.height / fRect.height || 0.5;

    const fClone = featured.cloneNode(true);
    const mClone = miniEl.cloneNode(true);

    [fClone, mClone].forEach(el => el.style.pointerEvents = 'none');
    Object.assign(fClone.style, {
      position: 'fixed',
      left: fRect.left + 'px',
      top: fRect.top + 'px',
      width: fRect.width + 'px',
      height: fRect.height + 'px',
      zIndex: '9999',
      margin: 0,
      boxSizing: 'border-box'
    });
    Object.assign(mClone.style, {
      position: 'fixed',
      left: mRect.left + 'px',
      top: mRect.top + 'px',
      width: mRect.width + 'px',
      height: mRect.height + 'px',
      zIndex: '9998',
      margin: 0,
      boxSizing: 'border-box'
    });

    document.body.appendChild(fClone);
    document.body.appendChild(mClone);

    featured.style.visibility = 'hidden';
    miniEl.style.visibility = 'hidden';

    const timeline = gsap.timeline({
      onComplete: () => {
        featured.dataset.id = mData.id;
        featured.dataset.title = mData.title;
        featured.dataset.desc = mData.desc;
        featured.dataset.link = mData.link;
        featured.dataset.img = mData.img;
        updateFeaturedCardPage(featured, mData);

        miniEl.dataset.id = fData.id;
        miniEl.dataset.title = fData.title;
        miniEl.dataset.desc = fData.desc;
        miniEl.dataset.link = fData.link;
        miniEl.dataset.img = fData.img;
        updateMiniCardPage(miniEl, fData);

        featured.style.visibility = 'visible';
        miniEl.style.visibility = 'visible';

        fClone.remove();
        mClone.remove();
        isSwapping = false;
      }
    });

    timeline.to(
      fClone,
      { x: dx, y: dy, scaleX: scaleX, scaleY: scaleY, duration: 0.5, ease: 'power2.inOut' },
      0
    );
    timeline.to(
      mClone,
      { x: -dx, y: -dy, scaleX: 1 / scaleX, scaleY: 1 / scaleY, duration: 0.5, ease: 'power2.inOut' },
      0
    );
  }

  function updateFeaturedCardPage(card, data){
    const titleEl = card.querySelector('.featured-title-page');
    const descEl = card.querySelector('.featured-desc-page');
    const ctaEl = card.querySelector('.featured-cta-page');
    const imgEl = card.querySelector('.featured-img-page');

    if(titleEl) titleEl.textContent = data.title;
    if(descEl) descEl.textContent = data.desc || 'No description provided.';
    if(ctaEl) ctaEl.href = data.link;
    if(imgEl && data.img) imgEl.src = data.img;
  }

  function updateMiniCardPage(card, data){
    const titleEl = card.querySelector('.mini-title-page');
    const descEl = card.querySelector('.mini-desc-page');
    const imgEl = card.querySelector('.mini-img-page');

    if(titleEl) titleEl.textContent = data.title;
    if(descEl) descEl.textContent = data.desc ? (data.desc.length > 120 ? data.desc.substring(0, 117) + '...' : data.desc) : '';
    if(imgEl && data.img) imgEl.src = data.img;
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', setupSwapListeners);
  } else {
    setupSwapListeners();
  }
})();

// ============ HOME PAGE INTERACTIVE ENHANCEMENTS ============

// Animate stat numbers on scroll into view
(function(){
  if(typeof gsap === 'undefined') return;
  
  document.querySelectorAll('.card-stat').forEach(card => {
    const countEl = card.querySelector('.stat-number');
    if(!countEl) return;
    
    const targetCount = parseInt(card.dataset.count) || 0;
    const originalText = countEl.innerHTML;
    
    gsap.to({count: 0}, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        once: true
      },
      count: targetCount,
      duration: 2,
      ease: 'power2.out',
      onUpdate: function(){
        countEl.textContent = Math.ceil(this.targets()[0].count);
      },
      onComplete: function(){
        countEl.innerHTML = originalText;
      }
    });
  });
})();

// Animate achievement items staggered
(function(){
  if(typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  
  const items = document.querySelectorAll('.achievement-item');
  if(items.length === 0) return;
  
  gsap.to(items, {
    scrollTrigger: {
      trigger: '.highlights-interactive',
      start: 'top 75%',
      once: true
    },
    opacity: 1,
    x: 0,
    stagger: 0.05,
    duration: 0.6,
    ease: 'power2.out'
  });
})();

// Team card hover effect with subtle 3D tilt
(function(){
  const cards = document.querySelectorAll('.profile-card-interactive');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if(window.innerWidth < 768) return; // disable on mobile
      
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      gsap.to(card, {
        rotationY: x * 5,
        rotationX: -y * 5,
        transformPerspective: 600,
        duration: 0.3
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
})();

// Form field focus animations
(function(){
  const inputs = document.querySelectorAll('.form-input');
  const formSubmit = document.querySelector('.form-submit');
  
  if(formSubmit){
    formSubmit.addEventListener('mouseenter', () => {
      gsap.to(formSubmit, {
        scale: 1.08,
        duration: 0.2
      });
    });
    
    formSubmit.addEventListener('mouseleave', () => {
      gsap.to(formSubmit, {
        scale: 1,
        duration: 0.2
      });
    });
  }
})();

// Project card floating effect
(function(){
  if(typeof gsap === 'undefined') return;
  
  const heroCard = document.querySelector('.hero-card-interactive');
  if(heroCard){
    gsap.to(heroCard, {
      y: -8,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  }
})();

// Social icons pulse effect
(function(){
  if(typeof gsap === 'undefined') return;
  
  const socialIcons = document.querySelectorAll('.social-icon-interactive');
  socialIcons.forEach((icon, idx) => {
    gsap.fromTo(icon, 
      { scale: 1, opacity: 0.7 },
      {
        scale: 1.05,
        opacity: 0.9,
        duration: 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: idx * 0.15
      }
    );
  });
})();

// Team Member Modal
(function(){
  const modal = document.getElementById('team-modal');
  if (!modal) return;

  const teamCards = document.querySelectorAll('.team-member-card');
  const closeButton = modal.querySelector('[data-close]');
  const backdrop = modal.querySelector('.modal-backdrop');

  function openModal(card) {
    const name = card.getAttribute('data-name');
    const title = card.getAttribute('data-title');
    const bio = card.getAttribute('data-bio');
    const pronouns = card.getAttribute('data-pronouns');
    const photo = card.getAttribute('data-photo');
    const instagram = card.getAttribute('data-instagram');
    const linkedin = card.getAttribute('data-linkedin');
    const x = card.getAttribute('data-x');

    // Set content
    document.getElementById('modal-title').textContent = name;
    document.getElementById('modal-pronouns').textContent = pronouns || '';
    document.getElementById('modal-title-text').textContent = title;
    document.getElementById('modal-bio').textContent = bio || 'No bio available.';

    // Set photo
    if (photo) {
      document.getElementById('modal-photo').src = photo;
      document.getElementById('modal-photo').style.display = 'block';
    } else {
      document.getElementById('modal-photo').style.display = 'none';
    }

    // Set social links
    const instagramLink = document.getElementById('modal-instagram');
    const linkedinLink = document.getElementById('modal-linkedin');
    const xLink = document.getElementById('modal-x');

    if (instagram) {
      instagramLink.href = instagram;
      instagramLink.style.display = 'inline-flex';
    } else {
      instagramLink.style.display = 'none';
    }

    if (linkedin) {
      linkedinLink.href = linkedin;
      linkedinLink.style.display = 'inline-flex';
    } else {
      linkedinLink.style.display = 'none';
    }

    if (x) {
      xLink.href = x;
      xLink.style.display = 'inline-flex';
    } else {
      xLink.style.display = 'none';
    }

    // Show modal with animation
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    if (typeof gsap !== 'undefined') {
      gsap.from('.modal-content', {
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Event listeners
  teamCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(card);
    });
  });

  closeButton.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
})();