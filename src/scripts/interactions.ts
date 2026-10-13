type Subject = 'web' | 'math' | 'language';
type Guidance = 'question' | 'hint' | 'reflect';
const subjects: Record<Subject, { name: string; role: string; instructions: string[]; resources: string[]; outcome: string; principle: string; conversation: {role: 'student' | 'mentor'; text: string}[] }> = {
  web: {
    name: 'Web Mentor', role: 'Be a patient web development mentor.',
    instructions: ['Start with what the student has already tried.', 'Offer small hints the student can test.', 'Ask the student to explain why the fix worked.'],
    resources: ['HTML structure and file paths', 'CSS basics and debugging'],
    outcome: "“What have you tried so far? Let's look at one part of the code first.”",
    principle: 'AMIRA starts with what the student has tried, then guides them toward one manageable step.',
    conversation: [
      { role: 'student', text: "Why isn't my CSS loading? I've added a link tag in my HTML." },
      { role: 'mentor', text: "Let's trace it together. Which folder is your CSS file in, and what path did you use in the <link> tag?" },
      { role: 'student', text: 'It is in the styles folder, but my href only says style.css.' },
      { role: 'mentor', text: 'Try matching the path to the file location: styles/style.css. Reload the page and check whether its appearance changes.' },
      { role: 'student', text: 'It works! The path needs to match the file location relative to my HTML.' },
      { role: 'mentor', text: 'Exactly. Now explain in your own words why the change worked, and note the guidance you used in your learning journal.' },
    ],
  },
  math: {
    name: 'Math Mentor', role: 'Be a friendly mathematics mentor.',
    instructions: ['Connect concepts to everyday examples.', 'Ask about the reasoning behind each step.', 'Encourage the student to check the result.'],
    resources: ['Understanding fractions with visual models', 'Fractions in everyday situations'],
    outcome: "“Let's start with a cake cut into four equal pieces.”",
    principle: 'AMIRA connects concepts to familiar situations and encourages students to explain their thinking.',
    conversation: [
      { role: 'student', text: "Why isn't 1/2 plus 1/4 equal to 2/6?" },
      { role: 'mentor', text: 'Imagine a cake cut into four equal pieces. How many pieces would make half of the cake?' },
      { role: 'student', text: 'Two pieces. So one half is the same as two quarters.' },
      { role: 'mentor', text: 'Right. If you add one more piece to those two, how much of the whole cake do you have?' },
      { role: 'student', text: 'Three out of four pieces. The answer is 3/4.' },
      { role: 'mentor', text: 'You have found the reasoning. Can you explain why the pieces need to be the same size before we add them?' },
    ],
  },
  language: {
    name: 'Writing Mentor', role: 'Be a supportive writing partner.',
    instructions: ["Start with the student's ideas and experiences.", 'Ask questions that help clarify the main idea.', 'Help the student revise in their own words.'],
    resources: ['Building an argumentative paragraph', 'Organizing ideas and supporting evidence'],
    outcome: '“What is your main point, and which experience supports it?”',
    principle: 'AMIRA uses thoughtful questions to help students develop their ideas and find their own voice.',
    conversation: [
      { role: 'student', text: "I want to write about why reading matters, but I don't know how to start." },
      { role: 'mentor', text: 'Start with your own experience. Has something you read helped you understand an idea that once felt difficult?' },
      { role: 'student', text: 'I read a programming guide and finally understood how to build a website.' },
      { role: 'mentor', text: 'That is a useful example. Write one sentence about a benefit of reading, then use your experience as evidence.' },
      { role: 'student', text: 'Reading helps us learn new skills. I built a website after understanding the guide.' },
      { role: 'mentor', text: 'Your idea is clear. Reread it: could you add one detail to make the link between reading and your new skill more specific?' },
    ],
  },
};

const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const navigation = document.querySelector<HTMLElement>('#main-nav');
function closeMenu() { navigation?.classList.remove('is-open'); menuToggle?.setAttribute('aria-expanded', 'false'); menuToggle?.setAttribute('aria-label', 'Open navigation'); }
menuToggle?.addEventListener('click', () => {
  const opened = navigation?.classList.toggle('is-open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(opened));
  menuToggle.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
});
navigation?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') { closeMenu(); menuToggle.focus(); } });
document.addEventListener('click', e => { if (e.target instanceof Node && !document.querySelector('.site-header')?.contains(e.target)) closeMenu(); });
window.matchMedia('(min-width: 641px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

let activeGuidance: Guidance = 'question';
const guidanceRules: Record<Guidance, string> = {
  question: 'Start with what the student has already tried.',
  hint: 'Offer one small hint the student can test.',
  reflect: 'Ask the student to explain their reasoning and result.',
};
const guidanceExamples: Record<Subject, Record<Guidance, { response: string; step: string }>> = {
  web: {
    question: { response: subjects.web.outcome, step: 'Share the code and explain what they have already tried.' },
    hint: { response: '“Match styles/style.css to your file location, then reload the page.”', step: 'Update the file path, test the change, and check the page.' },
    reflect: { response: '“Why did changing the file path make the CSS load? Explain it in your own words.”', step: 'Explain how the file location relates to its HTML path, and note the help used.' },
  },
  math: {
    question: { response: subjects.math.outcome, step: 'Connect half a cake to two of its four equal pieces.' },
    hint: { response: '“Use four equal pieces. Half the cake is two pieces; add one more.”', step: 'Draw a fraction model and count the pieces.' },
    reflect: { response: '“Why must the pieces be the same size before adding them? Use your cake drawing to explain.”', step: 'Use their own model to explain why the denominators must match.' },
  },
  language: {
    question: { response: subjects.language.outcome, step: 'Share a time when reading helped them learn something new.' },
    hint: { response: '“Write one sentence stating your point, then add your experience as evidence.”', step: 'Write a main point and a supporting example in their own words.' },
    reflect: { response: '“Reread your paragraph. Which part best connects your main point to the evidence?”', step: 'Review the paragraph, explain their choices, and revise one part.' },
  },
};

function updateConfiguration(subject: Subject) {
  const model = subjects[subject];
  document.querySelectorAll<HTMLElement>('[data-mentor-name]').forEach(node => { node.textContent = model.name; });
  const instructions = document.querySelector<HTMLElement>('[data-instructions]');
  if (instructions) {
    instructions.replaceChildren();
    const role = document.createElement('p'); role.className = 'instruction-role'; role.textContent = model.role;
    const list = document.createElement('ul');
    model.instructions.forEach(line => { const item = document.createElement('li'); item.textContent = line; list.append(item); });
    const focus = document.createElement('div'); focus.className = 'instruction-focus';
    const label = document.createElement('span'); label.textContent = 'Guidance focus';
    const rule = document.createElement('p'); rule.textContent = guidanceRules[activeGuidance];
    focus.append(label, rule); instructions.append(role, list, focus);
  }
  const resources = document.querySelector<HTMLElement>('[data-resources]');
  if (resources) {
    resources.replaceChildren();
    model.resources.forEach(name => {
      const file = document.createElement('div'); file.className = 'resource-file';
      const icon = document.createElement('span'); icon.textContent = '↳'; icon.setAttribute('aria-hidden', 'true');
      const body = document.createElement('div'); const title = document.createElement('strong'); title.textContent = name;
      const label = document.createElement('span'); label.textContent = 'Sample learning resource';
      body.append(title, label); file.append(icon, body); resources.append(file);
    });
  }
  const example = guidanceExamples[subject][activeGuidance];
  const outcome = document.querySelector<HTMLElement>('[data-outcome]'); if (outcome) outcome.textContent = example.response;
  const caption = document.querySelector<HTMLElement>('[data-guidance-caption]'); if (caption) caption.textContent = guidanceRules[activeGuidance];
  const step = document.querySelector<HTMLElement>('[data-student-step]'); if (step) step.textContent = example.step;
  const question = document.querySelector<HTMLElement>('[data-preview-question]'); if (question) question.textContent = model.conversation[0].text;
  document.querySelectorAll<HTMLButtonElement>('[data-guidance]').forEach(button => {
    const active = button.dataset.guidance === activeGuidance;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}
document.querySelector<HTMLSelectElement>('#subject-select')?.addEventListener('change', e => {
  const subject = (e.target as HTMLSelectElement).value;
  if (subject in subjects) {
    updateConfiguration(subject as Subject);
    activeScenario = subject as Subject;
    visibleMessages = 2;
    renderConversation(true);
  }
});
document.querySelectorAll<HTMLButtonElement>('[data-guidance]').forEach(button => button.addEventListener('click', () => {
  const guidance = button.dataset.guidance;
  if (!guidance || !(guidance in guidanceRules)) return;
  activeGuidance = guidance as Guidance;
  const subject = document.querySelector<HTMLSelectElement>('#subject-select')?.value || 'web';
  if (subject in subjects) updateConfiguration(subject as Subject);
}));
updateConfiguration('web');

const configTabs = [...document.querySelectorAll<HTMLButtonElement>('[data-config-tab]')];
function selectTab(tab: HTMLButtonElement) {
  configTabs.forEach(item => {
    const active = item === tab;
    item.classList.toggle('is-active', active); item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;
    const panel = document.getElementById(item.getAttribute('aria-controls') || ''); if (panel) panel.hidden = !active;
  });
}
configTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', e => {
    let next: number | undefined;
    if (e.key === 'ArrowRight') next = (index + 1) % configTabs.length;
    if (e.key === 'ArrowLeft') next = (index - 1 + configTabs.length) % configTabs.length;
    if (e.key === 'Home') next = 0; if (e.key === 'End') next = configTabs.length - 1;
    if (next !== undefined) { e.preventDefault(); selectTab(configTabs[next]); configTabs[next].focus(); }
  });
});

let activeScenario: Subject = 'web';
let visibleMessages = 2;
const conversation = document.querySelector<HTMLElement>('[data-conversation]');
const nextButton = document.querySelector<HTMLButtonElement>('[data-next-message]');
function createMessage(message: {role: 'student' | 'mentor'; text: string}) {
  const node = document.createElement('div'); node.className = `chat-message ${message.role}`;
  if (message.role === 'mentor') { const mark = document.createElement('span'); mark.className = 'brand-mark'; mark.setAttribute('aria-hidden', 'true'); node.append(mark); }
  const body = document.createElement('div'); const speaker = document.createElement('span'); speaker.className = 'chat-speaker'; speaker.textContent = message.role === 'mentor' ? 'AMIRA' : 'STUDENT';
  const text = document.createElement('p'); text.textContent = message.text; body.append(speaker, text); node.append(body); return node;
}
function renderConversation(reset = false) {
  if (!conversation || !nextButton) return;
  const model = subjects[activeScenario];
  if (reset) conversation.replaceChildren();
  for (let i = conversation.children.length; i < visibleMessages; i++) conversation.append(createMessage(model.conversation[i]));
  const completed = visibleMessages >= model.conversation.length;
  const textNode = nextButton.firstChild; if (textNode) textNode.textContent = completed ? 'Replay example ' : 'Continue example ';
  const phase = Math.min(2, Math.floor(visibleMessages / 2) - 1);
  const phaseTitles = ['01 — UNDERSTAND THE CONTEXT', '02 — TRY ONE STEP', '03 — REFLECT ON THE RESULT'];
  const phaseCopy = [model.principle, 'A hint leads to a small experiment. The student tests an idea and checks what changed.', 'The student explains the result and acknowledges the guidance used along the way.'];
  const principle = document.querySelector<HTMLElement>('[data-principle]'); if (principle) principle.textContent = phaseCopy[phase];
  const phaseTitle = document.querySelector<HTMLElement>('[data-principle-title]'); if (phaseTitle) phaseTitle.textContent = phaseTitles[phase];
  document.querySelectorAll<HTMLElement>('[data-learning-phase]').forEach(item => {
    const current = Number(item.dataset.learningPhase) === phase;
    item.classList.toggle('is-current', current);
    item.classList.toggle('is-complete', Number(item.dataset.learningPhase) < phase);
    if (current) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
  });
  document.querySelectorAll<HTMLButtonElement>('[data-scenario]').forEach(btn => { const selected = btn.dataset.scenario === activeScenario; btn.classList.toggle('is-active', selected); btn.setAttribute('aria-pressed', String(selected)); });
}
document.querySelectorAll<HTMLButtonElement>('[data-scenario]').forEach(btn => btn.addEventListener('click', () => { const key = btn.dataset.scenario; if (key && key in subjects) { activeScenario = key as Subject; visibleMessages = 2; renderConversation(true); } }));
nextButton?.addEventListener('click', () => { const completed = visibleMessages >= subjects[activeScenario].conversation.length; visibleMessages = completed ? 2 : Math.min(visibleMessages + 2, subjects[activeScenario].conversation.length); renderConversation(completed); });
document.querySelector<HTMLButtonElement>('.conversation-reset')?.addEventListener('click', () => { visibleMessages = 2; renderConversation(true); });
renderConversation(true);

// Deep links into a disclosure should expose its content before the browser scrolls.
function exposeTarget(hash: string) {
  if (!hash || hash === '#') return;
  let target: HTMLElement | null = null;
  try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
  if (target instanceof HTMLDetailsElement) target.open = true;
}
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link => link.addEventListener('click', () => exposeTarget(link.hash)));
window.addEventListener('hashchange', () => exposeTarget(location.hash));
exposeTarget(location.hash);
