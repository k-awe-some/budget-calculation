/* BUDGET (DATA) CONTROLLER */
let budgetController = (function() { // data

  // create function constructors as there will be lots of incomes and expenses
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

  let data = {
    allItems: {
      inc: [],
      exp: [],
    },

    total: {
      inc: 0,
      exp: 0,
    }
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

    test: function() {
      console.log(this.addInput());
    }
  };

})();

/* UI CONTROLLER */
let uiController = (function() { // view
  // create an obj to store DOM elements
  let DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeList: '.income__list',
    expensesList: '.expenses__list',
    itemDescription: 'item__description',
    itemDelete: 'item__delete',
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

    // return display lists into the public
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

    clearFields: function() {
      // 'querySelectorAll' returns a list, not an array
      let fields = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`);

      // 'slice' returns an array when called
      let fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(currentField, index, array) {
        currentField.value = '';
      });

      // reset focus to 'description' field
      fieldsArray[0].focus();
    },
  }
})();

/* GLOBAL APP CONTROLLER */
let appController = (function(data, ui) { // handler

  let setupEventListener = function() {
    let DOM = ui.getDOMstrings();

    document.addEventListener('keydown', function(e) {
      if (e.keyCode === 13) {
        addItemCtrl();
      }
    });
    document.querySelector(DOM.inputButton).addEventListener('click', addItemCtrl);
  };

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
    // return budget
    // display budget in ui
  }

  // init() stores all the code we want to execute when the app starts
  // to be called in the publlic
  return {
    init: function() {
      console.log('App has started');
      setupEventListener();
    }
  };

})(budgetController, uiController);

appController.init();
