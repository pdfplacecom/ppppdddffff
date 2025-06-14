
// Enhanced PDF storage with all new features
let pdfStorage = [];
let downloadHistory = [];
let commentsStorage = [];
let isLoggedIn = false;
let currentUser = '';
let isAdmin = false;
let currentTheme = 'light';

// Admin users list
const adminUsers = ['admin', 'ayush', 'AYUSH KUMAR', 'administrator', 'ak763145918@gmail.com'];

// Initialize storage and theme
function initializeStorage() {
    try {
        const stored = localStorage.getItem('pdfStorage');
        if (stored) pdfStorage = JSON.parse(stored);
        
        const downloads = localStorage.getItem('downloadHistory');
        if (downloads) downloadHistory = JSON.parse(downloads);
        
        const comments = localStorage.getItem('commentsStorage');
        if (comments) commentsStorage = JSON.parse(comments);
        
        const theme = localStorage.getItem('theme') || 'light';
        setTheme(theme);
        
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            currentUser = user.username;
            isAdmin = user.isAdmin || false;
            isLoggedIn = true;
            showMainApp();
        }
        
        updateStorageUsage();
    } catch (error) {
        console.error('Error loading storage:', error);
        pdfStorage = [];
        downloadHistory = [];
        commentsStorage = [];
    }
}

// Theme Management
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// Welcome popup functions
function showWelcomePopup() {
    if (!localStorage.getItem('welcomeShown') || !isLoggedIn) {
        document.getElementById('welcomePopup').style.display = 'flex';
        if (isLoggedIn) localStorage.setItem('welcomeShown', 'true');
    }
}

function closeWelcomePopup() {
    document.getElementById('welcomePopup').style.display = 'none';
}

// Enhanced Login functions
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        showStatus('Please enter both email and password', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
        showStatus('Please enter a valid email address', 'error');
        return;
    }
    
    // Check specific admin credentials
    if (username === 'ak763145918@gmail.com' && password === '76730') {
        currentUser = username;
        isLoggedIn = true;
        isAdmin = true;
        showStatus('Admin login successful!', 'success');
    } else {
        // Demo login for other users
        currentUser = username;
        isLoggedIn = true;
        isAdmin = false; // Only the specific admin account gets admin privileges
        showStatus('Login successful!', 'success');
    }
    
    localStorage.setItem('userData', JSON.stringify({
        username: currentUser,
        loginTime: new Date().toISOString(),
        isAdmin: isAdmin
    }));
    
    setTimeout(() => {
        showMainApp();
        showWelcomePopup();
    }, 1000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userData');
        localStorage.removeItem('welcomeShown');
        isLoggedIn = false;
        currentUser = '';
        isAdmin = false;
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
}

// Password visibility toggle
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}

// Forgot password functionality
function showForgotPassword() {
    document.getElementById('forgotPasswordModal').style.display = 'flex';
}

function closeForgotPassword() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
    document.getElementById('resetEmail').value = '';
}

function sendPasswordReset() {
    const email = document.getElementById('resetEmail').value.trim();
    
    if (!email) {
        showStatus('Please enter your email address', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate sending reset email
    showStatus('Password reset instructions sent to your email!', 'success');
    setTimeout(() => {
        closeForgotPassword();
    }, 2000);
}

function showMainApp() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    const userLabel = isAdmin ? `${currentUser} (Admin)` : currentUser;
    document.getElementById('currentUser').textContent = `Welcome, ${userLabel}!`;
    
    // Show upload section only for admin users
    const uploadSection = document.getElementById('uploadSection');
    if (uploadSection) {
        uploadSection.style.display = isAdmin ? 'block' : 'none';
        console.log('Admin status:', isAdmin, 'Upload section display:', uploadSection.style.display);
    }
    
    // Update comments tab for admin
    const commentsTab = document.querySelector('[onclick="showTab(\'comments\')"]');
    const commentsTitle = document.getElementById('commentsTitle');
    const commentForm = document.getElementById('commentForm');
    const commentsDisplayTitle = document.getElementById('commentsDisplayTitle');
    
    if (isAdmin) {
        commentsTab.textContent = '📥 User Feedback';
        commentsTitle.textContent = '📥 User Feedback Management';
        commentForm.style.display = 'none';
        commentsDisplayTitle.textContent = '📋 All User Feedback';
    } else {
        commentsTab.textContent = '💬 Feedback';
        commentsTitle.textContent = '💬 Share Your Feedback';
        commentForm.style.display = 'block';
        commentsDisplayTitle.textContent = '📋 Recent Feedback';
    }
    
    loadPDFs();
    loadDownloadHistory();
    loadComments();
    initializeLogo();
}

// Tab Management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
    // Load tab-specific content
    if (tabName === 'downloads') {
        loadDownloadHistory();
    } else if (tabName === 'comments') {
        loadComments();
    }
}

// Enhanced file upload
function uploadPDF() {
    console.log('Upload function called, isAdmin:', isAdmin);
    
    if (!isAdmin) {
        showStatus('Only admin users can upload files', 'error');
        return;
    }
    
    const fileInput = document.getElementById('pdfFile');
    const statusDiv = document.getElementById('uploadStatus');
    const categorySelect = document.getElementById('categorySelect');
    const file = fileInput.files[0];
    
    if (!file) {
        showStatus('Please select a PDF file', 'error');
        return;
    }
    
    if (file.type !== 'application/pdf') {
        showStatus('Please select a valid PDF file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showStatus('File too large. Please select a PDF smaller than 5MB.', 'error');
        return;
    }
    
    // Check storage before proceeding
    const currentStorage = JSON.stringify(pdfStorage);
    const availableSpace = 4500000 - new Blob([currentStorage]).size;
    
    if (file.size > availableSpace) {
        showStatus(`Not enough storage space. Available: ${formatFileSize(availableSpace)}, Required: ${formatFileSize(file.size)}`, 'error');
        return;
    }
    
    showStatus('Uploading PDF...', 'loading');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const pdfData = {
                id: Date.now().toString(),
                name: file.name,
                size: file.size,
                category: categorySelect.value,
                data: e.target.result,
                uploadDate: new Date().toISOString(),
                uploadedBy: currentUser
            };
            
            const updatedStorage = [...pdfStorage, pdfData];
            const storageString = JSON.stringify(updatedStorage);
            
            if (storageString.length > 4500000) {
                showStatus('Storage limit reached. Please delete some files first.', 'error');
                return;
            }
            
            localStorage.setItem('pdfStorage', storageString);
            pdfStorage = updatedStorage;
            
            showStatus(`PDF "${file.name}" uploaded successfully!`, 'success');
            fileInput.value = '';
            loadPDFs();
            updateStorageUsage();
            
            const logo = document.getElementById('logo');
            logo.click();
            
        } catch (error) {
            console.error('Upload error:', error);
            if (error.name === 'QuotaExceededError') {
                showStatus('Storage quota exceeded. Please delete some files first.', 'error');
            } else {
                showStatus('Error uploading file. Please try again.', 'error');
            }
        }
    };
    
    reader.onerror = function() {
        showStatus('Error reading file', 'error');
    };
    
    reader.readAsDataURL(file);
}

// Search and filter functionality
function searchPDFs() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    let filteredPDFs = pdfStorage.filter(pdf => {
        const matchesSearch = pdf.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || pdf.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    displayPDFs(filteredPDFs);
}

function filterByCategory() {
    searchPDFs();
}

// Enhanced PDF display
function loadPDFs() {
    displayPDFs(pdfStorage);
    updateStorageUsage();
}

function displayPDFs(pdfs) {
    const pdfList = document.getElementById('pdfList');
    
    if (pdfs.length === 0) {
        pdfList.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">📂 No PDFs found. Upload some documents to get started!</div>';
        return;
    }
    
    pdfList.innerHTML = pdfs.map(pdf => {
        const deleteButton = isAdmin ? `<button class="secondary-btn" onclick="deletePDF('${pdf.id}')">🗑️ Delete</button>` : '';
        const categoryIcons = {
            'mocktest': '📝',
            'ncert': '📚',
            'pyqs': '📄',
            'pw-notes': '📖',
            'kgs-notes': '📓',
            'others': '📁'
        };
        
        return `
            <div class="pdf-item" data-category="${pdf.category}">
                <div class="pdf-info">
                    <div class="pdf-name">${categoryIcons[pdf.category] || '📁'} ${pdf.name}</div>
                    <div class="pdf-size">${formatFileSize(pdf.size)} • ${formatDate(pdf.uploadDate)}</div>
                    <div class="pdf-category ${pdf.category}">${pdf.category.replace('-', ' ').toUpperCase()}</div>
                </div>
                <div class="pdf-actions">
                    <button class="primary-btn" onclick="previewPDF('${pdf.id}')">👁️ Preview</button>
                    <button class="success-btn" onclick="downloadPDF('${pdf.id}')">📥 Download</button>
                    ${deleteButton}
                </div>
            </div>
        `;
    }).join('');
}

// Download functionality with history tracking
function downloadPDF(id) {
    const pdf = pdfStorage.find(p => p.id === id);
    if (!pdf) {
        showStatus('PDF not found', 'error');
        return;
    }
    
    try {
        const link = document.createElement('a');
        link.href = pdf.data;
        link.download = pdf.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Add to download history
        const downloadRecord = {
            id: Date.now().toString(),
            pdfId: pdf.id,
            name: pdf.name,
            category: pdf.category,
            downloadDate: new Date().toISOString(),
            downloadedBy: currentUser
        };
        
        downloadHistory.unshift(downloadRecord);
        localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
        
        showStatus(`Downloaded "${pdf.name}"`, 'success');
        
    } catch (error) {
        showStatus('Error downloading file', 'error');
    }
}

// Download History Management
function loadDownloadHistory() {
    displayDownloads(downloadHistory);
}

function displayDownloads(downloads) {
    const downloadsList = document.getElementById('downloadsList');
    
    if (downloads.length === 0) {
        downloadsList.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">📥 No downloads yet. Download some PDFs to see them here!</div>';
        return;
    }
    
    downloadsList.innerHTML = downloads.map(download => `
        <div class="download-item">
            <div class="download-info">
                <div class="download-name">📄 ${download.name}</div>
                <div class="download-time">${formatDate(download.downloadDate)}</div>
            </div>
            <div class="download-actions">
                <button class="primary-btn" onclick="redownloadPDF('${download.pdfId}')">📥 Download Again</button>
            </div>
        </div>
    `).join('');
}

function redownloadPDF(pdfId) {
    downloadPDF(pdfId);
}

function filterDownloads() {
    const filter = document.getElementById('downloadsFilter').value;
    const now = new Date();
    let filteredDownloads = downloadHistory;
    
    if (filter === 'today') {
        filteredDownloads = downloadHistory.filter(d => {
            const downloadDate = new Date(d.downloadDate);
            return downloadDate.toDateString() === now.toDateString();
        });
    } else if (filter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredDownloads = downloadHistory.filter(d => new Date(d.downloadDate) >= weekAgo);
    } else if (filter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredDownloads = downloadHistory.filter(d => new Date(d.downloadDate) >= monthAgo);
    }
    
    displayDownloads(filteredDownloads);
}

function clearDownloadHistory() {
    if (confirm('Are you sure you want to clear your download history?')) {
        downloadHistory = [];
        localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
        loadDownloadHistory();
        showStatus('Download history cleared', 'success');
    }
}

// Comments System
function submitComment() {
    const commentText = document.getElementById('commentText').value.trim();
    const commentCategory = document.getElementById('commentCategory').value;
    
    if (!commentText) {
        showStatus('Please enter your feedback', 'error');
        return;
    }
    
    const comment = {
        id: Date.now().toString(),
        text: commentText,
        category: commentCategory,
        user: currentUser,
        date: new Date().toISOString(),
        isAdmin: isAdmin
    };
    
    commentsStorage.unshift(comment);
    localStorage.setItem('commentsStorage', JSON.stringify(commentsStorage));
    
    document.getElementById('commentText').value = '';
    showStatus('Feedback submitted successfully!', 'success');
    loadComments();
}

function loadComments() {
    displayComments(commentsStorage);
}

function displayComments(comments) {
    const commentsList = document.getElementById('commentsList');
    
    // Filter comments based on user role
    let displayComments = comments;
    if (!isAdmin) {
        // Regular users see only their own comments and a few recent ones
        displayComments = comments.filter(c => c.user === currentUser || comments.indexOf(c) < 5);
    }
    
    if (displayComments.length === 0) {
        commentsList.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">💬 No feedback yet. Be the first to share your thoughts!</div>';
        return;
    }
    
    commentsList.innerHTML = displayComments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <span class="comment-user">${comment.user} ${comment.isAdmin ? '(Admin)' : ''}</span>
                <span class="comment-category ${comment.category}">${comment.category}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
            <div class="comment-time">${formatDate(comment.date)}</div>
        </div>
    `).join('');
}

// Enhanced PDF preview
let currentPreviewPDF = null;

function previewPDF(id) {
    const pdf = pdfStorage.find(p => p.id === id);
    if (!pdf) {
        showStatus('PDF not found', 'error');
        return;
    }
    
    currentPreviewPDF = pdf;
    const modal = document.getElementById('previewModal');
    const previewFrame = document.getElementById('previewFrame');
    const previewTitle = document.getElementById('previewTitle');
    const previewLoading = document.getElementById('previewLoading');
    
    previewTitle.textContent = `Preview: ${pdf.name}`;
    
    if (previewLoading) {
        previewLoading.style.display = 'flex';
    }
    
    previewFrame.onload = function() {
        if (previewLoading) {
            previewLoading.style.display = 'none';
        }
    };
    
    previewFrame.src = pdf.data;
    modal.style.display = 'flex';
}

function closePreview() {
    const modal = document.getElementById('previewModal');
    const previewFrame = document.getElementById('previewFrame');
    const previewLoading = document.getElementById('previewLoading');
    
    modal.style.display = 'none';
    previewFrame.src = '';
    currentPreviewPDF = null;
    
    if (previewLoading) {
        previewLoading.style.display = 'none';
    }
}

function downloadCurrentPDF() {
    if (currentPreviewPDF) {
        downloadPDF(currentPreviewPDF.id);
    }
}

function toggleFullscreen() {
    const modal = document.getElementById('previewModal');
    if (!document.fullscreenElement) {
        modal.requestFullscreen().catch(err => {
            showStatus('Fullscreen not supported', 'error');
        });
    } else {
        document.exitFullscreen();
    }
}

// Delete PDF function
function deletePDF(id) {
    const pdf = pdfStorage.find(p => p.id === id);
    if (!pdf) {
        showStatus('PDF not found', 'error');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete "${pdf.name}"?`)) {
        return;
    }
    
    try {
        pdfStorage = pdfStorage.filter(p => p.id !== id);
        localStorage.setItem('pdfStorage', JSON.stringify(pdfStorage));
        
        showStatus('PDF deleted successfully', 'success');
        loadPDFs();
        updateStorageUsage();
    } catch (error) {
        showStatus('Error deleting file', 'error');
    }
}

// Storage usage calculation
function updateStorageUsage() {
    try {
        const storageString = JSON.stringify(pdfStorage);
        const usedBytes = new Blob([storageString]).size;
        const maxBytes = 5000000;
        const usagePercent = Math.round((usedBytes / maxBytes) * 100);
        
        const storageElement = document.getElementById('storageUsage');
        if (storageElement) {
            storageElement.textContent = `Storage: ${usagePercent}% (${formatFileSize(usedBytes)})`;
            
            if (usagePercent > 80) {
                storageElement.style.color = 'var(--secondary-color)';
            } else if (usagePercent > 60) {
                storageElement.style.color = 'var(--warning-color)';
            } else {
                storageElement.style.color = 'var(--success-color)';
            }
        }
    } catch (error) {
        console.error('Error calculating storage usage:', error);
    }
}

// Status display
function showStatus(message, type) {
    const statusDiv = document.getElementById('uploadStatus');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = type;
        
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                statusDiv.textContent = '';
                statusDiv.className = '';
            }, 4000);
        }
    }
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Enhanced logo interactions
function initializeLogo() {
    const logo = document.getElementById('logo');
    const pdfPages = document.querySelectorAll('.pdf-page');
    
    if (!logo) return;
    
    logo.addEventListener('click', function() {
        this.style.animation = 'pulse 0.6s ease-in-out';
        
        setTimeout(() => {
            this.style.animation = '';
        }, 600);
        
        pdfPages.forEach((page, index) => {
            setTimeout(() => {
                page.style.transform = `translateY(-10px) rotate(${(index + 1) * 10}deg)`;
                setTimeout(() => {
                    page.style.transform = '';
                }, 300);
            }, index * 100);
        });
    });
}

// Event listeners
document.addEventListener('click', function(event) {
    const modal = document.getElementById('previewModal');
    const popup = document.getElementById('welcomePopup');
    const forgotModal = document.getElementById('forgotPasswordModal');
    
    if (event.target === modal) closePreview();
    if (event.target === popup) closeWelcomePopup();
    if (event.target === forgotModal) closeForgotPassword();
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePreview();
        closeWelcomePopup();
        closeForgotPassword();
    }
    
    if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeStorage();
    
    if (!isLoggedIn) {
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    } else {
        showMainApp();
        showWelcomePopup();
    }
});
