# 📊 NCNDA Dashboard - Vollständige Anleitung

## 🎯 Übersicht

Das NCNDA Management Dashboard ist Ihre **zentrale Schaltstelle** für:

- ✅ **Dokumente erstellen & versenden**
- ✅ **Status-Überwachung** (Entwurf, Versendet, Unterschrieben)
- ✅ **IP-Tracking** (max. 3 IPs pro Dokument)
- ✅ **Unterschriften-Verwaltung**
- ✅ **Live-Statistiken**

---

## 🚀 Zugriff

### URL:
```
http://localhost:3000/admin.html         (lokal)
https://IHR-NAME.onrender.com/admin.html (online)
```

### Login:
- **Username:** `admin`
- **Password:** `admin123`

→ Automatische Weiterleitung zum Dashboard

---

## 📊 Dashboard-Übersicht

### 1. **Statistik-Karten** (oben)

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ 📄 Gesamt   │ 📝 Entwürfe │ 📧 Versendet│ ✅ Unterschr│ ⏳ Ausstehend│
│     15      │      3      │      6      │      5      │      1      │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### 2. **Tabs** (Navigation)

- **Alle Dokumente** → Gesamtübersicht
- **Versendet** → Nur versendete Dokumente
- **Unterschrieben** → Nur unterschriebene Dokumente
- **Letzte Unterschriften** → Neueste Signaturen

### 3. **Aktionen** (rechts oben)

- **+ Neues Dokument** → Dokument erstellen
- **Abmelden** → Logout

---

## ➕ Neues Dokument erstellen

### Schritt-für-Schritt:

1. **Button klicken:** "+ Neues Dokument"

2. **Formular ausfüllen:**
   ```
   ┌─────────────────────────────────────┐
   │ Partner Firma *                     │
   │ ├─> z.B. "ABC GmbH"                 │
   │                                      │
   │ Ansprechpartner Name                │
   │ ├─> z.B. "Max Mustermann"           │
   │                                      │
   │ E-Mail                               │
   │ ├─> z.B. "max@abc-gmbh.de"          │
   │                                      │
   │ Telefon                              │
   │ ├─> z.B. "+49 123 456789"           │
   │                                      │
   │ Passwort (mind. 6 Zeichen) *        │
   │ ├─> z.B. "ABC123XY"                 │
   └─────────────────────────────────────┘
   ```

3. **"Dokument erstellen"** klicken

4. **Erfolgsmeldung** erscheint mit:
   - ✅ Dokument ID
   - ✅ Passwort (wird angezeigt)
   - ✅ Share-Link

5. **Versenden via:**

   **📱 WhatsApp:**
   - Öffnet WhatsApp
   - Nachricht bereits vorausgefüllt:
     ```
     NCNDA Dokument

     Link: https://...
     Passwort: ABC123XY
     ```
   - Empfänger auswählen → Senden

   **✉️ E-Mail:**
   - Öffnet E-Mail-Client
   - Betreff & Text vorausgefüllt
   - An-Feld mit Partner-E-Mail gefüllt
   - Senden

   **📋 Link kopieren:**
   - Link in Zwischenablage
   - Manuell versenden (Telegram, SMS, etc.)

---

## 📋 Dokumente verwalten

### Status-Übersicht:

| Status | Symbol | Bedeutung |
|--------|--------|-----------|
| **Entwurf** | 📝 | Erstellt, noch nicht versendet |
| **Versendet** | 📧 | Link wurde geteilt |
| **Unterschrieben** | ✅ | Partner hat unterschrieben |
| **Ausstehend** | ⏳ | Warte auf Unterschrift |

### Workflow:

```
1. ERSTELLEN
   ↓ (Status: Entwurf)

2. VERSENDEN (WhatsApp/E-Mail)
   ↓ (Status: Versendet)
   │
   │ → Partner öffnet Link
   │ → Gibt Passwort ein
   │ → IP wird registriert (1/3)
   │
   ↓

3. UNTERSCHREIBEN
   ↓ (Status: Unterschrieben)

4. ABGESCHLOSSEN ✅
```

---

## 🔍 Tabs im Detail

### 📋 Tab: "Alle Dokumente"

**Spalten:**
- **Dokument ID** → Eindeutige ID (z.B. DOC-1696...)
- **Partner Firma** → Firmenname
- **Partner Name** → Ansprechpartner
- **Status** → Aktueller Status (Badge)
- **IPs** → Registrierte IPs (z.B. 2/3)
- **Erstellt** → Erstellungsdatum
- **Aktionen** → Buttons

**Aktionen:**
- **Versenden** → Status auf "Versendet" setzen (nur bei Entwurf)
- **Details** → IP-Adressen & Details anzeigen
- **Löschen** → Dokument entfernen

---

### 📧 Tab: "Versendet"

Zeigt nur Dokumente mit Status **"Versendet"**.

**Zusätzliche Info:**
- **E-Mail** → Partner-E-Mail
- **Versendet am** → Zeitstempel

---

### ✅ Tab: "Unterschrieben"

Zeigt nur Dokumente mit Status **"Unterschrieben"**.

**Zusätzliche Info:**
- **Unterschrieben am** → Zeitstempel der Signatur
- **IP-Adresse** → IP des Unterzeichners

---

### 🖊️ Tab: "Letzte Unterschriften"

Zeigt die **5 neuesten Unterschriften**.

**Spalten:**
- Partner Name
- Position
- Firma
- Unterschrieben am
- IP-Adresse

---

## 📊 IP-Tracking verstehen

### Wie funktioniert es?

1. **Partner öffnet Link** → IP wird erfasst
2. **Passwort eingeben** → IP wird registriert
3. **Max. 3 IPs** → Danach blockiert

### Beispiel:

```
Dokument: DOC-123456

┌──────────────────────────────────────┐
│ Registrierte IPs:                    │
├──────────────────────────────────────┤
│ 1. 192.168.1.100 (Hamburg)           │
│    └─> 01.10.2024 14:23             │
│                                       │
│ 2. 85.14.23.45 (Berlin)              │
│    └─> 02.10.2024 09:15             │
│                                       │
│ 3. 172.16.0.5 (München)              │
│    └─> 02.10.2024 16:42             │
├──────────────────────────────────────┤
│ Status: 3/3 IPs → LIMIT ERREICHT ⛔  │
└──────────────────────────────────────┘
```

**4. Person versucht zu öffnen:**
```
❌ Fehler: Maximum IP limit reached
```

---

## ✍️ Unterschriften-Prozess

### Für den Partner (Empfänger):

1. **Link öffnen**
2. **Passwort eingeben** (vom Absender erhalten)
3. ✅ **Zugriff gewährt**
4. **Formular ausfüllen:**
   - Name
   - Position
   - Firma
5. **Digital unterschreiben** (ASCII-Signatur)
6. **"Fertig"** klicken
7. ✅ **Unterschrift gespeichert**

### Für Sie (Admin):

**Benachrichtigung im Dashboard:**
```
🔔 Neue Unterschrift!

Partner: Max Mustermann
Firma: ABC GmbH
Zeit: 02.10.2024 16:45
IP: 85.14.23.45
```

**Im Tab "Unterschrieben":**
- Dokument erscheint mit grünem ✅ Badge
- Details zeigen Unterschrift-Daten

---

## 📈 Statistiken nutzen

### Echtzeit-Updates:

- **Automatisch alle 30 Sekunden**
- **Manuell:** Seite neu laden (F5)

### Was Sie sehen:

**Gesamtübersicht:**
```
📊 Dashboard-Statistiken

├─ 📄 Gesamt: 25 Dokumente
│  ├─ 📝 Entwürfe: 5
│  ├─ 📧 Versendet: 10
│  ├─ ✅ Unterschrieben: 8
│  └─ ⏳ Ausstehend: 2

├─ 🌍 IP-Tracking
│  ├─ Aktive IPs: 45
│  └─ Durchschnitt: 1.8 IPs/Dokument

└─ 📝 Letzte 24h
   ├─ Neue Dokumente: 3
   └─ Neue Unterschriften: 2
```

---

## 🔄 Typischer Workflow (Beispiel)

### Szenario: Neuer Partner "ABC GmbH"

**1. Vorbereitung (Admin):**
```
→ Dashboard öffnen
→ "+ Neues Dokument" klicken
→ Eingeben:
   • Firma: ABC GmbH
   • Name: Max Mustermann
   • E-Mail: max@abc-gmbh.de
   • Passwort: SECURE2024
→ "Erstellen"
```

**2. Versand:**
```
→ Erfolgsmeldung erscheint
→ Klick auf "📧 E-Mail"
→ E-Mail-Client öffnet sich:

   An: max@abc-gmbh.de
   Betreff: NCNDA Dokument

   Sehr geehrter Herr Mustermann,

   Link: https://...
   Passwort: SECURE2024

→ E-Mail senden
→ Status: "Versendet" ✅
```

**3. Partner öffnet (Max Mustermann):**
```
→ Link klicken
→ Passwort eingeben: SECURE2024
→ ✅ Zugriff gewährt
→ IP registriert: 85.14.23.45 (1/3)
→ Formular ausfüllen
→ Unterschreiben
→ "Fertig" klicken
```

**4. Bestätigung (Admin):**
```
→ Dashboard aktualisiert sich
→ Statistik: "Unterschrieben" +1
→ Tab "Unterschrieben": Neuer Eintrag
→ Details zeigen:
   • IP: 85.14.23.45
   • Zeit: 02.10.2024 16:45
   • Unterschrift gespeichert ✅
```

**5. Abschluss:**
```
→ Dokument als PDF exportieren (optional)
→ Archivieren
→ Fertig! 🎉
```

---

## 🔧 Erweiterte Funktionen

### Details-Ansicht:

**Klick auf "Details" zeigt:**
```
┌──────────────────────────────────────┐
│ Dokument DOC-123456                  │
├──────────────────────────────────────┤
│ Partner: ABC GmbH                    │
│ Passwort: SECURE2024                 │
│ Status: Unterschrieben ✅            │
│                                       │
│ 📊 IP-Adressen (2/3):                │
│ ├─ 85.14.23.45 (02.10. 16:45)       │
│ └─ 192.168.1.1 (02.10. 09:12)       │
│                                       │
│ ✍️ Unterschrift:                     │
│ ├─ Name: Max Mustermann              │
│ ├─ Position: CEO                     │
│ └─ Zeit: 02.10.2024 16:45           │
└──────────────────────────────────────┘
```

### Massenaktionen (geplant):

- [ ] Mehrere Dokumente auswählen
- [ ] Bulk-Export als PDF
- [ ] Bulk-Versand
- [ ] Archivieren

---

## 🔒 Sicherheit

### Was gespeichert wird:

| Daten | Zweck | Verschlüsselt |
|-------|-------|---------------|
| Passwort | Zugriffskontrolle | Ja (Bcrypt) |
| IP-Adresse | Tracking (max 3) | Nein |
| Unterschrift | Rechtliche Gültigkeit | Nein |
| E-Mail | Versand | Nein |

### Best Practices:

1. ✅ **Admin-Passwort ändern** nach erstem Login
2. ✅ **Starke Passwörter** für Dokumente (min. 8 Zeichen)
3. ✅ **HTTPS aktivieren** im Produktions-Deployment
4. ✅ **Regelmäßige Backups** der Datenbank
5. ✅ **2FA aktivieren** (optional, via JWT Refresh Token)

---

## 📱 Mobile Nutzung

Das Dashboard ist **responsive** und funktioniert auf:

- ✅ Desktop (optimal)
- ✅ Tablet (gut)
- ✅ Smartphone (eingeschränkt)

**Mobile-Tipp:**
```
Landscape-Modus nutzen für bessere Übersicht!
```

---

## 🆘 Troubleshooting

### Problem: "Statistiken laden nicht"

**Lösung:**
```bash
# Browser-Konsole öffnen (F12)
→ Network Tab prüfen
→ Fehler bei /api/admin/dashboard?

# Server-Logs prüfen:
npm start
```

### Problem: "Dokument verschwindet nach Reload"

**Grund:** Datenbank wird bei jedem Deploy zurückgesetzt (Render Free Tier)

**Lösung:**
```
1. Render Dashboard öffnen
2. "Disks" hinzufügen
3. Mount Path: /opt/render/project/src
4. Redeploy
→ Daten bleiben erhalten!
```

### Problem: "Status wird nicht aktualisiert"

**Lösung:**
```javascript
// Browser-Konsole:
localStorage.clear();
location.reload();
```

---

## 📊 Datenbank-Struktur

### Tabellen:

**1. documents**
```sql
- id (PK)
- document_id (unique)
- password
- partner_company
- partner_name
- status (draft/sent/signed/pending)
- email, phone
- created_at, sent_at, signed_at
```

**2. ip_access**
```sql
- id (PK)
- document_id (FK)
- ip_address
- accessed_at
- user_agent
```

**3. signatures**
```sql
- id (PK)
- document_id (FK)
- partner_name
- partner_position
- signature_data
- signed_at
- ip_address
```

---

## 🚀 Nächste Schritte

1. ✅ **Lokal testen:** `npm start` → http://localhost:3000/admin.html
2. ✅ **Dokument erstellen** & versenden
3. ✅ **Mit 2. Gerät testen** (IP-Tracking)
4. ✅ **Online deployen** (siehe DEPLOYMENT.md)
5. ✅ **Produktiv nutzen** 🎉

---

**Viel Erfolg mit Ihrem NCNDA Dashboard! 📊🚀**
