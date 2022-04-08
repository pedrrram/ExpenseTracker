const form = document.getElementById('form');
const transactions = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // clear errors
  clearInputValidationError()

  const [ type, transactionInfo ] = getFormInputValues();
  if(validateInputs(transactionInfo)) {
    addTransaction(transactionInfo)
    form.reset();
  }
})

// show transactions from local storage when dom loaded
document.addEventListener("DOMContentLoaded", showTransactionsOnloaded);

const clearInputValidationError = () => {
  let errors = [...document.getElementsByClassName('error')];
  if(errors) {
    errors.forEach(error => {
      error.remove()
    });
  }
}

const getFormInputValues = () => {
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

  return [ type, transactionInfo ]
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

const addTransaction = (transactionInfo) => {
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
      <td class="py-4">${transactions.length + 1}</td>
      <td class="py-4">${transactionInfo.amount}</td>
      <td class="py-4">${transactionInfo.date.year}/${transactionInfo.date.month}/${transactionInfo.date.day}</td>
      <td class="py-4">${transactionType}</td>
      <td class="py-4">
        <button class="bg-sky-600 border border-sky-800 text-white rounded-md py-2 px-5 ml-1">نمایش</button>
        <button class="border border-rose-600 text-rose-600 rounded-md py-2 px-5">حذف</button>
      </td>
  `;
  document.getElementById('tbody').appendChild(row)

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
const getFromLocalStorage = () => {
  let transactions;
  let getTransactionLS = localStorage.getItem("transaction");
  if (getTransactionLS) {
    transactions = JSON.parse(getTransactionLS);
  } else {
    transactions = [];
  }
  return transactions;
}

function showTransactionsOnloaded()  {
  let transactions = getFromLocalStorage()
  transactions.forEach((tr, index) => {
    let transactionType;
    if(tr.type === 'income') {
      transactionType = 'درآمد';
    } else {
      transactionType = 'هزینه';
    }

    let row = document.createElement('tr');
    row.classList.add('odd:bg-slate-100', 'even:bg-slate-50')
    row.innerHTML = `
        <td class="py-4">${index + 1}</td>
        <td class="py-4">${tr.amount}</td>
        <td class="py-4">${tr.date.year}/${tr.date.month}/${tr.date.day}</td>
        <td class="py-4">${transactionType}</td>
        <td class="py-4">
          <button class="bg-sky-600 border border-sky-800 text-white rounded-md py-2 px-5 ml-1">نمایش</button>
          <button class="border border-rose-600 text-rose-600 rounded-md py-2 px-5">حذف</button>
        </td>
    `;
    document.getElementById('tbody').appendChild(row)
  })
}

//generate id
const genenrateID = () => {
  return Math.floor(Math.random() * 100000000);
}