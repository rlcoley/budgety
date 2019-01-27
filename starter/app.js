// var addBtn = document.getElementsByClassName('add__btn')[0]

// Budget Controller
var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
      var sum = 0;
      data.allItems[type].forEach(function(cur) {
          sum += cur.value
      })
      data.totals[type] = sum;
  };

  // var allExpenses = [],
  // var allIncomes = [],
  // var totalExpenses = 0;

  var data = {
      allItems: {
          exp: [],
          inc: []
      },
      totals: {
        exp: 0,
        inc: 0
      },
      budget:0,
      percentage: -1
  };

  return{
      addItem: function(type, des, val) {
        var newItem, ID;

        // ID = last ID + 1

        // Create new ID
        if (data.allItems[type].length > 0) {
          ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        }else {
          ID = 0
        }

        // Create new item based on 'inc' or 'exp' type
        if (type === 'exp') {
            newItem = new Expense(ID, des, val)
        }else if (type  === 'inc') {
            newItem = new Income(ID, des, val)
        }

        // Push it into data structure
        data.allItems[type].push(newItem)

        // Return the new element
        return newItem
      },

      calculateBudget: function() {

          // calculate total income and expenses
          calculateTotal('exp')
          calculateTotal('inc')

          // calculate the budget: income - expenses
          data.budget = data.totals.inc - data.totals.exp;

          // calculate the percentage of income that was spent
          if (data.totals.inc > 0) {
              data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
          }else {
            data.percentage =  -1;
          }


          // Expense = 100 and income 200, spent 50% = 100/200 =0.5 * 100
      },

      getBudget: function() {
          return{
            budget: data.budget,
            totalIncome: data.totals.inc,
            totalExpenses: data.totals.exp,
            percentage: data.percentage
          };
      },

      testing: function() {
        console.log(data);
      }

  }

})();




// UI Controller
var UIController = (function() {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  }

  return{
      getInput: function(){
          return{
            type: document.querySelector(DOMstrings.inputType).value, //Will be either income or expenses
            description: document.querySelector(DOMstrings.inputDescription).value,

            // turns string value into number. decimal included
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
          };
      },

      addListItem: function(obj, type) {

          // Create HTML string with placeholder text
          var html, newHtml, element;

          if (type === 'inc') {
            element = DOMstrings.incomeContainer
            html = `<div class="item clearfix" id="income-%id%">
                        <div class="item__description">%description%</div>
                        <div class="right clearfix">
                          <div class="item__value">%value%</div>
                          <div class="item__delete">
                              <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                        </div>
                    </div>`
          }else if (type === 'exp') {
            element = DOMstrings.expensesContainer
            html = `<div class="item clearfix" id="expense-%id%">
                      <div class="item__description">%description%</div>
                      <div class="right clearfix">
                          <div class="item__value">%value%</div>
                          <div class="item__percentage">21%</div>
                            <div class="item__delete">
                              <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                      </div>
                    </div>`
          }

          // Replace placeholder text with actual data
          newHtml = html.replace('%id%',obj.id)
          newHtml = newHtml.replace('%description%', obj.description)
          newHtml = newHtml.replace('%value%', obj.value)

          // Insert the  HTML into the DOM
          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)

      },

      clearFields: function() {
          let fields, fieldsArr;

          fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)

          fieldsArr = Array.prototype.slice.call(fields)

          fieldsArr.forEach(function(current, index, array) {
              current.value = "";
          })

          fieldsArr[0].focus()
      },

      getDOMstrings: function() {
        return DOMstrings;
      }
    };
  }) ();


// Global App Controller
var controller = (function (budgetCtrl, UICtrl) {

  var setUpEventListeners = function() {
    var DOM = UICtrl.getDOMstrings()

    document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem)
    // addBtn.addEventListener('click',ctrlAddItem)
    document.addEventListener('keypress',function(event) {
      // console.log(event);
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem()
      }
    })
  };

  var updateBudget = function() {

    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    var budget = budgetCtrl.getBudget()

    // 3. Disaplay budget on the UI
    console.log(budget);

  }

  var ctrlAddItem = function() {
    var input, newItem;

    // 1. Get field input data
    input = UICtrl.getInput();
    // console.log(input);

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
        // 2. Add item to budgetController
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)

        // 3. Add new item to UI
        UICtrl.addListItem(newItem, input.type)

        // 4. Clear the fields
        UICtrl.clearFields()

        // 5. Calculate and update budget
        updateBudget()

    }



  };

  return{
      init: function() {
        console.log('Application has started');
        setUpEventListeners();
      }
  };

}) (budgetController, UIController);

controller.init()
