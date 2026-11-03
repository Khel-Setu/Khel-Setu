// 1. Immediately apply the saved theme before the page fully loads
const savedTheme = localStorage.getItem('khelsetu_theme');
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// 2. Wait for the HTML elements to load, then wire up the switch
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        // Check the box automatically if dark mode is active
        themeToggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';

        // Listen for the switch sliding
        themeToggle.addEventListener('change', (event) => {
            if (event.target.checked) {
                // Switch to Dark Mode
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('khelsetu_theme', 'dark');
            } else {
                // Switch to Light Mode (Default)
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('khelsetu_theme', 'light');
            }
        });
    } else {
        console.error("Theme toggle switch not found in the HTML!");
    }
});