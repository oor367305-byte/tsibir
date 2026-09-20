const form = document.querySelector('#age-form');
const birthInput = document.querySelector('#birth-date');
const calcInput = document.querySelector('#calc-date');
const error = document.querySelector('#error');

const pad = (value) => String(value).padStart(2, '0');
const toInputDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

calcInput.value = toInputDate(new Date());

function parseDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function daysBetween(a, b) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.ceil((b - a) / oneDay);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!birthInput.value || !calcInput.value) {
    error.textContent = 'Заполните обе даты.';
    return;
  }

  const birth = parseDate(birthInput.value);
  const calc = parseDate(calcInput.value);

  // Валидация
  if (calc < birth) {
    error.textContent = 'Дата расчёта не может быть раньше даты рождения.';
    return;
  }

  error.textContent = '';

  // Полный возраст в годах
  const fullYears = calc.getFullYear() - birth.getFullYear();

  // Возраст в годах, месяцах и днях
  let years = calc.getFullYear() - birth.getFullYear();
  let months = calc.getMonth() - birth.getMonth();
  let days = calc.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const previousMonth = new Date(calc.getFullYear(), calc.getMonth(), 0);
    days += previousMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // Ближайший день рождения
  let nextYear = calc.getFullYear();
  let nextBirthday = new Date(nextYear, birth.getMonth(), birth.getDate());
  if (nextBirthday < calc) {
    nextYear++;
    nextBirthday = new Date(nextYear, birth.getMonth(), birth.getDate());
  }

  document.querySelector('#years').textContent = fullYears;
  document.querySelector('#exact-age').textContent = `${years} г. ${months} мес. ${days} дн.`;
  document.querySelector('#next-birthday').textContent = toInputDate(nextBirthday).split('-').reverse().join('.');
  document.querySelector('#days-left').textContent = `${daysBetween(calc, nextBirthday)} дн.`;
});

form.addEventListener('reset', () => {
  error.textContent = '';
  setTimeout(() => {
    calcInput.value = toInputDate(new Date());
  }, 0);
});
