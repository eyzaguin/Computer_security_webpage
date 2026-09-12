// TECH 3498: IT Computer Security - Interactive Enhancements
document.addEventListener('DOMContentLoaded', () => {
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

  // Log confirmation in console
  console.log("TECH 3498 - Nicole Eyzaguirre Portfolio Loaded Successfully ✨");
});
