// Scraper for Academico ESPOL (Simple V9)
(function () {
    console.log("ESPOL Scraper: Iniciando extracción...");

    function extractGrades() {
        const table = document.getElementById('ctl00_contenido_tbl_Calificaciones');
        if (!table) {
            return { success: false, message: "No se encontró la tabla de calificaciones. Asegúrate de haber consultado las notas." };
        }

        const subjects = [];
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 10) return;

            // 2: Materia, 9: Nota, 11: Estado
            const name = cells[2]?.innerText.trim();
            const gradeTxt = cells[9]?.innerText.trim();
            const state = cells[11]?.innerText.trim();

            if (name && gradeTxt) {
                const grade = parseFloat(gradeTxt.replace(',', '.'));
                if (!isNaN(grade)) {
                    subjects.push({ name, final: grade, credits: 4, state });
                }
            }
        });

        if (subjects.length === 0) {
            return { success: false, message: "Tabla encontrada pero vacía." };
        }

        return { success: true, count: subjects.length, data: subjects };
    }

    try {
        return extractGrades();
    } catch (e) {
        return { success: false, message: e.toString() };
    }
})();
