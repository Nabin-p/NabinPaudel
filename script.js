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

// Contact form handling (fake submit for demo)
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
if(contactForm){
  contactForm.addEventListener('submit', (e)=>{
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
    // Simulate network request
    setTimeout(()=>{
      formStatus.textContent = 'Thanks! Your message was sent (demo).';
      contactForm.reset();
    }, 900);
  });
}

// Update year in footer
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();
