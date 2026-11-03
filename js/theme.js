// 1. Immediately apply the saved theme before the page fully loads
const savedTheme = localStorage.getItem('khelsetu_theme');
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// 2. Wait for the HTML elements to load, then wire up the switch
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('theme-label'); // Grab the text label
    
    if (themeToggle) {
        // Check current state
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeToggle.checked = isDark;
        
        // Set the text on initial load
        if (themeLabel) {
            themeLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        }

        // Listen for the switch sliding
        themeToggle.addEventListener('change', (event) => {
            if (event.target.checked) {
                // Switch to Dark Mode
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('khelsetu_theme', 'dark');
                if (themeLabel) themeLabel.textContent = 'Light Mode'; // Update text
            } else {
                // Switch to Light Mode (Default)
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('khelsetu_theme', 'light');
                if (themeLabel) themeLabel.textContent = 'Dark Mode'; // Update text
            }
        });
    } else {
        console.error("Theme toggle switch not found in the HTML!");
    }
});