document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu-toggle');
const dropdowns = [];
const hoverNavigation = window.matchMedia('(min-width: 881px) and (hover: hover)');

document.querySelectorAll('.nav-group').forEach((group) => {
  const button = group.querySelector('.submenu-toggle');
  const submenu = group.querySelector('.nav-submenu');
  if (!button || !submenu) return;

  const sectionName = group.querySelector('.nav-parent > a').textContent.trim();
  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', `${open ? 'Hide' : 'Show'} ${sectionName} pages`);
    submenu.hidden = !open;
  };
  dropdowns.push({ group, button, setOpen });

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });
  group.addEventListener('pointerenter', () => {
    if (hoverNavigation.matches) setOpen(true);
  });
  group.addEventListener('pointerleave', () => {
    if (hoverNavigation.matches && !group.contains(document.activeElement)) setOpen(false);
  });
  group.addEventListener('focusout', (event) => {
    if (!group.contains(event.relatedTarget)) setOpen(false);
  });
  group.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' && event.target !== submenu && !submenu.contains(event.target)) {
      event.preventDefault();
      setOpen(true);
      submenu.querySelector('a')?.focus();
    }
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      button.focus();
    }
  });
});

const closeDropdowns = () => dropdowns.forEach(({ setOpen }) => setOpen(false));
document.addEventListener('click', (event) => {
  dropdowns.forEach(({ group, setOpen }) => {
    if (!group.contains(event.target)) setOpen(false);
  });
});

if (header && menu) {
  const closeMenu = () => {
    menu.setAttribute('aria-expanded', 'false');
    header.classList.remove('menu-open');
    closeDropdowns();
  };
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(expanded));
    header.classList.toggle('menu-open', expanded);
    if (!expanded) closeDropdowns();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      closeMenu();
      menu.focus();
    }
  });
  document.querySelectorAll('.main-nav a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}
