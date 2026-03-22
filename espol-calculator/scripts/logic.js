/**
 * Lógica de Calculadora ESPOL
 */

const Logic = {
    /**
     * Calcula el promedio de un parcial basado en sus componentes.
     * @param {Object} components - { lessons: [], tasks: [], exam: number }
     * @param {Object} weights - { lessons: 0.25, tasks: 0.25, exam: 0.50 }
     */
    calculatePartialInfo: (components, weights) => {
        // Promediar arrays (si hay múltiples notas)
        const avgArray = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

        const lessonAvg = avgArray(components.lessons || []);
        const taskAvg = avgArray(components.tasks || []);
        const examScore = components.exam || 0;

        const partialGrade = (lessonAvg * weights.lessons) +
            (taskAvg * weights.tasks) +
            (examScore * weights.exam);

        return parseFloat(partialGrade.toFixed(2));
    },

    /**
     * Calcula la nota final teórica y total.
     */
    calculateFinal: (p1, p2, practical, theoWeight = 0.70, practWeight = 0.30) => {
        const p1Val = parseFloat(p1) || 0;
        const p2Val = parseFloat(p2) || 0;
        const practVal = parseFloat(practical) || 0;

        const theoreticalAvg = (p1Val + p2Val) / 2;
        const finalGrade = (theoreticalAvg * theoWeight) + (practVal * practWeight);

        return {
            p1: p1Val,
            p2: p2Val,
            practical: practVal,
            theoreticalAvg: parseFloat(theoreticalAvg.toFixed(2)),
            final: parseFloat((finalGrade / 10).toFixed(2)),
            passed: finalGrade >= 60.0
        };
    },

    /**
     * Calcula la nota incluyendo mejoramiento.
     * Reemplaza la nota más baja entre P1 y P2.
     */
    calculateImproved: (p1, p2, improvement, practical, theoWeight = 0.70, practWeight = 0.30) => {
        const impVal = parseFloat(improvement) || 0;
        let newP1 = parseFloat(p1) || 0;
        let newP2 = parseFloat(p2) || 0;

        // Estrategia: Reemplazar el menor si el mejoramiento es mayor
        if (impVal > Math.min(newP1, newP2)) {
            if (newP1 < newP2) {
                newP1 = impVal;
            } else {
                newP2 = impVal;
            }
        }

        return Logic.calculateFinal(newP1, newP2, practical, theoWeight, practWeight);
    },

    /**
     * Calcula qué nota necesitas en el P2 para pasar.
     * Base de paso: 60.0
     */
    calculateNeededForP2: (p1, practical, theoWeight = 0.70, practWeight = 0.30, minPass = 60.0) => {
        const p1Val = parseFloat(p1) || 0;
        const practVal = parseFloat(practical) || 0;

        // Final = (Theo * 0.7) + (Pract * 0.3)
        // Final = ((P1 + P2)/2 * 0.7) + (Pract * 0.3)
        // Despejamos P2:
        // (MinPass - Pract*0.3) / 0.7 = AvgTheo
        // AvgTheo * 2 - P1 = P2

        const requiredTheoScore = (minPass - (practVal * practWeight)) / theoWeight;
        const requiredAvg = requiredTheoScore; // Esto es el promedio de (P1+P2)/2

        // (P1 + P2) / 2 = requiredAvg  => P1 + P2 = 2 * requiredAvg => P2 = 2*requiredAvg - P1
        const requiredP2 = (requiredAvg * 2) - p1Val;

        return parseFloat(requiredP2.toFixed(2));
    }
};

// Exportar para pruebas si es entorno Node (module.exports), sino window global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Logic;
} else {
    window.Logic = Logic;
}
