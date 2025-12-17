const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// File upload configuration - using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'personal-website-uploads',
    resource_type: 'auto',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'txt', 'doc', 'docx']
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Hardcoded credentials (with hashed password for better security)
// Password: yojana, Username: nishunishanth883
const ADMIN_USERNAME = 'nishunishanth883';
const ADMIN_PASSWORD_HASH = '$2a$10$4DOgbnbUeZCzUwP6b0VLde2ODbFsXRfZERj3lwHoGSKujW5qU5WgS'; // bcrypt hash of "yojana"

// Verify the hash (you can uncomment to test)
// const testHash = bcrypt.hashSync('nishu', 10);
// console.log('Hash for password "nishu":', testHash);

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.authenticated) {
    return res.redirect('/login');
  }
  next();
};

// Routes

// Home page (public)
app.get('/', (req, res) => {
  res.render('index');
});

// Login page (GET)
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Login handler (POST)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.render('login', { error: 'Username and password are required' });
  }

  // Check credentials
  if (username === ADMIN_USERNAME && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    req.session.authenticated = true;
    req.session.username = username;
    return res.redirect('/dashboard');
  }

  res.render('login', { error: 'Invalid username or password' });
});

// Dashboard (protected)
app.get('/dashboard', requireAuth, async (req, res) => {
  try {
    // Get files from Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'personal-website-uploads/',
      max_results: 500
    });

    const files = result.resources.map(file => ({
      name: file.public_id.split('/').pop(),
      originalname: file.display_name || file.public_id.split('/').pop(),
      size: (file.bytes / 1024).toFixed(2) + ' KB',
      uploadedAt: new Date(file.created_at).toLocaleString(),
      url: file.secure_url,
      publicId: file.public_id
    }));

    res.render('dashboard', { files, username: req.session.username });
  } catch (error) {
    console.error('Error fetching files from Cloudinary:', error);
    res.render('dashboard', { files: [], username: req.session.username, error: 'Error loading files' });
  }
});

// Upload file (POST)
app.post('/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.json({ success: false, message: 'No file uploaded' });
  }

  res.json({
    success: true,
    message: 'File uploaded successfully to cloud',
    filename: req.file.original_filename,
    size: (req.file.size / 1024).toFixed(2) + ' KB',
    url: req.file.secure_url
  });
});

// Download file (GET) - redirect to Cloudinary URL
app.get('/download/:filename', requireAuth, (req, res) => {
  const filename = req.params.filename;
  const publicId = `personal-website-uploads/${filename}`;
  
  // Generate download URL from Cloudinary
  const downloadUrl = cloudinary.url(publicId, {
    format: 'auto',
    attachment: filename
  });

  res.redirect(downloadUrl);
});

// Delete file (POST)
app.post('/delete/:filename', requireAuth, async (req, res) => {
  try {
    const filename = req.params.filename;
    const publicId = `personal-website-uploads/${filename}`;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.json({ success: false, message: 'Error deleting file' });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Error logging out');
    }
    res.redirect('/');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large (max 10MB)' });
    }
  }
  
  if (err.message) {
    return res.status(400).json({ success: false, message: err.message });
  }
  
  res.status(500).send('Something went wrong');
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📝 Login with username: yojana | password: nishu`);
});
