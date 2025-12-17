# Personal Website with Authentication & File Upload

A modern, secure personal website built with Node.js, Express, and EJS. Perfect for showcasing your portfolio, sharing documentation, and managing files with a login system.

## 🚀 Features

- ✅ **Secure Authentication** - Password-protected login system
- 📤 **File Management** - Upload, download, and delete files securely
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🔐 **Security Features**:
  - Session-based authentication with 24-hour expiry
  - Bcrypt password hashing
  - File type validation
  - File size limits (max 10MB)
  - Directory traversal protection
  - HTTP-only cookies
  - HTTPS-ready

- 📚 **Documentation** - Built-in guides and information pages
- 💎 **Beautiful UI** - Modern, clean interface with gradient design

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## 🛠️ Installation

1. **Navigate to the project folder:**
   ```bash
   cd "d:\New folder"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 🔑 Default Login Credentials

- **Username:** `yojana`
- **Password:** `nishu`

> ⚠️ **IMPORTANT:** Change these credentials in production!

## 📁 Project Structure

```
d:\New folder/
├── server.js              # Express server & API routes
├── package.json           # Project dependencies
├── public/
│   └── style.css         # CSS styles
├── views/
│   ├── index.ejs         # Home page
│   ├── login.ejs         # Login page
│   ├── dashboard.ejs     # Dashboard (protected)
│   └── 404.ejs           # 404 error page
└── uploads/              # User uploaded files (created automatically)
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=your-super-secret-key-change-this
```

### Change Credentials

To change login credentials, edit `server.js`:

```javascript
const ADMIN_USERNAME = 'your-username';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('your-password', 10);
```

To generate a password hash, run:

```javascript
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('your-password', 10));
```

## 🎯 Usage Guide

### For Visitors
1. Visit the home page to see your profile information
2. Click "Login to Dashboard" to access secured content

### For Logged-In Users
1. **Upload Files:** Use the upload form to add documents (PDF, images, TXT, DOC)
2. **View Files:** See all uploaded files with timestamps
3. **Download Files:** Click download to retrieve any file
4. **Delete Files:** Remove files you no longer need
5. **Logout:** Click logout when done

## 📊 API Endpoints

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | `/` | No | Home page |
| GET | `/login` | No | Login page |
| POST | `/login` | No | Process login |
| GET | `/dashboard` | Yes | User dashboard |
| POST | `/upload` | Yes | Upload file |
| GET | `/download/:filename` | Yes | Download file |
| POST | `/delete/:filename` | Yes | Delete file |
| GET | `/logout` | Yes | Logout |

## 🔒 Security Features Explained

### Authentication
- Uses bcryptjs for secure password hashing
- Session-based authentication (not JWT, better for server-side apps)
- Automatic session expiry after 24 hours
- HTTP-only cookies (prevents XSS attacks)

### File Uploads
- **Type Validation:** Only allows PDF, images, and documents
- **Size Limits:** Maximum 10MB per file
- **Unique Naming:** Files are renamed with timestamps to prevent conflicts
- **Path Protection:** Directory traversal prevention in downloads/deletes

### Data Protection
- Environment variables for sensitive config
- Input validation on all forms
- Error messages that don't leak system info

## 🚀 Deployment

### To Heroku/Vercel:
1. Set environment variables in hosting platform
2. Change `NODE_ENV` to `production`
3. The app is production-ready!

### To Your Own Server:
1. Install Node.js on your server
2. Clone/upload this project
3. Run `npm install`
4. Use PM2 or similar for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "personal-website"
   ```

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env or run on different port
set PORT=3001
npm start
```

### Files Not Uploading
- Check file size (max 10MB)
- Verify file type is allowed (PDF, images, TXT, DOC)
- Ensure `uploads/` folder exists

### Session Not Working
- Clear browser cookies
- Check if `SESSION_SECRET` is set
- Verify session cookie settings match your deployment

## 📝 License

This project is open source and available for personal and educational use.

## 🤝 Support

For issues or questions, review the code comments or check the built-in documentation on the dashboard.

---

**Happy building! 🚀**
