import { Stats } from 'fs';

export function getCurrentDate() {
  const currentDate = new Date();
  return currentDate.toISOString().split('T')[0];
}
export function changeStatToDate(state: Stats) {
  const date = state.birthtime;
  return date.toISOString().split('T')[0];
}
