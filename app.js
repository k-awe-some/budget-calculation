// /* INCOME */
// let incomeList = {
//   // It should store incomes
//   incomes: [],
//
//   // It should display incomes and total incomes
//   displayIncomes: function() {
//     console.log(this.incomes);
//     console.log(this.totalIncomes());
//   },
//
//   // It should add new income
//   addIncome: function(value) {
//     this.incomes.push({
//       incomeValue: value,
//     });
//     this.displayIncomes();
//   },
//
//   // It should edit income
//   editIncome: function(position, value) {
//     this.incomes[position].incomeValue = value;
//     this.displayIncomes();
//   },
//
//   // It should delete income
//   deleteIncome: function(position) {
//     this.incomes.splice(position, 1);
//     this.displayIncomes();
//   },
//
//   // It should total up incomes
//   totalIncomes: function() {
//     let result = 0;
//     this.incomes.forEach(function(value) {
//       result += value.incomeValue;
//     });
//     return result;
//   }
// }
//
// /* EXPENSES */
// let expenseList = {
//   // It should store expenses
//   expenses: [],
//
//   // It should display expenses and total expenses
//   displayExpenses: function() {
//     console.log(this.expenses);
//     console.log(this.totalExpenses());
//   },
//
//   // It should add new expense
//   addExpense: function(value) {
//     this.expenses.push({
//       expenseValue: value
//     });
//     this.displayExpenses();
//   },
//
//   // It should edit expense
//   editExpense: function(position, value) {
//     this.expenses[position].expenseValue = value;
//     this.displayExpenses();
//   },
//
//   // It should delete expense
//   deleteExpense: function(position) {
//     this.expenses.splice(position, 1);
//     this.displayExpenses();
//   },
//
//   // It should total up expenses
//   totalExpenses: function() {
//     let result = 0;
//     this.expenses.forEach(function(value) {
//       result += value.expenseValue;
//     });
//     return result;
//   }
// };
//
// /* AVAILABLE BUDGET */
// // It should show (incomes - expenses)
// let incomes = incomeList.totalIncomes();
// let expenses = expenseList.totalExpenses();
// let availableBudget = function() {
//   return incomes - expenses;
// }
// console.log(availableBudget());

/* BUDGET (DATA) CONTROLLER */
let budgetController = (function() { // todo list
  let descriptions = [];
  let incomes = [];
  return {
    addInput: function(description, value) {
      descriptions.push(description);
      incomes.push(value);
      return ` ${descriptions} ${incomes}`;
    }
  }
})();

/* UI CONTROLLER */
let uiController = (function() { // view
  // create an obj to store DOM elements
  let DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
  }

  return {
    // return DOMstrings into the public
    getDOMstrings: function() {
        return DOMstrings;
    },

    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
    },

    displayInput: function() {
      return {
        incomeList: document.querySelector('.income__list'),
        expensesList: document.querySelector('.expenses__list'),
      }
    }
  }
})();

/* GLOBAL APP CONTROLLER */
let appController = (function(data, ui) { // handler

  let addItemCtrl = function() {
    let input = ui.getInput();
    let displayInput = ui.displayInput();
    let newInput = document.createElement('li');

    if (input.type === 'exp') {
      newInput.textContent = `${input.description} ${input.value}`;
      displayInput.expensesList.appendChild(newInput);
    }

    if (input.type === 'inc') {
      newInput.textContent = `${input.description} ${input.value}`;
      displayInput.incomeList.appendChild(newInput);
    }
  };


  // what happens on 'enter' and 'click'
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
      addItemCtrl();
    }
  });
  document.querySelector(ui.getDOMstrings.inputButton).addEventListener('click', addItemCtrl);

})(budgetController, uiController);
