// 1. Immediately apply the saved theme before the page fully loads (Prevents flashing)
const savedTheme = localStorage.getItem('khelsetu_theme');
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// 2. Wait for the HTML elements to load, then wire up the button
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (themeToggleBtn) {
        // Set initial icon based on current theme
        themeToggleBtn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';

        // Listen for clicks on the toggle button
        themeToggleBtn.addEventListener('click', () => {
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                // Switch to Light Mode (Default)
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('khelsetu_theme', 'light');
                themeToggleBtn.textContent = '🌙'; // Moon icon for light mode (click to go dark)
            } else {
                // Switch to Dark Mode
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('khelsetu_theme', 'dark');
                themeToggleBtn.textContent = '☀️'; // Sun icon for dark mode (click to go light)
            }
        });
    }
});