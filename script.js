// DOM Elements
const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalAmount = document.getElementById('total-amount');
const filterSelect = document.getElementById('filter-category');
const exportBtn = document.getElementById('export-btn');

// Data pengeluaran
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Fungsi untuk memfilter dan merender
function renderExpenses() {
  const selectedCategory = filterSelect.value;
  const filteredExpenses = selectedCategory 
    ? expenses.filter(exp => exp.category === selectedCategory)
    : expenses;

  expenseList.innerHTML = '';
  let total = 0;

  filteredExpenses.forEach((exp, index) => {
    const originalIndex = expenses.indexOf(exp); // Indeks asli untuk hapus
    total += exp.amount;

    const li = document.createElement('li');
    li.className = 'expense-item';

    li.innerHTML = `
      <div class="info">
        <strong>${exp.title}</strong>
        <span>${exp.category} • ${formatDate(exp.date)}</span>
      </div>
      <span class="amount">Rp ${exp.amount.toLocaleString()}</span>
    `;

    li.addEventListener('click', () => {
      if (confirm(`Hapus pengeluaran: ${exp.title}?`)) {
        expenses.splice(originalIndex, 1);
        saveToLocalStorage();
        renderExpenses();
      }
    });

    expenseList.appendChild(li);
  });

  totalAmount.textContent = `Rp ${total.toLocaleString()}`;
}

// Format tanggal
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// Simpan ke localStorage
function saveToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Ekspor ke Excel
exportBtn.addEventListener('click', () => {
  if (expenses.length === 0) {
    alert("Tidak ada data untuk diekspor.");
    return;
  }

  const data = expenses.map(exp => ({
    "Nama Pengeluaran": exp.title,
    "Kategori": exp.category,
    "Jumlah (Rp)": exp.amount,
    "Tanggal": formatDate(exp.date)
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pengeluaran Bulanan");

  // Download file
  XLSX.writeFile(wb, `pengeluaran_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.xlsx`);
});

// Filter kategori
filterSelect.addEventListener('change', renderExpenses);

// Tambah pengeluaran
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  expenses.push({ title, amount, category, date });
  saveToLocalStorage();
  renderExpenses();

  form.reset();
});

// Inisialisasi
renderExpenses();
