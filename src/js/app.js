const form = document.getElementById('form');
const transactions = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // clear errors
  clearInputValidationError()

  const [ type, transactionInfo ] = getFormInputValues();
  if(validateInputs(transactionInfo)) {
    console.log('okay :)')
    form.reset();
  } else {
    console.log('not okay :(')
  }

})

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
function validateInputs(transactionInfo) {

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