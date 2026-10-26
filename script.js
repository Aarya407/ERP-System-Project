document.addEventListener('DOMContentLoaded', () => {
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const loginForm = document.getElementById('loginForm');

    // Toggle Password Visibility
    togglePasswordBtn.addEventListener('click', () => {
        // Toggle the type attribute
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Toggle the icon
        const icon = togglePasswordBtn.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('ph-eye-slash');
            icon.classList.add('ph-eye');
        } else {
            icon.classList.remove('ph-eye');
            icon.classList.add('ph-eye-slash');
        }
    });

    // Handle Form Submission (Demo)
    // Handle Form Submission (Supabase Login)
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Note: The original form asks for 'username' but Supabase Auth uses 'email' by default.
        // We will assume the user enters their Email in the username field for now,
        // OR we would need an Edge Function/Postgres logic to lookup email by username.
        // For simplicity in this step, we'll treat the input as email.
        const emailOrUsername = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const selectedRole = document.getElementById('role').value; // Role selected in dropdown

        try {
            // 1. Sign in with Supabase
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: emailOrUsername,
                password: password,
            });

            if (error) throw error;

            if (data.user) {
                // 2. Fetch User Profile to check role
                const { data: profile, error: profileError } = await supabaseClient
                    .from('profiles')
                    .select('role, full_name')
                    .eq('id', data.user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                    alert('Login successful, but could not verify role.');
                    return;
                }

                const userRole = profile.role;
                console.log('Logged in as:', userRole);

                // Strict Role Check
                if (userRole !== selectedRole) {
                    await supabaseClient.auth.signOut();
                    alert(`Access Denied: You selected "${selectedRole}" but your account is registered as "${userRole}". Please select the correct role.`);
                    return;
                }

                if (userRole === 'student') {
                    // Store user info for dashboard display
                    const userEmail = emailOrUsername;
                    // Derive a simple display name from email if profile name not available
                    const nameFromEmail = userEmail.split('@')[0].replace(/[._]/g, ' ');
                    localStorage.setItem('studentEmail', userEmail);
                    localStorage.setItem('studentEmail', userEmail);
                    localStorage.setItem('studentName', nameFromEmail);
                    // Use metadata if database column is missing
                    localStorage.setItem('studentPhone', data.user.user_metadata?.phone || '');
                    localStorage.setItem('studentCourse', data.user.user_metadata?.course || '');
                    localStorage.setItem('studentAcademicYear', data.user.user_metadata?.academic_year || '');

                    // Clear other roles
                    localStorage.removeItem('facultyEmail');
                    localStorage.removeItem('facultyName');
                    localStorage.removeItem('adminEmail');
                    localStorage.removeItem('adminName');

                    window.location.href = 'student_dashboard.html';
                } else if (userRole === 'faculty') {
                    // Store faculty info for dashboard display
                    const userEmail = emailOrUsername;
                    const fullName = profile.full_name || userEmail.split('@')[0].replace(/[._]/g, ' ');
                    localStorage.setItem('facultyEmail', userEmail);
                    localStorage.setItem('facultyEmail', userEmail);
                    localStorage.setItem('facultyName', fullName);
                    localStorage.setItem('facultyName', fullName);
                    localStorage.setItem('facultyPhone', data.user.user_metadata?.phone || '');
                    localStorage.setItem('facultyDepartment', data.user.user_metadata?.department || '');
                    localStorage.setItem('facultyAddress', data.user.user_metadata?.address || '');

                    // Clear other roles
                    localStorage.removeItem('studentEmail');
                    localStorage.removeItem('studentName');
                    localStorage.removeItem('adminEmail');
                    localStorage.removeItem('adminName');

                    window.location.href = 'faculty_dashboard.html';
                } else if (userRole === 'admin') {
                    // Store admin info for dashboard display
                    const adminEmail = emailOrUsername;
                    const adminName = profile.full_name || adminEmail.split('@')[0].replace(/[._]/g, ' ');
                    localStorage.setItem('adminEmail', adminEmail);
                    localStorage.setItem('adminEmail', adminEmail);
                    localStorage.setItem('adminName', adminName);
                    localStorage.setItem('adminName', adminName);
                    localStorage.setItem('adminPhone', data.user.user_metadata?.phone || '');

                    // Clear other roles
                    localStorage.removeItem('studentEmail');
                    localStorage.removeItem('studentName');
                    localStorage.removeItem('facultyEmail');
                    localStorage.removeItem('facultyName');
                    window.location.href = 'admin_dashboard.html'; // Assuming this exists
                } else {
                    alert('Unknown role: ' + userRole);
                }
            }

        } catch (error) {
            console.error('Login Error:', error);
            alert('Login failed: ' + error.message);
        }
    });
});
