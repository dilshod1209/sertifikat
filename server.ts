import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory and database file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface User {
  id: string;
  username: string;
  passwordHash: string;
  fullName: string;
}

interface Certificate {
  id: string;
  userId: string;
  orgName: string;
  certId: string;
  recipientName: string;
  courseDescription: string;
  certTitle?: string;
  courseDescriptionShort?: string;
  date: string;
  signee: string;
  location: string;
  template: 'blue' | 'gold' | 'green' | 'crimson' | 'purple' | 'classic_dark' | 'emerald';
  recipientFont?: string;
  createdAt: string;
  updatedAt?: string;
}

interface Database {
  users: User[];
  certificates: Certificate[];
}

const defaultDb: Database = {
  users: [],
  certificates: [
    {
      id: "demo-cert-1",
      userId: "system",
      orgName: "Google AI Academy",
      certId: "093-060250",
      recipientName: "Dilshod Allaberdiyev",
      courseDescription: "Suntax va Sun'iy Intellekt Dasturlash Kursi",
      date: "2026-06-25",
      signee: "AI Instructor",
      location: "Toshkent",
      template: "gold",
      createdAt: new Date().toISOString()
    }
  ]
};

function readDb(): Database {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
      return defaultDb;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return defaultDb;
  }
}

function writeDb(db: Database) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes

  // Register
  app.post('/api/auth/register', (req, res) => {
    const { username, password, fullName } = req.body;
    if (!username || !password || !fullName) {
      return res.status(400).json({ error: 'Barcha maydonlarni to\'ldiring' });
    }

    const db = readDb();
    const normalizedUsername = username.trim().toLowerCase();

    if (db.users.some(u => u.username === normalizedUsername)) {
      return res.status(400).json({ error: 'Ushbu foydalanuvchi nomi band' });
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username: normalizedUsername,
      passwordHash: hashPassword(password),
      fullName: fullName.trim()
    };

    db.users.push(newUser);
    writeDb(db);

    const { passwordHash, ...userWithoutPassword } = newUser;
    res.status(201).json({ user: userWithoutPassword, message: 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz' });
  });

  // Login
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Foydalanuvchi nomi va parolni kiriting' });
    }

    const db = readDb();
    const normalizedUsername = username.trim().toLowerCase();
    const user = db.users.find(u => u.username === normalizedUsername);

    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Foydalanuvchi nomi yoki parol noto\'g\'ri' });
    }

    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, message: 'Tizimga muvaffaqiyatli kirdingiz' });
  });

  // Get all certificates (optionally filtered by user)
  app.get('/api/certificates', (req, res) => {
    const { userId } = req.query;
    const db = readDb();
    
    if (userId) {
      const userCerts = db.certificates.filter(c => c.userId === userId);
      return res.json(userCerts);
    }
    
    res.json(db.certificates);
  });

  // Get specific certificate by ID or certId for verification
  app.get('/api/certificates/:idOrCertId', (req, res) => {
    const { idOrCertId } = req.params;
    const db = readDb();

    const targetId = idOrCertId.toLowerCase();
    const cert = db.certificates.find(c => c.id === idOrCertId || c.certId.toLowerCase() === targetId);

    if (!cert) {
      return res.status(404).json({ error: 'Sertifikat topilmadi' });
    }

    res.json(cert);
  });

  // Save/Create certificate
  app.post('/api/certificates', (req, res) => {
    const { userId, orgName, certId, recipientName, courseDescription, certTitle, courseDescriptionShort, date, signee, location, template, recipientFont } = req.body;

    if (!userId || !orgName || !certId || !recipientName || !courseDescription || !date || !signee || !location) {
      return res.status(400).json({ error: 'Barcha ma\'lumotlarni kiriting' });
    }

    const db = readDb();
    const cleanCertId = certId.trim();

    // Check if certId is already in use
    const existingIndex = db.certificates.findIndex(c => c.certId.toLowerCase() === cleanCertId.toLowerCase());
    if (existingIndex !== -1) {
      const existingCert = db.certificates[existingIndex];
      // If it belongs to a different user, error out
      if (existingCert.userId !== userId && existingCert.userId !== 'system') {
        return res.status(400).json({ error: 'Ushbu sertifikat ID si boshqa foydalanuvchi tomonidan band qilingan' });
      }

      // If it's the same user or a demo, we update the existing one!
      db.certificates[existingIndex] = {
        ...existingCert,
        orgName: orgName.trim(),
        recipientName: recipientName.trim(),
        courseDescription: courseDescription.trim(),
        certTitle: certTitle ? certTitle.trim() : undefined,
        courseDescriptionShort: courseDescriptionShort ? courseDescriptionShort.trim() : undefined,
        date,
        signee: signee.trim(),
        location: location.trim(),
        template: template || 'blue',
        recipientFont,
        updatedAt: new Date().toISOString()
      };
      
      writeDb(db);
      return res.json({ ...db.certificates[existingIndex], message: 'Sertifikat muvaffaqiyatli yangilandi' });
    }

    const newCert: Certificate = {
      id: crypto.randomUUID(),
      userId,
      orgName: orgName.trim(),
      certId: cleanCertId,
      recipientName: recipientName.trim(),
      courseDescription: courseDescription.trim(),
      certTitle: certTitle ? certTitle.trim() : undefined,
      courseDescriptionShort: courseDescriptionShort ? courseDescriptionShort.trim() : undefined,
      date,
      signee: signee.trim(),
      location: location.trim(),
      template: template || 'blue',
      recipientFont,
      createdAt: new Date().toISOString()
    };

    db.certificates.push(newCert);
    writeDb(db);

    res.status(201).json({ ...newCert, message: 'Yangi sertifikat muvaffaqiyatli saqlandi' });
  });

  // Delete certificate
  app.delete('/api/certificates/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Ruxsat etilmadi' });
    }

    const db = readDb();
    const index = db.certificates.findIndex(c => c.id === id && c.userId === userId);

    if (index === -1) {
      return res.status(404).json({ error: 'Sertifikat topilmadi yoki sizga tegishli emas' });
    }

    db.certificates.splice(index, 1);
    writeDb(db);

    res.json({ message: 'Sertifikat o\'chirildi' });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
