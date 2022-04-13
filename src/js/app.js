const form = document.getElementById('form');


form.addEventListener('submit', (e) => {
  e.preventDefault();

  // clear errors
  clearInputValidationError()
  // clear persian amount
  document.getElementById('amountInPersian').innerHTML = ''

  const transactionInfo = getFormInputValues();
  if(validateInputs(transactionInfo)) {
    // show table
    document.getElementById('table').classList.remove('hidden')
    //add transaction function
    addTransaction(transactionInfo)
    // update income & expense amount state
    updateIncomeAndExpense(transactionInfo)
    // clear form 
    form.reset();
  }
})

// show transactions from local storage when dom loaded
document.addEventListener("DOMContentLoaded", showTransactionsOnloaded);
// show income and expense value on board
document.addEventListener("DOMContentLoaded", updateIncomeAndExpense);



// clear elements having error class
const clearInputValidationError = () => {
  let errors = [...document.getElementsByClassName('error')];
  if(errors) {
    errors.forEach(error => {
      error.remove()
    });
  }
}

// get input values
const  getFormInputValues = () => {
  // get type --> Income or Expense
  const [incomeType, expenseType] = [...document.getElementsByName('amountType').values()]
  let type = null;
  if(incomeType.checked) {
    type = 'income'
  } else if(expenseType.checked) {
    type = 'expense'
  }

  // get amount money
  const amount = document.getElementById('amountValue').value;

  // get transaction date (day, month, year)
  const day = document.getElementById('day').value;
  const month = document.getElementById('month').value;
  const year = document.getElementById('year').value;
  const date = {year, month, day};

  // get description transaction
  const description = document.getElementById('description').value;

  const transactionInfo = {
    id: genenrateID(),
    type,
    amount,
    date,
    description
  };

  return transactionInfo
}

// create Error element
const makeErrorElement = (message) => {
  const div = document.createElement('div');
  div.classList.add('error', 'text-rose-600', 'font-bold', 'mt-4');
  div.innerHTML = message;
  return div
}  

// validate form inputs
const validateInputs = (transactionInfo) => {

  let { type, amount, date, description } = transactionInfo;

  // validate type
  const validateType = () => {
    if(!type) {
      const typeErrorEl = makeErrorElement('نوع پول را مشخص کنید...')
      document.getElementById('select-type').after(typeErrorEl)
      return false
    }
    return true 
  }

  //validate amount
  const validateAmount = () => {
    amount = Number(amount)
    if(isNaN(amount) || amount <= 0) {
      const amountErrorEl = makeErrorElement('مبلغ را به درستی وارد کنید...')
      document.getElementById('amount').after(amountErrorEl)
      return false
    }
    return true
  }

  // validate date
  const validateDate = () => {
    let day = Number(date.day);
    let month = Number(date.month);
    let year = Number(date.year);
    if(isNaN(day) || isNaN(month) || isNaN(year) || day < 0 || month < 0 || year < 0 || day > 31 || month > 12 || year <= 999) {
      const dateErrorEl = makeErrorElement('تاریخ را به درستی وارد کنید...')
      document.getElementById('dateBox').after(dateErrorEl)
      return false
    }
    return true
  }

  // validate description
  const validateDescription = () => {
    if(!description) {
      const descriptionErrorEl = makeErrorElement('توضیحات را کامل کنید...')
      document.getElementById('descriptionBox').after(descriptionErrorEl)
      return false
    }
    return true
  }

  if(validateType() && validateAmount() && validateDate() && validateDescription()) {
    return true
  }
  return false
}

// add new row to table & add to local storage
const addTransaction = (transactionInfo) => {
  let transactions = getFromLocalStorage()
  let transactionType;
  if(transactionInfo.type === 'income') {
    transactionType = 'درآمد';
  } else {
    transactionType = 'هزینه';
  }
  // add new row to table
  let row = document.createElement('tr');
  row.classList.add('odd:bg-slate-100', 'even:bg-slate-50')
  row.innerHTML = `
      <td class="py-4">${String(transactions.length + 1).toPersianDigits()}</td>
      <td class="py-4">${transactionInfo.amount.toPersianDigits()}</td>
      <td class="py-4">${transactionInfo.date.year.toPersianDigits()}/${transactionInfo.date.month.toPersianDigits()}/${transactionInfo.date.day.toPersianDigits()}</td>
      <td class="py-4">${transactionType}</td>
      <td class="py-4" data-id="${transactionInfo.id}">
        <button class="showTransaction bg-sky-600 border border-sky-800 text-white rounded-md py-2 px-5 ml-1">نمایش</button>
        <button class="deleteTransaction border 
        border-rose-600 text-rose-600 rounded-md py-2 px-5">حذف</button>
        <!-- delete confirm -->
        <div id="deleteConfirm" class="absolute w-full  h-full z-50 top-0 right-0 hidden justify-center items-center deleteConfirm bg-neutral-900/50">
          <div class="flex  flex-col bg-white border border-slate-200 rounded-md p-4 w-96">
            <div class="flex justify-between border-b">
              <h3 class="font-bold">حذف</h3>
              <span class="closeConfirm underline cursor-pointer text-sm">بستن</span>
            </div>
            <p class="my-8 h-auto">آیا از حذف کردن مطمئن هستید؟</p>
            <div class="flex justify-between">
              <button class="closeConfirm bg-sky-600 border border-sky-800 text-white rounded-md py-2 px-5 ml-1">بازگشت</button>
              <button id="confirmDelete" class="border border-rose-600 text-rose-600 rounded-md py-2 px-5">حذف</button>
            </div>
          </div>
        </div>
      </td>
  `;
  document.getElementById('tbody').appendChild(row)

    // add eventlistener for new row buttons
    row.querySelector('.deleteTransaction').addEventListener("click", confirmDelete)
    row.querySelector('.showTransaction').addEventListener("click", showTransaction)

  addToLocalStorage(transactionInfo)
}

// adding transaction info to local storage
const addToLocalStorage = (transactionInfo) => {
  // get transactions array form local storage
  let transaction = getFromLocalStorage();
  transaction.push(transactionInfo);
  localStorage.setItem("transaction", JSON.stringify(transaction));
}

// get data from local storage
function getFromLocalStorage() {
  let transactions;
  let getTransactionLS = localStorage.getItem("transaction");
  if (getTransactionLS) {
    transactions = JSON.parse(getTransactionLS);
  } else {
    transactions = [];
  }
  return transactions;
}

// show transactions table from local storage when DOM loaded 
function showTransactionsOnloaded()  {
  let transactions = getFromLocalStorage()
  if(transactions.length) {
    //show table
    document.getElementById('table').classList.remove('hidden')
    // create rows
    let rowNumber = 0
    transactions.forEach((tr) => {
      let transactionType;
      rowNumber += 1

      if(tr.type === 'income') {
        transactionType = 'درآمد';
      } else {
        transactionType = 'هزینه';
      }
  
      let row = document.createElement('tr');
      row.classList.add('odd:bg-slate-100', 'even:bg-slate-50')
      row.innerHTML = `
          <td class="py-4">${(String(rowNumber)).toPersianDigits()}</td>
          <td class="py-4">${tr.amount.toPersianDigits()}</td>
          <td class="py-4">${tr.date.year.toPersianDigits()}/${tr.date.month.toPersianDigits()}/${tr.date.day.toPersianDigits()}</td>
          <td class="py-4">${transactionType}</td>
          <td class="py-4" data-id="${tr.id}">
            <button class="showTransaction bg-sky-600 border border-sky-800 text-white rounded-md py-2 px-5 ml-1">نمایش</button>
            <button class="deleteTransaction border 
            border-rose-600 text-rose-600 rounded-md py-2 px-5">حذف</button>
            <!-- delete confirm -->
            <div id="deleteConfirm" class="absolute w-full  h-full z-50 top-0 right-0 hidden justify-center items-center deleteConfirm bg-neutral-900/50">
              <div class="flex  flex-col bg-white border border-slate-200 rounded-md p-4 w-96">
                <div class="flex justify-between border-b">
                  <h3 class="font-bold">حذف</h3>
                  <span class="closeConfirm underline cursor-pointer text-sm">بستن</span>
                </div>
                <p class="my-8 h-auto">آیا از حذف کردن مطمئن هستید؟</p>
                <div class="flex justify-between">
                  <button class="closeConfirm bg-sky-600 border border-sky-800 text-white rounded-md py-2 px-5 ml-1">بازگشت</button>
                  <button id="confirmDelete" class="border border-rose-600 text-rose-600 rounded-md py-2 px-5">حذف</button>
                </div>
              </div>
            </div>
          </td>
      `;
      document.getElementById('tbody').appendChild(row)

      row.querySelector('.deleteTransaction').addEventListener("click", confirmDelete)
      row.querySelector('.showTransaction').addEventListener("click", showTransaction)
    })
  }

}

// calculate income & expense value and show in document
function updateIncomeAndExpense() {
  let transactions = getFromLocalStorage()
  if(transactions.length) {
    let income = 0;
    let expense = 0;
    transactions.forEach((tr) => {
      if(tr.type === 'income') {
        income += Number(tr.amount)
      } else {
        expense += Number(tr.amount)
      }
    })
    document.getElementById('incomeValue').innerHTML = String(income).toPersianDigits()
    document.getElementById('expenseValue').innerHTML = String(expense).toPersianDigits()
  }
}

//generate id
const genenrateID = () => {
  return Math.floor(Math.random() * 100000000);
}

// convert english numbers to persian
String.prototype.toPersianDigits= function(){
  let persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return this.replace(/[0-9]/g, function(w){
      return persianDigits[+w];
  });
}

function confirmDelete(e) {
  document.querySelector('#deleteConfirm').classList.remove('hidden');
  document.querySelector('#deleteConfirm').classList.add('flex');
  document.body.classList.add('overflow-hidden');

  [...document.querySelectorAll('.closeConfirm')].map((item) => {
    item.addEventListener("click", () => {
      document.querySelector('#deleteConfirm').classList.remove('flex')
      document.querySelector('#deleteConfirm').classList.add('hidden')
      document.body.classList.remove('overflow-hidden')
    })
  });
  
  e.target.parentElement.querySelector('#confirmDelete').addEventListener("click", () => {
    const transactionId = e.target.parentElement.getAttribute('data-id');
    deleteTransaction(transactionId)
    // close confirm form
    document.body.classList.remove('overflow-hidden')
  });

}


// delete transaction element and run deleteTransactionFromLocalStorage
function deleteTransaction(transactionId) {
  document.getElementById('tbody').innerHTML = ''
  deleteTransactionFromLocalStorage(transactionId)
  showTransactionsOnloaded()
  updateIncomeAndExpense()
}

const deleteTransactionFromLocalStorage = (transactionId) => {
  const transactions = getFromLocalStorage()
  transactions.map((tr, index) => {
    if(tr.id == transactionId) {
      transactions.splice(index, 1)
    }
  })
  localStorage.setItem('transaction', JSON.stringify(transactions));
}

// convert amount number to persian words
document.getElementById('amountValue').addEventListener('keyup', (e) => {
  const persianAmount = Num2persian(e.target.value) + ' تومان'
  document.getElementById('amountInPersian').innerHTML = persianAmount
})

// show transactions description
function showTransaction(e) {
  const transactionId = e.target.parentElement.getAttribute('data-id')
  const transactions = getFromLocalStorage()
  transactions.map(tr => {
    if(tr.id == transactionId) {
      document.querySelector('#descriptionText').innerHTML = tr.description
    }
  })

  document.querySelector('#descriptionModal').classList.remove('hidden')
  document.querySelector('#descriptionModal').classList.add('flex')
  document.body.classList.add('overflow-hidden')
}

// close transactions desciption
[...document.querySelectorAll('.closeDescription')].map((item) => {
  item.addEventListener("click", () => {
    document.querySelector('#descriptionModal').classList.remove('flex')
    document.querySelector('#descriptionModal').classList.add('hidden')
    document.body.classList.remove('overflow-hidden')
  })
})