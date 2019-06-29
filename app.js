/* BUDGET (DATA) CONTROLLER */
/*
 * Independent functions that manipulate the data
 * Returns (into public) an object with the following methods:
 *    addInput()      - adds new input using Constructors
 *    calcBudget()    - calculates total inc, total exp, available budget, %
 *    getBudget()     - returns an object with total inc, total exp, available budget, % properties
 */
let budgetController = (function() {

  // create function Constructors to add new income and expenses
  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // store data in an obj
  let data = {
    allItems: {
      inc: [],
      exp: [],
    },

    total: {
      inc: 0,
      exp: 0,
    },

    budget: 0,
    percentage: -1, // -1 means something that does not exist
  };

  // store totals in a function
  let calcTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(function(item) {
      sum += item.value;
    });
    data.total[type] = sum;
  };

  return {
    addInput: function(type, des, val) {
      let newInput;
      let ID;
      // create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      // create new item based on 'inc' or 'exp' type
      if (type === 'inc') {
        newInput = new Income(ID, des, val);
      } else if (type === 'exp') {
        newInput = new Expense(ID, des, val);
      }
      // push it into data structure
      // then return new element
      data.allItems[type].push(newInput);
      return newInput;
    },

    calcBudget: function() {
      // calculate totals
      calcTotal('inc');
      calcTotal('exp');
      // calculate budget
      data.budget = data.total.inc - data.total.exp;
      // calculate % of income that we spent
      // ONLY IF SOME INCOME EXISTS
      if (data.total.inc > 0) {
        data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.total.inc,
        totalExp: data.total.exp,
        percentage: data.percentage,
      };
    },
  };

})();

/* UI CONTROLLER */
/*
 * Independent functions that manipulate the UI
 * Returns (into public) an object with the following methods:
 *    getDOMstrings()     - returns DOM class names
 *    getInput()          - get vallues from input fields
 *    addListItem()       - manipulates HTML to add item to the corresponding list depending on the type
 *    clearFields()       - clears input fields after item was added
 *    displayBudget()     - displays budget, total income, total expenses, percentage
 */
let uiController = (function() { // view
  // create an obj to store DOM elements
  let DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeList: '.income__list',
    expensesList: '.expenses__list',
    budgetValue: '.budget__value',
    totalIncValue: '.budget__income--value',
    totalExpValue: '.budget__expenses--value',
    expPercentage: '.budget__expenses--percentage',
  }

  return {
    // return DOMstrings into the public
    getDOMstrings: function() {
      return DOMstrings;
    },

    // return input info into the public
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value), // parseFloat converts string into number with decimal
      };
    },

    // return the corresponding list into the public depending on the type
    addListItem: function(obj, type) {
      let html, newHtml, element;

      // create html string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeList;
        html = `<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>`
      } else if (type === 'exp') {
        element = DOMstrings.expensesList;
        html = `<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>`
      }

      // replace placeholder text with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // insert html into DOM ('beforeend' = as the last child)
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    // clear input fields
    clearFields: function() {
      // 'querySelectorAll' returns a list, not an array
      let fields = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`);
      // 'slice' returns an array when called
      let fieldsArray = Array.prototype.slice.call(fields);
      // reset input fields to empty
      fieldsArray.forEach(function(currentField, index, array) {
        currentField.value = '';
      });
      // reset focus to 'description' field
      fieldsArray[0].focus();
    },

    // display budget summaries
    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetValue).textContent = obj.budget;
      document.querySelector(DOMstrings.totalIncValue).textContent = obj.totalInc;
      document.querySelector(DOMstrings.totalExpValue).textContent = obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.expPercentage).textContent = `${obj.percentage}%`;
      } else {
        document.querySelector(DOMstrings.expPercentage).textContent = `---`
      }
    },

  }
})();

/* GLOBAL APP CONTROLLER */
let appController = (function(data, ui) { // handler
  // stores all addEventListeners in one place
  let setupEventListener = function() {
    let DOM = ui.getDOMstrings();

    document.addEventListener('keydown', function(e) {
      if (e.keyCode === 13) {
        addItemCtrl();
      }
    });
    document.querySelector(DOM.inputButton).addEventListener('click', addItemCtrl);
  };

  //
  let addItemCtrl = function() {
    let input = ui.getInput();
    // make sure description does not contain spaces at the beginning
    input.description = input.description.replace(/^\s*/, '');
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // add item to data (budgetController)
      let newItem = data.addInput(input.type, input.description, input.value);
      // add item to ui
      ui.addListItem(newItem, input.type);
      // clear fields
      ui.clearFields();
      // update budget
      updateBudget();
    }
  };

  let updateBudget = function() {
    // calculate budget
    data.calcBudget();
    // return budget
    let budget = data.getBudget();
    // display budget in ui
    ui.displayBudget(budget);
  }

  // init() stores all the code we want to execute when the app starts
  // to be called in the public
  return {
    init: function() {
      console.log('App has started');
      ui.displayBudget({ // sets everything to 0 at the beginning
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListener();
    }
  };

})(budgetController, uiController);

appController.init();
