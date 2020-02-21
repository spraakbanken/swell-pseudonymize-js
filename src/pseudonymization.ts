import * as names from './names'
import * as random from './random'

/** A store of pseudonyms, indexed by type and variable index. */
export const variableMapping: { [type: string]: string[] } = {}
export const usedForType: { [key: string]: any } = {}

export function pseudonymize(s: string, labels: string[]): string {
  let [type, extra_labels] = [labels[0], labels.slice(1)]
  const variableIdx = getVariableIdx(extra_labels)
  const fun = anonymization[labels[0]]
  // By default, return the input.
  let p = s
  // First try the store.
  if (variableIdx !== undefined && storeHas(type, variableIdx)) {
    p = storeGet(type, variableIdx)
  }
  // Otherwise try to generate a new pseudonym.
  else if (fun) {
    p = fun(type, extra_labels, s)
  }
  // Save to store before returning.
  if (variableIdx !== undefined) {
    storeSet(type, variableIdx, p)
  }
  return p + affix(labels)
}

/** Get the first numeric label. */
function getVariableIdx(labels: string[]): number | undefined {
  return labels.map(l => parseInt(l)).filter(n => !isNaN(n)).shift()
}

/** Check the presence of a stored pseudonym. */
function storeHas(type: string, variableIdx: number): boolean {
  return variableMapping[type] && variableMapping[type][variableIdx] !== undefined
}

/** Get a stored pseudonym. */
function storeGet(type: string, variableIdx: number): string {
  return variableMapping[type][variableIdx]
}

/** Save a pseudonym to the store. */
function storeSet(type: string, variableIdx: number, p: string) {
  if (!variableMapping[type]) {
    variableMapping[type] = []
  }
  variableMapping[type][variableIdx] = p
}

/** Get affix string like "-gen-ort" */
function affix(labels: string[]): string {
  return labels.filter(l => affixLabels.includes(l)).map(l => '-' + l).join('')
}

function pseudonymizeAge(type: string, labels: string[], s: string): string {
  const ageInt = parseInt(s)
  if (isNaN(ageInt)) {
    return '' + random.getRandomInt(70)
  } else {
    const offset = random.getRandomInt(5) - 2
    return '' + (ageInt + offset)
  }
}

/** The age is given as a numerical label, e.g. "eighteen" should be labeled "age_string 18". */
function pseudonymizeAgeString(type: string, labels: string[], s: string): string {
  const age = labels.find(v => !isNaN(Number(v)))
  return pseudonymizeAge(type, labels, age || '')
}

function pseudonymizeFromList(a: string[]) {
  return function (type: string, labels: string[], s: string): string {
    if(!usedForType[type]) {
      usedForType[type] = []
    }
    
    const arrayIdx = getRandomArrayIdx(a, usedForType[type])
    if (usedForType[type].indexOf(arrayIdx) == -1) {
      usedForType[type].push(arrayIdx)
    }
    return a[arrayIdx]
  }
}

function randomInt(): string {
  return '' + (random.getRandomInt(50) + 1)
}

function zipCode(type: string, labels: string[], s: string): string {
  let letters = 'ABCDEFGHIJKLMNOPQRZTUVZXY'
  s = replaceNumbersWithZero(s)
  const letterExp = new RegExp("[0-9]", "g")
  let newString = ''
  for (let i = 0; i < s.length; i++) {
    if (isLetter(s[i])) {
      newString += letters[0]
      letters = letters.slice(1)
    } else {
      newString += s[i]
    }
  }
  return  newString
}

function isLetter(char: string): boolean {
  return char.toUpperCase() != char.toLowerCase()
}

function phoneNumber(type: string, labels: string[], s: string): string {
  return replaceNumbersWithZero(s)
}

function replaceNumbersWithZero(s: string): string {
  return s.replace(new RegExp("[0-9]", "g"), "0")
}

function email(): string {
  return 'email@dot.com'
}

function institution(type: string, labels: string[], s: string): string {
  const instType = labels[0]
  if (instType === 'school') {
    return pseudonymizeFromList(names.school)(type, labels, s)
  } else if (instType === 'work') {
    return pseudonymizeFromList(names.workplace)(type, labels, s)
  } else {
    return pseudonymizeFromList(names.otherInstitution)(type, labels, s)
  }
}


function getRandomArrayIdx(a: any[], used: number[] = []): number {
  if( used.length == a.length) {
    // every element in a has already been used, take a random one
    return random.getRandomInt(a.length)
  }

  let idx = 0
  do {
    idx = random.getRandomInt(a.length)
  } while (used.indexOf(idx) != -1)

  return idx
}

function isUpperCase (str: string): boolean {
  return /^[A-Z]*$/.test(str)
}

function pseudonymizeWrittenMonth(type: string, labels: string[], s: string): string {
  const idx = random.getRandomInt(12)
  const months = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"]
  let result = months[idx]
  /* if (isUpperCase(s[0])) {
    result = result[0].toUpperCase() + result.slice(1)
  } */
  return result
}

function pseudonymizeYear(type: string, labels: string[], s: string): string {
  const yearInt = parseInt(s)
  if (isNaN(yearInt)) {
    return '' + random.getRandomBetween(1970, 2018)
  } else {
    const offset = random.getRandomInt(5) - 2
    return '' + Math.max(1, yearInt + offset)
  }
}

function pseudonymizeDate(type: string, labels: string[], s: string): string {
  return s.replace(new RegExp("[0-9]", "g"), "1")
}

function pseudonymizeTransport(type: string, labels: string[], s: string): string {
  let result = pseudonymizeFromList(names.transport)(type, labels, s)
  if (isUpperCase(s[0])) {
    result = s[0].toUpperCase() + result.slice(1)
  }
  return result
}

/** Modifiers labels, not associated with pseudonym categories. */
const affixLabels = ['gen', 'def', 'pl', 'ort']

export const anonymization:{ [key: string]: (type: string, labels: string[], s: string) => string } = {
  'firstname_male': pseudonymizeFromList(names.maleName),
  'firstname_female': pseudonymizeFromList(names.femaleName),
  'firstname_unknown': pseudonymizeFromList(names.unknownName),
  'surname': pseudonymizeFromList(names.surname),
  'middlename': () => 'A',
  'initials': () => 'A',
  'institution': institution,
  'school': pseudonymizeFromList(names.school),
  'work': pseudonymizeFromList(names.workplace),
  'other_institution': pseudonymizeFromList(names.otherInstitution),
  'country_of_origin': pseudonymizeFromList(names.countryOfOrigin),
  'country': pseudonymizeFromList(names.country),
  'zip_code': zipCode,
  'region': pseudonymizeFromList(names.region),
  'city': pseudonymizeFromList(names.city),
  'city_foreign': pseudonymizeFromList(names.cityForeign),
  'area_foreign': pseudonymizeFromList(names.areaForeign),
  'place_foreign': pseudonymizeFromList(names.placeForeign),
  'region_foreign': pseudonymizeFromList(names.regionForeign),
  'area': pseudonymizeFromList(names.area),
  'place': pseudonymizeFromList(names.place),
  'geo': pseudonymizeFromList(names.geographicLocation),
  'street_nr': randomInt,
  'transport_name': pseudonymizeTransport,
  'transport_nr': () => '1',
  'age_digits': pseudonymizeAge,
  'age_string': pseudonymizeAgeString,
  'day': () => '' + (random.getRandomInt(28) + 1),
  'month_digit': () => '' + (random.getRandomInt(12) + 1),
  'month_word': pseudonymizeWrittenMonth,
  'year': pseudonymizeYear,
  'date_digits': pseudonymizeDate,
  'phone_nr': phoneNumber,
  'email': email,
  'personid_nr': () => '123456-0000',
  'account_nr': (type: string, labels: any, str: string) => replaceNumbersWithZero(str),
  'license_nr': zipCode,
  'url': () => 'url.com',
  'other_nr_seq': (type: string, labels: any, str: string) => replaceNumbersWithZero(str)
}
