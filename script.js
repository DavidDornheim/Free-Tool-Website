function generatePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
      const rand = Math.floor(Math.random() * chars.length);
      password += chars[rand];
    }
    document.getElementById("password-output").value = password;
  }

  function generateRandomNumber() {
  const min = parseInt(document.getElementById("min-number").value);
  const max = parseInt(document.getElementById("max-number").value);
  
  if (isNaN(min) || isNaN(max) || min > max) {
    document.getElementById("random-number-output").value = "Ungültige Eingabe";
    return;
  }

  const result = Math.floor(Math.random() * (max - min + 1)) + min;
  document.getElementById("random-number-output").value = result;
}

function generateQRCode() {
  const input = document.getElementById("qr-input").value;
  const qrOutput = document.getElementById("qr-output");

  // Vorherigen QR-Code entfernen (falls vorhanden)
  qrOutput.innerHTML = "";

  if (input.trim() === "") {
    qrOutput.innerText = "Bitte gib einen Text oder Link ein.";
    return;
  }

  new QRCode(qrOutput, {
    text: input,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}

function countText() {
  const text = document.getElementById("text-input").value;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;

  document.getElementById("word-count").innerText = `Wörter: ${words}`;
  document.getElementById("char-count").innerText = `Zeichen: ${chars}`;
}

function rollDice() {
  const result = Math.floor(Math.random() * 6) + 1;
  const dice = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  document.getElementById("dice-result").innerText = `Ergebnis: ${dice[result - 1]} (${result})`;
}

function addTodo() {
  const input = document.getElementById("todo-input");
  const taskText = input.value.trim();
  if (taskText === "") return;

  const li = document.createElement("li");
  li.innerHTML = `
    <input type="checkbox" onchange="toggleDone(this)">
    <span>${taskText}</span>
    <button onclick="deleteTodo(this)">🗑️</button>
  `;
  document.getElementById("todo-items").appendChild(li);
  input.value = "";
}

function toggleDone(checkbox) {
  const span = checkbox.nextElementSibling;
  span.style.textDecoration = checkbox.checked ? "line-through" : "none";
}

function deleteTodo(button) {
  const li = button.parentElement;
  li.remove();
}

function calculateBMI() {
  const height = parseFloat(document.getElementById("bmi-height").value);
  const weight = parseFloat(document.getElementById("bmi-weight").value);
  const resultElement = document.getElementById("bmi-result");

  if (!height || !weight || height <= 0 || weight <= 0) {
    resultElement.innerText = "Bitte gültige Werte eingeben.";
    return;
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  let category = "";

  if (bmi < 18.5) category = "Untergewicht";
  else if (bmi < 25) category = "Normalgewicht";
  else if (bmi < 30) category = "Übergewicht";
  else category = "Adipositas";

  resultElement.innerText = `Dein BMI: ${bmi.toFixed(1)} – ${category}`;
}

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar(month, year) {
  const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];
  const daysOfWeek = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const table = document.getElementById("calendar-table");
  table.innerHTML = "";

  const monthYearLabel = document.getElementById("calendar-month-year");
  monthYearLabel.innerText = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  let row = table.insertRow();
  daysOfWeek.forEach(day => {
    const cell = row.insertCell();
    cell.innerHTML = `<strong>${day}</strong>`;
  });

  row = table.insertRow();
  for (let i = 0; i < adjustedFirstDay; i++) {
    row.insertCell();
  }

  for (let day = 1; day <= daysInMonth; day++) {
    if (row.cells.length === 7) row = table.insertRow();
    const cell = row.insertCell();
    cell.innerText = day;
  }
}

function changeMonth(offset) {
  currentMonth += offset;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
}

renderCalendar(currentMonth, currentYear);

const unitOptions = {
  length: ["Meter", "Kilometer", "Zentimeter", "Millimeter"],
  weight: ["Kilogramm", "Gramm", "Tonne"],
  temperature: ["Celsius", "Fahrenheit", "Kelvin"]
};

const conversionFunctions = {
  length: {
    Meter: 1,
    Kilometer: 0.001,
    Zentimeter: 100,
    Millimeter: 1000
  },
  weight: {
    Kilogramm: 1,
    Gramm: 1000,
    Tonne: 0.001
  }
};

document.getElementById("unit-type").addEventListener("change", updateUnitSelects);
updateUnitSelects(); // Initial beim Laden

function updateUnitSelects() {
  const type = document.getElementById("unit-type").value;
  const from = document.getElementById("from-unit");
  const to = document.getElementById("to-unit");
  from.innerHTML = '';
  to.innerHTML = '';

  unitOptions[type].forEach(unit => {
    from.innerHTML += `<option value="${unit}">${unit}</option>`;
    to.innerHTML += `<option value="${unit}">${unit}</option>`;
  });
}

function convertUnits() {
  const type = document.getElementById("unit-type").value;
  const input = parseFloat(document.getElementById("unit-input").value);
  const from = document.getElementById("from-unit").value;
  const to = document.getElementById("to-unit").value;
  const result = document.getElementById("unit-result");

  if (type === "temperature") {
    let output;
    if (from === to) output = input;
    else if (from === "Celsius") output = to === "Fahrenheit" ? input * 9/5 + 32 : input + 273.15;
    else if (from === "Fahrenheit") output = to === "Celsius" ? (input - 32) * 5/9 : (input - 32) * 5/9 + 273.15;
    else if (from === "Kelvin") output = to === "Celsius" ? input - 273.15 : (input - 273.15) * 9/5 + 32;
    result.textContent = `${output.toFixed(2)} ${to}`;
  } else {
    const base = input / conversionFunctions[type][from];
    const converted = base * conversionFunctions[type][to];
    result.textContent = `${converted.toFixed(2)} ${to}`;
  }
}

// Stoppuhr
let stopwatchInterval;
let stopwatchTime = 0;

function updateStopwatchDisplay() {
  let hrs = Math.floor(stopwatchTime / 3600);
  let mins = Math.floor((stopwatchTime % 3600) / 60);
  let secs = stopwatchTime % 60;
  document.getElementById("stopwatch-display").textContent =
    `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startStopwatch() {
  if (!stopwatchInterval) {
    stopwatchInterval = setInterval(() => {
      stopwatchTime++;
      updateStopwatchDisplay();
    }, 1000);
  }
}

function pauseStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
}

function resetStopwatch() {
  pauseStopwatch();
  stopwatchTime = 0;
  updateStopwatchDisplay();
}

// Timer
let timerInterval;

function startTimer() {
  const minutes = parseInt(document.getElementById("timer-minutes").value);
  if (isNaN(minutes) || minutes <= 0) return;

  let totalSeconds = minutes * 60;
  updateTimerDisplay(totalSeconds);

  timerInterval = setInterval(() => {
    totalSeconds--;
    updateTimerDisplay(totalSeconds);
    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      alert("⏰ Zeit ist um!");
    }
  }, 1000);
}

function updateTimerDisplay(seconds) {
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;
  document.getElementById("timer-display").textContent =
    `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const nameStart = ["Mega", "Super", "Crazy", "Dark", "Happy", "Silent", "Thunder", "Ninja", "Fluffy", "Shadow"];
const nameEnd = ["Tiger", "Banana", "Hero", "Gamer", "Wizard", "Penguin", "Fox", "Knight", "Unicorn", "Cat"];

function generateName() {
  const start = nameStart[Math.floor(Math.random() * nameStart.length)];
  const end = nameEnd[Math.floor(Math.random() * nameEnd.length)];
  document.getElementById("name-output").textContent = `${start}${end}`;
}

function saveNote() {
  const note = document.getElementById("note-text").value;
  localStorage.setItem("notizblock", note);
  document.getElementById("note-status").textContent = "✅ Notiz gespeichert!";
}

function clearNote() {
  document.getElementById("note-text").value = "";
  localStorage.removeItem("notizblock");
  document.getElementById("note-status").textContent = "🗑️ Notiz gelöscht!";
}

// Beim Laden: vorhandene Notiz anzeigen
window.addEventListener("DOMContentLoaded", () => {
  const savedNote = localStorage.getItem("notizblock");
  if (savedNote) {
    document.getElementById("note-text").value = savedNote;
    document.getElementById("note-status").textContent = "💾 Gespeicherte Notiz geladen.";
  }
});

const sprueche = [
  "Träume nicht dein Leben – lebe deinen Traum.",
  "Heute ist der erste Tag vom Rest deines Lebens.",
  "Sei du selbst – alle anderen gibt es schon.",
  "Auch aus Steinen, die dir in den Weg gelegt werden, kannst du etwas Schönes bauen.",
  "Lächeln ist die schönste Sprache der Welt.",
  "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.",
  "Der Weg ist das Ziel.",
  "Jeder Tag ist eine neue Chance.",
  "Du bist stärker, als du denkst.",
  "Mach es einfach – und mach es einfach."
];

function zeigeSpruch() {
  const zufall = Math.floor(Math.random() * sprueche.length);
  document.getElementById("spruch-anzeige").textContent = `"${sprueche[zufall]}"`;
}

function berechneTrinkgeld() {
  const betrag = parseFloat(document.getElementById("betrag").value);
  const prozent = parseFloat(document.getElementById("prozent").value);

  if (isNaN(betrag) || isNaN(prozent)) {
    document.getElementById("rechner-ausgabe").textContent = "Bitte gültige Zahlen eingeben.";
    return;
  }

  const tipp = betrag * (prozent / 100);
  const gesamt = betrag + tipp;

  document.getElementById("rechner-ausgabe").textContent =
    `💡 Trinkgeld: ${tipp.toFixed(2)} € | Gesamtbetrag: ${gesamt.toFixed(2)} €`;
}

function berechneRabatt() {
  const betrag = parseFloat(document.getElementById("betrag").value);
  const prozent = parseFloat(document.getElementById("prozent").value);

  if (isNaN(betrag) || isNaN(prozent)) {
    document.getElementById("rechner-ausgabe").textContent = "Bitte gültige Zahlen eingeben.";
    return;
  }

  const rabatt = betrag * (prozent / 100);
  const neu = betrag - rabatt;

  document.getElementById("rechner-ausgabe").textContent =
    `💸 Rabatt: ${rabatt.toFixed(2)} € | Neuer Preis: ${neu.toFixed(2)} €`;
}

const horoskope = [
  "Heute erwartet dich eine spannende Wendung – bleib offen für Neues!",
  "Deine Energie ist ansteckend – nutze sie, um andere zu motivieren.",
  "Nimm dir heute Zeit für dich selbst – du hast es verdient.",
  "Etwas Unerwartetes bringt dich zum Lächeln.",
  "Vertraue deinem Bauchgefühl – es liegt richtig.",
  "Heute ist ein guter Tag, um alte Pläne endlich umzusetzen.",
  "Ein kleiner Erfolg gibt dir großen Auftrieb.",
  "Sei mutig – der richtige Moment ist jetzt!",
  "Du wirst überrascht, wie viel du heute schaffst.",
  "Ein Gespräch bringt neue Klarheit in dein Leben."
];

function zeigeHoroskop() {
  const zeichen = document.getElementById("sternzeichen").value;
  const zufall = horoskope[Math.floor(Math.random() * horoskope.length)];
  document.getElementById("horoskop-anzeige").textContent = `🔮 ${zeichen}: ${zufall}`;
}

function binZuDez() {
  const eingabe = document.getElementById("zahlInput").value.trim();
  if (/^[01]+$/.test(eingabe)) {
    const dezimal = parseInt(eingabe, 2);
    document.getElementById("zahlErgebnis").textContent = `Dezimal: ${dezimal}`;
  } else {
    document.getElementById("zahlErgebnis").textContent = "Ungültige Binärzahl.";
  }
}

function dezZuBin() {
  const eingabe = document.getElementById("zahlInput").value.trim();
  const dezimal = parseInt(eingabe, 10);
  if (!isNaN(dezimal)) {
    const binär = dezimal.toString(2);
    document.getElementById("zahlErgebnis").textContent = `Binär: ${binär}`;
  } else {
    document.getElementById("zahlErgebnis").textContent = "Ungültige Dezimalzahl.";
  }
}

const umrechnungsfaktoren = {
  meter: 1,
  kilometer: 1000,
  centimeter: 0.01,
  millimeter: 0.001
};

function umrechnen() {
  const wert = parseFloat(document.getElementById("wertInput").value);
  const vonEinheit = document.getElementById("vonEinheit").value;
  const nachEinheit = document.getElementById("nachEinheit").value;

  if (!isNaN(wert)) {
    const umgerechneterWert = wert * umrechnungsfaktoren[vonEinheit] / umrechnungsfaktoren[nachEinheit];
    document.getElementById("umrechnenErgebnis").textContent = `${wert} ${vonEinheit} = ${umgerechneterWert} ${nachEinheit}`;
  } else {
    document.getElementById("umrechnenErgebnis").textContent = "Bitte geben Sie eine gültige Zahl ein.";
  }
}

let reaktionsStartZeit;
let reaktionsEndZeit;

function starteReaktion() {
  const button = document.getElementById("startButton");
  button.disabled = true;
  button.textContent = "Warte auf Grün...";

  // Button nach zufälliger Zeit grün machen
  const warteZeit = Math.floor(Math.random() * 5000) + 2000; // zwischen 2 und 7 Sekunden warten
  setTimeout(() => {
    button.style.backgroundColor = "green";
    button.textContent = "Jetzt Klicken!";
    reaktionsStartZeit = new Date().getTime();
    button.disabled = false;
  }, warteZeit);
}

document.getElementById("startButton").addEventListener("click", function () {
  if (this.style.backgroundColor === "green") {
    reaktionsEndZeit = new Date().getTime();
    const reaktionszeit = reaktionsEndZeit - reaktionsStartZeit;
    document.getElementById("reaktionszeitErgebnis").textContent = `Deine Reaktionszeit: ${reaktionszeit} ms`;
    this.disabled = true;
    this.textContent = "Erneut starten";
    this.style.backgroundColor = "";
  }
});

let richtigeAntwort;
let aktuelleAufgabe;

function generiereAufgabe() {
  const zahl1 = Math.floor(Math.random() * 100) + 1;
  const zahl2 = Math.floor(Math.random() * 100) + 1;
  aktuelleAufgabe = { zahl1, zahl2, summe: zahl1 + zahl2 };
  
  document.getElementById("rechenaufgabe").textContent = `Was ist ${zahl1} + ${zahl2}?`;
  richtigeAntwort = aktuelleAufgabe.summe;
}

function checkAntwort() {
  const userAntwort = parseInt(document.getElementById("antwortInput").value, 10);
  if (userAntwort === richtigeAntwort) {
    document.getElementById("antwortErgebnis").textContent = "Richtig!";
  } else {
    document.getElementById("antwortErgebnis").textContent = `Falsch! Die richtige Antwort ist ${richtigeAntwort}.`;
  }
  generiereAufgabe(); // Neue Aufgabe generieren
}

// Initiale Aufgabe generieren
generiereAufgabe();

function textUmkehren() {
  const text = document.getElementById("textInput").value;
  const umgekehrterText = text.split('').reverse().join('');
  document.getElementById("textErgebnis").textContent = `Umgekehrter Text: ${umgekehrterText}`;
}

function textInGross() {
  const text = document.getElementById("textInput").value;
  const grosserText = text.toUpperCase();
  document.getElementById("textErgebnis").textContent = `Text in Großbuchstaben: ${großerText}`;
}

function textInKlein() {
  const text = document.getElementById("textInput").value;
  const kleinerText = text.toLowerCase();
  document.getElementById("textErgebnis").textContent = `Text in Kleinbuchstaben: ${kleinerText}`;
}

function textZählen() {
  const text = document.getElementById("textInput").value;
  const wortAnzahl = text.split(/\s+/).length;
  const zeichenAnzahl = text.length;
  document.getElementById("textErgebnis").textContent = `Wörter: ${wortAnzahl}, Zeichen: ${zeichenAnzahl}`;
}

function textVorlesen() {
  const text = document.getElementById("speechInput").value;

  if (text.trim() === "") {
    document.getElementById("speechStatus").textContent = "Bitte geben Sie einen Text ein!";
    return;
  }

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "de-DE"; // Setze die Sprache auf Deutsch
  window.speechSynthesis.speak(speech);
  
  document.getElementById("speechStatus").textContent = "Text wird vorgelesen...";
}

document.getElementById('ingredients-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const ingredient1 = document.getElementById('ingredient1').value;
  const ingredient2 = document.getElementById('ingredient2').value;
  const ingredient3 = document.getElementById('ingredient3').value;

  const ingredients = [ingredient1, ingredient2, ingredient3].join(',');

  fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=1e153316dd674df58d49dcda08d0a385`)
    .then(response => response.json())
    .then(data => {
      let recipeHTML = '<h2>Rezepte:</h2>';
      data.forEach(recipe => {
        recipeHTML += `<div>
                         <h3>${recipe.title}</h3>
                         <img src="${recipe.image}" alt="${recipe.title}">
                       </div>`;
      });

      document.getElementById('recipe-results').innerHTML = recipeHTML;
    })
    .catch(error => console.log('Fehler:', error));
});

document.getElementById("ingredients-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const ingredients = [
    document.getElementById("ingredient1").value,
    document.getElementById("ingredient2").value,
    document.getElementById("ingredient3").value,
    document.getElementById("ingredient4").value
  ]
    .filter(i => i.trim() !== "")
    .join(",");

  if (!ingredients) {
    document.getElementById("recipe-results").innerHTML = "<p>Bitte gib mindestens eine Zutat ein.</p>";
    return;
  }

  const apiKey = "1e153316dd674df58d49dcda08d0a385"; // Achtung: öffentlich sichtbar
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=5&apiKey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!data.length) {
        document.getElementById("recipe-results").innerHTML = "<p>Keine Rezepte gefunden.</p>";
        return;
      }

      // Für jedes Rezept weitere Infos abrufen
      const detailPromises = data.map(recipe =>
        fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`)
          .then(response => response.json())
      );

      Promise.all(detailPromises).then(details => {
        const resultHTML = details
          .map(r => `
            <div class="recipe">
              <h3><a href="${r.sourceUrl}" target="_blank" rel="noopener noreferrer">${r.title}</a></h3>
              <img src="${r.image}" alt="${r.title}" style="max-width: 100%; border-radius: 8px;" />
              <p><strong>Zubereitungszeit:</strong> ${r.readyInMinutes} Minuten</p>
              <p><strong>Portionen:</strong> ${r.servings}</p>
            </div>
          `)
          .join("");

        document.getElementById("recipe-results").innerHTML = resultHTML;
      });
    })
    .catch(error => {
      console.error("Fehler beim Abrufen der Rezepte:", error);
      document.getElementById("recipe-results").innerHTML = "<p>Fehler beim Laden der Rezepte.</p>";
    });
});

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function switchTab(tabId) {
  // Tabs ausblenden
  const allTabs = document.querySelectorAll('.tab-content');
  allTabs.forEach(tab => tab.classList.add('hidden'));

  // Aktiven Tab anzeigen
  const selected = document.getElementById(tabId);
  if (selected) selected.classList.remove('hidden');

  // Buttons aktualisieren
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.tab-btn[onclick*="${tabId}"]`).classList.add('active');
}

// 1. Wochentags-Rechner
function calculateWeekday() {
  const date = new Date(document.getElementById("date-input").value);
  const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  document.getElementById("weekday-result").textContent = `Das ist ein ${days[date.getDay()]}`;
}

// 2. Countdown
function calculateCountdown() {
  const inputDate = new Date(document.getElementById("countdown-date").value);
  const now = new Date();
  const diffTime = inputDate - now;
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  document.getElementById("countdown-result").textContent = `Noch ${days} Tag(e) bis zu diesem Datum.`;
}

// 3. Paketverfolgung
function trackPackage() {
  const number = document.getElementById("tracking-number").value.trim();
  const provider = document.getElementById("tracking-provider").value;
  let url = "#";

  switch (provider) {
    case "dhl":
      url = `https://www.dhl.de/de/privatkunden/dhl-sendungsverfolgung.html?piececode=${number}`;
      break;
    case "ups":
      url = `https://www.ups.com/track?tracknum=${number}`;
      break;
    case "hermes":
      url = `https://www.myhermes.de/empfangen/sendungsverfolgung/?trackingNumber=${number}`;
      break;
  }

  if (number) window.open(url, "_blank");
}

// 4. Tagesjournal (localStorage)
function saveJournal() {
  const text = document.getElementById("journal-text").value;
  localStorage.setItem("dailyJournal", text);
  document.getElementById("journal-status").textContent = "✅ Gespeichert im Browser.";
}

// 5. Zutaten-Umrechner
function convertIngredient() {
  const amount = parseFloat(document.getElementById("ingredient-amount").value);
  const type = document.getElementById("ingredient-type").value;
  let result = 0;

  switch (type) {
    case "sugar": result = amount * 12; break;     // 1 EL Zucker ≈ 12 g
    case "flour": result = amount * 10; break;     // 1 EL Mehl ≈ 10 g
    case "butter": result = amount * 15; break;    // 1 EL Butter ≈ 15 g
  }

  document.getElementById("ingredient-result").textContent = `${amount} EL ${type} ≈ ${result} g`;
}

// 6. Wetteranzeige (Google - ohne API-Schlüssel)
function showWeather() {
  const city = document.getElementById("weather-city").value.trim();
  if (city) {
    const url = `https://www.google.com/search?q=Wetter+${encodeURIComponent(city)}`;
    window.open(url, "_blank");
  }
}

const emojis = ['🍕', '🐶', '🚗', '🌈', '🦄', '🎈', '🎮', '🍓'];
let memoryDeck = [...emojis, ...emojis];
let revealed = [];
let locked = false;

function shuffleMemory(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createMemoryGrid() {
  shuffleMemory(memoryDeck);
  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  memoryDeck.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    card.addEventListener('click', () => revealCard(card));
    grid.appendChild(card);
  });
}

function revealCard(card) {
  if (locked || card.classList.contains('revealed')) return;
  card.textContent = card.dataset.emoji;
  card.classList.add('revealed');
  revealed.push(card);

  if (revealed.length === 2) {
    locked = true;
    const [first, second] = revealed;
    if (first.dataset.emoji === second.dataset.emoji) {
      revealed = [];
      locked = false;
      if (document.querySelectorAll('.memory-card.revealed').length === memoryDeck.length) {
        document.getElementById('memory-message').textContent = "🎉 Alle Paare gefunden!";
      }
    } else {
      setTimeout(() => {
        first.textContent = '';
        second.textContent = '';
        first.classList.remove('revealed');
        second.classList.remove('revealed');
        revealed = [];
        locked = false;
      }, 800);
    }
  }
}

createMemoryGrid();

let tttCurrent = 'X';
let tttBoard = Array(9).fill(null);

function renderTicTacToe() {
  const grid = document.getElementById('ttt-grid');
  grid.innerHTML = '';
  tttBoard.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.classList.add('ttt-cell');
    cell.textContent = val || '';
    cell.addEventListener('click', () => handleTicTacToeClick(i));
    grid.appendChild(cell);
  });
}

function handleTicTacToeClick(index) {
  if (tttBoard[index] || checkTicTacToeWinner()) return;
  tttBoard[index] = tttCurrent;
  tttCurrent = tttCurrent === 'X' ? 'O' : 'X';
  document.getElementById('ttt-status').textContent = `Spieler: ${tttCurrent}`;
  renderTicTacToe();

  const winner = checkTicTacToeWinner();
  if (winner) {
    document.getElementById('ttt-status').textContent = `🎉 Spieler ${winner} gewinnt!`;
  } else if (!tttBoard.includes(null)) {
    document.getElementById('ttt-status').textContent = "🤝 Unentschieden!";
  }
}

function checkTicTacToeWinner() {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8], // Zeilen
    [0,3,6],[1,4,7],[2,5,8], // Spalten
    [0,4,8],[2,4,6]          // Diagonalen
  ];
  for (const [a,b,c] of winCombos) {
    if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
      return tttBoard[a];
    }
  }
  return null;
}

function resetTicTacToe() {
  tttBoard = Array(9).fill(null);
  tttCurrent = 'X';
  document.getElementById('ttt-status').textContent = `Spieler: ${tttCurrent}`;
  renderTicTacToe();
}

renderTicTacToe();

function createBingImage() {
  const prompt = document.getElementById("imagePrompt").value.trim();
  if (prompt) {
    const url = `https://www.bing.com/images/create?q=${encodeURIComponent(prompt)}`;
    window.open(url, "_blank");
  } else {
    alert("Bitte gib eine Beschreibung für das Bild ein.");
  }
}
