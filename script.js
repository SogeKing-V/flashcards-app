let flashcards = [];
let currentCard = null;

document.getElementById('fileInput').addEventListener('change', handleFile, false);
document.getElementById('showQuestionBtn').addEventListener('click', showRandomQuestion);
document.getElementById('showAnswerBtn').addEventListener('click', showAnswer);

function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    flashcards = rows.slice(1)
      .filter(row => row[0] && row[1])
      .map(row => ({ question: row[0], answer: row[1] }));

    resetDisplay();
  };

  reader.readAsArrayBuffer(file);
}

function resetDisplay() {
  document.getElementById('questionText').textContent = '...';
  document.getElementById('answerText').textContent = '...';
  currentCard = null;
}

function showRandomQuestion() {
  if (flashcards.length === 0) {
    alert('Primero debes cargar un archivo Excel con preguntas y respuestas.');
    return;
  }

  const randomIndex = Math.floor(Math.random() * flashcards.length);
  currentCard = flashcards[randomIndex];
  document.getElementById('questionText').textContent = currentCard.question;
  document.getElementById('answerText').textContent = '...';
}

function showAnswer() {
  if (!currentCard) {
    alert('Primero pulsa "Preguntar" para ver una pregunta.');
    return;
  }

  document.getElementById('answerText').textContent = currentCard.answer;
}