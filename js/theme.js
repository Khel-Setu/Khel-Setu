// 1. Immediately apply the saved theme
const savedTheme = localStorage.getItem('khelsetu_theme');
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// 2. Wait for HTML to load, then wire up the button
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (themeToggleBtn) {
        // Set initial icon
        themeToggleBtn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';

        // Listen for clicks
        themeToggleBtn.addEventListener('click', () => {
            console.log("Toggle button was clicked!"); // This will show in F12 Console
            
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                // Switch to Light
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('khelsetu_theme', 'light');
                themeToggleBtn.textContent = '🌙';
            } else {
                // Switch to Dark
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('khelsetu_theme', 'dark');
                themeToggleBtn.textContent = '☀️';
            }
        });
    } else {
        console.error("Theme toggle button not found in the HTML!");
    }
});