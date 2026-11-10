// Darbų lentelės skaičiuoklė: valandos per mėnesį = kartų per mėn. (vienas žmogus) × min. vienam kartui × kiek žmonių / 60.
// Bendra puslapiui ir Apps Script.
function parseDecimal(value) {
  var text = String(value === undefined || value === null ? '' : value).trim();
  if (!/^\d+(?:[.,]\d+)?$/.test(text)) return null;
  var parsed = Number(text.replace(',', '.'));
  return isFinite(parsed) && parsed <= 1000000 ? parsed : null;
}
function validNumber(value) { return parseDecimal(value) !== null; }
function jobPeople(job) { return String(job.people || '').trim() === '' ? 1 : parseDecimal(job.people); }
function jobHours(job) {
  if (!job || !String(job.name || '').trim() || !validNumber(job.count) || !validNumber(job.minutes) || jobPeople(job) === null) return null;
  return parseDecimal(job.count) * parseDecimal(job.minutes) * jobPeople(job) / 60;
}
function totalHours(jobs) { return (jobs || []).reduce(function (sum, job) { var h = jobHours(job); return sum + (h === null ? 0 : h); }, 0); }
