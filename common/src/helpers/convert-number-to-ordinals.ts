const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });

const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
]);

export function convertNumberToOrdinals(num: number) {
  const rule = pr.select(num)
  const suffix = suffixes.get(rule)
  return `${num}${suffix}`
}

/*
convertNumberToOrdinals(0); // '0th'
convertNumberToOrdinals(1); // '1st'
convertNumberToOrdinals(2); // '2nd'
convertNumberToOrdinals(3); // '3rd'
convertNumberToOrdinals(4); // '4th'
convertNumberToOrdinals(11); // '11th'
convertNumberToOrdinals(21); // '21st'
convertNumberToOrdinals(42); // '42nd'
convertNumberToOrdinals(103); // '103rd'
*/