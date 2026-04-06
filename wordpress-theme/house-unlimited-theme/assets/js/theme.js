document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
    });
  });

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  var menuToggle = document.querySelector('[data-toggle="hu-mobile-menu"]');
  var mobileMenu = document.querySelector('#hu-mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });
  }

  var authModal = document.querySelector('#hu-auth-modal');
  var authOpenButtons = document.querySelectorAll('[data-hu-auth-open]');
  var authCloseButtons = document.querySelectorAll('[data-hu-auth-close]');
  var authTabs = document.querySelectorAll('[data-hu-auth-tab]');
  var authPanels = document.querySelectorAll('[data-hu-auth-panel]');

  function setAuthMode(mode) {
    authTabs.forEach(function (tab) {
      if (tab.getAttribute('data-hu-auth-tab') === mode) {
        tab.classList.add('bg-teal-600', 'text-white', 'border-teal-600');
        tab.classList.remove('text-gray-600');
      } else {
        tab.classList.remove('bg-teal-600', 'text-white', 'border-teal-600');
        tab.classList.add('text-gray-600');
      }
    });

    authPanels.forEach(function (panel) {
      if (panel.getAttribute('data-hu-auth-panel') === mode) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });
  }

  function openAuthModal(mode) {
    if (!authModal) {
      return;
    }
    authModal.classList.remove('hidden');
    authModal.classList.add('flex');
    setAuthMode(mode || 'signin');
  }

  function closeAuthModal() {
    if (!authModal) {
      return;
    }
    authModal.classList.add('hidden');
    authModal.classList.remove('flex');
  }

  authOpenButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      openAuthModal(button.getAttribute('data-hu-auth-open') || 'signin');
    });
  });

  authCloseButtons.forEach(function (button) {
    button.addEventListener('click', closeAuthModal);
  });

  authTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      setAuthMode(tab.getAttribute('data-hu-auth-tab') || 'signin');
    });
  });

  if (authModal) {
    authModal.addEventListener('click', function (event) {
      if (event.target === authModal) {
        closeAuthModal();
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAuthModal();
    }
  });
});
