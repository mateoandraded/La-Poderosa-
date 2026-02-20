const Logic = require('./scripts/logic.js');

console.log("=== TESTS CALCULADORA ESPOL ===");

// 1. Prueba de Cálculo Final (Datos ejemplo user)
// P1: 58.27, P2: 70, Pract: 80
// Final = (Avg(58.27, 70)*0.70) + (80*0.30)
// Avg = 64.135
// Theo = 64.135 * 0.7 = 44.8945
// Pract = 80 * 0.3 = 24
// Final = 68.8945 -> 68.89
const case1 = Logic.calculateFinal(58.27, 70, 80);
console.log(`Test 1 (Normal): Esperado ~68.89. Obtenido: ${case1.final}. Passed: ${case1.passed}`);

// 2. Prueba Needed for P2
// P1: 58.27, Pract: 80. Needed Final: 60.0
// Logic: (Avg * 0.7) + (Pract * 0.3) = 60
// (Avg * 0.7) + 24 = 60 -> Avg * 0.7 = 36 -> Avg = 51.428..
// (P1 + P2)/2 = 51.428 -> P1 + P2 = 102.857
// P2 = 102.857 - 58.27 = 44.587..
const case2 = Logic.calculateNeededForP2(58.27, 80);
console.log(`Test 2 (Needed): Needed P2 for passing with 60.0. Calculated: ${case2}`);

// 3. Prueba Partial
// Lessons: [100, 40, 68]. Avg = 69.33. * 0.25 = 17.33
// Tasks: [70, 20, 85, 80]. Avg = 63.75. * 0.25 = 15.9375
// Exam: 90. * 0.50 = 45.
// Total = 17.33 + 15.94 + 45 = 78.27.
// Let's verify with Logic.calculatePartialInfo.
const parts = { lessons: [100, 40, 68], tasks: [70, 20, 85, 80], exam: 90 };
const weights = { lessons: 0.25, tasks: 0.25, exam: 0.50 };
const pResult = Logic.calculatePartialInfo(parts, weights);
console.log(`Test 3 (Partial): Obtenido: ${pResult}`);

