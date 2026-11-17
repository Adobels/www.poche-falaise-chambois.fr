'use strict';
// Remplacer les champs provisoires uniquement par des informations vérifiées.
const people = Array.from({ length: 10 }, (_, index) => ({
  title: `Personne ${String(index + 1).padStart(2, '0')}`,
  name: 'À renseigner', role: 'À renseigner', date: 'À renseigner',
  reason: 'À renseigner', description: 'Présentation à compléter à partir de sources vérifiées.', portrait: `assets/portrait-${String(index + 1).padStart(2, '0')}.svg`
}));
const events = [
  { image: 'assets/commemoration.png', alt: 'Bouquet de fleurs près d’une pierre, scène symbolique générée par IA', title: 'Commémoration — titre à préciser', date: 'À renseigner', place: 'À renseigner', description: 'Thème proposé : un temps de mémoire consacré aux combats et à leurs victimes.' },
  { image: 'assets/transmission.png', alt: 'Carnet et dossiers sur une table, illustration générée par IA', title: 'Transmission et rencontre — titre à préciser', date: 'À renseigner', place: 'À renseigner', description: 'Thème proposé : une rencontre autour des archives, des témoignages et de leur transmission.' },
  { image: 'assets/remise.png', alt: 'Diplôme vierge et coffret, illustration générée par IA', title: 'Remise du label ou de l’insigne — titre à préciser', date: 'À renseigner', place: 'À renseigner', description: 'Thème proposé : une remise dont le cadre et les modalités restent à documenter.' }
];
const board = ['Présidence', 'Vice-présidence', 'Secrétariat', 'Trésorerie', 'Cinquième fonction à préciser'].map((role, index) => ({
  name: 'Nom à renseigner', role: `${role} — à confirmer`, description: 'Courte présentation à compléter.', portrait: `assets/portrait-${String(index + 11).padStart(2, '0')}.svg`
}));
// Les contenus sont insérés comme texte pour permettre leur remplacement sans HTML.
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function portrait(label, source) {
  const node = element('div', 'portrait illustrated-portrait');
  const image = element('img');
  image.src = source;
  image.alt = 'Portrait graphique anonyme, sans identité réelle';
  image.width = 400; image.height = 500; image.loading = 'lazy';
  node.append(image, element('span', '', label));
  return node;
}
function fields(entries) {
  const list = element('dl');
  entries.forEach(([label, value]) => list.append(element('dt', '', label), element('dd', '', value)));
  return list;
}
const dialog = document.querySelector('#detail-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogContent = document.querySelector('#dialog-content');
const closeButton = dialog.querySelector('.dialog-close');
let previousFocus;
function openDetail(button, title, entries, description) {
  previousFocus = button;
  dialogTitle.textContent = title;
  dialogContent.replaceChildren(element('p', '', description), fields(entries));
  dialog.showModal();
  document.body.classList.add('modal-open');
  closeButton.focus();
}
closeButton.addEventListener('click', () => dialog.close());
// Le dialogue natif gère Échap et rend le reste de la page inerte.
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  previousFocus?.focus();
});
// Maintenir explicitement la navigation au clavier dans la fenêtre.
dialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const focusable = [...dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
function detailButton(label, title, entries, description) {
  const button = element('button', 'detail-button', label);
  button.type = 'button';
  button.setAttribute('aria-label', `${label} : ${title}`);
  button.setAttribute('aria-haspopup', 'dialog');
  button.addEventListener('click', () => openDetail(button, title, entries, description));
  return button;
}
people.forEach((person, index) => {
  const entries = [['Nom', person.name], ['Fonction au moment de la remise', person.role], ['Date de remise', person.date], ['Motif de la distinction', person.reason]];
  const card = element('article', 'person-card');
  card.append(portrait(String(index + 1).padStart(2, '0'), person.portrait), element('h3', '', person.title), element('p', 'status', 'Informations à compléter'), fields(entries), element('p', '', person.description), detailButton('Voir la fiche', person.title, entries, person.description));
  document.querySelector('#people-grid').append(card);
});
events.forEach((event, index) => {
  const card = element('article', 'event-card');
  const image = element('div', 'event-image');
  const illustration = element('img');
  illustration.src = event.image; illustration.alt = event.alt;
  illustration.width = 1536; illustration.height = 1024; illustration.loading = 'lazy';
  image.append(illustration, element('small', '', 'Illustration générée par IA'));
  const entries = [['Date', event.date], ['Lieu', event.place], ['Statut', 'Thème provisoire — aucune programmation confirmée']];
  card.append(image, element('p', 'event-meta', `Date : ${event.date.toLowerCase()} · Lieu : ${event.place.toLowerCase()}`), element('h3', '', event.title), element('p', '', event.description), element('p', 'status', 'Thème provisoire · non programmé'), detailButton('Voir le détail', event.title, entries, event.description));
  document.querySelector('#events-grid').append(card);
});
board.forEach((member, index) => {
  const card = element('article', 'board-card');
  card.append(portrait(String(index + 1).padStart(2, '0'), member.portrait), element('h3', '', member.name), element('p', 'role', member.role), element('p', '', member.description));
  document.querySelector('#board-grid').append(card);
});
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const mobile = window.matchMedia('(max-width: 1000px)');
menuButton.hidden = false;
function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-collapsed', !open);
}
function syncMenu() { setMenu(!mobile.matches); }
syncMenu();
mobile.addEventListener('change', syncMenu);
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => {
  if (mobile.matches && event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobile.matches && menuButton.getAttribute('aria-expanded') === 'true' && !dialog.open) {
    setMenu(false); menuButton.focus();
  }
});
