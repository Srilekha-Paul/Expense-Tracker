// Initialize expenses array
let expenses = [];
let editingId = null;

// Get DOM elements
const expenseNameInput = document.getElementById('expenseName');
const expenseAmountInput = document.getElementById('expenseAmount');
const expenseCategorySelect = document.getElementById('expenseCategory');
const expenseDateInput = document.getElementById('expenseDate');
const addBtn = document.getElementById('addBtn');
const expenseList = document.getElementById('expenseList');
const totalAmountSpan = document.getElementById('totalAmount');

// Set today's date as default
expenseDateInput.valueAsDate = new Date();

// Add expense event listener
addBtn.addEventListener('click', handleAddExpense);

// Allow Enter key to submit
[expenseNameInput, expenseAmountInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAddExpense();
        }
    });
});

// Handle add/update expense
function handleAddExpense() {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategorySelect.value;
    const date = expenseDateInput.value;

    // Validation
    if (!name) {
        alert('Please enter expense name');
        return;
    }

    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    if (!date) {
        alert('Please select a date');
        return;
    }

    if (editingId !== null) {
        // Update existing expense
        const index = expenses.findIndex(exp => exp.id === editingId);
        if (index !== -1) {
            expenses[index] = { id: editingId, name, amount, category, date };
        }
        editingId = null;
        addBtn.textContent = 'Add Expense';
    } else {
        // Add new expense
        const newExpense = {
            id: Date.now(),
            name,
            amount,
            category,
            date
        };
        expenses.push(newExpense);
    }

    // Clear form
    clearForm();
    
    // Render expenses
    renderExpenses();
    
    // Update total
    updateTotal();
}

// Clear form inputs
function clearForm() {
    expenseNameInput.value = '';
    expenseAmountInput.value = '';
    expenseCategorySelect.value = 'Food';
    expenseDateInput.valueAsDate = new Date();
}

// Render all expenses
function renderExpenses() {
    expenseList.innerHTML = '';

    if (expenses.length === 0) {
        expenseList.innerHTML = '<div class="empty-state">No expenses yet. Add your first expense!</div>';
        return;
    }

    expenses.forEach(expense => {
        const expenseItem = createExpenseElement(expense);
        expenseList.appendChild(expenseItem);
    });
}

// Create expense element
function createExpenseElement(expense) {
    const div = document.createElement('div');
    div.className = 'expense-item';
    
    div.innerHTML = `
        <div class="expense-info">
            <div class="expense-main">${expense.name} - ₹${expense.amount}</div>
            <div class="expense-details">(${expense.category}) - ${expense.date}</div>
        </div>
        <div class="expense-actions">
            <button class="btn-icon btn-edit" onclick="editExpense(${expense.id})">
                <svg class="icon-edit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </button>
            <button class="btn-icon btn-delete" onclick="deleteExpense(${expense.id})">
                <svg class="icon-delete" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    `;
    
    return div;
}

// Edit expense
function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    
    if (expense) {
        expenseNameInput.value = expense.name;
        expenseAmountInput.value = expense.amount;
        expenseCategorySelect.value = expense.category;
        expenseDateInput.value = expense.date;
        
        editingId = id;
        addBtn.textContent = 'Update Expense';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Delete expense
function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses = expenses.filter(exp => exp.id !== id);
        renderExpenses();
        updateTotal();
        
        // If we were editing this expense, reset the form
        if (editingId === id) {
            editingId = null;
            addBtn.textContent = 'Add Expense';
            clearForm();
        }
    }
}

// Update total amount
function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmountSpan.textContent = total.toFixed(2);
}

// Initialize the app
function init() {
    renderExpenses();
    updateTotal();
}

// Load expenses from localStorage on page load (optional feature)
window.addEventListener('DOMContentLoaded', () => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
        init();
    }
});

// Save expenses to localStorage whenever they change (optional feature)
function saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Override the original functions to include localStorage
const originalHandleAddExpense = handleAddExpense;
handleAddExpense = function() {
    originalHandleAddExpense();
    saveToLocalStorage();
};

const originalDeleteExpense = deleteExpense;
deleteExpense = function(id) {
    originalDeleteExpense(id);
    saveToLocalStorage();
};

// Initialize on load
init();