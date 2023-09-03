//объъявление переменных - строковые константы
const CURRENCY = "руб.";
const STATUS_IN_LIMIT = "Все хорошо";
const STATUS_OUT_OF_LIMIT = "Все плохо";
const POPUP_OPEN_CLASSNAME = "popup_open";
const STORAGE_LABEL_LIMIT = "limit";
const STORAGE_LABEL_EXPENSES = "expenses";

//подсветка статуса после отображения суммы
const STATUS_IN_LIMIT_CLASSNAME = "stats__statusText_positive";
const STATUS_OUT_OF_LIMIT_CLASSNAME = "stats__statusText_negative";

// вытаскиваем html-эелементы
// поле ввода, категория, кнопка "добавить"
const moneyInputNode = document.getElementById("moneyInput");
const categorySelectNode = document.getElementById("categorySelect");
const addBtnNode = document.getElementById("addBtn");

// отображение расходов: лимит, всего, статус
const limitValueNode = document.getElementById("limitValue");
const sumValueNode = document.getElementById("sumValue");
const statusTextNode = document.getElementById("statusText");

//вывод истории и кнопка "сбросить"
const historyNode = document.getElementById("history");
const clearBtnNode = document.getElementById("clearBtn");

//popup элементы
// открыть попап
const btnOpenPopup = document.getElementById("openPopup");
//фиксация попапа
const popupNode = document.getElementById("popup");

//закрытие попапа
const closePopupNode = document.getElementById("closePopup");

//поле ввода нового лимита
const newMoneyInputNode = document.getElementById("newMoneyInput");

// по нажатию меняется лимит
const changeValueBtnNode = document.getElementById("changeValueBtn");

// //
const popupContentNode = document.getElementById("popupContent");

//массив с расходами
let expenses = [];

// вызывая эту функцию "лимит" ни чему не равен и "всего" тоже
// render()

//переменная с начальным лимитом
let limit = parseInt(limitValueNode.innerText);

initLimit();

function initLimit() {
  const limitFromStorage = parseInt(localStorage.getItem(STORAGE_LABEL_LIMIT));
  if (!limitFromStorage) {
    return;
  }
  limitValueNode.innerText = limitFromStorage;
  limit = parseInt(limitValueNode.innerText);
}

init();

// начальные значения
//- "лимит" = 10000
//-"всего" = функции, в которой считается все расходы
//-статус = "Все хорошо"
function init() {
  // отображение
  // limitValueNode.innerText = limit;
  // sumValueNode.innerText = calculateExpenses(expenses);
  // statusTextNode.innerText = STATUS_IN_LIMIT;

  const expensesFromStorageString = localStorage.getItem(
    STORAGE_LABEL_EXPENSES
  );
  // parse превращает строку в объект
  const expensesFromStorage = JSON.parse(expensesFromStorageString);
  if (Array.isArray(expensesFromStorage)) {
    expenses = expensesFromStorage;
  }

  render(expenses);
}

const saveExpensesToStorage = () => {
  //JSON - она разбирает объект expenses и превращает в строку
  const expensesString = JSON.stringify(expenses);
  localStorage.setItem(STORAGE_LABEL_EXPENSES, expensesString);
};

function getExpenseHandler() {
  // получаем расход от пользователя
  const expense = getExpenseFromUser();

  // если расхода нет, то ничего не делай
  if (!expense) {
    return alert("Задайте сумму");
  }

  const expenseCategory = getSelectedCategory();

  // если категория не выбрана, то ничего не делай
  if (expenseCategory === "Категория") {
    return alert("Выберите категорию");
  }

  const newExpense = { amount: expense, category: expenseCategory };
  console.log(newExpense);

  expenses.push(newExpense);
  saveExpensesToStorage();

  //отрисовываю интерфейс
  render(expenses);

  clearInput();
}

function getSelectedCategory() {
  return categorySelectNode.value;
}

// функция, которая получает значения от пользователя из поля ввода
//- если ничего нет, то пусто
//- создаем переменную, которая округляет введенное значение
//- очисти поле после отправки значения в массив
//- верни расход
function getExpenseFromUser() {
  if (!moneyInputNode.value || moneyInputNode.value < 0) {
    return (moneyInputNode.value = "");
  }

  const expense = parseInt(moneyInputNode.value);

  return expense;
}

//функция очистки поля после отправки значения в массив
//инпут = пустой строке
//новый инпут для нового лимита = пустой строке
function clearInput() {
  moneyInputNode.value = "";
  categorySelectNode.value = "Категория";
}

function clearInputPopup() {
  newMoneyInputNode.value = "";
}

//функция сложения расходов
//- посчитать сумму и вывести ее
function calculateExpenses(expenses) {
  let sum = 0;

  expenses.forEach((expense) => {
    sum = sum + expense.amount; // sum += expense.amount;
  });

  return sum;
}

//функция отрисовка истории
//- выводим новый список трат
//- пробегаемся по списку с помощью цикла forEach и добавляем его в HTML
// вкладываем в history список ol
function renderHistory(expenses) {
  let expensesListHTML = "";

  expenses.forEach((expense) => {
    expensesListHTML += `<li>${expense.category} - ${expense.amount} ${CURRENCY}</li>`;
  });

  historyNode.innerHTML = `<ol>${expensesListHTML}</ol>`;
}

//отображение "всего"
// - элемент sumValue из HTML приравнивается сумме расходов
// function renderSum(sum) {
//   sumValueNode.innerText = sum;

// }

//функция, которая обновляет статус в зависимости от "ВСЕГО"
//если сумма <= лимиту(10000), то "все хорошо" и цвет зеленый
// если сумма больше лимита, то "все плохо" и цвет красный
function renderStatus(sum) {
  // console.warn("sum", sum);
  // console.warn("limit", limit);
  // const total = calculateExpenses(expenses);
  sumValueNode.innerText = sum;

  if (sum <= limit) {
    statusTextNode.innerText = STATUS_IN_LIMIT;
    statusTextNode.classList.add(STATUS_IN_LIMIT_CLASSNAME);
    statusTextNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
  } else {
    statusTextNode.innerText = `${STATUS_OUT_OF_LIMIT} (${limit - sum} руб.)`;
    statusTextNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
  }
}

//функция отображения: "лимит, всего и статус"
//-рисуем историю
//-рисуем сумму
//-рисуем статус
function render(expenses) {
  const sum = calculateExpenses(expenses);

  renderHistory(expenses);

  // renderSum(sum);

  renderStatus(sum);
}

//функция очистки истории, обнуление "всего" и удаление красного цвета "все плохо"
function clearBtn() {
  expenses = [];
  render(expenses);
  statusTextNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
  localStorage.removeItem(STORAGE_LABEL_EXPENSES, expenses);
}

function clearBtnHandler() {
  clearBtn();
  clearInput();
}

function openPopupHandler() {
  popupNode.classList.add(POPUP_OPEN_CLASSNAME);
}

function closePopupHandler() {
  popupNode.classList.remove(POPUP_OPEN_CLASSNAME);
}

// обработчик события по клику
changeValueBtnNode.addEventListener("click", function () {
  changeInputAmount();
  renderStatus(calculateExpenses(expenses));
  closePopupHandler();
  clearInputPopup();
});

function changeInputAmount() {
  if (newMoneyInputNode.value == "") {
    return alert("Лимит остался прежним");
  }
  limitValueNode.innerText = newMoneyInputNode.value;

  limit = newMoneyInputNode.value;

  localStorage.setItem(STORAGE_LABEL_LIMIT, limit);
}

//привязка функций обработчиков к кнопкам
//обработчик события по нажатию кнопки "добавить"
addBtnNode.addEventListener("click", getExpenseHandler);
//обработчик события по нажатию кнопки "сбросить"
clearBtnNode.addEventListener("click", clearBtnHandler);
//обработчик события по нажатию на изменение лимита
btnOpenPopup.addEventListener("click", openPopupHandler);
//обработчик события по нажатию на закрытие попапа
closePopupNode.addEventListener("click", closePopupHandler);
