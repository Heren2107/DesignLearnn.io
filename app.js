// Global state
let currentCourseId = null;
let currentLevelNumber = null;
let currentUser = null;
let enrolledCourses = {};
let currentChatCourseId = null; // Tambahkan state untuk chat

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    currentUser = JSON.parse(localStorage.getItem('designlearnUser'));
    enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || {};
    updateAuthUI();
    renderCoursesGrid();
    clearAuthErrors();
    
    // Navigation listeners
    document.getElementById('loginBtn').addEventListener('click', openAuthModal);
    document.getElementById('menuToggle').addEventListener('click', toggleMenu);
    document.getElementById('userProfileBtn').addEventListener('click', toggleUserMenu);
    
    // Nav menu link listeners
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.getAttribute('data-view');
            if (view) {
                showView(view);
                document.getElementById('navMenu').classList.remove('active');
            }
        });
    });
    
    // Contact link listener
    document.querySelector('.contact-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        showContactInfo();
    });
    
    // Dropdown menu listeners
    document.querySelectorAll('.dropdown-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleDropdownAction(action);
        });
    });
    
    // Auth form handlers
    document.getElementById('signinForm').addEventListener('submit', handleSignin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    
    // Hero button listener
    document.querySelector('.view-courses-btn')?.addEventListener('click', () => {
        showView('courses');
    });
    
    // Back buttons
    document.querySelector('.back-to-courses')?.addEventListener('click', () => {
        showView('courses');
    });
    
    document.querySelectorAll('.back-to-detail').forEach(btn => {
        btn.addEventListener('click', () => {
            showView('courseDetail');
        });
    });
    
    // Payment modal buttons
    document.querySelector('.close-payment-overlay')?.addEventListener('click', closePaymentModal);
    document.querySelector('.close-payment-btn')?.addEventListener('click', closePaymentModal);
    document.querySelector('.show-qris-btn')?.addEventListener('click', showQRIS);
    document.querySelector('.show-bank-btn')?.addEventListener('click', showBankTransfer);
    
    // Profile modal buttons
    document.querySelector('.close-profile-overlay')?.addEventListener('click', closeProfileModal);
    document.querySelector('.close-profile-btn')?.addEventListener('click', closeProfileModal);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const userMenu = document.getElementById('userMenuContainer');
        if (userMenu && !userMenu.contains(e.target)) {
            closeUserDropdownMenu();
        }
    });
    
    // Close modals on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAuthModal();
            closePaymentModal();
            closeProfileModal();
            closeUserDropdownMenu();
        }
    });
}

// ==================== VIEW MANAGEMENT ====================
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // Close menus
    document.getElementById('navMenu').classList.remove('active');
    
    // Show selected view
    if (viewName === 'home') {
        document.getElementById('homeView').classList.add('active');
    } else if (viewName === 'courses') {
        document.getElementById('coursesView').classList.add('active');
        renderCoursesGrid();
    } else if (viewName === 'courseDetail' && currentCourseId) {
        document.getElementById('courseDetailView').classList.add('active');
        renderCourseDetail();
    } else if (viewName === 'quiz' && currentCourseId && currentLevelNumber) {
        document.getElementById('quizView').classList.add('active');
        renderQuiz();
    } else if (viewName === 'caseStudy' && currentCourseId && currentLevelNumber) {
        document.getElementById('caseStudyView').classList.add('active');
        renderCaseStudy();
    } else if (viewName === 'dashboard') {
        if (!currentUser) {
            alert('Silakan login terlebih dahulu');
            openAuthModal();
            return;
        }
        document.getElementById('dashboardView').classList.add('active');
        renderDashboard();
    } else if (viewName === 'courseChat' && currentChatCourseId) {
        if (!currentUser) {
            alert('Silakan login terlebih dahulu');
            openAuthModal();
            return;
        }
        document.getElementById('courseChatView').classList.add('active');
        renderCourseChat();
    }
    
    window.scrollTo(0, 0);
}

// ==================== COURSES GRID ====================
function renderCoursesGrid() {
    const grid = document.getElementById('coursesGrid');
    grid.innerHTML = '';
    
    coursesData.forEach(course => {
        const isEnrolled = currentUser && enrolledCourses[currentUser.email]?.includes(course.id);
        const card = document.createElement('div');
        card.className = 'course-card';


        card.innerHTML = `
            <img src="${course.image}" alt="${course.title}" class="course-image">
            <div class="course-info">
                <span class="course-level">${course.level}</span>
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-meta">
                    <span class="rating">★ ${course.rating} (${course.reviews} reviews)</span>
                    <span class="price">Rp ${course.price.toLocaleString('id-ID')}</span>
                </div>
                <button class="btn btn-primary course-detail-btn" data-course-id="${course.id}">
                    ${isEnrolled ? 'Lanjutkan Belajar' : 'Lihat Detail'}
                </button>
            </div>
            <div class="course-footer"></div>
        `;
        grid.appendChild(card);
        
        // Add event listener untuk button
        const btn = card.querySelector('.course-detail-btn');
        btn.addEventListener('click', () => {
            openCourseDetail(course.id);
        });
    });
}

// ==================== COURSE DETAIL ====================
function openCourseDetail(courseId) {
    currentCourseId = courseId;
    currentLevelNumber = null;
    showView('courseDetail');
}

function renderCourseDetail() {
    const course = coursesData.find(c => c.id === currentCourseId);
    if (!course) return;
    
    const isEnrolled = currentUser && enrolledCourses[currentUser.email]?.includes(course.id);
    const content = document.getElementById('courseDetailContent');
    
    // Pastikan instructor memiliki property yang diperlukan
    if (!course.instructor.rating) course.instructor.rating = 4.9;
    if (!course.instructor.totalReviews) course.instructor.totalReviews = course.reviews || 0;
    if (!course.instructor.responseRate) course.instructor.responseRate = "98%";
    if (!course.instructor.avgResponseTime) course.instructor.avgResponseTime = "2 jam";
    if (!course.instructor.reviews) course.instructor.reviews = [];
    
    let html = `
        <div class="course-detail-header">
            <img src="${course.image}" alt="${course.title}" class="course-hero-image">
            <div class="course-header-info">
                <span class="course-category">${course.category}</span>
                <h1>${course.title}</h1>
                <p>${course.description}</p>
                <div class="course-header-meta">
                    <span>★ ${course.rating} (${course.reviews} reviews)</span>
                    <span>Rp ${course.price.toLocaleString('id-ID')}</span>
                    <div class="course-progress-summary">
                        <span class="progress-label">Progress:</span>
                        <strong id="courseProgressPercent">0%</strong>
                    </div>
                </div>
                <div class="course-actions">
                    <button class="btn ${isEnrolled ? 'btn-secondary' : 'btn-primary'} enroll-btn" 
                        ${isEnrolled ? 'disabled' : ''}>
                        ${isEnrolled ? 'Sudah Terdaftar' : 'Daftar Sekarang'}
                    </button>
                </div>
            </div>
        </div>
        
        <div class="course-main-content">
            <div class="course-instructor">
                <img src="${course.instructor.image}" alt="${course.instructor.name}" class="instructor-image">
                <div class="instructor-info">
                    <h3>${course.instructor.name}</h3>
                    <p class="role">${course.instructor.role}</p>
                    <p>${course.instructor.bio}</p>
                </div>
            </div>
            
            <div class="what-you-learn">
                <h2>Yang Akan Anda Pelajari</h2>
                <ul>
                    ${course.whatYouLearn.map(item => `<li>✓ ${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="course-levels">
                <h2>Level & Materi Kursus</h2>
                ${course.levels.map(level => `
                    <div class="level-card ${isEnrolled ? 'unlocked' : 'locked'}" data-level="${level.levelNumber}">
                        <div class="level-header">
                            <h3>Level ${level.levelNumber}: ${level.title}</h3>
                            <p class="level-duration">⏱️ ${level.duration}</p>
                        </div>
                        <p class="level-description">${level.description}</p>
                        ${isEnrolled ? `
                            <div class="level-actions">
                                <button class="btn btn-secondary quiz-btn" data-level="${level.levelNumber}">
                                    Quiz Level ${level.levelNumber} (10 soal)
                                </button>
                                <button class="btn btn-secondary case-study-btn" data-level="${level.levelNumber}">
                                    Case Study Level ${level.levelNumber}
                                </button>
                            </div>
                        ` : `<p class="lock-message">🔒 Daftar kursus untuk mengakses</p>`}
                    </div>
                `).join('')}
            </div>
            
            <div class="instructor-reviews">
                <h3>⭐ Review untuk ${course.instructor.name}</h3>
                <div class="overall-rating">
                    <div class="rating-badge">
                        <span class="rating-number">${course.instructor.rating}</span>
                        <span class="rating-stars">${'★'.repeat(Math.floor(course.instructor.rating))}${'☆'.repeat(5-Math.floor(course.instructor.rating))}</span>
                        <span class="rating-count">(${course.instructor.totalReviews} review)</span>
                    </div>
                    <div class="rating-stats">
                        <p>📊 Tingkat respon: ${course.instructor.responseRate}</p>
                        <p>⏱️ Rata-rata respon: ${course.instructor.avgResponseTime}</p>
                    </div>
                </div>
                
                <div class="reviews-list">
                    ${course.instructor.reviews.length > 0 ? 
                        course.instructor.reviews.slice(0, 3).map(review => `
                            <div class="review-card">
                                <div class="review-header">
                                    <div class="reviewer-avatar">${review.userAvatar || '👤'}</div>
                                    <div class="reviewer-info">
                                        <strong>${review.userName || 'User'}</strong>
                                        <div class="review-rating">
                                            ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                                        </div>
                                    </div>
                                    <span class="review-date">${formatDate(review.date)}</span>
                                </div>
                                <p class="review-comment">${review.comment || 'Tidak ada komentar'}</p>
                                <span class="review-course">Kursus: ${review.courseTitle || course.title}</span>
                            </div>
                        `).join('') : 
                        '<p class="no-reviews">Belum ada review untuk instruktur ini.</p>'
                    }
                </div>
                
                ${course.instructor.reviews.length > 3 ? `
                    <button class="btn btn-secondary view-all-reviews" onclick="showAllReviews(${course.id})">
                        Lihat Semua Review (${course.instructor.reviews.length})
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    content.innerHTML = html;
    
    // Add event listeners setelah content di-render
    const enrollBtn = content.querySelector('.enroll-btn');
    if (enrollBtn && !isEnrolled) {
        enrollBtn.addEventListener('click', enrollCourse);
    }
    
    // Add listeners untuk quiz buttons
    content.querySelectorAll('.quiz-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            startQuiz(parseInt(btn.getAttribute('data-level')));
        });
    });
    
    // Add listeners untuk case study buttons
    content.querySelectorAll('.case-study-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            startCaseStudy(parseInt(btn.getAttribute('data-level')));
        });
    });

    // Update UI badges/percent based on saved progress
    updateCourseProgressUI(currentCourseId);
}

function enrollCourse() {
    if (!currentUser) {
        alert('Silakan login terlebih dahulu');
        openAuthModal();
        return;
    }
    
    const course = coursesData.find(c => c.id === currentCourseId);
    openPaymentModal(course);
}

// ==================== QUIZ SYSTEM ====================
function startQuiz(levelNumber) {
    currentLevelNumber = levelNumber;
    showView('quiz');
}

function renderQuiz() {
    const course = coursesData.find(c => c.id === currentCourseId);
    const level = course.levels.find(l => l.levelNumber === currentLevelNumber);
    const content = document.getElementById('quizContent');
    
    let html = `
        <div class="quiz-container">
            <h1>Quiz Level ${level.levelNumber}: ${level.title}</h1>
            <form id="quizForm" class="quiz-form">
                ${level.quiz.map((q, idx) => `
                    <div class="quiz-question">
                        <h3>Pertanyaan ${idx + 1}:</h3>
                        <p>${q.question}</p>
                        <div class="quiz-options">
                            ${q.options.map((opt, optIdx) => `
                                <label class="quiz-option">
                                    <input type="radio" name="question_${idx}" value="${optIdx}" required>
                                    <span>${opt}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
                <button type="submit" class="btn btn-primary btn-large">Selesaikan Quiz</button>
            </form>
        </div>
    `;
    
    content.innerHTML = html;
    document.getElementById('quizForm').addEventListener('submit', (e) => submitQuiz(e, level));
}

function submitQuiz(e, level) {
    e.preventDefault();
    const formData = new FormData(document.getElementById('quizForm'));
    let score = 0;
    
    level.quiz.forEach((q, idx) => {
        const answer = parseInt(formData.get(`question_${idx}`));
        if (answer === q.correct) score++;
    });
    
    const percentage = Math.round((score / level.quiz.length) * 100);
    const passed = percentage >= 70;

    const msg = `Skor Anda: ${score}/${level.quiz.length} (${percentage}%)\n${passed ? '✅ Lulus! Silakan lanjut ke case study.' : '❌ Belum cukup. Coba lagi!'}`;

    // Show non-blocking toast (so we can auto-close/redirect without requiring user to click OK)
    showToast(msg, 1800);

    if (passed) {
        // Mark quiz as completed
        saveProgress(currentCourseId, currentLevelNumber, 'quiz');
    }

    // After a short delay, close the quiz view automatically:
    setTimeout(() => {
        if (passed) {
            // Navigate directly to case study
            startCaseStudy(currentLevelNumber);
        } else {
            // Go back to course detail so user doesn't have to scroll
            showView('courseDetail');
        }
    }, 1000);
}

// ==================== CASE STUDY SYSTEM ====================
function startCaseStudy(levelNumber) {
    currentLevelNumber = levelNumber;
    showView('caseStudy');
}

// Simple toast helper (non-blocking) — shows small message then removes itself
function showToast(message, duration = 1800) {
    const toast = document.createElement('div');
    toast.className = 'app-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // trigger entrance animation
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function renderCaseStudy() {
    const course = coursesData.find(c => c.id === currentCourseId);
    const level = course.levels.find(l => l.levelNumber === currentLevelNumber);
    const cs = level.caseStudy;
    const content = document.getElementById('caseStudyContent');
    
    let html = `
        <div class="case-study-container">
            <h1>${cs.title}</h1>
            <p class="cs-intro">${cs.description}</p>
            
            <div class="cs-requirements">
                <h2>Requirements</h2>
                <ol>
                    ${cs.requirements.map(req => `<li>${req}</li>`).join('')}
                </ol>
            </div>
            
            <form id="caseStudyForm" class="case-study-form">
                <div class="form-group">
                    <label for="caseTitle">Judul Project</label>
                    <input type="text" id="caseTitle" name="caseTitle" required>
                </div>
                
                <div class="form-group">
                    <label for="caseDescription">Deskripsi Project</label>
                    <textarea id="caseDescription" name="caseDescription" rows="6" required></textarea>
                </div>
                
                <div class="form-group">
                    <label for="caseLink">Link Portfolio/Behance (Optional)</label>
                    <input type="url" id="caseLink" name="caseLink" placeholder="https://...">
                </div>
                
                <div class="form-group">
                    <label for="caseFile">Upload File (ZIP/PDF)</label>
                    <input type="file" id="caseFile" name="caseFile" accept=".zip,.pdf,.rar">
                </div>
                
                <button type="submit" class="btn btn-primary btn-large">Kirim Case Study</button>
            </form>
        </div>
    `;
    
    content.innerHTML = html;
    document.getElementById('caseStudyForm').addEventListener('submit', submitCaseStudy);
}

function submitCaseStudy(e) {
    e.preventDefault();
    alert('✅ Case study berhasil dikirim! Instruktur akan mengevaluasi submission Anda dalam 3-5 hari kerja.');
    saveProgress(currentCourseId, currentLevelNumber, 'caseStudy');
    showView('courseDetail');
}

// ==================== DASHBOARD ====================
function renderDashboard() {
    const content = document.getElementById('dashboardContent');
    const userCourses = enrolledCourses[currentUser.email] || [];
    
    if (userCourses.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.innerHTML = '<p>Anda belum terdaftar di kursus apapun.</p>';
        
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = 'Lihat kursus tersedia';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showView('courses');
        });
        
        emptyDiv.appendChild(document.createElement('br'));
        emptyDiv.appendChild(link);
        content.innerHTML = '';
        content.appendChild(emptyDiv);
        return;
    }
    
    let html = '<div class="dashboard-grid">';
    userCourses.forEach(courseId => {
        const course = coursesData.find(c => c.id === courseId);
        html += `
            <div class="dashboard-card">
                <img src="${course.image}" alt="${course.title}">
                <h3>${course.title}</h3>
                <p>Progress: <strong id="progress_${courseId}">0%</strong></p>
                <button class="btn btn-primary continue-btn" data-course-id="${courseId}">Lanjutkan</button>
            </div>
        `;
    });
    html += '</div>';
    content.innerHTML = html;
    
    // Add event listeners untuk continue buttons
    content.querySelectorAll('.continue-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const courseId = parseInt(btn.getAttribute('data-course-id'));
            openCourseDetail(courseId);
        });
    });

    // Update progress numbers for each course in dashboard
    userCourses.forEach(courseId => {
        updateCourseProgressUI(courseId);
    });
}

// ==================== PAYMENT SYSTEM ====================
let pendingCourseForPayment = null;

function openPaymentModal(course) {
    pendingCourseForPayment = course;
    document.getElementById('qrisContent').style.display = 'none';
    document.getElementById('bankContent').style.display = 'none';
    document.getElementById('paymentModal').style.display = 'flex';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function showQRIS() {
    document.getElementById('qrisContent').style.display = 'block';
    document.getElementById('bankContent').style.display = 'none';
    if (pendingCourseForPayment) {
        document.getElementById('qrisPrice').textContent = 
            'Total: Rp ' + pendingCourseForPayment.price.toLocaleString('id-ID');
    }
}

function showBankTransfer() {
    document.getElementById('qrisContent').style.display = 'none';
    document.getElementById('bankContent').style.display = 'block';
    if (pendingCourseForPayment) {
        document.getElementById('transferAmount').textContent = 
            'Total: Rp ' + pendingCourseForPayment.price.toLocaleString('id-ID');
    }
}

function completePayment(method) {
    if (!currentUser || !pendingCourseForPayment) return;
    
    // Add course to enrolled courses
    if (!enrolledCourses[currentUser.email]) {
        enrolledCourses[currentUser.email] = [];
    }
    if (!enrolledCourses[currentUser.email].includes(pendingCourseForPayment.id)) {
        enrolledCourses[currentUser.email].push(pendingCourseForPayment.id);
    }
    
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
    
    alert(`✅ Pembayaran berhasil melalui ${method}!\nAnda sekarang dapat mengakses semua materi kursus.`);
    closePaymentModal();
    renderCourseDetail();
}

// ==================== AUTH SYSTEM ====================
function openAuthModal() {
    document.getElementById('signinForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('authTitle').textContent = 'Masuk ke DesignLearn';
    document.getElementById('authModal').style.display = 'flex';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function showSignin(e) {
    if (e) e.preventDefault();
    document.getElementById('signinForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('authTitle').textContent = 'Masuk ke DesignLearn';
    clearAuthErrors();
}

function showSignup(e) {
    if (e) e.preventDefault();
    document.getElementById('signinForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('authTitle').textContent = 'Daftar ke DesignLearn';
    clearAuthErrors();
}

function clearAuthErrors() {
    document.querySelectorAll('.auth-error').forEach(el => el.remove());
    document.querySelectorAll('.form-group input').forEach(el => {
        el.classList.remove('input-error');
    });
}

function showInputError(inputId, errorMessage) {
    const input = document.getElementById(inputId);
    const formGroup = input.closest('.form-group');
    
    input.classList.add('input-error');
    
    // Remove existing error message
    const existing = formGroup.querySelector('.auth-error');
    if (existing) existing.remove();
    
    const errorEl = document.createElement('p');
    errorEl.className = 'auth-error';
    errorEl.textContent = '❌ ' + errorMessage;
    formGroup.appendChild(errorEl);
}

function handleSignin(e) {
    e.preventDefault();
    clearAuthErrors();
    
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    
    // Validate email format
    if (!email) {
        showInputError('email', 'Email harus diisi');
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        showInputError('email', 'Format email tidak valid');
        return;
    }
    
    if (!password) {
        showInputError('password', 'Password harus diisi');
        return;
    }
    
    // Get all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem('designlearnUsers')) || {};
    const user = allUsers[email];
    
    if (!user || user.password !== password) {
        if (!user) {
            showInputError('email', 'Email tidak terdaftar');
        } else {
            showInputError('password', 'Password salah');
        }
        return;
    }
    
    currentUser = user;
    localStorage.setItem('designlearnUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeAuthModal();
    alert('✅ Selamat datang, ' + user.name);
    showView('home');
}

function handleSignup(e) {
    e.preventDefault();
    clearAuthErrors();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;
    
    let hasError = false;
    
    if (!name) {
        showInputError('signupName', 'Nama harus diisi');
        hasError = true;
    }
    
    if (!email) {
        showInputError('signupEmail', 'Email harus diisi');
        hasError = true;
    } else if (!email.includes('@') || !email.includes('.')) {
        showInputError('signupEmail', 'Format email tidak valid');
        hasError = true;
    }
    
    if (!password) {
        showInputError('signupPassword', 'Password harus diisi');
        hasError = true;
    } else if (password.length < 6) {
        showInputError('signupPassword', 'Password minimal 6 karakter');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Check if email already registered
    const allUsers = JSON.parse(localStorage.getItem('designlearnUsers')) || {};
    if (allUsers[email]) {
        showInputError('signupEmail', 'Email sudah terdaftar');
        return;
    }
    
    // Save new user
    allUsers[email] = { name, email, password };
    localStorage.setItem('designlearnUsers', JSON.stringify(allUsers));
    
    currentUser = { name, email, password };
    localStorage.setItem('designlearnUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeAuthModal();
    alert('✅ Pendaftaran berhasil! Selamat datang, ' + name);
    showView('home');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('designlearnUser');
    updateAuthUI();
    closeUserDropdownMenu();
    alert('Anda telah logout');
    showView('home');
    clearAuthErrors();
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userMenuContainer = document.getElementById('userMenuContainer');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    if (currentUser) {
        loginBtn.style.display = 'none';
        userMenuContainer.style.display = 'block';
        userNameDisplay.textContent = currentUser.name.split(' ')[0];
    } else {
        loginBtn.style.display = 'block';
        userMenuContainer.style.display = 'none';
        closeUserDropdownMenu();
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdownMenu');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function closeUserDropdownMenu() {
    document.getElementById('userDropdownMenu').style.display = 'none';
}

function addNewAccount() {
    closeUserDropdownMenu();
    // Clear form dan buka modal signup
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('signinForm').style.display = 'none';
    document.getElementById('authTitle').textContent = 'Tambah Akun Baru';
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    clearAuthErrors();
    openAuthModal();
}

function switchAccount() {
    closeUserDropdownMenu();
    // Buka modal signin untuk ganti akun
    document.getElementById('signinForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('authTitle').textContent = 'Ganti Akun';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    clearAuthErrors();
    openAuthModal();
}

function deleteAccount() {
    closeUserDropdownMenu();
    if (!currentUser) return;
    
    const confirmed = confirm('⚠️ Apakah Anda yakin ingin menghapus akun ini?\n\nAkun dan SEMUA data (enrollment, progress, case studies) akan dihapus secara permanen!');
    
    if (confirmed) {
        const userEmail = currentUser.email;
        
        // 1. Hapus dari daftar users
        const allUsers = JSON.parse(localStorage.getItem('designlearnUsers')) || {};
        delete allUsers[userEmail];
        localStorage.setItem('designlearnUsers', JSON.stringify(allUsers));
        
        // 2. Hapus semua enrollment course
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || {};
        delete enrolledCourses[userEmail];
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
        
        // 3. Hapus semua progress data untuk user
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.includes(`progress_${userEmail}`) || 
                key.includes(`quiz_${userEmail}`) || 
                key.includes(`caseStudy_${userEmail}`)) {
                localStorage.removeItem(key);
            }
        });
        
        // 4. Logout user
        currentUser = null;
        localStorage.removeItem('designlearnUser');
        updateAuthUI();
        alert('✅ Akun dan semua data telah berhasil dihapus secara permanen');
        showView('home');
    }
}

// ==================== FITUR CHAT COURSE ====================
function openCourseChat(courseId) {
    if (!currentUser) {
        alert('Silakan login terlebih dahulu untuk mengakses fitur chat');
        openAuthModal();
        return;
    }
    currentChatCourseId = courseId;
    showView('courseChat');
}

function renderCourseChat() {
    const course = coursesData.find(c => c.id === currentChatCourseId);
    const content = document.getElementById('courseChatContent');
    
    // Pastikan instructor memiliki property yang diperlukan
    if (!course.instructor.rating) course.instructor.rating = 4.9;
    if (!course.instructor.avgResponseTime) course.instructor.avgResponseTime = "2 jam";
    if (!course.instructor.responseRate) course.instructor.responseRate = "98%";
    
    let html = `
        <div class="chat-container">
            <div class="chat-header">
                <div class="instructor-chat-info">
                    <div class="chat-instructor-avatar">${getUserAvatar(course.instructor.name)}</div>
                    <div>
                        <h2>Chat dengan ${course.instructor.name}</h2>
                        <p class="instructor-stats">
                            <span>⭐ ${course.instructor.rating}/5.0</span>
                            <span>⏱️ Rata-rata respon: ${course.instructor.avgResponseTime}</span>
                            <span>📊 Tingkat respon: ${course.instructor.responseRate}</span>
                        </p>
                    </div>
                </div>

            </div>
            
            <div class="chat-messages" id="chatMessages">
                <!-- Messages will be loaded here -->
            </div>
            
            <div class="chat-input-area">
                <textarea id="chatMessageInput" placeholder="Tanyakan tentang pelajaran ini..." rows="3"></textarea>
                <button class="btn btn-primary" onclick="sendChatMessage()">Kirim Pesan</button>
            </div>
            
            <div class="chat-guidelines">
                <p>📝 <strong>Tips:</strong> Ajukan pertanyaan spesifik tentang materi kursus untuk mendapatkan jawaban terbaik</p>
                <p>⏰ Instruktur biasanya merespon dalam ${course.instructor.avgResponseTime}</p>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
    loadChatMessages();
}

function loadChatMessages() {
    if (!currentUser) return;
    
    const chatKey = `chat_${currentUser.email}_${currentChatCourseId}`;
    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    const chatMessages = document.getElementById('chatMessages');
    
    if (messages.length === 0) {
        chatMessages.innerHTML = `
            <div class="empty-chat">
                <div class="empty-chat-icon">💬</div>
                <h3>Mulai Percakapan</h3>
                <p>Ajukan pertanyaan tentang kursus ini kepada instruktur</p>
                <p>Contoh pertanyaan:</p>
                <ul>
                    <li>"Bagaimana cara menerapkan teori warna pada branding?"</li>
                    <li>"Bisakah Anda menjelaskan lagi tentang typography hierarchy?"</li>
                    <li>"Ada rekomendasi tools untuk case study level 3?"</li>
                </ul>
            </div>
        `;
        return;
    }
    
    let messagesHTML = '';
    messages.forEach(msg => {
        messagesHTML += `
            <div class="chat-message ${msg.sender === 'user' ? 'user-message' : 'instructor-message'}">
                <div class="message-avatar">${msg.sender === 'user' ? getUserAvatar(currentUser.name) : getUserAvatar(msg.instructorName || 'Instruktur')}</div>
                <div class="message-content">
                    <div class="message-header">
                        <strong>${msg.sender === 'user' ? currentUser.name : msg.instructorName || 'Instruktur'}</strong>
                        <span class="message-time">${formatTime(msg.timestamp)}</span>
                    </div>
                    <div class="message-text">${msg.text}</div>
                    ${msg.attachments ? `
                        <div class="message-attachments">
                            ${msg.attachments.map(att => 
                                `<a href="${att.url}" target="_blank" class="attachment">📎 ${att.name}</a>`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    chatMessages.innerHTML = messagesHTML;
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendChatMessage() {
    if (!currentUser) return;
    
    const input = document.getElementById('chatMessageInput');
    const message = input.value.trim();
    
    if (!message) {
        alert('Silakan tulis pesan terlebih dahulu');
        return;
    }
    
    const chatKey = `chat_${currentUser.email}_${currentChatCourseId}`;
    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    
    const newMessage = {
        id: Date.now(),
        sender: 'user',
        text: message,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    messages.push(newMessage);
    localStorage.setItem(chatKey, JSON.stringify(messages));
    
    input.value = '';
    loadChatMessages();
    
    // Simulasikan balasan dari instruktur (lebih variatif dan kontekstual)
    setTimeout(() => {
        const course = coursesData.find(c => c.id === currentChatCourseId);
        const lower = message.toLowerCase();
        let replyText = '';

        if (/(cara|mulai|memulai|bagaimana)/.test(lower)) {
            replyText = `Halo! Untuk memulai, buka modul pertama dan ikuti langkah-langkah di sana. Mau saya tunjukkan link modulnya?`;
        } else if (/(deadline|batas waktu|kapan)/.test(lower)) {
            replyText = `Biasanya ada deadline 7 hari setelah tugas diberikan; cek bagian 'Case Study' untuk tanggal pasti atau tanyakan bagian mana yang Anda maksud.`;
        } else if (/(konsep|jelaskan|apa itu|definisi)/.test(lower)) {
            replyText = `Konsep utama meliputi teori, contoh dan latihan praktis — sebutkan topik spesifik (mis. prototyping) supaya saya bisa jelaskan lebih rinci.`;
        } else if (/(contoh|sample|contohnya)/.test(lower)) {
            replyText = `Contoh ada pada modul 3; saya bisa memberi ringkasan atau menyalin potongan yang relevan jika Anda mau.`;
        } else if (/(halo|hi|hai|hello)/.test(lower)) {
            replyText = `Halo! Ada yang bisa saya bantu hari ini seputar materi atau tugas?`;
        } else if (/(berapa|berapa banyak|berapa lama)/.test(lower)) {
            replyText = `Itu tergantung pada tugasnya — kebanyakan latihan memerlukan 1-3 jam, case study bisa lebih lama. Sebutkan tugasnya agar saya bisa perkirakan.`;
        } else {
            const fallbacks = [
                `Terima kasih! Saya akan memeriksa dan kembali dengan penjelasan singkat.`,
                `Bisa Anda jelaskan sedikit lebih detail bagian mana yang membingungkan?`,
                `Coba lihat bagian terkait di modul sebelumnya; jika masih bingung, katakan kata kuncinya.`,
                `Saya bisa mengirimkan referensi materi yang relevan, mau saya kirimkan?`
            ];
            replyText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }

        const autoReply = {
            id: Date.now() + 1,
            sender: 'instructor',
            instructorName: course.instructor.name,
            text: replyText,
            timestamp: new Date().toISOString()
        };

        messages.push(autoReply);
        localStorage.setItem(chatKey, JSON.stringify(messages));
        loadChatMessages();
    }, 1000 + Math.floor(Math.random() * 1200));
}

// Rating feature removed per user request

// ==================== FITUR USER PROFILE & PORTFOLIO ====================
function openUserProfile() {
    if (!currentUser) {
        alert('Silakan login terlebih dahulu');
        return;
    }
    
    const content = document.getElementById('profileContent');
    const userProjects = JSON.parse(localStorage.getItem(`projects_${currentUser.email}`)) || [];
    const userStats = getUserStats();
    
    content.innerHTML = `
        <div class="profile-container">
            <div class="profile-header">
                <div class="profile-avatar">${getUserAvatar(currentUser.name)}</div>
                <div class="profile-info">
                    <h2>${currentUser.name}</h2>
                    <p class="profile-email">📧 ${currentUser.email}</p>
                    <div class="profile-stats">
                        <div class="stat-item">
                            <span class="stat-number">${userStats.coursesCompleted}</span>
                            <span class="stat-label">Kursus Selesai</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${userStats.projectsCount}</span>
                            <span class="stat-label">Proyek</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${userStats.certificatesCount}</span>
                            <span class="stat-label">Sertifikat</span>
                        </div>
                    </div>
                </div>
                <button class="btn btn-secondary" onclick="openEditProfile()">✏️ Edit Profil</button>
            </div>
            
            <div class="profile-tabs">
                <button class="tab-btn active" onclick="switchProfileTab('projects')">🎨 Proyek Saya</button>
                <button class="tab-btn" onclick="switchProfileTab('courses')">📚 Kursus Saya</button>
                <button class="tab-btn" onclick="switchProfileTab('certificates')">🏆 Sertifikat</button>
            </div>
            
            <div class="profile-content">
                <div class="tab-content active" id="projectsTab">
                    <div class="projects-grid">
                        ${userProjects.length > 0 ? userProjects.map(project => `
                            <div class="project-card">
                                <img src="${project.image || 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&h=300&fit=crop'}" 
                                     alt="${project.title}" class="project-image">
                                <div class="project-info">
                                    <h4>${project.title}</h4>
                                    <p class="project-description">${project.description ? project.description.substring(0, 100) + '...' : 'Tidak ada deskripsi'}</p>
                                    <div class="project-meta">
                                        <span class="project-course">${project.courseTitle || 'Tidak ada kursus'}</span>
                                        <span class="project-date">${formatDate(project.date)}</span>
                                    </div>
                                    <div class="project-tags">
                                        ${(project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                                    </div>
                                    <div class="project-actions">
                                        <button class="btn btn-small" onclick="viewProject(${project.id})">👁️ Lihat</button>
                                        <button class="btn btn-small" onclick="shareProject(${project.id})">📤 Share</button>
                                    </div>
                                </div>
                            </div>
                        `).join('') : `
                            <div class="empty-projects">
                                <div class="empty-icon">🎨</div>
                                <h3>Belum Ada Proyek</h3>
                                <p>Mulai buat proyek pertama Anda dari case study di kursus!</p>
                                <button class="btn btn-primary" onclick="showView('dashboard')">Lihat Kursus Saya</button>
                            </div>
                        `}
                    </div>
                    <button class="btn btn-primary add-project-btn" onclick="openAddProjectModal()">
                        + Tambah Proyek Baru
                    </button>
                </div>
                
                <div class="tab-content" id="coursesTab">
                    <div class="enrolled-courses-list">
                        ${userStats.enrolledCourses.length > 0 ? userStats.enrolledCourses.map(courseId => {
                            const course = coursesData.find(c => c.id === courseId);
                            if (!course) return '';
                            return `
                                <div class="enrolled-course-card">
                                    <img src="${course.image}" alt="${course.title}">
                                    <div class="course-details">
                                        <h4>${course.title}</h4>
                                        <p>${course.description.substring(0, 100)}...</p>
                                        <div class="course-progress">
                                            <div class="progress-bar">
                                                <div class="progress-fill" style="width: ${getCourseProgress(courseId)}%"></div>
                                            </div>
                                            <span>${getCourseProgress(courseId)}% selesai</span>
                                        </div>
                                    </div>
                                    <button class="btn btn-secondary" onclick="openCourseDetail(${courseId})">Lanjutkan</button>
                                </div>
                            `;
                        }).join('') : '<p class="no-courses">Belum ada kursus yang diikuti</p>'}
                    </div>
                </div>
                
                <div class="tab-content" id="certificatesTab">
                    <div class="certificates-list">
                        ${userStats.certificatesCount > 0 ? `
                            <p>Anda memiliki ${userStats.certificatesCount} sertifikat:</p>
                            <div class="certificates-grid">
                                ${Array.from({length: userStats.certificatesCount}).map((_, i) => `
                                    <div class="certificate-card">
                                        <div class="certificate-icon">🏆</div>
                                        <h4>Sertifikat Kelulusan #${i + 1}</h4>
                                        <p>DesignLearn Certification</p>
                                        <button class="btn btn-small" onclick="downloadCertificate(${i + 1})">📥 Download</button>
                                    </div>
                                `).join('')}
                            </div>
                        ` : '<p class="no-certificates">Belum ada sertifikat. Selesaikan kursus untuk mendapatkan sertifikat!</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('profileModal').style.display = 'flex';
}

function getUserStats() {
    if (!currentUser) return { coursesCompleted: 0, projectsCount: 0, certificatesCount: 0, enrolledCourses: [] };
    
    const userCourses = enrolledCourses[currentUser.email] || [];
    const userProjects = JSON.parse(localStorage.getItem(`projects_${currentUser.email}`)) || [];
    
    // Hitung kursus yang selesai (semua level completed)
    let coursesCompleted = 0;
    userCourses.forEach(courseId => {
        const progress = getProgressForCourse(courseId);
        const course = coursesData.find(c => c.id === courseId);
        if (course && course.levels.every(l => progress[l.levelNumber]?.completed)) {
            coursesCompleted++;
        }
    });
    
    const userCertificates = getCertificatesForUser(currentUser.email);
    return {
        coursesCompleted,
        projectsCount: userProjects.length,
        certificatesCount: userCertificates.length,
        enrolledCourses: userCourses,
        certificates: userCertificates
    }; 
}

function openAddProjectModal() {
    const userCourses = enrolledCourses[currentUser.email] || [];
    if (userCourses.length === 0) {
        alert('Anda belum terdaftar di kursus apapun. Silakan daftar kursus terlebih dahulu.');
        return;
    }
    
    const modalHTML = `
        <div class="add-project-modal">
            <h3>+ Tambah Proyek Baru</h3>
            <form id="addProjectForm">
                <div class="form-group">
                    <label for="projectTitle">Judul Proyek</label>
                    <input type="text" id="projectTitle" required>
                </div>
                <div class="form-group">
                    <label for="projectDescription">Deskripsi</label>
                    <textarea id="projectDescription" rows="4" required></textarea>
                </div>
                <div class="form-group">
                    <label for="projectCourse">Kursus Terkait</label>
                    <select id="projectCourse" required>
                        ${userCourses.map(courseId => {
                            const course = coursesData.find(c => c.id === courseId);
                            return course ? `<option value="${courseId}">${course.title}</option>` : '';
                        }).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="projectTags">Tags (pisahkan dengan koma)</label>
                    <input type="text" id="projectTags" placeholder="contoh: UI Design, Mobile App, Branding">
                </div>
                <div class="form-group">
                    <label for="projectImage">URL Gambar (opsional)</label>
                    <input type="url" id="projectImage" placeholder="https://...">
                </div>
                <div class="form-group">
                    <label for="projectLink">Link Proyek (Behance/Dribbble)</label>
                    <input type="url" id="projectLink" placeholder="https://behance.net/...">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeCurrentModal()">Batal</button>
                    <button type="button" class="btn btn-primary" onclick="saveProject()">Simpan Proyek</button>
                </div>
            </form>
        </div>
    `;
    
    // Buat modal baru
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-panel">${modalHTML}</div>
    `;
    document.body.appendChild(modal);
    
    // Tambahkan event listener untuk form
    modal.querySelector('#addProjectForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveProject();
    });
}

function closeCurrentModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function saveProject() {
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const courseId = parseInt(document.getElementById('projectCourse').value);
    const tags = document.getElementById('projectTags').value.split(',').map(t => t.trim()).filter(t => t);
    const image = document.getElementById('projectImage').value.trim();
    const link = document.getElementById('projectLink').value.trim();
    
    if (!title || !description) {
        alert('Judul dan deskripsi harus diisi');
        return;
    }
    
    const course = coursesData.find(c => c.id === courseId);
    
    const project = {
        id: Date.now(),
        title,
        description,
        courseId,
        courseTitle: course ? course.title : 'Tidak diketahui',
        tags,
        image: image || null,
        link: link || null,
        date: new Date().toISOString(),
        likes: 0,
        comments: []
    };
    
    const projectKey = `projects_${currentUser.email}`;
    const projects = JSON.parse(localStorage.getItem(projectKey)) || [];
    projects.push(project);
    localStorage.setItem(projectKey, JSON.stringify(projects));
    
    // Tutup modal
    closeCurrentModal();
    
    // Refresh profile
    openUserProfile();
    alert('✅ Proyek berhasil ditambahkan ke portfolio!');
}

function viewProject(projectId) {
    alert(`Melihat proyek #${projectId} (fitur detail proyek sedang dalam pengembangan)`);
}

function shareProject(projectId) {
    alert(`Berbagi proyek #${projectId} (fitur berbagi sedang dalam pengembangan)`);
}

function downloadCertificateById(certificateId) {
    if (!currentUser) return alert('Silakan login untuk mengunduh sertifikat');
    const certificates = getCertificatesForUser(currentUser.email);
    const cert = certificates.find(c => String(c.id) === String(certificateId));
    if (!cert) return alert('Sertifikat tidak ditemukan');

    if (!cert.dataUrl) {
        // generate on demand
        cert.dataUrl = generateCertificateImage(cert);
        saveCertificateForUser(cert);
    }

    const a = document.createElement('a');
    a.href = cert.dataUrl;
    a.download = `Sertifikat - ${cert.courseTitle} - ${cert.userName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function shareCertificateById(certificateId) {
    if (!currentUser) return alert('Silakan login untuk berbagi sertifikat');
    const certificates = getCertificatesForUser(currentUser.email);
    const cert = certificates.find(c => String(c.id) === String(certificateId));
    if (!cert) return alert('Sertifikat tidak ditemukan');

    if (!cert.dataUrl) {
        cert.dataUrl = generateCertificateImage(cert);
        saveCertificateForUser(cert);
    }

    // Try native share
    if (navigator.share) {
        navigator.share({ title: `Sertifikat - ${cert.courseTitle}`, files: [] }).catch(() => {
            window.open(cert.dataUrl, '_blank');
        });
    } else {
        window.open(cert.dataUrl, '_blank');
    }
} 

function openEditProfile() {
    alert('Fitur edit profil sedang dalam pengembangan');
}

// ==================== UTILITY FUNCTIONS ====================
function getUserAvatar(name) {
    if (!name) return '👤';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return initials || '👤';
}

function formatTime(isoString) {
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
    } catch (e) {
        return '--:--';
    }
}

function formatDate(isoString) {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        return 'Tanggal tidak valid';
    }
}

// ==================== CERTIFICATE HELPERS ====================
function getCertificatesForUser(email) {
    if (!email) return [];
    return JSON.parse(localStorage.getItem(`certificates_${email}`)) || [];
}

function saveCertificateForUser(cert) {
    if (!currentUser) return;
    const key = `certificates_${currentUser.email}`;
    const certs = JSON.parse(localStorage.getItem(key)) || [];
    const idx = certs.findIndex(c => String(c.id) === String(cert.id));
    if (idx > -1) certs[idx] = cert; else certs.push(cert);
    localStorage.setItem(key, JSON.stringify(certs));
}

function generateCertificateImage(cert) {
    const width = 1600; const height = 1000;
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Smooth background gradient
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#ffffff');
    bg.addColorStop(0.35, '#f6fbff');
    bg.addColorStop(1, '#eef7ff');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Subtle diagonal pattern overlay
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = '#000';
    for (let i = -height; i < width; i += 40) {
        ctx.fillRect(i, 0, 10, height);
        i += 20;
    }
    ctx.restore();

    // Decorative border with inner shadow
    const pad = 48;
    roundRect(ctx, pad, pad, width - pad*2, height - pad*2, 18, false, true);
    ctx.strokeStyle = 'rgba(30,40,80,0.06)'; ctx.lineWidth = 8; ctx.stroke();

    // Header badge / logo
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'rgba(0,0,0,0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(140, 120, 48, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'linear-gradient(0, #7B2FF7, #14C3FF)';
    ctx.fillStyle = '#7B2FF7';
    ctx.font = '700 28px Roboto, Arial'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff';
    ctx.fillText('DL', 140, 132);

    // Big title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1a1a2e'; ctx.font = '700 44px Roboto, Arial';
    ctx.fillText('SERTIFIKAT KESELESAIAN', width/2, 150);

    // Thin decorative rule
    ctx.strokeStyle = 'rgba(26,26,46,0.08)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(220, 168); ctx.lineTo(width - 220, 168); ctx.stroke();

    // Course title block
    ctx.fillStyle = '#333'; ctx.font = '700 36px Roboto, Arial';
    wrapText(ctx, cert.courseTitle, width/2, 220, width - 360, 42);

    // Recipient name with gold foil style
    ctx.font = '800 56px Roboto, Arial';
    const nameX = width/2; const nameY = 360;
    // gold gradient
    const gold = ctx.createLinearGradient(0, nameY-40, 0, nameY+40);
    gold.addColorStop(0, '#ffd970'); gold.addColorStop(0.5, '#ffd44a'); gold.addColorStop(1, '#ffb84d');
    ctx.fillStyle = gold;
    // subtle shadow
    ctx.shadowColor = 'rgba(0,0,0,0.12)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 6;
    ctx.fillText(cert.userName, nameX, nameY);
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

    // Subtitle text
    ctx.fillStyle = '#555'; ctx.font = '20px Roboto, Arial';
    ctx.fillText('Telah menyelesaikan kursus', width/2, nameY + 46);

    // Certificate meta (date and id)
    ctx.fillStyle = '#222'; ctx.font = '16px Roboto, Arial'; ctx.textAlign = 'left';
    ctx.fillText(`Diberikan pada: ${formatDate(cert.date)}`, 220, height - 160);
    ctx.textAlign = 'right';
    ctx.fillText(`Sertifikat ID: ${cert.id}`, width - 220, height - 160);

    // Signature area (simulated signature)
    ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(width/2 - 160, height - 200); ctx.lineTo(width/2 + 160, height - 200); ctx.stroke();
    ctx.font = '700 18px Roboto, Arial'; ctx.textAlign = 'center'; ctx.fillStyle = '#333';
    ctx.fillText('Direktur Kurikulum', width/2, height - 176);

    // Gold emblem on right
    const emblemX = width - 220; const emblemY = 260; const emblemR = 70;
    ctx.beginPath(); ctx.arc(emblemX, emblemY, emblemR, 0, Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = '#f3d28a'; ctx.stroke();
    // star inside
    ctx.fillStyle = '#f0b429'; ctx.font = '700 40px Roboto, Arial'; ctx.textAlign = 'center'; ctx.fillText('⭐', emblemX, emblemY + 14);
    ctx.font = '700 14px Roboto, Arial'; ctx.fillStyle = '#777'; ctx.fillText('TERVERIFIKASI', emblemX, emblemY + 56);

    // QR-like badge (non-functional placeholder)
    const qrX = width - 220; const qrY = height - 220; const qrS = 84;
    ctx.fillStyle = '#111';
    for (let rx = 0; rx < 6; rx++) for (let ry = 0; ry < 6; ry++) {
        if ((rx + ry) % 2 === 0) ctx.fillRect(qrX - qrS/2 + rx*14, qrY - qrS/2 + ry*14, 12, 12);
    }

    // Small watermark (DesignLearn)
    ctx.globalAlpha = 0.08;
    ctx.font = '700 80px Roboto, Arial'; ctx.textAlign = 'center'; ctx.fillStyle = '#7B2FF7';
    ctx.fillText('DesignLearn', width/2, height - 520);
    ctx.globalAlpha = 1;

    return canvas.toDataURL('image/png');
}

// helper: rounded rectangle
function roundRect(ctx, x, y, w, h, r, fill, stroke) {
    if (typeof r === 'undefined') r = 5;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

function createCertificateForCourse(courseId) {
    if (!currentUser) return;
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;

    const existing = getCertificatesForUser(currentUser.email).find(c => c.courseId === courseId);
    if (existing) return existing;

    const cert = {
        id: `cert_${Date.now()}`,
        courseId: courseId,
        courseTitle: course.title,
        userName: currentUser.name,
        date: new Date().toISOString(),
        dataUrl: null
    };

    saveCertificateForUser(cert);
    alert(`🎉 Selamat! Sertifikat untuk kursus "${course.title}" sudah tersedia di profil Anda.`);
    if (typeof renderProfileContent === 'function') renderProfileContent();
    return cert;
}

function checkCourseCompletion(courseId) {
    if (!currentUser) return;
    const progress = getCourseProgress(courseId);
    if (progress === 100) {
        const existing = getCertificatesForUser(currentUser.email).find(c => c.courseId === courseId);
        if (!existing) {
            createCertificateForCourse(courseId);
        }
    }
}

function getCourseProgress(courseId) {
    const progress = getProgressForCourse(courseId);
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return 0;
    
    const totalLevels = course.levels.length;
    let completedLevels = 0;
    
    course.levels.forEach(level => {
        if (progress[level.levelNumber]?.completed) completedLevels++;
    });
    
    return Math.round((completedLevels / totalLevels) * 100);
}

function showAllReviews(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course || !course.instructor.reviews || course.instructor.reviews.length === 0) return;
    
    let reviewsHTML = '<div class="all-reviews-modal">';
    reviewsHTML += `<h3>Semua Review untuk ${course.instructor.name}</h3>`;
    reviewsHTML += `<div class="reviews-count">Total: ${course.instructor.reviews.length} review</div>`;
    
    course.instructor.reviews.forEach(review => {
        reviewsHTML += `
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer-avatar">${review.userAvatar || '👤'}</div>
                    <div class="reviewer-info">
                        <strong>${review.userName || 'User'}</strong>
                        <div class="review-rating">
                            ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                        </div>
                    </div>
                    <span class="review-date">${formatDate(review.date)}</span>
                </div>
                <p class="review-comment">${review.comment || 'Tidak ada komentar'}</p>
                <span class="review-course">Kursus: ${review.courseTitle || course.title}</span>
            </div>
        `;
    });
    
    reviewsHTML += '<button class="btn btn-secondary" onclick="closeCurrentModal()">Tutup</button>';
    reviewsHTML += '</div>';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-panel">${reviewsHTML}</div>
    `;
    document.body.appendChild(modal);
}

function saveProgress(courseId, levelNumber, type) {
    if (!currentUser) return;
    const userEmail = currentUser.email;
    const key = `progress_${userEmail}_${courseId}`;
    const progress = JSON.parse(localStorage.getItem(key)) || {};
    if (!progress[levelNumber]) progress[levelNumber] = {};
    // mark the specific type as completed with timestamp
    progress[levelNumber][type] = true;
    if (!progress[levelNumber].timestamps) progress[levelNumber].timestamps = {};
    progress[levelNumber].timestamps[type] = new Date().toISOString();

    // if both quiz and caseStudy completed, mark level as completed
    if (progress[levelNumber].quiz && progress[levelNumber].caseStudy) {
        progress[levelNumber].completed = true;
        progress[levelNumber].completedAt = new Date().toISOString();
    }

    localStorage.setItem(key, JSON.stringify(progress));

    // update summary progress (percentage) and UI
    updateCourseProgressUI(courseId);
    renderDashboard();

    // Check if course just completed and create certificate if needed
    checkCourseCompletion(courseId);
}

function getProgressForCourse(courseId) {
    if (!currentUser) return {};
    const key = `progress_${currentUser.email}_${courseId}`;
    return JSON.parse(localStorage.getItem(key)) || {};
}

function updateCourseProgressUI(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
    const progress = getProgressForCourse(courseId);
    const totalLevels = course.levels.length;
    let completedLevels = 0;
    course.levels.forEach(l => {
        if (progress[l.levelNumber] && progress[l.levelNumber].completed) completedLevels++;
    });

    const percent = Math.round((completedLevels / totalLevels) * 100);

    // Update progress display in course detail if open
    const percentEl = document.getElementById('courseProgressPercent');
    if (percentEl) percentEl.textContent = percent + '%';

    // Update each level card badges
    const content = document.getElementById('courseDetailContent');
    if (content) {
        course.levels.forEach(l => {
            const levelEl = content.querySelector(`.level-card[data-level="${l.levelNumber}"]`);
            if (!levelEl) return;
            // remove existing badges
            const existingBadges = levelEl.querySelectorAll('.level-badge');
            existingBadges.forEach(b => b.remove());

            // add quiz badge
            if (progress[l.levelNumber] && progress[l.levelNumber].quiz) {
                const b = document.createElement('span');
                b.className = 'level-badge';
                b.textContent = 'Quiz ✓';
                levelEl.querySelector('.level-header').appendChild(b);
            }

            // add caseStudy badge
            if (progress[l.levelNumber] && progress[l.levelNumber].caseStudy) {
                const b2 = document.createElement('span');
                b2.className = 'level-badge';
                b2.textContent = 'Case ✓';
                levelEl.querySelector('.level-header').appendChild(b2);
            }

            // mark completed
            if (progress[l.levelNumber] && progress[l.levelNumber].completed) {
                levelEl.classList.add('level-completed');
            } else {
                levelEl.classList.remove('level-completed');
            }
        });
    }
    
    // Update progress in dashboard
    const dashboardEl = document.getElementById(`progress_${courseId}`);
    if (dashboardEl) dashboardEl.textContent = percent + '%';
}

function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

function handleDropdownAction(action) {
    closeUserDropdownMenu();
    
    switch(action) {
        case 'dashboard':
            showView('dashboard');
            break;
        case 'add-account':
            addNewAccount();
            break;
        case 'switch-account':
            switchAccount();
            break;
        case 'delete-account':
            deleteAccount();
            break;
        case 'logout':
            logout();
            break;
        case 'my-profile':
        case 'dashboard': // Menangani juga action 'dashboard' dari dropdown lama
            openUserProfile();
            break;
        case 'my-projects':
            openUserProfile();
            setTimeout(() => switchProfileTab('projects'), 100);
            break;
        default:
            // Untuk action yang tidak dikenal, coba tampilkan view dengan nama yang sama
            if (['home', 'courses'].includes(action)) {
                showView(action);
            }
    }
}

function showContactInfo() {
    const message = '📧 Email: farhan.dev@email.com\n💼 LinkedIn: linkedin.com/in/farhanmauludin\n𝕏 Twitter: twitter.com/farhandev\n⚙️ GitHub: github.com/farhanmauludin';
    alert(message);
}

function switchProfileTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab
    const tabBtn = document.querySelector(`.tab-btn[onclick*="${tabName}"]`);
    const tabContent = document.getElementById(`${tabName}Tab`);
    
    if (tabBtn) tabBtn.classList.add('active');
    if (tabContent) tabContent.classList.add('active');
}

function closeProfileModal() {
    document.getElementById('profileModal').style.display = 'none';
}

// ==================== LIVE CHAT WIDGET ====================
let chatWidget = null;
let isChatMinimized = false;

function openCourseChat(courseId) {
    if (!currentUser) {
        alert('Silakan login terlebih dahulu untuk mengakses fitur chat');
        openAuthModal();
        return;
    }
    
    currentChatCourseId = courseId;
    
    // Create chat widget if not exists
    if (!document.getElementById('chatWidget')) {
        createChatWidget();
    }
    
    renderChatWidget();
    showChatWidget();
}

function createChatWidget() {
    const chatWidgetHTML = `
        <div id="chatWidget" class="chat-modal">
            <div class="chat-header" onclick="toggleChatMinimize()">
                <div class="chat-header-info">
                    <div class="chat-avatar" id="chatAvatar">👨‍🏫</div>
                    <div class="chat-header-text">
                        <h3 id="chatInstructorName">Instruktur</h3>
                        <p id="chatStatus">🟢 Online</p>
                    </div>
                </div>
                <div class="chat-controls">
                    <button class="chat-control-btn" onclick="toggleChatMinimize(event)">−</button>
                    <button class="chat-control-btn" onclick="closeChatWidget()">×</button>
                </div>
            </div>
            
            <div class="chat-messages-area" id="chatMessagesArea">
                <!-- Messages will be loaded here -->
            </div>
            
            <div class="chat-input-area">
                <textarea class="chat-input" id="chatInput" 
                          placeholder="Ketik pesan Anda..." 
                          rows="1"></textarea>
                <button class="send-btn" onclick="sendChatMessageWidget()">
                    <i>➤</i>
                </button>
            </div>
        </div>
    `;
    
    const widget = document.createElement('div');
    widget.innerHTML = chatWidgetHTML;
    document.body.appendChild(widget.firstElementChild);
    
    // Add enter key listener
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessageWidget();
        }
    });
    
    // Auto-resize textarea
    document.getElementById('chatInput').addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

function renderChatWidget() {
    const course = coursesData.find(c => c.id === currentChatCourseId);
    if (!course) return;
    
    // Update header
    document.getElementById('chatInstructorName').textContent = course.instructor.name;
    document.getElementById('chatAvatar').textContent = getUserAvatar(course.instructor.name);
    
    // Load messages
    loadChatWidgetMessages();
    
    // Add welcome message if no messages
    const chatKey = `chat_${currentUser.email}_${currentChatCourseId}`;
    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    
    if (messages.length === 0) {
        const messagesArea = document.getElementById('chatMessagesArea');
        messagesArea.innerHTML = `
            <div class="welcome-message">
                <h4>👋 Chat dengan ${course.instructor.name}</h4>
                <p>Ajukan pertanyaan tentang kursus "${course.title}"</p>
                <div class="quick-questions">
                    <button class="quick-question-btn" onclick="sendQuickQuestion('Bagaimana cara memulai level pertama?')">Cara memulai?</button>
                    <button class="quick-question-btn" onclick="sendQuickQuestion('Bisakah Anda menjelaskan konsep utama?')">Konsep utama?</button>
                    <button class="quick-question-btn" onclick="sendQuickQuestion('Ada deadline untuk case study?')">Deadline case study?</button>
                </div>
            </div>
        `;
    }
}

function loadChatWidgetMessages() {
    if (!currentUser) return;
    
    const chatKey = `chat_${currentUser.email}_${currentChatCourseId}`;
    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    const messagesArea = document.getElementById('chatMessagesArea');
    
    let messagesHTML = '';
    
    // Group messages by date
    const groupedMessages = groupMessagesByDate(messages);
    
    Object.keys(groupedMessages).forEach(date => {
        // Add date separator
        messagesHTML += `
            <div class="date-separator">
                <span>${formatDate(date)}</span>
            </div>
        `;
        
        // Add messages for this date
        groupedMessages[date].forEach(msg => {
            const time = formatTime(msg.timestamp);
            const isUser = msg.sender === 'user';
            
            messagesHTML += `
                <div class="message-bubble ${isUser ? 'user-message-bubble' : 'instructor-message-bubble'}">
                    <div class="message-text">${msg.text}</div>
                    <span class="message-time">
                        ${time}
                        ${isUser ? `<span class="message-status ${msg.read ? 'read' : 'sent'}">${msg.read ? '✓✓' : '✓'}</span>` : ''}
                    </span>
                </div>
            `;
        });
    });
    
    messagesArea.innerHTML += messagesHTML;
    
    // Scroll to bottom
    setTimeout(() => {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }, 100);
}

function groupMessagesByDate(messages) {
    const grouped = {};
    
    messages.forEach(msg => {
        const date = new Date(msg.timestamp).toISOString().split('T')[0];
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(msg);
    });
    
    return grouped;
}

function sendChatMessageWidget() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add message to UI immediately
    const messagesArea = document.getElementById('chatMessagesArea');
    const time = formatTime(new Date().toISOString());
    
    messagesArea.innerHTML += `
        <div class="message-bubble user-message-bubble">
            <div class="message-text">${message}</div>
            <span class="message-time">
                ${time}
                <span class="message-status sent">✓</span>
            </span>
        </div>
    `;
    
    // Save to localStorage
    const chatKey = `chat_${currentUser.email}_${currentChatCourseId}`;
    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    
    const newMessage = {
        id: Date.now(),
        sender: 'user',
        text: message,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    messages.push(newMessage);
    localStorage.setItem(chatKey, JSON.stringify(messages));
    
    // Clear input and reset height
    input.value = '';
    input.style.height = 'auto';
    
    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
    
    // Show typing indicator
    messagesArea.innerHTML += `
        <div class="typing-indicator">
            <span class="typing-text">Instruktur sedang mengetik...</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    messagesArea.scrollTop = messagesArea.scrollHeight;
    
    // Simulate instructor reply (keyword-aware and varied)
    setTimeout(() => {
        // Remove typing indicator
        const typingIndicator = messagesArea.querySelector('.typing-indicator');
        if (typingIndicator) typingIndicator.remove();

        const course = coursesData.find(c => c.id === currentChatCourseId);
        const lower = message.toLowerCase();
        let replyText = '';

        if (/(cara|mulai|memulai|bagaimana)/.test(lower)) {
            replyText = `Untuk memulai, lihat Modul 1 pada kursus ini; ada panduan langkah-demi-langkah dan latihan awal.`;
        } else if (/(deadline|batas waktu|kapan)/.test(lower)) {
            replyText = `Biasanya tenggat waktu ditampilkan di halaman tugas; cek tab 'Case Study' atau beri tahu tugas mana yang Anda maksud.`;
        } else if (/(konsep|jelaskan|apa itu)/.test(lower)) {
            replyText = `Konsep utama mencakup teori, contoh, dan aplikasi praktis — sebutkan bagian yang ingin diperjelas.`;
        } else if (/(contoh|sample)/.test(lower)) {
            replyText = `Ada contoh di Modul 3; saya bisa ringkas atau beri kutipan jika Anda mau.`;
        } else if (/(halo|hi|hai)/.test(lower)) {
            replyText = `Halo! Apa yang ingin Anda tanyakan tentang kursus ini?`;
        } else if(/(terima kasih|makasih|thanks)/.test(lower)) {
            replyText = `Sama-sama! Jangan ragu untuk bertanya lagi jika ada yang ingin Anda ketahui.`;
        } else if(/(sedih|kecewa)/.test(lower)) {
            replyText = `Maaf mendengar itu. Bisa beri tahu saya bagian mana yang membuat Anda kesulitan? Saya di sini untuk membantu!`;
        } else if(/sayang|cinta/.test(lower)) {
            replyText = `aku juga sayang sama kamu kok. ❤️`;
        } else if(/(bug|error|masalah)/.test(lower)) {
            replyText = `Maaf atas ketidaknyamanannya. Bisa jelaskan lebih detail tentang masalah yang Anda alami?`;
        } else if(/(sulit|bingung|pusing)/.test(lower)) {
            replyText = `Saya mengerti, beberapa konsep memang menantang. Bagian mana yang paling membingungkan bagi Anda?`;
        } else if(/(bagus|hebat|mantap)/.test(lower)) {
            replyText = `Terima kasih atas apresiasinya! Senang mendengar Anda menikmati kursus ini.`;
        } else if(/(bantu|tolong)/.test(lower)) {
            replyText = `Tentu! Silakan beri tahu saya apa yang bisa saya bantu terkait kursus ini.`;
        } else if(/(review|ulasan)/.test(lower)) {
            replyText = `Anda bisa melihat ulasan dari peserta lain di halaman kursus. Ada yang spesifik ingin Anda ketahui?`;
        } else if(/(sertifikat|certificate)/.test(lower)) {
            replyText = `Sertifikat akan diberikan setelah Anda menyelesaikan semua level dan tugas dalam kursus ini. Semangat ya!`;
        } else if(/(kamu udah makan)/.test(lower)) {
            replyText = `udah sayang 😘, kamu udah?`;
        } else if(/(ngantuk|lelah)/.test(lower)) {
            replyText = `jangan lupa istirahat yang cukup ya! kesehatan itu penting. 😊`;
        } else {
            const fallbacks = [
                `Terima kasih! Saya akan melihat dan kembali secepatnya.`,
                `Bisa kasih sedikit detail tambahan supaya saya bisa bantu lebih spesifik?`,
                `Coba sebutkan kata kunci atau topik yang ingin dijelaskan.`,
                `Mungkin materi di Level 2 atau 3 relevan; mau saya tunjukkan?`
                `oke sayang, aku usahain bantu semampuku 😊`,
            ];
            replyText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }

        const autoReply = {
            id: Date.now() + 1,
            sender: 'instructor',
            text: replyText,
            timestamp: new Date().toISOString()
        };

        messages.push(autoReply);
        localStorage.setItem(chatKey, JSON.stringify(messages));

        // Add reply to UI
        const replyTime = formatTime(autoReply.timestamp);
        messagesArea.innerHTML += `
            <div class="message-bubble instructor-message-bubble">
                <div class="message-text">${autoReply.text}</div>
                <span class="message-time">${replyTime}</span>
            </div>
        `;

        messagesArea.scrollTop = messagesArea.scrollHeight;
    }, 900 + Math.floor(Math.random() * 1400));
}

function sendQuickQuestion(question) {
    document.getElementById('chatInput').value = question;
    sendChatMessageWidget();
}

function showChatWidget() {
    const widget = document.getElementById('chatWidget');
    widget.style.display = 'flex';
    widget.classList.remove('minimized');
    isChatMinimized = false;
    
    // Focus input
    setTimeout(() => {
        document.getElementById('chatInput').focus();
    }, 300);
}

function toggleChatMinimize(e) {
    if (e) e.stopPropagation();
    
    const widget = document.getElementById('chatWidget');
    isChatMinimized = !isChatMinimized;
    
    if (isChatMinimized) {
        widget.classList.add('minimized');
        widget.innerHTML = `
            <div class="chat-minimized" onclick="toggleChatMinimize(event)">
                <div class="chat-minimized-avatar" id="chatMinimizedAvatar">👨‍🏫</div>
                <div class="chat-minimized-text">
                    <h4>Chat dengan Instruktur</h4>
                    <p>Klik untuk membuka</p>
                </div>
                <button class="chat-control-btn" onclick="closeChatWidget(event)">×</button>
            </div>
        `;
        
        // Update avatar
        const course = coursesData.find(c => c.id === currentChatCourseId);
        if (course) {
            document.getElementById('chatMinimizedAvatar').textContent = getUserAvatar(course.instructor.name);
        }
    } else {
        renderChatWidget();
        widget.classList.remove('minimized');
        showChatWidget();
    }
}

function closeChatWidget(e) {
    if (e) e.stopPropagation();
    
    const widget = document.getElementById('chatWidget');
    if (widget) {
        widget.remove();
    }
}

function openChatFromFloatingBtn() {
    if (currentUser && enrolledCourses[currentUser.email] && enrolledCourses[currentUser.email].length > 0) {
        // Buka chat untuk kursus pertama yang di-enroll
        openCourseChat(enrolledCourses[currentUser.email][0]);
    } else {
        alert('Silakan daftar kursus terlebih dahulu untuk mengakses chat dengan instruktur');
        showView('courses');
    }
}

// Periksa notifikasi chat
function checkChatNotifications() {
    if (!currentUser) return;
    
    let unreadCount = 0;
    const userCourses = enrolledCourses[currentUser.email] || [];
    
    userCourses.forEach(courseId => {
        const chatKey = `chat_${currentUser.email}_${courseId}`;
        const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
        
        messages.forEach(msg => {
            if (msg.sender === 'instructor' && !msg.read) {
                unreadCount++;
            }
        });
    });
    
    const badge = document.getElementById('chatNotification');
    if (unreadCount > 0) {
        badge.style.display = 'flex';
        badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
    } else {
        badge.style.display = 'none';
    }
}

// Jalankan pemeriksaan notifikasi setiap 30 detik
setInterval(checkChatNotifications, 30000);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeProfileSystem();
});

function initializeProfileSystem() {
    // Load user data
    currentUser = JSON.parse(localStorage.getItem('designlearnUser'));
    enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || {};
    
    // Initialize UI
    updateAuthUI();
    
    // Navigation listeners
    document.getElementById('loginBtn')?.addEventListener('click', openAuthModal);
    document.getElementById('menuToggle')?.addEventListener('click', toggleMenu);
    document.getElementById('userProfileBtn')?.addEventListener('click', toggleUserMenu);
    
    // Dropdown menu listeners
    document.querySelectorAll('.dropdown-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleDropdownAction(action);
        });
    });
    
    // Auth form handlers
    document.getElementById('signinForm')?.addEventListener('submit', handleSignin);
    document.getElementById('signupForm')?.addEventListener('submit', handleSignup);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const userMenu = document.getElementById('userMenuContainer');
        if (userMenu && !userMenu.contains(e.target)) {
            closeUserDropdownMenu();
        }
    });
    
    // Initialize projects data structure if not exists
    initializeProjectsData();
}

function initializeProjectsData() {
    if (!currentUser) return;
    
    const projectKey = `projects_${currentUser.email}`;
    if (!localStorage.getItem(projectKey)) {
        localStorage.setItem(projectKey, JSON.stringify([]));
    }
}

// ==================== PROFILE SYSTEM ====================
function openUserProfile() {
    if (!currentUser) {
        alert('Silakan login terlebih dahulu');
        openAuthModal();
        return;
    }
    
    // Create profile modal if not exists
    if (!document.getElementById('profileModal')) {
        createProfileModal();
    }
    
    renderProfileContent();
    document.getElementById('profileModal').style.display = 'flex';
}

function createProfileModal() {
    const modalHTML = `
        <div class="modal" id="profileModal" style="display: none;">
            <div class="modal-overlay" onclick="closeProfileModal()"></div>
            <div class="modal-panel profile-modal-panel">
                <button class="modal-close" onclick="closeProfileModal()">✕</button>
                <div id="profileContent"></div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal.firstElementChild);
}

function renderProfileContent() {
    const content = document.getElementById('profileContent');
    if (!content) return;
    
    const userStats = getUserStats();
    const userProjects = JSON.parse(localStorage.getItem(`projects_${currentUser.email}`)) || [];
    
    // Ensure certificates exist for any already-completed courses (retroactive generation)
    (userStats.enrolledCourses || []).forEach(cid => checkCourseCompletion(cid));
    
    let html = `
        <div class="profile-container">
            <div class="profile-header">
                <div class="profile-avatar">${getUserAvatar(currentUser.name)}</div>
                <div class="profile-info">
                    <h2>${currentUser.name}</h2>
                    <p class="profile-email">📧 ${currentUser.email}</p>
                    ${currentUser.bio ? `<p class="profile-bio">${currentUser.bio}</p>` : ''}
                    <div class="profile-stats">
                        <div class="stat-item">
                            <span class="stat-number">${userStats.coursesCompleted}</span>
                            <span class="stat-label">Kursus Selesai</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${userStats.projectsCount}</span>
                            <span class="stat-label">Proyek</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${userStats.certificatesCount}</span>
                            <span class="stat-label">Sertifikat</span>
                        </div>
                    </div>
                </div>
                <button class="btn btn-secondary" onclick="openEditProfile()">✏️ Edit Profil</button>
            </div>
            
            <div class="profile-tabs">
                <button class="tab-btn ${currentProfileTab === 'projects' ? 'active' : ''}" onclick="switchProfileTab('projects')">🎨 Proyek Saya</button>
                <button class="tab-btn ${currentProfileTab === 'courses' ? 'active' : ''}" onclick="switchProfileTab('courses')">📚 Kursus Saya</button>
                <button class="tab-btn ${currentProfileTab === 'certificates' ? 'active' : ''}" onclick="switchProfileTab('certificates')">🏆 Sertifikat</button>
            </div>
            
            <div class="profile-content">
                ${renderProfileTabContent(currentProfileTab, userProjects, userStats)}
            </div>
        </div>
    `;
    
    content.innerHTML = html;
}

function renderProfileTabContent(tabName, userProjects, userStats) {
    switch(tabName) {
        case 'projects':
            return renderProjectsTab(userProjects);
        case 'courses':
            return renderCoursesTab(userStats);
        case 'certificates':
            return renderCertificatesTab(userStats);
        default:
            return '';
    }
}

function renderProjectsTab(userProjects) {
    if (userProjects.length === 0) {
        return `
            <div class="empty-tab-content" id="projectsTab">
                <div class="empty-state">
                    <div class="empty-icon">🎨</div>
                    <h3>Belum Ada Proyek</h3>
                    <p>Mulai buat proyek pertama Anda untuk membangun portfolio design!</p>
                    <button class="btn btn-primary" onclick="openAddProjectModal()">+ Buat Proyek Baru</button>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="tab-content active" id="projectsTab">
            <button class="btn btn-primary add-project-btn" onclick="openAddProjectModal()" style="margin-bottom: 1.5rem;">
                + Tambah Proyek Baru
            </button>
            <div class="projects-grid">
                ${userProjects.map(project => `
                    <div class="project-card" data-project-id="${project.id}">
                        <img src="${project.image || 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&h=300&fit=crop'}" 
                             alt="${project.title}" class="project-image">
                        <div class="project-info">
                            <h4>${project.title}</h4>
                            <p class="project-description">${project.description ? project.description.substring(0, 100) + '...' : 'Tidak ada deskripsi'}</p>
                            <div class="project-meta">
                                <span class="project-course">${project.courseTitle || 'Tidak ada kursus'}</span>
                                <span class="project-date">${formatDate(project.date)}</span>
                            </div>
                            <div class="project-tags">
                                ${(project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                            <div class="project-stats">
                                <span class="project-stat">❤️ ${project.likes || 0}</span>
                                <span class="project-stat">💬 ${project.comments?.length || 0}</span>
                            </div>
                            <div class="project-actions">
                                <button class="btn btn-small" onclick="viewProjectDetail(${project.id})">👁️ Detail</button>
                                <button class="btn btn-small" onclick="editProject(${project.id})">✏️ Edit</button>
                                <button class="btn btn-small btn-danger" onclick="deleteProject(${project.id})">🗑️ Hapus</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderCoursesTab(userStats) {
    const userCourses = userStats.enrolledCourses || [];
    
    if (userCourses.length === 0) {
        return `
            <div class="empty-tab-content" id="coursesTab">
                <div class="empty-courses">
                    <div class="empty-courses-icon">📚</div>
                    <h3>Belum Ada Kursus</h3>
                    <p>Mulai perjalanan belajar design Anda dengan mendaftar kursus pertama!</p>
                    <button class="btn-explore-courses" onclick="showView('courses')">
                        Jelajahi Kursus
                    </button>
                </div>
            </div>
        `;
    }
    
    let html = '<div class="enrolled-courses-list">';
    
    
    userCourses.forEach(courseId => {
        const course = coursesData.find(c => c.id === courseId);
        if (!course) return;
        
        const progress = getCourseProgress(courseId);
        const isCompleted = progress === 100;
        
        // Hitung statistik tambahan
        const progressData = getProgressForCourse(courseId);
        const totalLevels = course.levels.length;
        const completedLevels = course.levels.filter(l => progressData[l.levelNumber]?.completed).length;
        const completedQuizzes = course.levels.filter(l => progressData[l.levelNumber]?.quiz).length;
        const completedCaseStudies = course.levels.filter(l => progressData[l.levelNumber]?.caseStudy).length;
        
        // Hitung waktu belajar estimasi
        const totalDuration = course.levels.reduce((total, level) => {
            const hours = parseInt(level.duration) || 0;
            return total + hours;
        }, 0);
        
        html += `
            <div class="enrolled-course-card" data-course-id="${courseId}">
                <img src="${course.image}" alt="${course.title}" class="course-thumbnail">
                <div class="course-details">
                    <h4>${course.title}</h4>
                    <span class="course-category">${course.category}</span>
                    
                    <div class="course-progress">
                        <div class="progress-header">
                            <span class="progress-label">Progress Belajar</span>
                            <span class="progress-percent">${progress}%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="progress-text">
                            <span>${completedLevels}/${totalLevels} Level</span>
                            <span>${isCompleted ? '🎉 Selesai!' : 'Dalam Progress'}</span>
                        </div>
                        
                        <div class="progress-stats">
                            <div class="stat-item-mini">
                                <span class="stat-number-mini">${completedQuizzes}</span>
                                <span class="stat-label-mini">Quiz</span>
                            </div>
                            <div class="stat-item-mini">
                                <span class="stat-number-mini">${completedCaseStudies}</span>
                                <span class="stat-label-mini">Case Study</span>
                            </div>
                            <div class="stat-item-mini">
                                <span class="stat-number-mini">${totalDuration}h</span>
                                <span class="stat-label-mini">Total Jam</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="course-meta-info">
                        <span class="meta-item level">
                            ${course.level}
                        </span>
                        <span class="meta-item duration">
                            ${totalLevels} Level
                        </span>
                        <span class="meta-item rating">
                            ${course.rating}/5.0
                        </span>
                    </div>
                </div>
                <div class="course-actions">
                    ${isCompleted ? 
                        `<span class="completed-badge">Lengkap!</span>` : 
                        `<button class="btn-continue" onclick="openCourseDetail(${courseId})">
                            Lanjutkan Belajar
                        </button>`
                    }
                    <button class="btn-chat-instructor" onclick="openCourseChat(${courseId})">
                        💬 Chat Instruktur
                    </button>

                </div> 
            </div>
        `;
    });
    
    html += '</div>';
    
    return `<div class="tab-content active" id="coursesTab">${html}</div>`;
}

function renderCertificatesTab(userStats) {
    const certificates = getCertificatesForUser(currentUser?.email);
    if (!certificates || certificates.length === 0) {
        return `
            <div class="empty-tab-content" id="certificatesTab">
                <div class="empty-state">
                    <div class="empty-icon">🏆</div>
                    <h3>Belum Ada Sertifikat</h3>
                    <p>Selesaikan kursus untuk mendapatkan sertifikat!</p>
                </div>
            </div>
        `;
    }
    
    let html = `
        <div class="tab-content active" id="certificatesTab">
            <div class="certificates-grid">
    `;

    certificates.forEach(cert => {
        const course = coursesData.find(c => c.id === cert.courseId) || {};
        html += `
            <div class="certificate-card">
                <div class="certificate-header">
                    <div class="certificate-icon">🏆</div>
                    <h4>Sertifikat Kelulusan</h4>
                </div>
                <div class="certificate-body">
                    <h5>${course.title || cert.courseTitle}</h5>
                    <p>Diberikan kepada:</p>
                    <h3>${cert.userName}</h3>
                    <p>atas keberhasilannya menyelesaikan kursus</p>
                    <div class="certificate-date">${formatDate(cert.date)}</div>
                </div>
                <div class="certificate-actions">
                    <button class="btn btn-secondary" onclick="downloadCertificate('${cert.id}')">📥 Download</button>
                    <button class="btn btn-primary" onclick="shareCertificate('${cert.id}')">📤 Share</button>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;
    
    return html;
} 

function switchProfileTab(tabName) {
    currentProfileTab = tabName;
    renderProfileContent();
}

// ==================== PROJECT MANAGEMENT ====================
function openAddProjectModal() {
    const userCourses = enrolledCourses[currentUser.email] || [];
    if (userCourses.length === 0) {
        alert('Anda belum terdaftar di kursus apapun. Silakan daftar kursus terlebih dahulu.');
        return;
    }
    
    const modalHTML = `
        <div class="add-project-modal">
            <h3>➕ Tambah Proyek Baru</h3>
            <form id="addProjectForm">
                <div class="form-group">
                    <label for="projectTitle">Judul Proyek *</label>
                    <input type="text" id="projectTitle" required placeholder="Contoh: Redesign UI Website E-commerce">
                </div>
                <div class="form-group">
                    <label for="projectDescription">Deskripsi *</label>
                    <textarea id="projectDescription" rows="4" required placeholder="Deskripsikan proyek Anda..."></textarea>
                </div>
                <div class="form-group">
                    <label for="projectCourse">Kursus Terkait *</label>
                    <select id="projectCourse" required>
                        <option value="">Pilih kursus</option>
                        ${userCourses.map(courseId => {
                            const course = coursesData.find(c => c.id === courseId);
                            return course ? `<option value="${courseId}">${course.title}</option>` : '';
                        }).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="projectTags">Tags (pisahkan dengan koma)</label>
                    <input type="text" id="projectTags" placeholder="UI Design, Mobile App, Branding">
                </div>
                <div class="form-group">
                    <label for="projectImage">URL Gambar (opsional)</label>
                    <input type="url" id="projectImage" placeholder="https://images.unsplash.com/photo-...">
                </div>
                <div class="form-group">
                    <label for="projectLink">Link Proyek (opsional)</label>
                    <input type="url" id="projectLink" placeholder="https://behance.net/...">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeCurrentModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan Proyek</button>
                </div>
            </form>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeCurrentModal()"></div>
        <div class="modal-panel">${modalHTML}</div>
    `;
    document.body.appendChild(modal);
    
    // Add form submission handler
    modal.querySelector('#addProjectForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveNewProject();
    });
}

function saveNewProject() {
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const courseId = parseInt(document.getElementById('projectCourse').value);
    const tags = document.getElementById('projectTags').value.split(',').map(t => t.trim()).filter(t => t);
    const image = document.getElementById('projectImage').value.trim();
    const link = document.getElementById('projectLink').value.trim();
    
    // Validation
    if (!title || !description || !courseId) {
        alert('Harap isi semua field yang wajib diisi (judul, deskripsi, dan kursus terkait)');
        return;
    }
    
    const course = coursesData.find(c => c.id === courseId);
    if (!course) {
        alert('Kursus tidak ditemukan');
        return;
    }
    
    const project = {
        id: Date.now(),
        title,
        description,
        courseId,
        courseTitle: course.title,
        tags: tags.length > 0 ? tags : [course.category],
        image: image || course.image,
        link: link || null,
        date: new Date().toISOString(),
        likes: 0,
        comments: [],
        views: 0
    };
    
    // Save to localStorage
    const projectKey = `projects_${currentUser.email}`;
    const projects = JSON.parse(localStorage.getItem(projectKey)) || [];
    projects.push(project);
    localStorage.setItem(projectKey, JSON.stringify(projects));
    
    // Close modal and refresh profile
    closeCurrentModal();
    renderProfileContent();
    
    alert('✅ Proyek berhasil ditambahkan ke portfolio!');
}

function viewProjectDetail(projectId) {
    const projects = JSON.parse(localStorage.getItem(`projects_${currentUser.email}`)) || [];
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
        alert('Proyek tidak ditemukan');
        return;
    }
    
    // Increment views
    project.views = (project.views || 0) + 1;
    localStorage.setItem(`projects_${currentUser.email}`, JSON.stringify(projects));
    
    const modalHTML = `
        <div class="project-detail-modal">
            <div class="project-detail-header">
                <img src="${project.image}" alt="${project.title}" class="project-detail-image">
                <div class="project-detail-info">
                    <h3>${project.title}</h3>
                    <p class="project-course">${project.courseTitle}</p>
                    <div class="project-meta">
                        <span class="project-date">📅 ${formatDate(project.date)}</span>
                        ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">🔗 Lihat Proyek Lengkap</a>` : ''}
                    </div>
                </div>
            </div>
            <div class="project-detail-body">
                <h4>📝 Deskripsi</h4>
                <p class="project-description-full">${project.description}</p>
                
                ${project.tags && project.tags.length > 0 ? `
                    <div class="project-tags">
                        <h4>🏷️ Tags</h4>
                        <div class="tags-list">
                            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="project-stats-detail">
                    <div class="stat">
                        <span class="stat-number">${project.likes || 0}</span>
                        <span class="stat-label">Likes</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${project.comments?.length || 0}</span>
                        <span class="stat-label">Komentar</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${project.views || 0}</span>
                        <span class="stat-label">Views</span>
                    </div>
                </div>
                
                ${project.comments && project.comments.length > 0 ? `
                    <div class="project-comments">
                        <h4>💬 Komentar</h4>
                        ${project.comments.map(comment => `
                            <div class="comment">
                                <div class="comment-author">${comment.author}</div>
                                <div class="comment-text">${comment.text}</div>
                                <div class="comment-date">${formatDate(comment.date)}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="project-detail-actions">
                <button class="btn btn-secondary" onclick="likeProject(${projectId})">❤️ Like (${project.likes || 0})</button>
                <button class="btn btn-primary" onclick="shareProject(${projectId})">📤 Share</button>
                <button class="btn" onclick="closeCurrentModal()">Tutup</button>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeCurrentModal()"></div>
        <div class="modal-panel">${modalHTML}</div>
    `;
    document.body.appendChild(modal);
}

function editProject(projectId) {
    const projects = JSON.parse(localStorage.getItem(`projects_${currentUser.email}`)) || [];
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
        alert('Proyek tidak ditemukan');
        return;
    }
    
    currentEditProjectId = projectId;
    isEditMode = true;
    
    const userCourses = enrolledCourses[currentUser.email] || [];
    
    const modalHTML = `
        <div class="edit-project-modal">
            <h3>✏️ Edit Proyek</h3>
            <form id="editProjectForm">
                <div class="form-group">
                    <label for="editProjectTitle">Judul Proyek *</label>
                    <input type="text" id="editProjectTitle" value="${project.title}" required>
                </div>
                <div class="form-group">
                    <label for="editProjectDescription">Deskripsi *</label>
                    <textarea id="editProjectDescription" rows="4" required>${project.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="editProjectCourse">Kursus Terkait *</label>
                    <select id="editProjectCourse" required>
                        ${userCourses.map(courseId => {
                            const course = coursesData.find(c => c.id === courseId);
                            const selected = courseId === project.courseId ? 'selected' : '';
                            return course ? `<option value="${courseId}" ${selected}>${course.title}</option>` : '';
                        }).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="editProjectTags">Tags (pisahkan dengan koma)</label>
                    <input type="text" id="editProjectTags" value="${project.tags?.join(', ') || ''}">
                </div>
                <div class="form-group">
                    <label for="editProjectImage">URL Gambar</label>
                    <input type="url" id="editProjectImage" value="${project.image || ''}">
                </div>
                <div class="form-group">
                    <label for="editProjectLink">Link Proyek</label>
                    <input type="url" id="editProjectLink" value="${project.link || ''}">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeCurrentModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
                </div>
            </form>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeCurrentModal()"></div>
        <div class="modal-panel">${modalHTML}</div>
    `;
    document.body.appendChild(modal);
    
    // Add form submission handler
    modal.querySelector('#editProjectForm').addEventListener('submit', (e) => {
        e.preventDefault();
        updateProject();
    });
}

function updateProject() {
    const title = document.getElementById('editProjectTitle').value.trim();
    const description = document.getElementById('editProjectDescription').value.trim();
    const courseId = parseInt(document.getElementById('editProjectCourse').value);
    const tags = document.getElementById('editProjectTags').value.split(',').map(t => t.trim()).filter(t => t);
    const image = document.getElementById('editProjectImage').value.trim();
    const link = document.getElementById('editProjectLink').value.trim();
    
    // Validation
    if (!title || !description || !courseId) {
        alert('Harap isi semua field yang wajib diisi');
        return;
    }
    
    const course = coursesData.find(c => c.id === courseId);
    if (!course) {
        alert('Kursus tidak ditemukan');
        return;
    }
    
    // Update project in localStorage
    const projectKey = `projects_${currentUser.email}`;
    const projects = JSON.parse(localStorage.getItem(projectKey)) || [];
    const projectIndex = projects.findIndex(p => p.id === currentEditProjectId);
    
    if (projectIndex === -1) {
        alert('Proyek tidak ditemukan');
        return;
    }
    
    // Keep existing stats
    const existingProject = projects[projectIndex];
    
    projects[projectIndex] = {
        ...existingProject,
        title,
        description,
        courseId,
        courseTitle: course.title,
        tags: tags.length > 0 ? tags : [course.category],
        image: image || course.image,
        link: link || null,
        updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(projectKey, JSON.stringify(projects));
    
    // Close modal and refresh profile
    closeCurrentModal();
    currentEditProjectId = null;
    isEditMode = false;
    renderProfileContent();
    
    alert('✅ Proyek berhasil diperbarui!');
}

function deleteProject(projectId) {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan.')) {
        return;
    }
    
    const projectKey = `projects_${currentUser.email}`;
    const projects = JSON.parse(localStorage.getItem(projectKey)) || [];
    const filteredProjects = projects.filter(p => p.id !== projectId);
    
    localStorage.setItem(projectKey, JSON.stringify(filteredProjects));
    renderProfileContent();
    
    alert('✅ Proyek berhasil dihapus!');
}

function likeProject(projectId) {
    const projectKey = `projects_${currentUser.email}`;
    const projects = JSON.parse(localStorage.getItem(projectKey)) || [];
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) return;
    
    if (!projects[projectIndex].likes) {
        projects[projectIndex].likes = 0;
    }
    
    projects[projectIndex].likes++;
    localStorage.setItem(projectKey, JSON.stringify(projects));
    
    // Update the displayed like count
    const likeBtn = document.querySelector(`[onclick="likeProject(${projectId})"]`);
    if (likeBtn) {
        likeBtn.textContent = `❤️ Like (${projects[projectIndex].likes})`;
    }
    
    alert('❤️ Terima kasih telah memberi like!');
}

function shareProject(projectId) {
    const projects = JSON.parse(localStorage.getItem(`projects_${currentUser.email}`)) || [];
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return;
    
    const shareText = `Lihat proyek design saya: "${project.title}"\n${project.description.substring(0, 100)}...\n\n#DesignLearn #Portfolio`;
    const shareUrl = project.link || window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: project.title,
            text: shareText,
            url: shareUrl
        }).then(() => {
            console.log('Proyek berhasil dibagikan');
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare(shareText, shareUrl);
        });
    } else {
        fallbackShare(shareText, shareUrl);
    }
}

function fallbackShare(shareText, shareUrl) {
    const shareModalHTML = `
        <div class="share-modal">
            <h3>📤 Bagikan Proyek</h3>
            <p>Salin link atau bagikan ke media sosial:</p>
            <div class="share-options">
                <button class="share-option" onclick="copyToClipboard('${shareUrl}')">
                    📋 Copy Link
                </button>
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}" 
                   target="_blank" class="share-option">
                    𝕏 Twitter
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" 
                   target="_blank" class="share-option">
                    📘 Facebook
                </a>
                <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}" 
                   target="_blank" class="share-option">
                    💼 LinkedIn
                </a>
            </div>
            <button class="btn btn-secondary" onclick="closeCurrentModal()">Tutup</button>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeCurrentModal()"></div>
        <div class="modal-panel">${shareModalHTML}</div>
    `;
    document.body.appendChild(modal);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Link berhasil disalin ke clipboard!');
        closeCurrentModal();
    }).catch(err => {
        console.error('Error copying text:', err);
        alert('Gagal menyalin link');
    });
}

// ==================== PROFILE EDITING ====================
function openEditProfile() {
    const modalHTML = `
        <div class="edit-profile-modal">
            <h3>✏️ Edit Profil</h3>
            <form id="editProfileForm">
                <div class="form-group">
                    <label for="editProfileName">Nama Lengkap *</label>
                    <input type="text" id="editProfileName" value="${currentUser.name}" required>
                </div>
                <div class="form-group">
                    <label for="editProfileEmail">Email</label>
                    <input type="email" id="editProfileEmail" value="${currentUser.email}" readonly>
                    <small class="text-muted">Email tidak dapat diubah</small>
                </div>
                <div class="form-group">
                    <label for="editProfileBio">Bio (opsional)</label>
                    <textarea id="editProfileBio" rows="3" placeholder="Ceritakan tentang diri Anda...">${currentUser.bio || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="editProfileAvatar">Avatar (emoji)</label>
                    <div class="avatar-options">
                        <button type="button" class="avatar-option" onclick="selectAvatar('👤')">👤</button>
                        <button type="button" class="avatar-option" onclick="selectAvatar('🎨')">🎨</button>
                        <button type="button" class="avatar-option" onclick="selectAvatar('👩‍💻')">👩‍💻</button>
                        <button type="button" class="avatar-option" onclick="selectAvatar('👨‍🎨')">👨‍🎨</button>
                        <button type="button" class="avatar-option" onclick="selectAvatar('🌟')">🌟</button>
                    </div>
                    <input type="text" id="editProfileAvatar" value="${currentUser.avatar || getUserAvatar(currentUser.name)}" maxlength="2" style="margin-top: 0.5rem;">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeCurrentModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
                </div>
            </form>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeCurrentModal()"></div>
        <div class="modal-panel">${modalHTML}</div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('#editProfileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        updateUserProfile();
    });
}

function selectAvatar(emoji) {
    document.getElementById('editProfileAvatar').value = emoji;
}

function updateUserProfile() {
    const newName = document.getElementById('editProfileName').value.trim();
    const newBio = document.getElementById('editProfileBio').value.trim();
    const newAvatar = document.getElementById('editProfileAvatar').value.trim();
    
    if (!newName) {
        alert('Nama tidak boleh kosong');
        return;
    }
    
    // Update current user
    currentUser.name = newName;
    currentUser.bio = newBio;
    currentUser.avatar = newAvatar || getUserAvatar(newName);
    
    // Update in localStorage
    localStorage.setItem('designlearnUser', JSON.stringify(currentUser));
    
    // Update all users data
    const allUsers = JSON.parse(localStorage.getItem('designlearnUsers')) || {};
    if (allUsers[currentUser.email]) {
        allUsers[currentUser.email].name = newName;
        allUsers[currentUser.email].bio = newBio;
        allUsers[currentUser.email].avatar = newAvatar;
        localStorage.setItem('designlearnUsers', JSON.stringify(allUsers));
    }
    
    // Update UI
    updateAuthUI();
    closeCurrentModal();
    renderProfileContent();
    
    alert('✅ Profil berhasil diperbarui!');
}

// ==================== UTILITY FUNCTIONS ====================
function getUserStats() {
    if (!currentUser) {
        return { 
            coursesCompleted: 0, 
            projectsCount: 0, 
            certificatesCount: 0, 
            enrolledCourses: [] 
        };
    }
    
    const userCourses = enrolledCourses[currentUser.email] || [];
    const projects = JSON.parse(localStorage.getItem(`projects_${currentUser.email}`)) || [];
    
    // Count completed courses (progress 100%)
    let coursesCompleted = 0;
    userCourses.forEach(courseId => {
        const progress = getCourseProgress(courseId);
        if (progress === 100) {
            coursesCompleted++;
        }
    });
    
    return {
        coursesCompleted,
        projectsCount: projects.length,
        certificatesCount: coursesCompleted,
        enrolledCourses: userCourses
    };
}

function getCourseProgress(courseId) {
    // Simplified progress calculation
    // In real app, you would calculate based on completed quizzes and case studies
    const progressKey = `progress_${currentUser.email}_${courseId}`;
    const progress = JSON.parse(localStorage.getItem(progressKey)) || {};
    
    // Count completed levels
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return 0;
    
    let completedLevels = 0;
    course.levels.forEach(level => {
        if (progress[level.levelNumber]?.completed) {
            completedLevels++;
        }
    });
    
    return Math.round((completedLevels / course.levels.length) * 100);
}

function getUserAvatar(name) {
    if (!name) return '👤';
    
    // Use custom avatar if set
    if (currentUser && currentUser.avatar) {
        return currentUser.avatar;
    }
    
    // Generate initials
    const initials = name.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    
    return initials || '👤';
}

function formatDate(isoString) {
    try {
        const date = new Date(isoString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Hari ini';
        } else if (diffDays === 1) {
            return 'Kemarin';
        } else if (diffDays < 7) {
            return `${diffDays} hari yang lalu`;
        } else {
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    } catch (e) {
        return 'Tanggal tidak valid';
    }
}

function downloadCertificate(courseIdOrCertId) {
    // If certificate id-like string -> download by id
    if (String(courseIdOrCertId).startsWith('cert_')) {
        return downloadCertificateById(courseIdOrCertId);
    }

    // Otherwise assume it's a numeric courseId and try to find/create cert then download
    const courseId = parseInt(courseIdOrCertId);
    if (!currentUser) return alert('Silakan login untuk mengunduh sertifikat');
    const certs = getCertificatesForUser(currentUser.email);
    let cert = certs.find(c => c.courseId === courseId);
    if (!cert) {
        // If course is completed, create certificate immediately
        const progress = getCourseProgress(courseId);
        if (progress === 100) {
            cert = createCertificateForCourse(courseId);
        } else {
            return alert('Sertifikat belum tersedia. Selesaikan kursus terlebih dahulu.');
        }
    }
    return downloadCertificateById(cert.id);
}

function shareCertificate(courseIdOrCertId) {
    if (String(courseIdOrCertId).startsWith('cert_')) {
        return shareCertificateById(courseIdOrCertId);
    }
    const courseId = parseInt(courseIdOrCertId);
    const certs = getCertificatesForUser(currentUser.email);
    let cert = certs.find(c => c.courseId === courseId);
    if (!cert) {
        const progress = getCourseProgress(courseId);
        if (progress === 100) {
            cert = createCertificateForCourse(courseId);
        } else {
            return alert('Sertifikat belum tersedia. Selesaikan kursus terlebih dahulu.');
        }
    }
    return shareCertificateById(cert.id);
}

function closeCurrentModal() {
    const modal = document.querySelector('.modal:not(#profileModal):not(#authModal)');
    if (modal) {
        modal.remove();
    }
    currentEditProjectId = null;
    isEditMode = false;
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentProfileTab = 'projects';
}

// ==================== AUTH FUNCTIONS ====================
function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userMenuContainer = document.getElementById('userMenuContainer');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    if (currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userMenuContainer) userMenuContainer.style.display = 'block';
        if (userNameDisplay) userNameDisplay.textContent = currentUser.name.split(' ')[0];
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (userMenuContainer) userMenuContainer.style.display = 'none';
        closeUserDropdownMenu();
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
}

function closeUserDropdownMenu() {
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown) {
        dropdown.style.display = 'none';
    }
}

function handleDropdownAction(action) {
    closeUserDropdownMenu();
    
    switch(action) {
        case 'my-profile':
            openUserProfile();
            break;
        case 'my-projects':
            currentProfileTab = 'projects';
            openUserProfile();
            break;
        case 'logout':
            logout();
            break;
        case 'add-account':
            addNewAccount();
            break;
        case 'switch-account':
            switchAccount();
            break;
        case 'delete-account':
            deleteAccount();
            break;
        default:
            console.log('Action not handled:', action);
    }
}

// ==================== BASIC AUTH ====================
function openAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.style.display = 'flex';
    }
}

function handleSignin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Email dan password harus diisi');
        return;
    }
    
    // Check user
    const allUsers = JSON.parse(localStorage.getItem('designlearnUsers')) || {};
    const user = allUsers[email];
    
    if (!user || user.password !== password) {
        alert('Email atau password salah');
        return;
    }
    
    // Login successful
    currentUser = user;
    localStorage.setItem('designlearnUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeAuthModal();
    alert(`Selamat datang, ${user.name}!`);
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;
    
    // Validation
    if (!name || !email || !password) {
        alert('Semua field harus diisi');
        return;
    }
    
    if (password.length < 6) {
        alert('Password minimal 6 karakter');
        return;
    }
    
    // Check if user exists
    const allUsers = JSON.parse(localStorage.getItem('designlearnUsers')) || {};
    if (allUsers[email]) {
        alert('Email sudah terdaftar');
        return;
    }
    
    // Create new user
    const newUser = {
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    
    allUsers[email] = newUser;
    localStorage.setItem('designlearnUsers', JSON.stringify(allUsers));
    
    // Auto login
    currentUser = newUser;
    localStorage.setItem('designlearnUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeAuthModal();
    
    alert(`Pendaftaran berhasil! Selamat datang, ${name}`);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('designlearnUser');
    updateAuthUI();
    alert('Anda telah logout');
}

function addNewAccount() {
    // Clear form and show signup
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('signinForm').style.display = 'none';
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    openAuthModal();
}

function switchAccount() {
    // Clear form and show signin
    document.getElementById('signinForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    openAuthModal();
}

function deleteAccount() {
    if (!currentUser) return;
    
    if (!confirm('⚠️ Apakah Anda yakin ingin menghapus akun ini?\n\nSEMUA data akan dihapus permanen!')) {
        return;
    }
    
    const userEmail = currentUser.email;
    
    // Remove from users list
    const allUsers = JSON.parse(localStorage.getItem('designlearnUsers')) || {};
    delete allUsers[userEmail];
    localStorage.setItem('designlearnUsers', JSON.stringify(allUsers));
    
    // Remove user data
    localStorage.removeItem('designlearnUser');
    
    // Remove user projects
    localStorage.removeItem(`projects_${userEmail}`);
    
    // Remove enrolled courses
    const enrolledCoursesData = JSON.parse(localStorage.getItem('enrolledCourses')) || {};
    delete enrolledCoursesData[userEmail];
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCoursesData));
    
    // Remove progress data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.includes(`progress_${userEmail}`)) {
            localStorage.removeItem(key);
        }
    });
    
    // Logout
    currentUser = null;
    updateAuthUI();
    
    alert('✅ Akun berhasil dihapus');
}

// Helper functions
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.style.display = 'none';
    }
}

// ==================== CHAT SELECTOR ====================
function openChatSelector() {
    if (!currentUser) {
        alert('Silakan login terlebih dahulu');
        openAuthModal();
        return;
    }
    
    const userCourses = enrolledCourses[currentUser.email] || [];
    
    if (userCourses.length === 0) {
        alert('Anda belum terdaftar di kursus apapun. Daftar kursus terlebih dahulu!');
        showView('courses');
        return;
    }
    
    const modalHTML = `
        <div class="chat-selector-modal">
            <h3>💬 Pilih Chat Instruktur</h3>
            <p class="chat-selector-subtitle">Pilih instruktur yang ingin diajak chat</p>
            
            <div class="chat-instructors-list">
                ${userCourses.map(courseId => {
                    const course = coursesData.find(c => c.id === courseId);
                    if (!course) return '';
                    
                    const chatKey = `chat_${currentUser.email}_${courseId}`;
                    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
                    const unread = messages.filter(m => m.sender === 'instructor' && !m.read).length;
                    const lastMessage = messages[messages.length - 1];
                    
                    return `
                        <div class="chat-instructor-item" onclick="openCourseChat(${courseId})">
                            <div class="instructor-chat-avatar">
                                ${getUserAvatar(course.instructor.name)}
                                ${unread > 0 ? `<span class="chat-unread-badge">${unread > 9 ? '9+' : unread}</span>` : ''}
                            </div>
                            <div class="instructor-chat-info">
                                <div class="instructor-chat-header">
                                    <h4>${course.instructor.name}</h4>
                                    ${lastMessage ? `<span class="last-message-time">${formatTime(lastMessage.timestamp)}</span>` : ''}
                                </div>
                                <p class="instructor-chat-course">Kursus: ${course.title}</p>
                                <p class="last-message-preview">
                                    ${lastMessage ? (lastMessage.text.length > 40 ? lastMessage.text.substring(0, 40) + '...' : lastMessage.text) : 'Belum ada pesan'}
                                </p>
                            </div>
                            ${unread > 0 ? '<div class="chat-indicator"></div>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
            
            <button class="btn btn-secondary" onclick="closeCurrentModal()">Batal</button>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeCurrentModal()"></div>
        <div class="modal-panel">${modalHTML}</div>
    `;
    document.body.appendChild(modal);
}

// Update fungsi openChatFromFloatingBtn:
function openChatFromFloatingBtn() {
    if (!currentUser) {
        alert('Silakan login terlebih dahulu');
        openAuthModal();
        return;
    }
    
    const userCourses = enrolledCourses[currentUser.email] || [];
    
    if (userCourses.length === 0) {
        alert('Silakan daftar kursus terlebih dahulu untuk mengakses chat dengan instruktur');
        showView('courses');
        return;
    } else if (userCourses.length === 1) {
        // Jika hanya 1 kursus, langsung buka chat
        openCourseChat(userCourses[0]);
    } else {
        // Jika lebih dari 1, tampilkan selector
        openChatSelector();
    }
}

// ==================== CHAT MANAGEMENT ====================
let currentChats = {};

function loadAllChats() {
    if (!currentUser) return {};
    
    const userCourses = enrolledCourses[currentUser.email] || [];
    const chats = {};
    
    userCourses.forEach(courseId => {
        const chatKey = `chat_${currentUser.email}_${courseId}`;
        chats[courseId] = JSON.parse(localStorage.getItem(chatKey)) || [];
    });
    
    return chats;
}

function markChatAsRead(courseId) {
    if (!currentUser) return;
    
    const chatKey = `chat_${currentUser.email}_${courseId}`;
    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    
    messages.forEach(msg => {
        if (msg.sender === 'instructor' && !msg.read) {
            msg.read = true;
        }
    });
    
    localStorage.setItem(chatKey, JSON.stringify(messages));
    updateChatNotification();
}

function updateChatNotification() {
    if (!currentUser) return;
    
    let totalUnread = 0;
    const userCourses = enrolledCourses[currentUser.email] || [];
    
    userCourses.forEach(courseId => {
        const chatKey = `chat_${currentUser.email}_${courseId}`;
        const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
        const unread = messages.filter(m => m.sender === 'instructor' && !m.read).length;
        totalUnread += unread;
    });
    
    const badge = document.getElementById('chatNotification');
    if (badge) {
        if (totalUnread > 0) {
            badge.style.display = 'flex';
            badge.textContent = totalUnread > 9 ? '9+' : totalUnread;
        } else {
            badge.style.display = 'none';
        }
    }
}

// Panggil updateChatNotification secara berkala
setInterval(updateChatNotification, 30000);


// ==================== PROGRESS HELPER FUNCTIONS ====================
function getDetailedProgress(courseId) {
    if (!currentUser) return {};
    
    const progress = getProgressForCourse(courseId);
    const course = coursesData.find(c => c.id === courseId);
    
    if (!course) return {};
    
    const totalLevels = course.levels.length;
    const completedLevels = course.levels.filter(l => progress[l.levelNumber]?.completed).length;
    const completedQuizzes = course.levels.filter(l => progress[l.levelNumber]?.quiz).length;
    const completedCaseStudies = course.levels.filter(l => progress[l.levelNumber]?.caseStudy).length;
    
    // Hitung estimasi waktu belajar yang sudah diselesaikan
    let completedHours = 0;
    course.levels.forEach(level => {
        if (progress[level.levelNumber]?.completed) {
            const hours = parseInt(level.duration) || 2; // default 2 jam jika tidak ada duration
            completedHours += hours;
        }
    });
    
    // Hitung total estimasi waktu
    let totalHours = 0;
    course.levels.forEach(level => {
        const hours = parseInt(level.duration) || 2;
        totalHours += hours;
    });
    
    return {
        totalLevels,
        completedLevels,
        completedQuizzes,
        completedCaseStudies,
        completedHours,
        totalHours,
        percentage: Math.round((completedLevels / totalLevels) * 100)
    };
}

// Update fungsi getCourseProgress untuk lebih akurat
function getCourseProgress(courseId) {
    const details = getDetailedProgress(courseId);
    return details.percentage || 0;
}

// Fungsi untuk mendapatkan progress dalam format yang lebih detail
function formatProgressDetails(courseId) {
    const details = getDetailedProgress(courseId);
    
    return {
        progressBar: details.percentage,
        stats: {
            levels: `${details.completedLevels}/${details.totalLevels}`,
            quizzes: details.completedQuizzes,
            caseStudies: details.completedCaseStudies,
            hours: `${details.completedHours}/${details.totalHours} jam`
        },
        isCompleted: details.percentage === 100
    };
}
