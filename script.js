// DOM Elements
const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalAmount = document.getElementById('total-amount');

// Data pengeluaran
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Fungsi untuk memperbarui tampilan
function renderExpenses() {
  expenseList.innerHTML = '';
  let total = 0;

  expenses.forEach((exp, index) => {
    const li = document.createElement('li');
    li.className = 'expense-item';

    total += exp.amount;

    li.innerHTML = `
      <div class="info">
        <strong>${exp.title}</strong>
        <span>${exp.category} • ${formatDate(exp.date)}</span>
      </div>
      <span class="amount">Rp ${exp.amount.toLocaleString()}</span>
    `;

    // Tambahkan event klik untuk menghapus
    li.addEventListener('click', () => {
      expenses.splice(index, 1);
      saveToLocalStorage();
      renderExpenses();
    });

    expenseList.appendChild(li);
  });

  totalAmount.textContent = `Rp ${total.toLocaleString()}`;
}

// Format tanggal (YYYY-MM-DD => DD/MM/YYYY)
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// Simpan ke localStorage
function saveToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Event Listener untuk form
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  const newExpense = { title, amount, category, date };

  expenses.push(newExpense);
  saveToLocalStorage();
  renderExpenses();

  // Reset form
  form.reset();
});

// Inisialisasi
renderExpenses();