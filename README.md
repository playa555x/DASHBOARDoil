# 📋 NCNDA Tracking System

Ein professionelles System zum Erstellen, Verwalten und Tracken von NCNDA (Non-Circumvention Non-Disclosure Agreement) Dokumenten.

## ✨ Features

- 📄 **Template-Management**: Lade HTML-Templates hoch und verwende sie für neue Dokumente
- 🔒 **Passwortgeschützte Dokumente**: Jedes Dokument ist passwortgeschützt
- 🌍 **IP-Geolocation Tracking**: Automatisches Tracking von Zugriffs-IPs mit Standortdaten
- 📤 **Multi-Channel Sharing**: Teile Dokumente via WhatsApp, Email oder System-Share (Mobile)
- 🔍 **Echtzeit-Suche**: Finde Dokumente sofort nach ID, Partner oder Email
- 📊 **Detaillierte Analytics**: Siehe IP-Zugriffe, Unterschriften und Versand-Historie
- 🖊️ **Digitale Signaturen**: Erfasse Unterschriften mit Zeitstempel und IP-Tracking
- 🎨 **Material Design UI**: Moderne, responsive Benutzeroberfläche

## 🚀 Schnellstart (Lokal)

```bash
# Dependencies installieren
npm install

# Server starten
npm start

# Browser öffnen
http://localhost:3000/admin.html
```

**Standard Login:**
- Username: `admin`
- Password: `admin123`

## 📁 Projektstruktur

```
NCNDA_System/
├── server.js                 # Express Backend
├── package.json              # Dependencies
├── ncnda.db                  # SQLite Datenbank
├── public/
│   ├── admin.html           # Admin Login
│   ├── dashboard.html       # Haupt-Dashboard
│   ├── templates.html       # Template-Verwaltung
│   └── styles/
└── DEPLOYMENT.md            # Deployment-Anleitung
```

## 🔧 Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **Auth**: JWT + bcrypt
- **Frontend**: Vanilla JS + Material Design
- **Geolocation**: ip-api.com

## 🌐 Deployment

Siehe [DEPLOYMENT.md](./DEPLOYMENT.md) für detaillierte Deployment-Anleitungen für:
- Railway.app (empfohlen)
- Render.com
- VPS (DigitalOcean, Hetzner)

## 📝 Lizenz

MIT License - siehe LICENSE Datei
