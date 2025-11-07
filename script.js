const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Update local storage
function updateLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Update total
function updateTotal() {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  totalDisplay.textContent = `Total: ₹${total}`;
}

// Render expense list
function renderExpenses() {
  expenseList.innerHTML = "";
  expenses.forEach((exp, index) => {
    const item = document.createElement("div");
    item.classList.add("expense-item");
    item.innerHTML = `
      <span>${exp.name} - ₹${exp.amount} (${exp.category}) - ${exp.date}</span>
      <div class="actions">
        <button class="edit" onclick="editExpense(${index})">✏️</button>
        <button class="delete" onclick="deleteExpense(${index})">🗑️</button>
      </div>
    `;
    expenseList.appendChild(item);
  });
  updateTotal();
}

// Add new expense
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  expenses.push({ name, amount, category, date });
  updateLocalStorage();
  renderExpenses();
  expenseForm.reset();
});

// Delete expense
function deleteExpense(index) {
  if (confirm("Delete this expense?")) {
    expenses.splice(index, 1);
    updateLocalStorage();
    renderExpenses();
  }
}

// Edit expense
function editExpense(index) {
  const exp = expenses[index];
  document.getElementById("name").value = exp.name;
  document.getElementById("amount").value = exp.amount;
  document.getElementById("category").value = exp.category;
  document.getElementById("date").value = exp.date;

  expenses.splice(index, 1);
  updateLocalStorage();
  renderExpenses();
}


// Initial render
renderExpenses();
