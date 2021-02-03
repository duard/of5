import * as moment from 'moment';
const week = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export const periods = {
  morning: ['06:00', '11:59'],
  evening: ['12:00', '17:59'],
  nocturnal: ['18:00', '23:59']
};

export function compareTime(leftTime, rightTime) {
  return moment.utc(rightTime).isAfter(leftTime);
}

export function compareDateIsAfter(leftTime, rightTime) {
  return moment.utc(leftTime).isAfter(rightTime);
}

export function compareDateIsSameOrAfeter(leftTime, rightTime) {
  return moment.utc(leftTime).isSameOrAfter(rightTime);
}

export function isBetween(now, startDate, finalDate) {
  return moment(now).isBetween(startDate, finalDate, 'day', '[]');
}

export function getTimeInterval(startTime, endTime) {
  const start = moment(startTime, 'HH:mm');
  const end = moment(endTime, 'HH:mm');
  const minutes = end.diff(start, 'minutes');
  const interval = moment().hour(0).minute(minutes);

  return interval.format('HH:mm');
}

export function convertHoursToNumber(time) {
  return moment.duration(time).asHours();
}

export function dayWeekByDate(date) {
  const dayWeekIndex = moment.utc(date).day();

  return week[dayWeekIndex];
}

export function monthByDate(date) {
  const monthIndex = moment.utc(date).locale('pt-BR').format('MMM');
  return monthIndex;
}

export function dayWeekByIndex(index) {
  return week[index];
}

export function indexByDayWeek(dayWeek) {
  const w = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
  return w.findIndex(item => item === dayWeek) - 1;
}

export function getRange(startDate, endDate, type) {
  const fromDate = moment.utc(startDate);
  const toDate = moment.utc(endDate);
  const diff = toDate.diff(fromDate, type);
  const range = [];

  for (let i = 0; i < diff; i++) {
    range.push(moment.utc(startDate).add(i, type));
  }

  return range;
}

export function getNumberRange(start, end) {
  return [...Array(end - start + 1)].map((_, i) => start + i);
}

export function getCurrentDateWithoutHours() {
  return moment().format('YYYY-MM-DD');
}

export function formatDateWithoutHours(date) {
  return moment(date).format('YYYY-MM-DD');
}

export function formatDateHours(date) {
  return moment(date).format('HH:MM:ss');
}

export function formatDateWithHours(date) {
  return moment.utc(date).format('YYYY-MM-DD HH:MM:ss');
}

export function generateCodeWithCurrentDate() {
  return moment().format('YYYYMMDDHHMMssSSS');
}

export function generateCodePlp() {
  return moment().format('YYYYMMDD');
}

export function getDateNowWithouHours() {
  return moment.utc().format('YYYY-MM-DD');
}

export function calculatesTheDifferenceBetweenDates(initial, final) {
  return moment(final).diff(moment(initial), 'days');
}

export function addDays(date, days: number) {
  return moment(date).add(days, 'day').format('YYYY-MM-DD');
}

export function formatByType(date, type: string) {
  switch (type) {
    case 'Y':
      return moment.utc(date).format('YYYY');
      break;
    case 'M':
      return moment.utc(date).format('MM');
      break;
    case 'D':
      return moment.utc(date).format('DD');
      break;
  }
}
