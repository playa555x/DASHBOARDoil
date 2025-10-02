# ⚡ SCHNELLSTART GUIDE

## 🎯 In 3 Minuten startklar!

### 1️⃣ System lokal testen

**Windows:**
```bash
# Doppelklick auf:
START.bat
```

**Manuell:**
```bash
cd C:\Users\win11\Desktop\NCNDA_System
npm install
npm start
```

### 2️⃣ Admin-Panel öffnen

Browser öffnen:
```
http://localhost:3000/admin.html
```

**Login:**
- Username: `admin`
- Password: `admin123`

### 3️⃣ Erstes Dokument erstellen

1. Passwort eingeben (z.B. `TEST123`)
2. "Dokument erstellen" klicken
3. Link erscheint mit Share-Optionen
4. ✅ Fertig!

---

## 📱 Dokument teilen

### WhatsApp:
- Klick auf "📱 WhatsApp" Button
- Empfänger auswählen
- Senden

### E-Mail:
- Klick auf "✉️ E-Mail" Button
- E-Mail-Programm öffnet sich automatisch
- Empfänger eintragen & senden

### Manuell:
- Klick auf "📋 Link kopieren"
- In beliebige App einfügen

---

## 🔍 Testen

### Test mit 2 Geräten:

1. **PC/Laptop:**
   - Dokument erstellen
   - Link kopieren

2. **Smartphone:**
   - Link öffnen
   - Passwort eingeben
   - ✅ IP wird registriert

3. **Admin-Panel:**
   - "Details" klicken
   - Smartphone-IP sichtbar ✅

---

## 🚀 Online deployen

### Render.com (KOSTENLOS):

1. **GitHub Repo erstellen:**
```bash
cd C:\Users\win11\Desktop\NCNDA_System
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/DEIN-USERNAME/ncnda-system.git
git push -u origin main
```

2. **Render.com:**
- Gehe zu https://render.com
- "New +" > "Web Service"
- GitHub verbinden
- Repository wählen
- **Deploy!** ✅

3. **Fertig in 5 Minuten!**
```
https://DEIN-NAME.onrender.com/admin.html
```

**Mehr Details:** Siehe `DEPLOYMENT.md`

---

## 📊 System verstehen

### Wie es funktioniert:

1. **Admin erstellt Dokument** → Passwort festlegen
2. **Share-Link generiert** → `https://domain.com/document/DOC-123`
3. **Empfänger öffnet Link** → Passwort eingeben
4. **IP wird registriert** → Max. 3 IPs pro Dokument
5. **Admin sieht alle IPs** → Live-Überwachung

### Tabellen:
- `documents` → Dokument-Infos (ID, Passwort, Max-IPs)
- `ip_access` → Alle registrierten IPs
- `admin_users` → Admin-Accounts

---

## 🔧 Wichtige Einstellungen

### Admin-Passwort ändern:

**Methode 1 - Code:**
```javascript
// server.js, Zeile 14
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('NEUES-PASSWORT', 10);
```

**Methode 2 - Hash generieren:**
```bash
node -e "console.log(require('bcryptjs').hashSync('NEUES-PW', 10))"
```

### Max IPs ändern:

```javascript
// server.js, Zeile 78
max_ips INTEGER DEFAULT 5  // statt 3
```

### Port ändern:

```javascript
// server.js, Zeile 9
const PORT = process.env.PORT || 5000;  // statt 3000
```

---

## ✅ Checkliste

### Lokal testen:
- [ ] `npm install` ausgeführt
- [ ] Server läuft (`npm start`)
- [ ] Admin-Panel erreichbar
- [ ] Login funktioniert
- [ ] Dokument erstellt
- [ ] Share-Link funktioniert
- [ ] IP wird registriert

### Online deployen:
- [ ] GitHub Repository erstellt
- [ ] Code gepusht
- [ ] Render.com Account
- [ ] Service deployed
- [ ] Admin-Panel online erreichbar
- [ ] Admin-Passwort geändert
- [ ] Persistente DB aktiviert (Render Disk)

---

## 🆘 Probleme?

### Server startet nicht:
```bash
# Port belegt?
netstat -ano | findstr :3000

# Node.js installiert?
node --version
npm --version
```

### Login funktioniert nicht:
- Browser-Cache leeren (Strg + Shift + Delete)
- Inkognito-Modus testen
- Standard-Login: `admin` / `admin123`

### Datenbank leer:
```bash
# Datenbank zurücksetzen
del ncnda.db
npm start
```

---

## 📞 Support

**Logs prüfen:**
```bash
# Im Terminal sichtbar nach npm start
```

**Browser-Konsole:**
- F12 drücken
- "Console" Tab
- Fehlermeldungen prüfen

**API testen:**
```
http://localhost:3000/api/health
```
Sollte antworten:
```json
{"status":"ok","timestamp":"2024-..."}
```

---

## 🎉 Geschafft!

Ihr NCNDA IP-Tracking System ist einsatzbereit!

### Nächste Schritte:
1. ✅ Lokal testen
2. ✅ Online deployen (Render.com)
3. ✅ NCNDA-Dokument integrieren
4. ✅ Produktiv nutzen

**Viel Erfolg! 🚀**
