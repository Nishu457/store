const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Allow only certain file types
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, images, txt, and DOC files are allowed'));
    }
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
app.get('/dashboard', requireAuth, (req, res) => {
  const files = fs.readdirSync(uploadsDir).map(filename => {
    const filepath = path.join(uploadsDir, filename);
    const stats = fs.statSync(filepath);
    return {
      name: filename,
      size: (stats.size / 1024).toFixed(2) + ' KB',
      uploadedAt: stats.birthtime.toLocaleString()
    };
  });

  res.render('dashboard', { files, username: req.session.username });
});

// Upload file (POST)
app.post('/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.json({ success: false, message: 'No file uploaded' });
  }

  res.json({
    success: true,
    message: 'File uploaded successfully',
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: (req.file.size / 1024).toFixed(2) + ' KB'
  });
});

// Download file (GET)
app.get('/download/:filename', requireAuth, (req, res) => {
  const filename = path.basename(req.params.filename);
  const filepath = path.join(uploadsDir, filename);

  // Security: prevent directory traversal
  if (!filepath.startsWith(uploadsDir)) {
    return res.status(403).send('Access denied');
  }

  if (!fs.existsSync(filepath)) {
    return res.status(404).send('File not found');
  }

  res.download(filepath);
});

// Delete file (POST)
app.post('/delete/:filename', requireAuth, (req, res) => {
  const filename = path.basename(req.params.filename);
  const filepath = path.join(uploadsDir, filename);

  // Security: prevent directory traversal
  if (!filepath.startsWith(uploadsDir)) {
    return res.json({ success: false, message: 'Access denied' });
  }

  if (!fs.existsSync(filepath)) {
    return res.json({ success: false, message: 'File not found' });
  }

  fs.unlinkSync(filepath);
  res.json({ success: true, message: 'File deleted successfully' });
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
