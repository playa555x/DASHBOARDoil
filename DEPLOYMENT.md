# 🚀 NCNDA System Deployment Guide

## Option 1: Railway.app (Empfohlen - Einfachst)

### Schritt 1: GitHub Repository erstellen
```bash
cd C:\Users\win11\Desktop\NCNDA_System
git init
git add .
git commit -m "Initial commit: NCNDA Tracking System"
```

### Schritt 2: GitHub Repository erstellen
1. Gehe zu https://github.com/new
2. Erstelle ein neues Repository (z.B. "ncnda-system")
3. **WICHTIG:** Nicht "Initialize with README" anklicken!

### Schritt 3: Code zu GitHub pushen
```bash
git remote add origin https://github.com/DEIN-USERNAME/ncnda-system.git
git branch -M main
git push -u origin main
```

### Schritt 4: Railway.app Setup
1. Gehe zu https://railway.app
2. Klicke auf "Start a New Project"
3. Wähle "Deploy from GitHub repo"
4. Wähle dein "ncnda-system" Repository

### Schritt 5: Umgebungsvariablen setzen (Optional)
In Railway → Settings → Variables:
```
PORT=3000
NODE_ENV=production
```

### Schritt 6: Volume für SQLite Datenbank
1. Railway → Settings → Volumes
2. Click "New Volume"
3. Mount Path: `/app/data`
4. Klicke "Add Volume"

### Schritt 7: server.js anpassen
Ändere die Datenbankpfad-Zeile:
```javascript
const db = new Database(process.env.NODE_ENV === 'production' ? './data/ncnda.db' : './ncnda.db');
```

### Schritt 8: Deployment abschließen
- Railway deployt automatisch bei jedem Git Push
- Deine URL: `https://DEIN-APP-NAME.up.railway.app`

---

## Option 2: Render.com

### Schritt 1-3: Gleich wie bei Railway (GitHub Repo)

### Schritt 4: Render.com Setup
1. Gehe zu https://render.com
2. "New" → "Web Service"
3. Connect dein GitHub Repository
4. Settings:
   - **Name:** ncnda-system
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### Schritt 5: Disk für SQLite
1. Render → Disks
2. "Add Disk"
3. Mount Path: `/opt/render/project/src/data`
4. Size: 1GB

---

## Option 3: VPS (DigitalOcean / Hetzner)

### Vorteile:
- Volle Kontrolle
- Eigene Domain möglich
- Günstiger auf lange Sicht

### Setup:
1. Ubuntu Server 22.04 erstellen
2. SSH einloggen und installieren:
```bash
# Node.js installieren
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 installieren (für process management)
sudo npm install -g pm2

# Nginx installieren
sudo apt install nginx

# Code hochladen
git clone https://github.com/DEIN-USERNAME/ncnda-system.git
cd ncnda-system
npm install

# Mit PM2 starten
pm2 start server.js --name ncnda-system
pm2 startup
pm2 save

# Nginx konfigurieren (Reverse Proxy)
sudo nano /etc/nginx/sites-available/ncnda
```

Nginx Config:
```nginx
server {
    listen 80;
    server_name deine-domain.de;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/ncnda /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL mit Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d deine-domain.de
```

---

## Nach dem Deployment

### Admin-Zugang ändern:
1. Logge dich mit `admin` / `admin123` ein
2. Erstelle einen neuen Admin-User
3. Lösche den Default-Admin

### Wichtige URLs:
- **Admin Panel:** `https://deine-url.com/admin.html`
- **Dashboard:** `https://deine-url.com/dashboard.html`
- **Templates:** `https://deine-url.com/templates.html`
- **API:** `https://deine-url.com/api/...`

### Backup der Datenbank:
```bash
# Lokal
cp ncnda.db ncnda_backup_$(date +%Y%m%d).db

# Auf Server (mit PM2)
pm2 stop ncnda-system
cp ncnda.db backups/ncnda_$(date +%Y%m%d).db
pm2 start ncnda-system
```

---

## Troubleshooting

### Problem: "Cannot find module 'better-sqlite3'"
```bash
npm install
npm rebuild better-sqlite3
```

### Problem: "EADDRINUSE Port already in use"
```bash
# Finde den Prozess
lsof -i :3000
# Stoppe ihn
kill -9 PID
```

### Problem: Datenbank schreibgeschützt
```bash
chmod 666 ncnda.db
chmod 777 data/  # Ordner muss auch schreibbar sein
```
