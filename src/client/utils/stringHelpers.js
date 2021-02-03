// We're looking for a very specific Twilio url here.
function formatUrl(input) {
  if (!input) return '';
  const pos = input.lastIndexOf('/') + 1;
  return input.substring(pos, input.length);
}

// https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
function secondsToTimeString(time) {
  const secNum = parseInt(time, 10);
  let hours = Math.floor(secNum / 3600);
  let minutes = Math.floor((secNum - hours * 3600) / 60);
  let seconds = secNum - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
}

// https://css-tricks.com/how-to-convert-a-date-string-into-a-human-readable-format/
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export { formatUrl, secondsToTimeString, formatDate };
