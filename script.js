//querySelector é um método do js, que seleciona tanto o id (#) como class (.classe)
const transactionsUl = document.querySelector("#transactions")
const incomeDisplay = document.querySelector("#money-plus")
const expenseDisplay = document.querySelector("#money-minus")
const balanceDisplay = document.querySelector("#balance")
const form = document.querySelector("#form")
const inputTransactionName = document.querySelector("#text")
const inputTransactionAmount = document.querySelector("#amount")
const body = document.querySelector("body")
const btnDarkMode = document.querySelector("#darkmode")

// Recuperação de dados
const localStorageTransactions = JSON.parse(localStorage
  .getItem("transactions"))
let transactions = localStorage
  .getItem("transactions") !== null ? localStorageTransactions : []

// Remover uma transação
const removeTransaction = ID => {
  transactions = transactions.filter(transaction =>
    transaction.id !== ID)
  updateLocalStorage()
  init()
}

// Adicionar transação no DOM
const addTransactionIntoDom = ({ amount, name, id }) => {
  const operator = amount < 0 ? "-" : "+"
  const CSSClass = amount < 0 ? "minus" : "plus"
  const amountWithoutOperator = Math.abs(amount)
  const li = document.createElement("li")

  li.classList.add(CSSClass)
  li.innerHTML = `
    ${name} 
    <span>${operator} R$${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">
      x
    </button>
  `
  transactionsUl.append(li)
}

// Cálculo de saldo, receitas e despesas
const getExpenses = (transactionsAmounts) =>
  Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

const getIncomes = (transactionsAmounts) =>
  transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = (transactionsAmounts) =>
  transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

// Atualizar valores na interface
const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(({ amount }) => amount)
  const total = getTotal(transactionsAmounts)
  const income = getIncomes(transactionsAmounts)
  const expense = getExpenses(transactionsAmounts)

  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$ ${expense}`
}

// Inicialização do app
const init = () => {
  transactionsUl.innerHTML = ""
  transactions.forEach(addTransactionIntoDom)
  updateBalanceValues()
}

init()

// Atualizar localStorage
const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions))
}

// Gerar um ID aleatório
const generateID = () => Math.round(Math.random() * 1000)

// Adicionar uma nova transação
const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount)
  })
}

// Limpar inputs
const cleanInputs = () => {
  inputTransactionName.value = ""
  inputTransactionAmount.value = ""
}

// Adicionar transação ao enviar formulário
const handleFormSubmit = event => {
  event.preventDefault()

  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()
  const isSomeInputEmpty = transactionName === "" || transactionAmount === ""

  if (isSomeInputEmpty) {
    alert("Por favor, preencha os dados da transação!")
    return
  }

  addToTransactionsArray(transactionName, transactionAmount)
  init()
  updateLocalStorage()

  cleanInputs()
}

// Alternar entre Dark Mode e Light Mode
const darkMode = () => {
  body.classList.toggle("dark")
}

btnDarkMode.addEventListener("click", darkMode)

// Eventos
form.addEventListener("submit", handleFormSubmit)


