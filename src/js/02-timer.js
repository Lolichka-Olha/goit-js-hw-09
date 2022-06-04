import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const currentDate = new Date();

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  daysLeft: document.querySelector('.value[data-days]'),
  hoursLeft: document.querySelector('.value[data-hours]'),
  minutesLeft: document.querySelector('.value[data-minutes]'),
  secondsLeft: document.querySelector('.value[data-seconds]'),
};

refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    if (selectedDates[0] < currentDate) {
      Notify.warning('Please choose a date in the future');
    } else {
      refs.startBtn.disabled = false;
    }
  },
};

flatpickr(refs.input, options);

refs.startBtn.addEventListener('click', onStartTimerClick);

function onStartTimerClick() {
  refs.startBtn.disabled = true;

  let interval = setInterval(() => {
    const timeDiff = new Date(refs.input.value) - new Date();

    if (timeDiff < 0) {
      clearInterval(interval);
      return;
    }
    const timer = convertMs(timeDiff);
    timeLeft(timer);
  }, 1000);
}

function timeLeft({ days, hours, minutes, seconds }) {
  refs.daysLeft.textContent = days;
  refs.hoursLeft.textContent = hours;
  refs.minutesLeft.textContent = minutes;
  refs.secondsLeft.textContent = seconds;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}
