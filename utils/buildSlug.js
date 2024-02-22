export function buildSlug(input, subUrlType = '') {
  const map = {
    ä: 'a',
    ö: 'o',
    å: 'a',
    é: 'e',
    è: 'e',
    ê: 'e',
    ë: 'e',
    à: 'a',
    â: 'a',
    æ: 'ae',
    ç: 'c',
    î: 'i',
    ï: 'i',
    ô: 'o',
    œ: 'oe',
    ü: 'u',
    ß: 'ss',
    á: 'a',
    í: 'i',
    ó: 'o',
    ú: 'u',
    ñ: 'n',
  };
  let output = input
    .trim()
    .toLowerCase()
    .replace(/[^\w- ]+/g, function (char) {
      return map[char] || '';
    })
    .replace(/ +/g, '-')
    .replace(/-+/g, '-')
    .replace(/[\u0022\u0027]/g, '');

  let result;

  if (input.startsWith(`/${subUrlType}/`)) {
    const subUrlIndex = input.indexOf(`/${subUrlType}/`) + subUrlType.length + 2;
    const newUrl = input.substring(subUrlIndex);
    result = `/${subUrlType}/${newUrl}`;
  } else {
    result = `/${subUrlType}/${output}`;
  }

  if (!subUrlType) {
    result = `/${output}`;
  }

  return result;
}
