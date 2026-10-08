// TECH 3498: IT Computer Security - Interactive Enhancements
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeSelect = document.getElementById('theme-select');
  const motionToggle = document.getElementById('motion-toggle');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionChoice = null;
  function savePreference(key, value) {
    try { localStorage.setItem(key, value); } catch { /* Controls still work without storage. */ }
  }
  function applyMotion() {
    const paused = motionPreference.matches || motionChoice === 'paused';
    root.dataset.motion = paused ? 'paused' : 'playing';
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.textContent = motionPreference.matches ? 'Motion off (system setting)' : paused ? 'Resume animation' : 'Pause animation';
    motionToggle.disabled = motionPreference.matches;
  }
  try {
    const savedTheme = localStorage.getItem('portfolio-theme');
    themeSelect.value = Array.from(themeSelect.options).some(option => option.value === savedTheme) ? savedTheme : 'pink';
    motionChoice = localStorage.getItem('portfolio-motion');
  } catch { /* Use defaults when browser storage is unavailable. */ }
  root.dataset.theme = themeSelect.value;
  applyMotion();
  themeSelect.addEventListener('change', () => {
    root.dataset.theme = themeSelect.value;
    savePreference('portfolio-theme', themeSelect.value);
  });
  motionToggle.addEventListener('click', () => {
    motionChoice = root.dataset.motion === 'paused' ? 'playing' : 'paused';
    savePreference('portfolio-motion', motionChoice);
    applyMotion();
  });
  motionPreference.addEventListener('change', applyMotion);
  document.getElementById('display-controls').hidden = false;

  // Smooth scroll and active link indicator for sidebar navigation
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
  const sections = document.querySelectorAll('main section');

  // Highlight active section on scroll
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  const toggle = document.getElementById('chat-toggle');
  const panel = document.getElementById('cyber-chat');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  const chatTitle = document.getElementById('chat-title');
  let chatPersona = 'Cyber Buddy';
  const topics = [
    [/\b(phishing|scam|scams|suspicious)\b/, 'Phishing uses deceptive messages to trick you into sharing information or opening harmful links. Check the sender and visit the organization through a trusted address instead of clicking an unexpected link.'],
    [/\b(password|passwords|passphrase)\b/, 'Use a long, unique password for each account. A password manager can generate and store passwords. Enable multi-factor authentication when available, and never share passwords or sign-in codes.'],
    [/\b(mfa|2fa|authentication)\b/, 'Multi-factor authentication adds another way to verify your identity beyond a password, such as a security key or authenticator app. Never approve a sign-in request you did not initiate.'],
    [/\b(authorization|authorize|permission|permissions|administrator|admin|regular user|role|roles)\b/, 'Authentication verifies who signed in. Authorization checks what that authenticated account may do. A regular user can view and edit their own profile; an administrator can manage users, view security logs, and manage website content.'],
    [/\b(backup|backups|back up|ransomware|3 2 1)\b/, 'This site highlights the 3-2-1 backup rule: keep 3 copies of your data on 2 different storage media, with 1 copy offsite. Protect your backups and test that you can restore files. Backups help you recover from data loss, including ransomware.'],
    [/\b(privacy|private|share|sharing|pii)\b/, 'Keep passwords, authentication codes, your home address, personal phone number, and security-question answers private. Share general hobbies and school projects thoughtfully. See the Security Reflection section for examples.'],
    [/\b(encryption|cryptography|encrypt|cipher|aes|rsa)\b/, 'Encryption transforms readable data into ciphertext that requires the right key to read. Cryptography studies methods for protecting information and communications. It is one of Nicole\'s technology interests.'],
    [/\b(malware|virus|viruses|antivirus|anti virus)\b/, 'Malware is software designed to harm devices or data. Keep software updated, use your device\'s security protections, and download files from trusted sources. Avoid unexpected attachments.'],
    [/\b(network|wifi|wi fi|vpn)\b/, 'Network security protects connected devices and communications. Keep your router updated, protect Wi-Fi with a strong password, and be careful with unfamiliar networks.'],
    [/\b(course|class|3498|lab|semester)\b/, 'This is Nicole Eyzaguirre\'s TECH 3498 IT Computer Security website for Lab 1, Fall 2026. It introduces her interests, learning goals, and cybersecurity awareness tips.'],
    [/\b(nicole|author|student|hobbies)\b/, 'Nicole is a senior studying Information Technology with a cybersecurity focus. Her interests include cybersecurity, cryptography, reading, podcasts, hiking, and trying new places.'],
    [/\b(goal|goals|learn|learning)\b/, 'Nicole\'s course goals are to practice with security tools, work with cryptography, and understand computer security and data protection. Read more in the Course Goals section.'],
    [/\b(hi|hello|hey|help|topics)\b/, 'Hello! Ask about phishing, passwords, MFA, backups, privacy, encryption, malware, network security, Nicole, or this course. Try one topic at a time.'],
    [/\b(thanks|thank you)\b/, 'You\'re welcome! Pick another topic whenever you like.']
  ];
  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    (open ? input : toggle).focus();
  }
  function addMessage(speaker, text, user = false) {
    const message = document.createElement('p');
    message.className = user ? 'chat-message chat-user' : 'chat-message';
    const label = document.createElement('strong');
    label.textContent = `${speaker}: `;
    message.append(label, document.createTextNode(text));
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
  }
  function respond(question) {
    const text = question.trim().slice(0, 300);
    if (!text) return;
    const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ');
    const topic = topics.find(([pattern]) => pattern.test(normalized));
    const answer = topic ? topic[1] : 'I only have preset answers. Try phishing, passwords, MFA, authentication, authorization, backups, privacy, encryption, malware, network security, or this course.';
    addMessage('You', text, true);
    addMessage(chatPersona, answer);
    if (chatPersona === 'Cyber Cat') {
      document.getElementById('cat-response').textContent = answer;
      speakAnswer(answer);
    }
    input.value = '';
    input.focus();
  }
  function startChat(persona) {
    chatPersona = persona === 'Digital Person' ? 'Cyber Cat' : persona;
    chatTitle.textContent = chatPersona;
    setOpen(true);
    if (persona === 'Digital Person') {
      addMessage(chatPersona, 'Hello! I am Cyber Cat, a simulated digital person. Ask me about the cybersecurity topics on this page.');
    }
  }
  toggle.hidden = false;
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  document.getElementById('chat-close').addEventListener('click', () => setOpen(false));
  document.getElementById('start-chat').addEventListener('click', () => startChat('Cyber Buddy'));
  document.getElementById('talk-to-person').addEventListener('click', () => startChat('Digital Person'));
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') setOpen(false);
  });
  document.getElementById('chat-form').addEventListener('submit', event => {
    event.preventDefault();
    respond(input.value);
  });
  document.querySelectorAll('[data-question]').forEach(button => {
    button.addEventListener('click', () => respond(button.dataset.question));
  });

  const avatarUpload = document.getElementById('avatar-upload');
  const avatarImage = document.getElementById('avatar-image');
  const avatarPreview = document.getElementById('avatar-preview');
  const avatarStatus = document.getElementById('avatar-status');
  const generateAvatar = document.getElementById('generate-avatar');
  const talkToPerson = document.getElementById('talk-to-person');
  const stopSpeaking = document.getElementById('stop-speaking');
  const digitalCat = document.getElementById('digital-cat');
  const catMouth = digitalCat.querySelector('.cat-mouth');
  let avatarUrl = null;

  function finishSpeaking() {
    digitalCat.classList.remove('is-speaking');
    digitalCat.classList.remove('has-word-events');
    catMouth.classList.remove('speaking-word');
    digitalCat.style.removeProperty('--mouth-syllable-duration');
    digitalCat.style.removeProperty('--mouth-syllables');
    stopSpeaking.disabled = true;
  }
  function stopAvatarSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    finishSpeaking();
  }
  function speakAnswer(text) {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      avatarStatus.textContent = 'Text-to-speech is not available in this browser. The answer is still shown in the chat.';
      return;
    }
    window.speechSynthesis.cancel();
    finishSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => {
      digitalCat.classList.add('is-speaking');
      stopSpeaking.disabled = false;
      avatarStatus.textContent = 'Cyber Cat is speaking. Mouth movement follows speech word timings when supported.';
    };
    utterance.onboundary = event => {
      if (typeof event.charIndex !== 'number') return;
      const start = event.charIndex;
      const word = text.slice(start, event.charLength ? start + event.charLength : undefined).match(/^[a-z0-9']+/i);
      if (!word) return;

      const syllables = Math.max(1, (word[0].match(/[aeiouy]+/gi) || []).length);
      const duration = Math.min(260, Math.max(130, (word[0].length * 70) / (utterance.rate * syllables)));
      digitalCat.classList.add('has-word-events');
      digitalCat.style.setProperty('--mouth-syllable-duration', `${duration}ms`);
      digitalCat.style.setProperty('--mouth-syllables', String(syllables));
      catMouth.classList.remove('speaking-word');
      void catMouth.offsetWidth;
      catMouth.classList.add('speaking-word');
    };
    utterance.onend = finishSpeaking;
    utterance.onerror = event => {
      finishSpeaking();
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        avatarStatus.textContent = 'Speech playback failed. The answer is still shown in the chat.';
      }
    };
    window.speechSynthesis.speak(utterance);
  }

  avatarImage.addEventListener('load', () => {
    generateAvatar.disabled = false;
    avatarStatus.textContent = 'Image ready. Create a local demo avatar preview.';
  });
  avatarImage.addEventListener('error', () => {
    generateAvatar.disabled = true;
    avatarStatus.textContent = 'That file could not be displayed as an image. Choose a valid JPEG, PNG, or WebP file.';
    if (avatarUrl) {
      URL.revokeObjectURL(avatarUrl);
      avatarUrl = null;
    }
  });
  avatarUpload.addEventListener('change', () => {
    const file = avatarUpload.files && avatarUpload.files[0];
    generateAvatar.disabled = true;
    avatarPreview.hidden = true;

    if (avatarUrl) {
      URL.revokeObjectURL(avatarUrl);
      avatarUrl = null;
    }
    if (!file) {
      avatarStatus.textContent = 'Choose an image to create a local demo preview.';
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      avatarUpload.value = '';
      avatarStatus.textContent = 'Unsupported file type. Choose a JPEG, PNG, or WebP image.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      avatarUpload.value = '';
      avatarStatus.textContent = 'The image is larger than 5 MB. Choose a smaller image.';
      return;
    }

    avatarStatus.textContent = 'Checking image…';
    avatarUrl = URL.createObjectURL(file);
    avatarImage.src = avatarUrl;
  });
  generateAvatar.addEventListener('click', () => {
    if (!avatarUrl || generateAvatar.disabled) return;
    avatarPreview.hidden = false;
    talkToPerson.disabled = false;
    avatarStatus.textContent = 'Demo avatar ready. Your photo remains in this browser and was not AI-generated.';
  });
  stopSpeaking.addEventListener('click', stopAvatarSpeech);
  window.addEventListener('beforeunload', () => {
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
  });

  // Log confirmation in console
  console.log("TECH 3498 - Nicole Eyzaguirre Portfolio Loaded Successfully ✨");
});
