document.addEventListener('DOMContentLoaded', () => {
    // Role Selection Logic for Student Fields
    const roleSelect = document.getElementById('role');
    const studentFields = document.getElementById('student-fields');
    const facultyFields = document.getElementById('faculty-fields');

    // Function to toggle fields
    const toggleRoleFields = () => {
        // Reset both first
        studentFields.classList.add('hidden');
        facultyFields.classList.add('hidden');

        if (roleSelect.value === 'student') {
            studentFields.classList.remove('hidden');
        } else if (roleSelect.value === 'faculty') {
            facultyFields.classList.remove('hidden');
        }
    };

    // Initial check (in case browser caches selection)
    if (roleSelect) {
        toggleRoleFields();
        roleSelect.addEventListener('change', toggleRoleFields);
    }
    // Password Toggle Logic
    const toggleButtons = document.querySelectorAll('.password-toggle');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = button.querySelector('i');

            if (input && icon) {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);

                if (type === 'password') {
                    icon.classList.remove('ph-eye-slash');
                    icon.classList.add('ph-eye');
                } else {
                    icon.classList.remove('ph-eye');
                    icon.classList.add('ph-eye-slash');
                }
            }
        });
    });

    // Form Submission Demo
    // Form Submission with Supabase
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const role = document.getElementById('role').value;

            // Get student specific fields
            const course = document.getElementById('course').value;
            const academicYear = document.getElementById('academic-year').value;

            // Get faculty specific fields
            const department = document.getElementById('department').value;
            const address = document.getElementById('address').value;

            // Simple validation
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            try {
                // 1. Sign up the user in Supabase Auth AND pass metadata
                // The database Trigger will handle creating the profile automatically!
                const { data: authData, error: authError } = await supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: fullName,
                            username: username,
                            phone: phone,
                            role: role,
                            // Only add these if role is student
                            course: role === 'student' ? course : null,
                            academic_year: role === 'student' ? academicYear : null,

                            // Only add these if role is faculty
                            department: role === 'faculty' ? department : null,
                            address: role === 'faculty' ? address : null
                        }
                    }
                });

                if (authError) throw authError;

                if (authData.user) {
                    alert('Registration successful! Please login.');
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error('Registration Error:', error);
                alert('Registration failed: ' + error.message);
            }
        });
    }
});
