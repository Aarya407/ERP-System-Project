document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard loaded');
    // Populate user info if available
    const nameElem = document.querySelector('.user-name');
    const emailElem = document.querySelector('.user-email');
    if (nameElem && emailElem) {
        const storedName = localStorage.getItem('studentName') || localStorage.getItem('facultyName') || localStorage.getItem('adminName') || '';
        const storedEmail = localStorage.getItem('studentEmail') || localStorage.getItem('facultyEmail') || localStorage.getItem('adminEmail') || '';
        if (storedName) {
            nameElem.textContent = storedName;
            const welcomeNameElem = document.getElementById('welcomeUsername');
            if (welcomeNameElem) welcomeNameElem.textContent = storedName;
        }
        if (storedEmail) emailElem.textContent = storedEmail;
    }

    // Handle Logout
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            if (!confirm('Are you sure you want to logout?')) {
                e.preventDefault();
            }
        });
    }

    // Quick Action Buttons
    const buttons = document.querySelectorAll('.btn-action');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert(`Action triggered: ${btn.textContent}`);
        });
    });
});
