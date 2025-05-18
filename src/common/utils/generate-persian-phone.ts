export function generatePersianPhoneNumber(international = false): string {
  const prefixes = ['091', '092', '093', '099'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 10),
  ).join('');
  const localNumber = prefix + number;

  return international ? `+98${localNumber.slice(1)}` : localNumber;
}

// Example usage:
console.log('Local format:', generatePersianPhoneNumber(false));
console.log('International format:', generatePersianPhoneNumber(true));
