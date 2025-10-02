# ⚡ Windows Schnellstart - NCNDA System

## 🛠️ Problem: better-sqlite3 benötigt C++ Build Tools

### ✅ **Lösung 1: Build Tools installieren (EMPFOHLEN)**

**Warum:** Für Produktion am besten, SQLite funktioniert perfekt

**Schritt 1: Build Tools installieren**
```
Doppelklick auf: INSTALL_BUILDTOOLS.bat
```

**Oder manuell:**
1. Download: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
2. Installer starten
3. Workload auswählen: **"Desktop development with C++"**
4. Installieren (ca. 3-5 GB, 10-15 Minuten)
5. Computer neu starten

**Schritt 2: Dependencies installieren**
```bash
cd C:\Users\win11\Desktop\NCNDA_System
npm install
```

**Schritt 3: Server starten**
```bash
npm start
```

**Fertig!** → http://localhost:3000/admin.html

---

### ✅ **Lösung 2: Schneller Test ohne Installation**

**Wenn Sie die Build Tools NICHT installieren möchten:**

Ich kann eine Version ohne better-sqlite3 erstellen:
- Nutzt JSON-Dateien statt SQLite
- Funktioniert sofort ohne Installation
- Perfekt zum Testen
- Für Produktion: Lösung 1 verwenden

**Soll ich das machen?** Antworten Sie mit "ja" und ich erstelle die alternative Version.

---

### 🎯 **Empfehlung:**

**Für schnelles Testen JETZT:**
→ Lösung 2 (JSON-Version)

**Für Produktion & Deployment:**
→ Lösung 1 (Build Tools + SQLite)

---

**Was möchten Sie tun?**
