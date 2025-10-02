const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('admin123', 10); // Default password

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Erhöht für große HTML-Templates
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// Database Setup
const dbPath = process.env.NODE_ENV === 'production' && process.env.RAILWAY_VOLUME_MOUNT_PATH
  ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'ncnda.db')
  : 'ncnda.db';
const db = new Database(dbPath);
console.log(`📁 Database path: ${dbPath}`);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    max_ips INTEGER DEFAULT 3,
    partner_company TEXT,
    partner_name TEXT,
    status TEXT DEFAULT 'pending',
    sent_at DATETIME,
    signed_at DATETIME,
    email TEXT,
    phone TEXT,
    template_id INTEGER,
    FOREIGN KEY (template_id) REFERENCES templates(id)
  );
`)

// Add template_id column if it doesn't exist (migration for existing databases)
try {
  db.exec('ALTER TABLE documents ADD COLUMN template_id INTEGER');
  console.log('✅ Migration: Added template_id column to documents table');
} catch (err) {
  // Column already exists, ignore error
  if (!err.message.includes('duplicate column name')) {
    console.error('Migration error:', err.message);
  }
}

// Add geolocation columns to ip_access table
try {
  db.exec(`
    ALTER TABLE ip_access ADD COLUMN country TEXT;
    ALTER TABLE ip_access ADD COLUMN region TEXT;
    ALTER TABLE ip_access ADD COLUMN city TEXT;
    ALTER TABLE ip_access ADD COLUMN latitude REAL;
    ALTER TABLE ip_access ADD COLUMN longitude REAL;
  `);
  console.log('✅ Migration: Added geolocation columns to ip_access table');
} catch (err) {
  if (!err.message.includes('duplicate column name')) {
    console.error('Geolocation migration error:', err.message);
  }
}

db.exec(`

  CREATE TABLE IF NOT EXISTS ip_access (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    FOREIGN KEY (document_id) REFERENCES documents(document_id),
    UNIQUE(document_id, ip_address)
  );

  CREATE TABLE IF NOT EXISTS signatures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id TEXT NOT NULL,
    partner_name TEXT,
    partner_position TEXT,
    signature_data TEXT,
    signed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    FOREIGN KEY (document_id) REFERENCES documents(document_id)
  );

  CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    html_content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS share_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id TEXT NOT NULL,
    recipient_name TEXT,
    recipient_email TEXT,
    recipient_phone TEXT,
    share_method TEXT NOT NULL,
    shared_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    shared_by TEXT,
    FOREIGN KEY (document_id) REFERENCES documents(document_id)
  );
`);

// Insert default admin if not exists
const adminExists = db.prepare('SELECT * FROM admin_users WHERE username = ?').get('admin');
if (!adminExists) {
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', ADMIN_PASSWORD_HASH);
}

// ========== AUTH MIDDLEWARE ==========
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// ========== ENDPOINTS ==========

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  const admin = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);

  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });

  res.json({ token, username: admin.username });
});

// Create Document with Password
app.post('/api/document/create', authenticateToken, (req, res) => {
  const { password, partnerCompany, partnerName, email, phone, templateId } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Generate unique document ID
  const documentId = 'DOC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

  try {
    db.prepare(`
      INSERT INTO documents (document_id, password, max_ips, partner_company, partner_name, email, phone, status, template_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?)
    `).run(documentId, password.toUpperCase(), 3, partnerCompany, partnerName, email, phone, templateId || null);

    res.json({
      success: true,
      documentId,
      shareUrl: `${req.protocol}://${req.get('host')}/document/${documentId}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// Verify Password and Track IP
app.post('/api/document/verify', async (req, res) => {
  const { documentId, password, userAgent } = req.body;

  // Get client IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress || req.ip;

  const document = db.prepare('SELECT * FROM documents WHERE document_id = ?').get(documentId);

  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }

  // Check password
  if (password.toUpperCase() !== document.password) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Check how many IPs are already registered
  const ipCount = db.prepare('SELECT COUNT(*) as count FROM ip_access WHERE document_id = ?').get(documentId);

  // Check if this IP is already registered
  const existingIP = db.prepare('SELECT * FROM ip_access WHERE document_id = ? AND ip_address = ?').get(documentId, ip);

  if (existingIP) {
    // IP already has access
    return res.json({
      success: true,
      message: 'Access granted (existing IP)',
      isFirstTime: false
    });
  }

  // Check if max IPs reached
  if (ipCount.count >= document.max_ips) {
    return res.status(403).json({
      error: 'Maximum IP limit reached',
      message: `This document can only be accessed from ${document.max_ips} different IP addresses.`
    });
  }

  // Register new IP with geolocation
  try {
    // Fetch geolocation data for the IP
    let geoData = { country: null, region: null, city: null, lat: null, lon: null };

    try {
      // Skip geolocation for localhost/private IPs
      if (ip && !ip.includes('127.0.0.1') && !ip.includes('::1') && !ip.startsWith('192.168.')) {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon`);
        const geo = await geoResponse.json();

        if (geo.status === 'success') {
          geoData = {
            country: geo.country,
            region: geo.regionName,
            city: geo.city,
            lat: geo.lat,
            lon: geo.lon
          };
        }
      }
    } catch (geoError) {
      console.error('Geolocation fetch error:', geoError.message);
      // Continue without geolocation data
    }

    db.prepare(`
      INSERT INTO ip_access (document_id, ip_address, user_agent, country, region, city, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(documentId, ip, userAgent, geoData.country, geoData.region, geoData.city, geoData.lat, geoData.lon);

    res.json({
      success: true,
      message: 'Access granted',
      isFirstTime: true,
      ipCount: ipCount.count + 1,
      maxIps: document.max_ips
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register IP' });
  }
});

// Get Document Info (for admin)
app.get('/api/admin/document/:documentId', authenticateToken, (req, res) => {
  const { documentId } = req.params;

  const document = db.prepare('SELECT * FROM documents WHERE document_id = ?').get(documentId);

  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }

  const ips = db.prepare('SELECT * FROM ip_access WHERE document_id = ? ORDER BY accessed_at DESC').all(documentId);

  res.json({
    document,
    ips,
    ipCount: ips.length
  });
});

// List all documents (for admin)
app.get('/api/admin/documents', authenticateToken, (req, res) => {
  const documents = db.prepare(`
    SELECT
      d.*,
      COUNT(ia.id) as ip_count
    FROM documents d
    LEFT JOIN ip_access ia ON d.document_id = ia.document_id
    GROUP BY d.id
    ORDER BY d.created_at DESC
  `).all();

  res.json(documents);
});

// Delete document (for admin)
app.delete('/api/admin/document/:documentId', authenticateToken, (req, res) => {
  const { documentId } = req.params;

  try {
    db.prepare('DELETE FROM ip_access WHERE document_id = ?').run(documentId);
    db.prepare('DELETE FROM signatures WHERE document_id = ?').run(documentId);
    db.prepare('DELETE FROM documents WHERE document_id = ?').run(documentId);

    res.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Update document status (mark as sent)
app.post('/api/document/mark-sent', authenticateToken, (req, res) => {
  const { documentId } = req.body;

  try {
    db.prepare(`
      UPDATE documents
      SET status = 'sent', sent_at = CURRENT_TIMESTAMP
      WHERE document_id = ?
    `).run(documentId);

    res.json({ success: true, message: 'Document marked as sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Share document
app.post('/api/admin/document/:documentId/share', authenticateToken, (req, res) => {
  const { documentId } = req.params;
  const { recipientName, recipientEmail, recipientPhone, shareMethod } = req.body;

  try {
    // Log the share action
    db.prepare(`
      INSERT INTO share_history (document_id, recipient_name, recipient_email, recipient_phone, share_method, shared_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(documentId, recipientName || null, recipientEmail || null, recipientPhone || null, shareMethod, req.user.username);

    // Update document status to 'sent' if not already
    db.prepare(`
      UPDATE documents
      SET status = 'sent', sent_at = CURRENT_TIMESTAMP
      WHERE document_id = ? AND status = 'draft'
    `).run(documentId);

    console.log(`📤 Document ${documentId} shared via ${shareMethod} to ${recipientName || recipientEmail || recipientPhone}`);

    res.json({
      success: true,
      message: 'Share action logged successfully'
    });
  } catch (error) {
    console.error('Error logging share:', error);
    res.status(500).json({ error: 'Failed to log share action', details: error.message });
  }
});

// Get share history for a document
app.get('/api/admin/document/:documentId/shares', authenticateToken, (req, res) => {
  const { documentId } = req.params;

  try {
    const shares = db.prepare(`
      SELECT * FROM share_history
      WHERE document_id = ?
      ORDER BY shared_at DESC
    `).all(documentId);

    res.json(shares);
  } catch (error) {
    console.error('Error fetching shares:', error);
    res.status(500).json({ error: 'Failed to fetch share history' });
  }
});

// Submit signature
app.post('/api/document/sign', (req, res) => {
  const { documentId, partnerName, partnerPosition, signatureData } = req.body;
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress || req.ip;

  try {
    // Insert signature
    db.prepare(`
      INSERT INTO signatures (document_id, partner_name, partner_position, signature_data, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `).run(documentId, partnerName, partnerPosition, signatureData, ip);

    // Update document status
    db.prepare(`
      UPDATE documents
      SET status = 'signed', signed_at = CURRENT_TIMESTAMP, partner_name = ?
      WHERE document_id = ?
    `).run(partnerName, documentId);

    res.json({ success: true, message: 'Document signed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save signature' });
  }
});

// Get dashboard statistics
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
  try {
    const stats = {
      total: db.prepare('SELECT COUNT(*) as count FROM documents').get().count,
      draft: db.prepare("SELECT COUNT(*) as count FROM documents WHERE status = 'draft'").get().count,
      sent: db.prepare("SELECT COUNT(*) as count FROM documents WHERE status = 'sent'").get().count,
      signed: db.prepare("SELECT COUNT(*) as count FROM documents WHERE status = 'signed'").get().count,
      pending: db.prepare("SELECT COUNT(*) as count FROM documents WHERE status = 'pending'").get().count
    };

    const recentDocuments = db.prepare(`
      SELECT d.*, COUNT(ia.id) as ip_count,
             (SELECT COUNT(*) FROM signatures WHERE document_id = d.document_id) as signature_count
      FROM documents d
      LEFT JOIN ip_access ia ON d.document_id = ia.document_id
      GROUP BY d.id
      ORDER BY d.created_at DESC
      LIMIT 10
    `).all();

    const recentSignatures = db.prepare(`
      SELECT s.*, d.partner_company
      FROM signatures s
      JOIN documents d ON s.document_id = d.document_id
      ORDER BY s.signed_at DESC
      LIMIT 5
    `).all();

    res.json({
      stats,
      recentDocuments,
      recentSignatures
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get document details with IP tracking and geolocation
app.get('/api/admin/document/:documentId/details', authenticateToken, (req, res) => {
  const { documentId } = req.params;

  try {
    // Get document info
    const document = db.prepare('SELECT * FROM documents WHERE document_id = ?').get(documentId);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Get all IP accesses with geolocation data
    const ipAccesses = db.prepare(`
      SELECT *
      FROM ip_access
      WHERE document_id = ?
      ORDER BY accessed_at DESC
    `).all(documentId);

    // Get signatures
    const signatures = db.prepare(`
      SELECT *
      FROM signatures
      WHERE document_id = ?
      ORDER BY signed_at DESC
    `).all(documentId);

    // Get share history
    const shareHistory = db.prepare(`
      SELECT *
      FROM share_history
      WHERE document_id = ?
      ORDER BY shared_at DESC
    `).all(documentId);

    res.json({
      document,
      ipAccesses,
      signatures,
      shareHistory
    });
  } catch (error) {
    console.error('Error fetching document details:', error);
    res.status(500).json({ error: 'Failed to fetch document details' });
  }
});

// ========== TEMPLATE MANAGEMENT ==========

// Get all templates
app.get('/api/admin/templates', authenticateToken, (req, res) => {
  try {
    const templates = db.prepare(`
      SELECT *,
             (SELECT COUNT(*) FROM documents WHERE template_id = templates.id) as usage_count
      FROM templates
      ORDER BY created_at DESC
    `).all();

    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates', details: error.message });
  }
});

// Upload new template
app.post('/api/admin/template/upload', authenticateToken, (req, res) => {
  const { name, description, htmlContent } = req.body;

  if (!name || !htmlContent) {
    return res.status(400).json({ error: 'Name and HTML content are required' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO templates (name, description, html_content)
      VALUES (?, ?, ?)
    `).run(name, description || '', htmlContent);

    console.log('Template uploaded successfully:', { id: result.lastInsertRowid, name });

    res.json({
      success: true,
      templateId: result.lastInsertRowid,
      message: 'Template uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading template:', error);
    res.status(500).json({ error: 'Failed to upload template', details: error.message });
  }
});

// Get single template
app.get('/api/admin/template/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  try {
    const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// Update template
app.put('/api/admin/template/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, description, htmlContent } = req.body;

  try {
    db.prepare(`
      UPDATE templates
      SET name = ?, description = ?, html_content = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, description, htmlContent, id);

    res.json({ success: true, message: 'Template updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update template' });
  }
});

// Delete template
app.delete('/api/admin/template/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  try {
    // Check if template is in use
    const inUse = db.prepare('SELECT COUNT(*) as count FROM documents WHERE template_id = ?').get(id);

    if (inUse.count > 0) {
      // Set template_id to NULL for all documents using this template
      db.prepare('UPDATE documents SET template_id = NULL WHERE template_id = ?').run(id);
      console.log(`⚠️ Removed template ${id} from ${inUse.count} document(s)`);
    }

    // Now delete the template
    db.prepare('DELETE FROM templates WHERE id = ?').run(id);

    console.log(`✅ Template ${id} deleted successfully`);

    res.json({
      success: true,
      message: 'Template deleted',
      documentsUpdated: inUse.count
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template', details: error.message });
  }
});

// Toggle template active status
app.post('/api/admin/template/:id/toggle', authenticateToken, (req, res) => {
  const { id } = req.params;

  try {
    const template = db.prepare('SELECT is_active FROM templates WHERE id = ?').get(id);
    const newStatus = template.is_active ? 0 : 1;

    db.prepare('UPDATE templates SET is_active = ? WHERE id = ?').run(newStatus, id);

    res.json({ success: true, isActive: newStatus === 1 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle template' });
  }
});

// Get template for document creation (public - for document viewing)
app.get('/api/template/:id/content', (req, res) => {
  const { id } = req.params;

  try {
    const template = db.prepare('SELECT html_content FROM templates WHERE id = ? AND is_active = 1').get(id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found or inactive' });
    }

    res.send(template.html_content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin panel: http://localhost:${PORT}/admin.html`);
  console.log(`🔑 Default admin credentials: admin / admin123`);
});
