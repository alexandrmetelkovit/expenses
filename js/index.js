//объъявление переменных - строковые константы
const CURRENCY = "руб.";
const STATUS_IN_LIMIT = "Все хорошо";
const STATUS_OUT_OF_LIMIT = "Все плохо";

const POPUP_OPEN_CLASSNAME = "popup__open";

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
const expenses = [];

//переменная с начальным лимитом
let limit = 10000;

init(expenses);

// начальные значения
//- "лимит" = 10000
//-"всего" = функции, в которой считается все расходы
//-статус = "Все хорошо"
function init(expenses) {
  // отображение
  limitValueNode.innerText = limit;
  sumValueNode.innerText = calculateExpenses(expenses);
  statusTextNode.innerText = STATUS_IN_LIMIT;
}

function getExpenseHandler() {
  // получаем расход от пользователя
  const expense = getExpenseFromUser();

  // если расхода нет, то ничего не делай
  if (!expense) {
    return;
  }

  const expenseCategory = getSelectedCategory();

  // если категория не выбрана, то ничего не делай
  if (expenseCategory === "Категория") {
    return;
  }

  const newExpense = { amount: expense, category: expenseCategory };
  console.log(newExpense);

  expenses.push(newExpense);

  // trackExpense(expense);

  //отрисовываю интерфейс
  render(expenses);
}

function getSelectedCategory() {
  return categorySelectNode.value;
}

//функция, которая добавляет каждый последующий расход в массив
// function trackExpense(expense) {
//   expenses.push(expense);
// }

// функция, которая получает значения от пользователя из поля ввода
//- если ничего нет, то пусто
//- создаем переменную, которая округляет введенное значение
//- очисти поле после отправки значения в массив
//- верни расход
function getExpenseFromUser() {
  if (!moneyInputNode.value) {
    return;
  }

  const expense = parseInt(moneyInputNode.value);

  clearInput();

  return expense;
}

//функция очистки поля после отправки значения в массив
//инпут = пустой строке
//новый инпут для нового лимита = пустой строке
function clearInput() {
  moneyInputNode.value = "";
  newMoneyInputNode.value = "";
}

//функция сложения расходов
//- посчитать сумму и вывести ее
function calculateExpenses(expenses) {
  let sum = 0;

  expenses.forEach((expense) => {
    sum = sum + expense.amount; // sum += element
  });

  return sum;
}

//функция отрисовка истории
//- выводим новый список трат
//- пробегаемся по списку с помощью цикла forEach и добавляем его в HTML
// вкладываем в history список Ol
function renderHistory(expenses) {
  let expensesListHTML = "";

  expenses.forEach((expense) => {
    expensesListHTML += `<li>${expense.category} - ${expense.amount} ${CURRENCY}</li>`;
  });

  historyNode.innerHTML = `<ol>${expensesListHTML}</ol>`;
}

//отображение "всего"
// - элемент sumValue из HTML приравнивается сумме расходов
function renderSum(sum) {
  sumValueNode.innerText = sum;
}

//функция, которая обновляет статус в зависимости от "ВСЕГО"
//если сумма <= лимиту(10000), то "все хорошо" и цвет зеленый
// если сумма больше лимита, то "все плохо" и цвет красный
function renderStatus(sum) {
  // console.warn("sum", sum);
  // console.warn("limit", limit);
  const total = calculateExpenses(expenses);
  sumValueNode.innerText = total;

  if (sum <= limit) {
    statusTextNode.innerText = STATUS_IN_LIMIT;
    statusTextNode.classList.add(STATUS_IN_LIMIT_CLASSNAME);
    statusTextNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
  } else {
    statusTextNode.innerText = `${STATUS_OUT_OF_LIMIT} (${limit - total} руб.)`;
    statusTextNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
  }
}

//функция отображение "лимита, всего и статуса"
//-рисуем историю
//-рисуем сумму
//-рисуем статус
function render(expenses) {
  const sum = calculateExpenses(expenses);
  // console.warn(sum);

  renderHistory(expenses);

  renderSum(sum);

  renderStatus(sum);
}

//функция очистки истории, обнуление "всего" и удаление красного цвета "все плохо"
function clearBtn() {
  expenses.length = [];
  render(expenses);
  statusTextNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
}

function clearBtnHandler() {
  clearBtn();
  clearInput();
}

//привязка функций обработчиков к кнопкам
//обработчик события по нажатию кнопки "добавить"
addBtnNode.addEventListener("click", getExpenseHandler);
//обработчик события по нажатию кнопки "сбросить"
clearBtnNode.addEventListener("click", clearBtnHandler);

// //обработчик события по клику на иконку
// changeLimitIconNode.addEventListener("click", togglePopup);

// //обработчик события по клику на крестик закрытия попапа
// btnCloseNode.addEventListener("click", togglePopup);
btnOpenPopup.addEventListener("click", function () {
  openPopup();
});

closePopupNode.addEventListener("click", function () {
  closePopup();
});

function openPopup() {
  popupNode.classList.add("popup_open");

}

function closePopup() {
  popupNode.classList.remove("popup_open");
}

//клик по иконке (далее берем свойства из css)
//открытие попапа
//фиксация попапа
// function togglePopup() {
//   popupBgNode.classList.toggle(POPUP_OPENED_CLASSNAME);
//   bodyPopUpNode.classList.toggle(BODY_FIXED_CLASSNAME);
// }

// обработчик события по клику
changeValueBtnNode.addEventListener("click", function () {
  changeInputAmount();
  renderStatus(calculateExpenses(expenses));
  closePopup()
  clearInput();
  togglePopup();
});

function changeInputAmount() {
  if (newMoneyInputNode.value == "") {
    return;
  }
  limitValueNode.innerText = newMoneyInputNode.value;
  limit = newMoneyInputNode.value;
}
