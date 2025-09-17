
// Mao ni Firebase project config (Project Overview --> Project Settings --> Service accounts)
const firebaseConfig = {
  apiKey: "AIzaSyDv5-Qc4VjrMPIfwQd3DpaBM2QN1dyCtv0",
  authDomain: "tindak-gps.firebaseapp.com",
  databaseURL: "https://tindak-gps-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tindak-gps",
  storageBucket: "tindak-gps.firebasestorage.app",
  messagingSenderId: "373963652708",
  appId: "1:373963652708:web:f66faba75619e127bbe971",
  measurementId: "G-8SEEPDFSP8"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the login page or the dashboard page
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logout-btn');

    // Handle login page logic
    if (loginForm) {
        auth.onAuthStateChanged(user => {
            if (user) {
                // User is signed in, redirect to the dashboard
                window.location.href = 'admin_dashboard.html';
            }
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            const errorMessage = document.getElementById('error-message');

            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    // Success is handled by the authStateChanged listener
                })
                .catch((error) => {
                    errorMessage.textContent = 'Invalid email or password.';
                    errorMessage.style.visibility = 'visible';
                });
        });
    }

    // Handle dashboard page logic
    if (logoutBtn) {
        // Redirect if user is not logged in
        auth.onAuthStateChanged(user => {
            if (!user) {
                // User is not signed in, redirect to login page
                window.location.href = 'index.html';
            }
        });

        // Handle logout
        logoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                // Sign-out successful, redirect to login page
                window.location.href = 'index.html';
            }).catch((error) => {
                console.error('Logout error:', error);
            });
        });

        // Handle sidebar navigation
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        const contentViews = document.querySelectorAll('.content-view');

        // --- Data and Notifications Logic ---
        // ------------------------------------------Mock data for demonstration------------------------------------------
        const mockTrips = [
            { userId: 'user-001', deviceId: 'TINDAK-001', date: '2025-09-16', distance: 5.2, duration: 25 },
            { userId: 'user-002', deviceId: 'TINDAK-002', date: '2025-09-16', distance: 3.1, duration: 15 },
            { userId: 'user-001', deviceId: 'TINDAK-003', date: '2025-09-15', distance: 12.8, duration: 60 },
            { userId: 'user-004', deviceId: 'TINDAK-001', date: '2025-09-14', distance: 8.5, duration: 40 },
        ];

        // Function to render trip data
        function renderTripData(period) {
            const tableBody = document.querySelector('#trip-details-table tbody');
            tableBody.innerHTML = ''; // Clear existing data

            // Filter data based on period (This is a simple mock filter)
            let filteredTrips = mockTrips;
            if (period === '24h') {
                filteredTrips = mockTrips.filter(trip => trip.date === '2025-09-16');
            } else if (period === 'weekly') {
                // In a real app, need i calculate ang week's worth of data
                filteredTrips = mockTrips;
            } else if (period === 'monthly') {
                // In a real app, need i calculate ang week's worth of data
                filteredTrips = mockTrips;
            }

            let totalDistance = 0;
            let totalTrips = 0;

            filteredTrips.forEach(trip => {
                const row = `
                    <tr>
                        <td>${trip.userId}</td>
                        <td>${trip.deviceId}</td>
                        <td>${trip.date}</td>
                        <td>${trip.distance.toFixed(1)} km</td>
                        <td>${trip.duration} min</td>
                    </tr>
                `;
                tableBody.innerHTML += row;

                // Calculate totals
                totalDistance += trip.distance;
                totalTrips++;
            });

            // Update the data cards
            document.getElementById('total-trips-value').textContent = totalTrips;
            document.getElementById('total-distance-value').textContent = totalDistance.toFixed(1) + ' km';
        }

        // Add event listeners for period selection
        const tripsSelect = document.getElementById('trips-period-select');
        if (tripsSelect) {
            tripsSelect.addEventListener('change', (e) => {
                renderTripData(e.target.value);
            });
        }
        
        const distanceSelect = document.getElementById('distance-period-select');
        if (distanceSelect) {
            distanceSelect.addEventListener('change', (e) => {
                // We'll use the same function for both for now
                renderTripData(e.target.value);
            });
        }
        
        // Initial render for "Data" section
        renderTripData('24h');

        // Note: For notifications, you would have a similar function that fetches
        // and renders notifications from Firebase. The HTML is already in place
        // with mock data for a visual example.
        
        // This is a placeholder for future Firebase integration
        // The resolve buttons would have a click listener to update Firebase
        // to mark the notification as resolved.


        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove 'active' class from all nav items and content views
                navItems.forEach(i => i.classList.remove('active'));
                contentViews.forEach(c => c.classList.remove('active'));

                // Add 'active' class to the clicked nav item
                item.classList.add('active');

                // Get the ID of the content to show from the data attribute
                const contentId = item.getAttribute('data-content');
                
                // Find and show the corresponding content view
                const contentView = document.getElementById(`${contentId}-content`);
                if (contentView) {
                    contentView.classList.add('active');
                }
                
                // Update the main header text
                const headerTitle = document.querySelector('.dashboard-header h1');
                headerTitle.textContent = item.querySelector('a').textContent;
            });
        });
    }
});