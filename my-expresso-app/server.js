const express = require('express');
const path = require('path');

const app = express();
const PORT = 4000;

// ─── Étape 3 : Middleware des heures de travail ───────────────────────────
function workingHoursMiddleware(req, res, next) {
  const now = new Date();
  const day = now.getDay();    // 0 = Dimanche, 6 = Samedi
  const hour = now.getHours(); // 0–23

  const isWeekday = day >= 1 && day <= 5;       // Lundi–Vendredi
  const isWorkingHour = hour >= 9 && hour < 17; // 09:00–17:00

  if (isWeekday && isWorkingHour) {
    return next(); // ✅ On laisse passer
  }

  // ❌ Hors horaires → page fermée
  const dayNames = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const dayName = dayNames[day];
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  res.status(503).sendFile(path.join(__dirname, 'views', 'closed.html'));
}

// ─── Appliquer le middleware sur toutes les routes ────────────────────────
app.use(workingHoursMiddleware);

// ─── Fichiers statiques (CSS, images) ────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Routes principales ───────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'services.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

// ─── 404 ──────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// ─── Démarrer le serveur ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✦ my-expresso-app lancé sur http://localhost:${PORT}`);
  console.log(`  Horaires : Lun–Ven, 09:00–17:00`);
});