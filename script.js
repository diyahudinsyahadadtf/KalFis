const formulas = {
  gerak: [
    {
      id: "speed",
      name: "Kecepatan",
      formula: "v = s / t",
      fields: [
        { id: "s", label: "Jarak (meter)", unit: "m" },
        { id: "t", label: "Waktu (sekon)", unit: "s" }
      ],
      calculate: x => x.s / x.t,
      unit: "m/s",
      steps: x => `${x.s} / ${x.t}`
    },
    {
      id: "distance",
      name: "Jarak",
      formula: "s = v × t",
      fields: [
        { id: "v", label: "Kecepatan (m/s)", unit: "m/s" },
        { id: "t", label: "Waktu (sekon)", unit: "s" }
      ],
      calculate: x => x.v * x.t,
      unit: "m",
      steps: x => `${x.v} × ${x.t}`
    },
    {
      id: "acceleration",
      name: "Percepatan",
      formula: "a = (v₂ − v₁) / t",
      fields: [
        { id: "v2", label: "Kecepatan akhir (m/s)", unit: "m/s" },
        { id: "v1", label: "Kecepatan awal (m/s)", unit: "m/s" },
        { id: "t", label: "Waktu (sekon)", unit: "s" }
      ],
      calculate: x => (x.v2 - x.v1) / x.t,
      unit: "m/s²",
      steps: x => `(${x.v2} − ${x.v1}) / ${x.t}`
    }
  ],

  gaya: [
    {
      id: "force",
      name: "Gaya",
      formula: "F = m × a",
      fields: [
        { id: "m", label: "Massa (kg)", unit: "kg" },
        { id: "a", label: "Percepatan (m/s²)", unit: "m/s²" }
      ],
      calculate: x => x.m * x.a,
      unit: "N",
      steps: x => `${x.m} × ${x.a}`
    },
    {
      id: "mass",
      name: "Massa",
      formula: "m = F / a",
      fields: [
        { id: "F", label: "Gaya (N)", unit: "N" },
        { id: "a", label: "Percepatan (m/s²)", unit: "m/s²" }
      ],
      calculate: x => x.F / x.a,
      unit: "kg",
      steps: x => `${x.F} / ${x.a}`
    }
  ],

  energi: [
    {
      id: "kinetic",
      name: "Energi Kinetik",
      formula: "Ek = ½ × m × v²",
      fields: [
        { id: "m", label: "Massa (kg)", unit: "kg" },
        { id: "v", label: "Kecepatan (m/s)", unit: "m/s" }
      ],
      calculate: x => 0.5 * x.m * x.v ** 2,
      unit: "J",
      steps: x => `0.5 × ${x.m} × ${x.v}²`
    },
    {
      id: "work",
      name: "Usaha",
      formula: "W = F × s",
      fields: [
        { id: "F", label: "Gaya (N)", unit: "N" },
        { id: "s", label: "Perpindahan (m)", unit: "m" }
      ],
      calculate: x => x.F * x.s,
      unit: "J",
      steps: x => `${x.F} × ${x.s}`
    },
    {
      id: "power",
      name: "Daya",
      formula: "P = W / t",
      fields: [
        { id: "W", label: "Usaha (J)", unit: "J" },
        { id: "t", label: "Waktu (sekon)", unit: "s" }
      ],
      calculate: x => x.W / x.t,
      unit: "W",
      steps: x => `${x.W} / ${x.t}`
    }
  ],

  fluida: [
    {
      id: "pressure",
      name: "Tekanan",
      formula: "P = F / A",
      fields: [
        { id: "F", label: "Gaya tegak lurus (N)", unit: "N" },
        { id: "A", label: "Luas bidang (m²)", unit: "m²" }
      ],
      calculate: x => x.F / x.A,
      unit: "Pa",
      steps: x => `${x.F} / ${x.A}`
    }
  ],

  listrik: [
    {
      id: "voltage",
      name: "Tegangan",
      formula: "V = I × R",
      fields: [
        { id: "I", label: "Arus listrik (A)", unit: "A" },
        { id: "R", label: "Hambatan (Ω)", unit: "Ω" }
      ],
      calculate: x => x.I * x.R,
      unit: "V",
      steps: x => `${x.I} × ${x.R}`
    },
    {
      id: "current",
      name: "Arus Listrik",
      formula: "I = V / R",
      fields: [
        { id: "V", label: "Tegangan (V)", unit: "V" },
        { id: "R", label: "Hambatan (Ω)", unit: "Ω" }
      ],
      calculate: x => x.V / x.R,
      unit: "A",
      steps: x => `${x.V} / ${x.R}`
    },
    {
      id: "resistance",
      name: "Hambatan",
      formula: "R = V / I",
      fields: [
        { id: "V", label: "Tegangan (V)", unit: "V" },
        { id: "I", label: "Arus listrik (A)", unit: "A" }
      ],
      calculate: x => x.V / x.I,
      unit: "Ω",
      steps: x => `${x.V} / ${x.I}`
    }
  ]
};

const categorySelect = document.getElementById("category");
const formulaSelect = document.getElementById("formula");
const inputContainer = document.getElementById("inputs");
const resultBox = document.getElementById("result");
const historyBox = document.getElementById("history");

let history = [];

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function getCurrentFormulas() {
  return formulas[categorySelect.value] || [];
}

function loadFormulas() {
  formulaSelect.innerHTML = "";

  getCurrentFormulas().forEach(formula => {
    const option = document.createElement("option");
    option.value = formula.id;
    option.textContent = formula.name;
    formulaSelect.appendChild(option);
  });

  loadInputs();
}

function loadInputs() {
  const formula = getCurrentFormulas().find(
    item => item.id === formulaSelect.value
  );

  inputContainer.innerHTML = "";
  resultBox.style.display = "none";

  if (!formula) return;

  const formulaText = document.createElement("p");
  formulaText.textContent = "Rumus: " + formula.formula;
  inputContainer.appendChild(formulaText);

  formula.fields.forEach(field => {
    const label = document.createElement("label");
    label.htmlFor = "input-" + field.id;
    label.textContent = field.label;

    const input = document.createElement("input");
    input.id = "input-" + field.id;
    input.type = "number";
    input.step = "any";
    input.placeholder = "Masukkan " + field.label;
    input.inputMode = "decimal";

    inputContainer.appendChild(label);
    inputContainer.appendChild(input);
  });
}

function calculate() {
  const formula = getCurrentFormulas().find(
    item => item.id === formulaSelect.value
  );

  if (!formula) return;

  const values = {};

  for (const field of formula.fields) {
    const input = document.getElementById("input-" + field.id);
    const raw = input.value.trim();
    const value = Number(raw);

    if (raw === "" || !Number.isFinite(value)) {
      showResult("Mohon isi semua kolom dengan angka yang valid.", true);
      return;
    }

    // Penyebut tidak boleh nol.
    if (
      value === 0 &&
      (
        (formula.id === "speed" && field.id === "t") ||
        (formula.id === "acceleration" && field.id === "t") ||
        (formula.id === "mass" && field.id === "a") ||
        (formula.id === "power" && field.id === "t") ||
        (formula.id === "pressure" && field.id === "A") ||
        (formula.id === "current" && field.id === "R") ||
        (formula.id === "resistance" && field.id === "I")
      )
    ) {
      showResult("Nilai pembagi tidak boleh nol.", true);
      return;
    }

    if (
      (field.id === "m" || field.id === "t" ||
       field.id === "s" || field.id === "A" ||
       field.id === "R") &&
      value < 0
    ) {
      showResult("Massa, waktu, jarak, luas, dan hambatan tidak boleh negatif.", true);
      return;
    }

    values[field.id] = value;
  }

  const answer = formula.calculate(values);

  if (!Number.isFinite(answer)) {
    showResult("Hasil tidak valid. Periksa kembali nilai masukan.", true);
    return;
  }

  const formatted = Number(answer.toPrecision(8)).toString();
  const steps = formula.steps(values);

  showResult(
    `<strong>${escapeHTML(formula.name)}</strong><br>
     Rumus: ${escapeHTML(formula.formula)}<br>
     Perhitungan: ${escapeHTML(steps)}<br>
     Hasil: <strong>${escapeHTML(formatted)} ${escapeHTML(formula.unit)}</strong>`,
    false
  );

  history.unshift({
    name: formula.name,
    steps,
    answer: formatted + " " + formula.unit,
    time: new Date().toLocaleTimeString("id-ID")
  });

  history = history.slice(0, 10);
  renderHistory();
}

function showResult(message, isError) {
  resultBox.innerHTML = message;
  resultBox.className = isError ? "result error" : "result";
  resultBox.style.display = "block";
}

function renderHistory() {
  if (history.length === 0) {
    historyBox.innerHTML = "<p>Belum ada riwayat perhitungan.</p>";
    return;
  }

  historyBox.innerHTML = history.map(item => `
    <div class="history-item">
      <strong>${escapeHTML(item.name)}</strong><br>
      ${escapeHTML(item.steps)} = ${escapeHTML(item.answer)}
      <small>${escapeHTML(item.time)}</small>
    </div>
  `).join("");
}

function clearHistory() {
  history = [];
  renderHistory();
}

categorySelect.addEventListener("change", loadFormulas);
formulaSelect.addEventListener("change", loadInputs);

loadFormulas();
renderHistory();
