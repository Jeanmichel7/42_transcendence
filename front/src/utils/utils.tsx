export function getTimeSince(time: Date): string {
  const now: Date = new Date();
  const dataTime: Date = new Date(time);
  const diff: number = now.getTime() - dataTime.getTime();
  const seconds: number = Math.floor(diff / 1000);
  const minutes: number = Math.floor(seconds / 60);
  const hours: number = Math.floor(minutes / 60);
  let result = '';

  if (hours > 24)
    result += 'Le ' + dataTime.toLocaleDateString();
  else if (hours == 0 && minutes == 0 && seconds <= 30)
    result += 'Now';
  else {
    result += 'Il y a ';
    if (hours >= 1) {
      result += `${hours}h`;
    } else if (minutes >= 1) {
      result += `${minutes}m`;
    } else {
      result += `${seconds}s`;
    }
  }
  return result;
}