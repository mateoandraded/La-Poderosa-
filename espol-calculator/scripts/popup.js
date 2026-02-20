document.addEventListener('DOMContentLoaded', () => {
    // === NAVIGATION ===
    const mainTabs = document.querySelectorAll('.nav-tabs .nav-btn');
    const mainSections = document.querySelectorAll('.view-section');
    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            mainTabs.forEach(t => t.classList.remove('active'));
            mainSections.forEach(s => s.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    const subTabs = document.querySelectorAll('.sub-nav-btn');
    const subSections = document.querySelectorAll('.detailed-content');
    subTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            subTabs.forEach(t => t.classList.remove('active'));
            subSections.forEach(s => s.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.sub).classList.add('active');
        });
    });

    // === QUICK CALC ===
    const qIn = {
        p1: document.getElementById('q-p1'),
        p2: document.getElementById('q-p2'),
        pract: document.getElementById('q-pract'),
        impr: document.getElementById('q-improv'),
        wTheo: document.getElementById('q-weight-theo'),
        wPract: document.getElementById('q-weight-pract'),
        subject: document.getElementById('q-subject')
    };
    const qOut = {
        grade: document.getElementById('q-grade'),
        status: document.getElementById('q-status'),
        advice: document.getElementById('q-advice'),
        imgHappy: document.getElementById('img-happy'),
        imgSad: document.getElementById('img-sad')
    };

    const parse = (val) => parseFloat(val) || 0;

    function updateVisuals(gradeVal, isPass, state) {
        // Colors
        qOut.grade.classList.remove('grade-pass', 'grade-fail');
        if (state === 'complete') {
            if (gradeVal >= 60) qOut.grade.classList.add('grade-pass');
            else qOut.grade.classList.add('grade-fail');
        }

        // Images
        qOut.imgHappy.style.display = 'none';
        qOut.imgSad.style.display = 'none';

        if (state === 'complete') {
            if (isPass) qOut.imgHappy.style.display = 'block';
            else qOut.imgSad.style.display = 'block';
        }
    }

    function calcQuick() {
        const p1 = parse(qIn.p1.value);
        const p2 = parse(qIn.p2.value);
        const pr = parse(qIn.pract.value);
        const im = parse(qIn.impr.value);
        const wT = parse(qIn.wTheo.value) / 100;
        const wP = parse(qIn.wPract.value) / 100;

        // Reset
        qOut.grade.innerText = "--";
        qOut.grade.classList.remove('grade-pass', 'grade-fail');
        qOut.imgHappy.style.display = 'none';
        qOut.imgSad.style.display = 'none';

        if (!qIn.p1.value && !qIn.p2.value && !qIn.pract.value) {
            qOut.status.innerText = "¿Terminó el semestre?";
            qOut.advice.innerText = "Ingresa tus notas para comenzar";
            return;
        }

        let res;
        if (qIn.impr.value) res = window.Logic.calculateImproved(p1, p2, im, pr, wT, wP);
        else res = window.Logic.calculateFinal(p1, p2, pr, wT, wP);

        qOut.grade.innerText = res.final.toFixed(2);

        // Logic branching
        if (!qIn.p2.value && qIn.p1.value) {
            // Caso: Solo P1 (En curso)
            const needed = window.Logic.calculateNeededForP2(p1, pr, wT, wP, 60.0);
            qOut.status.innerText = "En Curso";

            if (!qIn.pract.value) {
                // Validación explícita de práctico faltante
                qOut.advice.innerText = "Oye, falta el práctico y el 2do parcial";
            } else {
                if (needed > 100) qOut.advice.innerText = `Matemáticamente difícil (${needed.toFixed(2)})`;
                else if (needed <= 0) qOut.advice.innerText = "Ya has aprobado (teóricamente)";
                else qOut.advice.innerText = `Necesitas ${needed.toFixed(2)} en el Segundo Parcial`;
            }

        } else if (qIn.p1.value && qIn.p2.value && !qIn.pract.value && !qIn.impr.value) {
            // Caso: P1 y P2 pero NO Practico
            qOut.status.innerText = "¡Atención!";
            qOut.advice.innerText = "Oye, falta el práctico";
            // No mostramos tortuga ni color definitivo aun porque falta el practico

        } else if (res.passed) {
            // Aprobado
            qOut.status.innerText = "Aprobado";
            qOut.advice.innerText = "Has superado la materia";
            updateVisuals(res.final, true, 'complete');
        } else {
            // Reprobado
            qOut.status.innerText = "Reprobado";
            updateVisuals(res.final, false, 'complete');

            if (!qIn.impr.value && qIn.p2.value) {
                const maxP = Math.max(p1, p2);
                const targetTheo = (60.0 - (pr * wP)) / wT;
                const neededImp = (targetTheo * 2) - maxP;
                if (neededImp > 100) qOut.advice.innerText = "Nota requerida fuera de rango";
                else qOut.advice.innerText = `Necesitas ${neededImp.toFixed(2)} en Mejoramiento`;
            } else {
                qOut.advice.innerText = "No se alcanzó el puntaje mínimo";
            }
        }
    }
    Object.values(qIn).forEach(el => el.addEventListener('input', calcQuick));

    // === DETAILED CALC V7 ===
    const scoreEls = { p1: document.getElementById('score-p1'), p2: document.getElementById('score-p2'), pr: document.getElementById('score-pr') };

    function setupDetailedSection(weights, examId, scoreElId, targetInputId, structure) {

        // Setup Add Buttons
        for (const [type, listId] of Object.entries(structure)) {
            const btn = document.querySelector(`button[data-add="${listId}"]`);
            if (btn) {
                btn.addEventListener('click', () => {
                    const list = document.getElementById(listId);
                    const div = document.createElement('div');
                    div.className = 'row-item';
                    div.innerHTML = `
                         <input type="number" class="det-val" data-type="${type}" placeholder="0">
                         <button class="del-btn">×</button>
                    `;
                    div.querySelector('.del-btn').addEventListener('click', () => { div.remove(); recalc(); });
                    div.querySelector('input').addEventListener('input', recalc);
                    list.appendChild(div);
                });
            }
        }

        const recalc = () => {
            const sums = {};
            for (const [type, listId] of Object.entries(structure)) {
                if (!sums[type]) sums[type] = [];
                const inputs = document.querySelectorAll(`#${listId} input`);
                inputs.forEach(i => sums[type].push(parse(i.value)));
            }

            const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

            let total = 0;
            // Map types to weight input IDs
            const wMap = {
                'Lección': weights.les, 'Tarea': weights.tas,
                'Actividad': weights.act, 'Proyecto': weights.pro
            };

            for (const [type, wId] of Object.entries(wMap)) {
                if (document.getElementById(wId) && sums[type]) {
                    const w = parse(document.getElementById(wId).value) / 100;
                    total += avg(sums[type]) * w;
                }
            }

            const examVal = parse(document.getElementById(examId).value);
            const examW = parse(document.getElementById(weights.exa).value) / 100;
            total += examVal * examW;

            const resStr = total.toFixed(2);
            document.getElementById(scoreElId).innerText = resStr;
            const targetInput = document.getElementById(targetInputId);
            if (targetInput) targetInput.value = resStr;

            calcQuick();
        };

        // Attach listeners
        Object.values(weights).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', recalc);
        });
        document.getElementById(examId).addEventListener('input', recalc);
    }

    // P1 Setup
    setupDetailedSection(
        { les: 'p1-w-les', tas: 'p1-w-tas', act: 'p1-w-act', pro: 'p1-w-pro', exa: 'p1-w-exa' },
        'p1-exam-score', 'score-p1', 'q-p1',
        { 'Lección': 'p1-list-les', 'Tarea': 'p1-list-tas', 'Actividad': 'p1-list-act', 'Proyecto': 'p1-list-pro' }
    );

    // P2 Setup
    setupDetailedSection(
        { les: 'p2-w-les', tas: 'p2-w-tas', act: 'p2-w-act', pro: 'p2-w-pro', exa: 'p2-w-exa' },
        'p2-exam-score', 'score-p2', 'q-p2',
        { 'Lección': 'p2-list-les', 'Tarea': 'p2-list-tas', 'Actividad': 'p2-list-act', 'Proyecto': 'p2-list-pro' }
    );

    // Practico Setup
    setupDetailedSection(
        { les: 'pr-w-les', tas: 'pr-w-tas', pro: 'pr-w-pro', exa: 'pr-w-exa' },
        'pr-exam-score', 'score-pr', 'q-pract',
        { 'Lección': 'pr-list-les', 'Tarea': 'pr-list-tas', 'Proyecto': 'pr-list-pro' }
    );

    // === HISTORY ===
    const hList = document.getElementById('history-list');
    const hAvg = document.getElementById('general-average');

    function renderHistory() {
        chrome.storage.local.get(['subjects'], res => {
            const subs = res.subjects || [];
            hList.innerHTML = '';

            if (subs.length === 0) {
                hList.innerHTML = '<div style="padding:20px; text-align:center; color:#999; font-size:0.9rem;">No hay registros</div>';
                hAvg.innerText = "--";
                return;
            }

            let sum = 0;
            subs.slice().reverse().forEach((s, idx) => {
                const div = document.createElement('div');
                div.className = 'history-item';
                div.innerHTML = `
                    <span class="history-name">${s.name}</span>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span class="history-grade">${s.final}</span>
                        <button class="del-btn">×</button>
                    </div>
                `;
                div.querySelector('.del-btn').addEventListener('click', () => {
                    subs.splice(subs.length - 1 - idx, 1);
                    chrome.storage.local.set({ subjects: subs }, renderHistory);
                });
                hList.appendChild(div);
                sum += parseFloat(s.final);
            });
            hAvg.innerText = (sum / subs.length).toFixed(2);
        });
    }

    document.getElementById('q-save-btn').addEventListener('click', () => {
        const n = qIn.subject.value.trim();
        const v = qOut.grade.innerText;
        if (!n || v === "--") return;
        chrome.storage.local.get(['subjects'], r => {
            const s = r.subjects || [];
            s.push({ name: n, final: v, date: new Date() });
            chrome.storage.local.set({ subjects: s }, () => {
                qIn.subject.value = ""; renderHistory();
            });
        });
    });

    document.getElementById('h-manual-add').addEventListener('click', () => {
        const n = document.getElementById('h-manual-name').value.trim();
        const v = document.getElementById('h-manual-grade').value.trim();
        if (!n || !v) return;
        chrome.storage.local.get(['subjects'], r => {
            const s = r.subjects || [];
            s.push({ name: n, final: v, date: new Date() });
            chrome.storage.local.set({ subjects: s }, () => {
                document.getElementById('h-manual-name').value = "";
                document.getElementById('h-manual-grade').value = "";
                renderHistory();
            });
        });
    });

    // === SCRAPING & SLOTS ===
    const btnImport = document.getElementById('btn-import-grades');
    const slotDisplay = document.getElementById('slot-display');
    const slotName = document.getElementById('slot-name');
    const slotTime = document.getElementById('slot-time');

    if (btnImport) {
        btnImport.addEventListener('click', async () => {
            // 1. Get Active Tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab || !tab.url.includes('academico.espol.edu.ec')) {
                alert("Por favor, abre la página de calificaciones en el Académico (academico.espol.edu.ec) antes de importar.");
                return;
            }

            // 2. Inject Script
            try {
                const results = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['scripts/scraper.js']
                });

                const response = results[0].result;
                if (!response || !response.success) {
                    alert("Error al importar: " + (response ? response.message : "Desconocido"));
                    return;
                }

                // 3. Process Data
                const newSubjects = response.data;
                chrome.storage.local.get(['subjects'], (res) => {
                    let current = res.subjects || [];

                    // Merge avoiding duplicates (by name)
                    let addedCount = 0;
                    newSubjects.forEach(ns => {
                        const exists = current.find(s => s.name === ns.name);
                        if (!exists) {
                            current.push({ ...ns, date: new Date().toISOString() });
                            addedCount++;
                        } else {
                            // Update existing? Maybe logic to update if grade changed
                            // For now, keep existing or overwrite? Let's overwrite only if new grade is different
                            if (exists.final !== ns.final) {
                                exists.final = ns.final;
                                exists.credits = ns.credits;
                                addedCount++;
                            }
                        }
                    });

                    chrome.storage.local.set({ subjects: current }, () => {
                        alert(`¡Éxito! Se importaron/actualizaron ${addedCount} materias.`);
                        renderHistory();
                        updateSlot(current);
                    });
                });

            } catch (err) {
                console.error(err);
                alert("Error técnico: " + err.message);
            }
        });
    }

    function updateSlot(subjects) {
        if (!subjects || subjects.length === 0) {
            slotDisplay.style.display = 'none';
            return;
        }

        // Calculate Weighted Average (if credits exist) or Simple
        let totalProd = 0;
        let totalCreds = 0;

        subjects.forEach(s => {
            const grade = parseFloat(s.final);
            const creds = s.credits ? parseFloat(s.credits) : 4; // Default 4 if missing
            if (!isNaN(grade)) {
                totalProd += grade * creds;
                totalCreds += creds;
            }
        });

        const avg = totalCreds > 0 ? (totalProd / totalCreds) : 0;

        let franja = "";
        let horario = "";

        // Reglas de Franjas ESPOL
        if (avg >= 8.5) { franja = "Primera Franja"; horario = "10:00 AM - 1:00 PM"; }
        else if (avg >= 8.0) { franja = "Segunda Franja"; horario = "1:00 PM - 4:00 PM"; }
        else if (avg >= 7.5) { franja = "Tercera Franja"; horario = "4:00 PM - 7:00 PM"; }
        else if (avg >= 7.0) { franja = "Cuarta Franja"; horario = "7:00 PM - 10:00 PM"; }
        else if (avg >= 6.5) { franja = "Quinta Franja"; horario = "Día Siguiente 8:00 AM - 11:00 AM"; }
        else { franja = "Sexta Franja"; horario = "Día Siguiente 11:00 AM - 2:00 PM"; }

        // Baldeo check? (User said < 6.5 is sexta, baldeo is 2pm+)
        // Assuming Logic covers standard cases based on user info.

        slotName.innerText = `${franja} (Prom: ${avg.toFixed(2)})`;
        slotTime.innerText = horario;
        slotDisplay.style.display = 'flex';
    }

    document.getElementById('clear-history').addEventListener('click', () => {
        if (confirm("¿Eliminar historial?")) {
            chrome.storage.local.set({ subjects: [] }, () => {
                renderHistory();
                slotDisplay.style.display = 'none';
            });
        }
    });

    // Initial Render call updates
    chrome.storage.local.get(['subjects'], res => {
        if (res.subjects) updateSlot(res.subjects);
    });

    renderHistory();
    calcQuick(); // Force initial status
});
