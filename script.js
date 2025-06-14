
// Global Variables
let currentUser = null;
let isAdmin = false;
let currentPreviewFile = null;
let isDarkTheme = false;
let samplePDFs = [
  {
    id: 1,
    filename: "NCERT Mathematics Class 12.pdf",
    category: "ncert",
    upload_date: "2024-01-15",
    size: 15728640,
    download_count: 245
  },
  {
    id: 2,
    filename: "JEE Main Physics PYQ 2023.pdf",
    category: "pyqs",
    upload_date: "2024-01-12",
    size: 8945632,
    download_count: 189
  },
  {
    id: 3,
    filename: "Chemistry Mock Test - Organic.pdf",
    category: "mocktest",
    upload_date: "2024-01-10",
    size: 5242880,
    download_count: 156
  }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeApp();
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to initialize application: ' + error.message);
    }
});

function initializeApp() {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = '☀️';
        }
        isDarkTheme = true;
    }
    
    // Load uploaded PDFs from localStorage
    const uploadedPDFs = localStorage.getItem('uploadedPDFs');
    if (uploadedPDFs) {
        try {
            const parsed = JSON.parse(uploadedPDFs);
            if (Array.isArray(parsed)) {
                samplePDFs.length = 0; // Clear existing
                samplePDFs.push(...parsed); // Add uploaded PDFs
            }
        } catch (error) {
            console.error('Error loading uploaded PDFs:', error);
        }
    }
    
    // Show welcome popup on first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
        showWelcomePopup();
        localStorage.setItem('hasVisited', 'true');
    } else {
        closeWelcomePopup();
    }
    
    // Check if user is already logged in
    checkLoginStatus();
}

function checkLoginStatus() {
    // Check if user was previously logged in
    const savedUser = localStorage.getItem('currentUser');
    const savedAdmin = localStorage.getItem('isAdmin');
    
    if (savedUser) {
        currentUser = savedUser;
        isAdmin = savedAdmin === 'true';
        showMainPage();
    } else {
        showMainPage();
    }
}

// Welcome Popup Functions
function showWelcomePopup() {
    const popup = document.getElementById('welcomePopup');
    if (popup) {
        popup.style.display = 'flex';
    }
}

function closeWelcomePopup() {
    const popup = document.getElementById('welcomePopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// Theme Toggle
function toggleTheme() {
    try {
        const body = document.body;
        const themeIcon = document.getElementById('themeIcon');
        
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
            isDarkTheme = false;
        } else {
            body.classList.add('dark-theme');
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
            isDarkTheme = true;
        }
    } catch (error) {
        console.error('Error toggling theme:', error);
    }
}

// Authentication Functions
function togglePasswordVisibility() {
    try {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.getElementById('passwordToggleIcon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            toggleIcon.textContent = '👁️';
        }
    } catch (error) {
        console.error('Error toggling password visibility:', error);
    }
}

function login(event) {
    if (event) {
        event.preventDefault();
    }
    
    try {
        showLoading(true);
        
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            showError('Please enter both email and password');
            showLoading(false);
            return;
        }
        
        // Simulate login delay
        setTimeout(() => {
            // Demo login logic
            currentUser = email;
            isAdmin = email === 'ak763145918@gmail.com' && password === '76730';
            
            // Save login state
            localStorage.setItem('currentUser', currentUser);
            localStorage.setItem('isAdmin', isAdmin.toString());
            
            showMainApp();
            showSuccess('Login successful!');
            showLoading(false);
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        showError('Login failed: ' + error.message);
        showLoading(false);
    }
}

function logout() {
    try {
        showLoading(true);
        
        setTimeout(() => {
            currentUser = null;
            isAdmin = false;
            
            // Clear login state
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isAdmin');
            
            showMainPage();
            showSuccess('Logged out successfully!');
            showLoading(false);
        }, 500);
        
    } catch (error) {
        console.error('Logout error:', error);
        showError('Logout failed: ' + error.message);
        showLoading(false);
    }
}

function showMainPage() {
    const loginSection = document.getElementById('loginSection');
    const mainApp = document.getElementById('mainApp');
    const currentUserElement = document.getElementById('currentUser');
    const uploadSection = document.getElementById('uploadSection');
    const loginButton = document.getElementById('loginButton');
    const userInfo = document.getElementById('userInfo');
    
    if (loginSection) loginSection.style.display = 'none';
    if (mainApp) mainApp.style.display = 'block';
    
    // Show login button if not logged in
    if (!currentUser) {
        if (loginButton) loginButton.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
        if (currentUserElement) currentUserElement.textContent = 'Welcome! Please login to access features.';
        if (uploadSection) uploadSection.style.display = 'none';
        
        // Disable interactive features
        disableFeatures();
    } else {
        if (loginButton) loginButton.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        if (currentUserElement) currentUserElement.textContent = `Welcome, ${currentUser}!`;
        if (uploadSection) uploadSection.style.display = isAdmin ? 'block' : 'none';
        
        // Enable interactive features
        enableFeatures();
        loadPDFs();
        loadDownloads();
        loadComments();
        loadStorageInfo();
    }
}

function showLoginSection() {
    const loginSection = document.getElementById('loginSection');
    const mainApp = document.getElementById('mainApp');
    
    if (loginSection) loginSection.style.display = 'flex';
    if (mainApp) mainApp.style.display = 'none';
}

function disableFeatures() {
    // Show message for features that require login
    const pdfList = document.getElementById('pdfList');
    const downloadsList = document.getElementById('downloadsList');
    const commentsList = document.getElementById('commentsList');
    
    if (pdfList) {
        pdfList.innerHTML = '<div class="login-required"><p>Please login to view and manage PDF files.</p></div>';
    }
    if (downloadsList) {
        downloadsList.innerHTML = '<div class="login-required"><p>Please login to view download history.</p></div>';
    }
    if (commentsList) {
        commentsList.innerHTML = '<div class="login-required"><p>Please login to view and submit feedback.</p></div>';
    }
}

function enableFeatures() {
    // Features will be enabled when data is loaded
}

function showMainApp() {
    // After successful login, update the main page to show user features
    showMainPage();
}

// Forgot Password Functions
function showForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function sendPasswordReset() {
    const email = document.getElementById('resetEmail').value.trim();
    if (!email) {
        showError('Please enter your email address');
        return;
    }
    
    // Simulate password reset
    showSuccess('Password reset instructions sent to your email!');
    closeForgotPassword();
}

// Tab Navigation
function showTab(tabName) {
    try {
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab content
        const selectedTab = document.getElementById(tabName + 'Tab');
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Add active class to clicked button
        const clickedButton = event.target;
        if (clickedButton) {
            clickedButton.classList.add('active');
        }
        
        // Load data for specific tabs
        if (tabName === 'downloads') {
            loadDownloads();
        } else if (tabName === 'comments') {
            loadComments();
        }
    } catch (error) {
        console.error('Error showing tab:', error);
    }
}

// File Upload Functions
function uploadPDF(event) {
    if (event) {
        event.preventDefault();
    }
    
    try {
        if (!isAdmin) {
            showError('Upload permission denied. Admin access required.');
            return;
        }
        
        const fileInput = document.getElementById('pdfFile');
        const categorySelect = document.getElementById('categorySelect');
        const statusDiv = document.getElementById('uploadStatus');
        
        if (!fileInput.files[0]) {
            showError('Please select a PDF file');
            return;
        }
        
        const file = fileInput.files[0];
        if (file.type !== 'application/pdf') {
            showError('Please select a valid PDF file');
            return;
        }
        
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            showError('File size too large. Maximum size is 50MB.');
            return;
        }
        
        showLoading(true);
        statusDiv.innerHTML = '<div class="loading-spinner"></div> Uploading...';
        
        // Read file and create new PDF entry
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                // Check if we have a valid result
                if (!e.target || !e.target.result) {
                    throw new Error('Failed to read file data');
                }
                
                // Create new PDF object (without storing large file data)
                const newPDF = {
                    id: Date.now(),
                    filename: file.name,
                    category: categorySelect.value,
                    upload_date: new Date().toLocaleDateString(),
                    size: file.size,
                    download_count: 0,
                    file_data: file.size < 1 * 1024 * 1024 ? e.target.result : null // Only store files under 1MB
                };
                
                // Check current storage before adding
                const currentStorageSize = JSON.stringify(samplePDFs).length;
                const newItemSize = JSON.stringify(newPDF).length;
                const maxStorageSize = 5 * 1024 * 1024; // 5MB limit
                
                if (currentStorageSize + newItemSize > maxStorageSize) {
                    // Create PDF without file data to save space
                    newPDF.file_data = null;
                    showSuccess('File uploaded successfully! (Preview not available due to size)');
                } else {
                    showSuccess('File uploaded successfully!');
                }
                
                // Add to sample PDFs array
                samplePDFs.push(newPDF);
                
                // Try to save to localStorage with error handling
                try {
                    localStorage.setItem('uploadedPDFs', JSON.stringify(samplePDFs));
                } catch (storageError) {
                    // Remove the file from array if storage fails
                    samplePDFs.pop();
                    
                    if (storageError.name === 'QuotaExceededError') {
                        // Try again without file data
                        newPDF.file_data = null;
                        samplePDFs.push(newPDF);
                        try {
                            localStorage.setItem('uploadedPDFs', JSON.stringify(samplePDFs));
                            showSuccess('File uploaded successfully! (Preview not available due to storage limitations)');
                        } catch (secondError) {
                            samplePDFs.pop();
                            showError('Storage quota exceeded. Please clear some files first.');
                            showLoading(false);
                            return;
                        }
                    } else {
                        throw storageError;
                    }
                }
                
                document.getElementById('uploadForm').reset();
                statusDiv.innerHTML = '';
                loadPDFs(); // Refresh file list
                loadStorageInfo(); // Update storage info
                showLoading(false);
                
            } catch (error) {
                console.error('File processing error:', error);
                showError('Failed to process file: ' + (error.message || 'Unknown error'));
                showLoading(false);
            }
        };
        
        reader.onerror = function(error) {
            console.error('FileReader error:', error);
            showError('Failed to read file. Please try again.');
            showLoading(false);
        };
        
        reader.readAsDataURL(file);
        
    } catch (error) {
        console.error('Upload error:', error);
        showError('Upload failed: ' + error.message);
        showLoading(false);
    }
}

// File Management Functions
function loadPDFs() {
    try {
        if (!currentUser) {
            disableFeatures();
            return;
        }
        
        const category = document.getElementById('categoryFilter').value;
        const search = document.getElementById('searchInput').value.toLowerCase();
        
        // Filter sample PDFs
        let filteredPDFs = samplePDFs.filter(pdf => {
            const matchesCategory = !category || pdf.category === category;
            const matchesSearch = !search || pdf.filename.toLowerCase().includes(search);
            return matchesCategory && matchesSearch;
        });
        
        displayPDFs(filteredPDFs);
        
    } catch (error) {
        console.error('Error loading PDFs:', error);
        showError('Failed to load files: ' + error.message);
    }
}

function displayPDFs(files) {
    const pdfList = document.getElementById('pdfList');
    if (!pdfList) return;
    
    if (files.length === 0) {
        pdfList.innerHTML = '<p class="text-center text-muted">No PDF files found.</p>';
        return;
    }
    
    pdfList.innerHTML = files.map(file => `
        <div class="pdf-item">
            <div class="pdf-header">
                <div class="pdf-info">
                    <h3>${escapeHtml(file.filename)}</h3>
                    <div class="pdf-meta">
                        <span>📅 ${file.upload_date}</span>
                        <span>📊 ${formatFileSize(file.size)}</span>
                        <span>📈 ${file.download_count} downloads</span>
                    </div>
                </div>
                <div class="pdf-category">${file.category}</div>
            </div>
            <div class="pdf-actions">
                <button class="btn-preview" onclick="previewPDF(${file.id}, '${escapeHtml(file.filename)}')">
                    👁️ Preview
                </button>
                <button class="btn-download" onclick="downloadPDF(${file.id}, '${escapeHtml(file.filename)}')">
                    📥 Download
                </button>
                ${isAdmin ? `<button class="btn-delete" onclick="deletePDF(${file.id})">🗑️ Delete</button>` : ''}
            </div>
        </div>
    `).join('');
}

function searchPDFs() {
    loadPDFs();
}

function filterByCategory() {
    loadPDFs();
}

function previewPDF(fileId, filename) {
    try {
        const modal = document.getElementById('previewModal');
        const iframe = document.getElementById('previewFrame');
        const title = document.getElementById('previewTitle');
        const loading = document.getElementById('previewLoading');
        
        if (!modal || !iframe || !title || !loading) {
            showError('Preview modal not found');
            return;
        }
        
        currentPreviewFile = fileId;
        title.textContent = `Preview: ${filename}`;
        
        // Show modal and loading
        modal.style.display = 'flex';
        loading.style.display = 'block';
        iframe.style.display = 'none';
        
        // Find the PDF file
        const pdfFile = samplePDFs.find(pdf => pdf.id === fileId);
        
        setTimeout(() => {
            if (pdfFile && pdfFile.file_data) {
                // Use actual uploaded file data
                iframe.src = pdfFile.file_data;
                loading.style.display = 'none';
                iframe.style.display = 'block';
            } else if (pdfFile && !pdfFile.file_data) {
                // Show informative message for files without stored data
                loading.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <h3>📄 ${escapeHtml(filename)}</h3>
                        <p>⚠️ File preview not available due to storage limitations.</p>
                        <p>File size: ${formatFileSize(pdfFile.size)}</p>
                        <button onclick="downloadPDF(${fileId}, '${escapeHtml(filename)}')" 
                                style="padding: 10px 20px; background: var(--success-color); color: white; border: none; border-radius: 6px; cursor: pointer; margin-top: 10px;">
                            📥 Download to View
                        </button>
                    </div>
                `;
                loading.style.display = 'block';
                iframe.style.display = 'none';
            } else {
                // Use sample PDF for demo files and original sample data
                iframe.src = 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgoxMDAgNzAwIFRkCihTYW1wbGUgUERGKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDI0NSAwMDAwMCBuIAowMDAwMDAwMzI0IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDE4CiUlRU9G';
                loading.style.display = 'none';
                iframe.style.display = 'block';
            }
        }, 1000);
        
    } catch (error) {
        console.error('Preview error:', error);
        showError('Failed to preview PDF: ' + error.message);
    }
}

function closePreview() {
    const modal = document.getElementById('previewModal');
    const iframe = document.getElementById('previewFrame');
    
    if (modal) {
        modal.style.display = 'none';
    }
    
    if (iframe) {
        iframe.src = '';
    }
    
    currentPreviewFile = null;
}

function downloadCurrentPDF() {
    if (currentPreviewFile) {
        downloadPDF(currentPreviewFile, 'sample.pdf');
    }
}

function downloadPDF(fileId, filename) {
    try {
        const pdfFile = samplePDFs.find(pdf => pdf.id === fileId);
        
        if (pdfFile && pdfFile.file_data) {
            // Create download link for actual uploaded file
            const link = document.createElement('a');
            link.href = pdfFile.file_data;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showSuccess(`Downloaded ${filename} successfully!`);
        } else if (pdfFile && !pdfFile.file_data && pdfFile.size >= 2 * 1024 * 1024) {
            // File was too large to store
            showError(`File ${filename} was too large to store. Original file data not available.`);
        } else {
            // Simulate download for demo files
            showSuccess(`Downloading ${filename}...`);
        }
        
        // Update download count
        if (pdfFile) {
            pdfFile.download_count++;
            localStorage.setItem('uploadedPDFs', JSON.stringify(samplePDFs));
        }
        
        // Add to download history
        let downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
        downloads.push({
            file_id: fileId,
            filename: filename,
            download_date: new Date().toLocaleDateString(),
            category: pdfFile?.category || 'others'
        });
        localStorage.setItem('downloads', JSON.stringify(downloads));
        
        // Refresh displays
        loadPDFs();
        if (document.getElementById('downloadsTab').classList.contains('active')) {
            setTimeout(() => {
                loadDownloads();
            }, 1000);
        }
    } catch (error) {
        console.error('Download error:', error);
        showError('Failed to download PDF: ' + error.message);
    }
}

function deletePDF(fileId) {
    if (!isAdmin) {
        showError('Delete permission denied. Admin access required.');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this PDF?')) {
        return;
    }
    
    try {
        showLoading(true);
        
        setTimeout(() => {
            // Remove from sample data
            const index = samplePDFs.findIndex(pdf => pdf.id === fileId);
            if (index > -1) {
                samplePDFs.splice(index, 1);
                // Update localStorage
                localStorage.setItem('uploadedPDFs', JSON.stringify(samplePDFs));
            }
            
            showSuccess('File deleted successfully');
            loadPDFs(); // Refresh file list
            loadStorageInfo(); // Update storage info
            showLoading(false);
        }, 1000);
        
    } catch (error) {
        console.error('Delete error:', error);
        showError('Delete failed: ' + error.message);
        showLoading(false);
    }
}

function toggleFullscreen() {
    const iframe = document.getElementById('previewFrame');
    if (!iframe) return;
    
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
    }
}

// Downloads Functions
function loadDownloads() {
    try {
        if (!currentUser) {
            disableFeatures();
            return;
        }
        
        const downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
        const filter = document.getElementById('downloadsFilter').value;
        
        let filteredDownloads = downloads;
        
        if (filter) {
            const now = new Date();
            filteredDownloads = downloads.filter(download => {
                const downloadDate = new Date(download.download_date);
                switch (filter) {
                    case 'today':
                        return downloadDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return downloadDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        return downloadDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }
        
        displayDownloads(filteredDownloads);
        
    } catch (error) {
        console.error('Error loading downloads:', error);
        showError('Failed to load downloads: ' + error.message);
    }
}

function displayDownloads(downloads) {
    const downloadsList = document.getElementById('downloadsList');
    if (!downloadsList) return;
    
    if (downloads.length === 0) {
        downloadsList.innerHTML = '<p class="text-center text-muted">No downloads found.</p>';
        return;
    }
    
    downloadsList.innerHTML = downloads.map(download => `
        <div class="download-item">
            <div class="download-info">
                <h4>${escapeHtml(download.filename)}</h4>
                <div class="download-meta">
                    <span>📅 ${download.download_date}</span>
                    <span class="pdf-category">${download.category}</span>
                </div>
            </div>
            <div class="download-actions">
                <button onclick="downloadPDF(${download.file_id}, '${escapeHtml(download.filename)}')">
                    📥 Download Again
                </button>
            </div>
        </div>
    `).join('');
}

function filterDownloads() {
    loadDownloads();
}

function clearDownloadHistory() {
    if (!confirm('Are you sure you want to clear your download history?')) {
        return;
    }
    
    try {
        localStorage.removeItem('downloads');
        showSuccess('Download history cleared');
        loadDownloads();
    } catch (error) {
        console.error('Clear downloads error:', error);
        showError('Failed to clear history: ' + error.message);
    }
}

// Comments Functions
function submitComment(event) {
    if (event) {
        event.preventDefault();
    }
    
    try {
        if (!currentUser) {
            showError('Please login to submit feedback');
            return;
        }
        
        const text = document.getElementById('commentText').value.trim();
        const category = document.getElementById('commentCategory').value;
        
        if (!text) {
            showError('Please enter your feedback');
            return;
        }
        
        showLoading(true);
        
        setTimeout(() => {
            // Save comment
            let comments = JSON.parse(localStorage.getItem('comments') || '[]');
            comments.push({
                id: Date.now(),
                user_email: currentUser,
                text: text,
                category: category,
                created_at: new Date().toLocaleString(),
                is_resolved: false,
                admin_reply: null
            });
            localStorage.setItem('comments', JSON.stringify(comments));
            
            showSuccess('Feedback submitted successfully');
            document.getElementById('feedbackForm').reset();
            loadComments();
            showLoading(false);
        }, 1000);
        
    } catch (error) {
        console.error('Comment submission error:', error);
        showError('Failed to submit feedback: ' + error.message);
        showLoading(false);
    }
}

function loadComments() {
    try {
        if (!currentUser) {
            disableFeatures();
            return;
        }
        
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        displayComments(comments);
        
    } catch (error) {
        console.error('Error loading comments:', error);
        showError('Failed to load comments: ' + error.message);
    }
}

function displayComments(comments) {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="text-center text-muted">No feedback found.</p>';
        return;
    }
    
    commentsList.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <div class="comment-user">${escapeHtml(comment.user_email)}</div>
                <div class="comment-date">${comment.created_at}</div>
            </div>
            <div class="comment-category">${comment.category}</div>
            <div class="comment-text">${escapeHtml(comment.text)}</div>
            ${comment.is_resolved ? '<div class="comment-resolved">✅ Resolved</div>' : ''}
            ${comment.admin_reply ? `<div class="admin-reply"><strong>Admin Reply:</strong> ${escapeHtml(comment.admin_reply)}</div>` : ''}
        </div>
    `).join('');
}

// Storage Info
function loadStorageInfo() {
    try {
        if (!currentUser) return;
        
        const totalSize = samplePDFs.reduce((sum, pdf) => sum + pdf.size, 0);
        const totalFiles = samplePDFs.length;
        const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        
        // Calculate localStorage usage
        const storageSize = JSON.stringify(samplePDFs).length;
        const storageMB = (storageSize / (1024 * 1024)).toFixed(2);
        
        const storageElement = document.getElementById('storageUsage');
        if (storageElement) {
            storageElement.innerHTML = `
                Storage: ${sizeMB}MB (${totalFiles} files)<br>
                <small>LocalStorage: ${storageMB}MB used</small>
                ${storageMB > 4 ? '<br><small style="color: var(--danger-color);">⚠️ Storage nearly full</small>' : ''}
            `;
        }
        
    } catch (error) {
        console.error('Error loading storage info:', error);
    }
}

// Clear storage function
function clearStorageSpace() {
    if (!confirm('This will remove file preview data to free up space. Files will still be listed but previews may not work. Continue?')) {
        return;
    }
    
    try {
        // Remove file_data from all PDFs to save space
        samplePDFs.forEach(pdf => {
            if (pdf.file_data) {
                pdf.file_data = null;
            }
        });
        
        localStorage.setItem('uploadedPDFs', JSON.stringify(samplePDFs));
        showSuccess('Storage space cleared! File previews may be limited.');
        loadStorageInfo();
    } catch (error) {
        console.error('Error clearing storage:', error);
        showError('Failed to clear storage: ' + error.message);
    }
}

// Utility Functions
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

function showError(message) {
    const toast = document.getElementById('errorToast');
    const messageElement = document.getElementById('errorMessage');
    
    if (toast && messageElement) {
        messageElement.textContent = message;
        toast.style.display = 'flex';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideToast('errorToast');
        }, 5000);
    }
    
    console.error('Error:', message);
}

function showSuccess(message) {
    const toast = document.getElementById('successToast');
    const messageElement = document.getElementById('successMessage');
    
    if (toast && messageElement) {
        messageElement.textContent = message;
        toast.style.display = 'flex';
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            hideToast('successToast');
        }, 3000);
    }
    
    console.log('Success:', message);
}

function hideToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.style.display = 'none';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Event Listeners
document.addEventListener('click', function(event) {
    // Close modals when clicking outside
    if (event.target.classList.contains('modal-overlay')) {
        if (event.target.id === 'previewModal') {
            closePreview();
        } else if (event.target.id === 'forgotPasswordModal') {
            closeForgotPassword();
        }
    }
    
    // Close popup when clicking outside
    if (event.target.classList.contains('popup-overlay')) {
        closeWelcomePopup();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Escape key to close modals
    if (event.key === 'Escape') {
        closePreview();
        closeForgotPassword();
        closeWelcomePopup();
    }
    
    // Ctrl+/ to toggle theme
    if (event.ctrlKey && event.key === '/') {
        event.preventDefault();
        toggleTheme();
    }
});

// Window resize handler
window.addEventListener('resize', function() {
    // Adjust modal sizes if needed
    const modals = document.querySelectorAll('.modal-content');
    modals.forEach(modal => {
        if (window.innerWidth < 768) {
            modal.style.width = '95%';
            modal.style.margin = '20px';
        } else {
            modal.style.width = '';
            modal.style.margin = '';
        }
    });
});
