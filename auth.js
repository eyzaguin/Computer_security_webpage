// Client-only authentication learning demo. Nothing is persisted or sent to a server.
document.addEventListener('DOMContentLoaded', () => {
  const accounts = new Map();
  const forms = document.getElementById('auth-forms');
  const session = document.getElementById('auth-session');
  const sessionEmail = document.getElementById('session-email');
  const createForm = document.getElementById('create-form');
  const loginForm = document.getElementById('login-form');
  const createStatus = document.getElementById('create-status');
  const loginStatus = document.getElementById('login-status');

  function showSignedInState(email) {
    sessionEmail.textContent = email;
    forms.hidden = true;
    session.hidden = false;
  }

  createForm.addEventListener('submit', event => {
    event.preventDefault();
    createStatus.textContent = '';
    loginStatus.textContent = '';

    const formData = new FormData(createForm);
    const email = String(formData.get('email')).trim().toLowerCase();
    const password = String(formData.get('password'));
    const confirmation = String(formData.get('confirm-password'));

    if (password !== confirmation) {
      createStatus.textContent = 'The passwords do not match. Please try again.';
      document.getElementById('confirm-password').focus();
      return;
    }
    if (accounts.has(email)) {
      createStatus.textContent = 'A demo account with that email already exists in this tab. Log in instead.';
      return;
    }

    accounts.set(email, password);
    createForm.reset();
    document.getElementById('login-email').value = email;
    loginStatus.textContent = 'Demo account created in memory. Now log in with its demo credentials.';
    document.getElementById('login-password').focus();
  });

  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    createStatus.textContent = '';
    loginStatus.textContent = '';

    const formData = new FormData(loginForm);
    const email = String(formData.get('email')).trim().toLowerCase();
    const password = String(formData.get('password'));

    if (!accounts.has(email) || accounts.get(email) !== password) {
      loginStatus.textContent = 'Those demo credentials were not found. Create an account first, or check your entries.';
      return;
    }

    loginForm.reset();
    showSignedInState(email);
  });

  document.getElementById('logout-button').addEventListener('click', () => {
    session.hidden = true;
    forms.hidden = false;
    loginStatus.textContent = 'You have logged out of the demo session.';
    document.getElementById('login-email').value = '';
    document.getElementById('login-email').focus();
  });

  window.addEventListener('pagehide', () => {
    accounts.clear();
  });
});
