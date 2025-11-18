// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');
const themeToggle = document.getElementById('theme-toggle');

if(navToggle && siteNav){
  navToggle.addEventListener('click', ()=>{
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.style.display = expanded ? '' : 'block';
  });
}

// Theme toggle (dark mode)
function applyTheme(isDark){
  if(isDark) document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.removeAttribute('data-theme');
  if(themeToggle) themeToggle.setAttribute('aria-pressed', String(Boolean(isDark)));
}

const savedTheme = localStorage.getItem('theme');
if(savedTheme){
  applyTheme(savedTheme === 'dark');
}

if(themeToggle){
  themeToggle.addEventListener('click', () =>{
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href.length>1){
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        // collapse mobile nav after click
        if(window.innerWidth < 900 && siteNav){
          siteNav.style.display = '';
          if(navToggle) navToggle.setAttribute('aria-expanded','false');
        }
      }
    }
  })
});

// Contact form handling: try a server endpoint, otherwise open mail client
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
// If you have a Formspree (or similar) endpoint, put it here, e.g. 'https://formspree.io/f/xxxx'
const FORM_ENDPOINT = '';
const FALLBACK_EMAIL = 'paudelnabin11@gmail.com';

if(contactForm){
  contactForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const message = data.get('message')?.toString().trim();
    if(!name || !email || !message){
      formStatus.textContent = 'Please fill out all fields.';
      return;
    }

    formStatus.textContent = 'Sending…';

    // If a server endpoint is configured, try to POST the form there (Formspree-style)
    if(FORM_ENDPOINT){
      try{
        const resp = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: data,
          headers: {
            'Accept': 'application/json'
          }
        });
        if(resp.ok){
          formStatus.textContent = 'Thanks! Your message was sent.';
          contactForm.reset();
        } else {
          // try to read error details if available
          let errText = '';
          try{ const j = await resp.json(); errText = j?.error || j?.message || ''; }catch(_){ }
          formStatus.textContent = 'Sending failed. ' + (errText || 'Opening your email client...');
          // fallback to mailto
          openMailClient(name,email,message);
        }
      }catch(err){
        formStatus.textContent = 'Network error. Opening your email client...';
        openMailClient(name,email,message);
      }
    } else {
      // No backend configured: open user's default mail client with prefilled email to you
      openMailClient(name,email,message);
    }
  });
}

function openMailClient(name,email,message){
  const subject = encodeURIComponent(`Website message from ${name || 'Website visitor'}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  // Use window.location to open default mail client
  window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
  if(formStatus) formStatus.textContent = 'Opening your email client...';
}

// Update year in footer
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Modal for project descriptions
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
let lastFocused = null;

function openModal(title, body){
  if(!modal) return;
  if(modalTitle) modalTitle.textContent = title || 'Details';
  if(modalBody) modalBody.textContent = body || '';
  modal.setAttribute('aria-hidden','false');
  // Save last focused element to restore focus on close
  lastFocused = document.activeElement;
  // Move focus into the dialog
  if(modalClose) modalClose.focus();
}

function closeModal(){
  if(!modal) return;
  modal.setAttribute('aria-hidden','true');
  if(lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}

// Open modal when clicking view buttons
document.querySelectorAll('.view-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const title = btn.getAttribute('data-title') || btn.textContent || 'Details';
    const description = btn.getAttribute('data-description') || '';
    openModal(title, description);
  });
});

// Close handlers
if(modalClose) modalClose.addEventListener('click', closeModal);
if(modal){
  modal.addEventListener('click', (e)=>{
    if(e.target && e.target.matches('.modal-overlay')) closeModal();
  });
}
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false'){
    closeModal();
  }
});
