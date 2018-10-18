"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const names = require("./names");
const random = require("./random");
/** A store of pseudonyms, indexed by type and variable index. */
exports.variableMapping = {};
exports.usedForType = {};
function pseudonymize(s, labels) {
    let [type, extra_labels] = [labels[0], labels.slice(1)];
    const variableIdx = getVariableIdx(extra_labels);
    const fun = exports.anonymization[labels[0]];
    // By default, return the input.
    let p = s;
    // First try the store.
    if (variableIdx !== undefined && storeHas(type, variableIdx)) {
        p = storeGet(type, variableIdx);
    }
    // Otherwise try to generate a new pseudonym.
    else if (fun) {
        p = fun(type, extra_labels, s);
    }
    // Save to store before returning.
    if (variableIdx !== undefined) {
        storeSet(type, variableIdx, p);
    }
    return p + affix(labels);
}
exports.pseudonymize = pseudonymize;
/** Get the first numeric label. */
function getVariableIdx(labels) {
    return labels.map(l => parseInt(l)).filter(n => !isNaN(n)).shift();
}
/** Check the presence of a stored pseudonym. */
function storeHas(type, variableIdx) {
    return exports.variableMapping[type] && exports.variableMapping[type][variableIdx] !== undefined;
}
/** Get a stored pseudonym. */
function storeGet(type, variableIdx) {
    return exports.variableMapping[type][variableIdx];
}
/** Save a pseudonym to the store. */
function storeSet(type, variableIdx, p) {
    if (!exports.variableMapping[type]) {
        exports.variableMapping[type] = [];
    }
    exports.variableMapping[type][variableIdx] = p;
}
/** Get affix string like "-gen-ort" */
function affix(labels) {
    return labels.filter(l => affixLabels.includes(l)).map(l => '-' + l).join('');
}
function pseudonymizeAge(type, labels, s) {
    const ageInt = parseInt(s);
    if (isNaN(ageInt)) {
        return '' + random.getRandomInt(70);
    }
    else {
        const offset = random.getRandomInt(5) - 2;
        return '' + (ageInt + offset);
    }
}
function pseudonymizeFromList(a) {
    return function (type, labels, s) {
        if (!exports.usedForType[type]) {
            exports.usedForType[type] = [];
        }
        const arrayIdx = getRandomArrayIdx(a, exports.usedForType[type]);
        if (exports.usedForType[type].indexOf(arrayIdx) == -1) {
            exports.usedForType[type].push(arrayIdx);
        }
        return a[arrayIdx];
    };
}
function randomInt() {
    return '' + (random.getRandomInt(50) + 1);
}
function zipCode(type, labels, s) {
    let letters = 'ABCDEFGHIJKLMNOPQRZTUVZXY';
    s = replaceNumbersWithZero(s);
    const letterExp = new RegExp("[0-9]", "g");
    let newString = '';
    for (let i = 0; i < s.length; i++) {
        if (isLetter(s[i])) {
            newString += letters[0];
            letters = letters.slice(1);
        }
        else {
            newString += s[i];
        }
    }
    return newString;
}
function isLetter(char) {
    return char.toUpperCase() != char.toLowerCase();
}
function phoneNumber(type, labels, s) {
    return replaceNumbersWithZero(s);
}
function replaceNumbersWithZero(s) {
    return s.replace(new RegExp("[0-9]", "g"), "0");
}
function email() {
    return 'email@dot.com';
}
function institution(type, labels, s) {
    const instType = labels[0];
    if (instType === 'school') {
        return pseudonymizeFromList(names.school)(type, labels, s);
    }
    else if (instType === 'work') {
        return pseudonymizeFromList(names.workplace)(type, labels, s);
    }
    else {
        return pseudonymizeFromList(names.otherInstitution)(type, labels, s);
    }
}
function getRandomArrayIdx(a, used = []) {
    if (used.length == a.length) {
        // every element in a has already been used, take a random one
        return random.getRandomInt(a.length);
    }
    let idx = 0;
    do {
        idx = random.getRandomInt(a.length);
    } while (used.indexOf(idx) != -1);
    return idx;
}
function isUpperCase(str) {
    return /^[A-Z]*$/.test(str);
}
function pseudonymizeWrittenMonth(type, labels, s) {
    const idx = random.getRandomInt(12);
    const months = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];
    let result = months[idx];
    if (isUpperCase(s[0])) {
        result = s[0].toUpperCase() + result.slice(1);
    }
    return result;
}
function pseudonymizeYear(type, labels, s) {
    const yearInt = parseInt(s);
    if (isNaN(yearInt)) {
        return '' + random.getRandomBetween(1970, 2018);
    }
    else {
        const offset = random.getRandomInt(5) - 2;
        return '' + (yearInt + offset);
    }
}
function pseudonymizeDate(type, labels, s) {
    return s.replace(new RegExp("[0-9]", "g"), "1");
}
function pseudonymizeTransport(type, labels, s) {
    let result = pseudonymizeFromList(names.transport)(type, labels, s);
    if (isUpperCase(s[0])) {
        result = s[0].toUpperCase() + result.slice(1);
    }
    return result;
}
/** Modifiers labels, not associated with pseudonym categories. */
const affixLabels = ['gen', 'def', 'ort'];
exports.anonymization = {
    'firstname:male': pseudonymizeFromList(names.maleName),
    'firstname:female': pseudonymizeFromList(names.femaleName),
    'firstname:unknown': pseudonymizeFromList(names.unknownName),
    'surname': pseudonymizeFromList(names.surname),
    'middlename': () => 'A',
    'initials': () => 'A',
    'institution': institution,
    'school': pseudonymizeFromList(names.school),
    'work': pseudonymizeFromList(names.workplace),
    'other_institution': pseudonymizeFromList(names.otherInstitution),
    'country_of_origin': pseudonymizeFromList(names.country),
    'country': pseudonymizeFromList(names.countryOfOrigin),
    'zip_code': zipCode,
    'region': pseudonymizeFromList(names.region),
    'city': pseudonymizeFromList(names.city),
    'city-SWE': pseudonymizeFromList(names.citySwe),
    'area': pseudonymizeFromList(names.area),
    'street': pseudonymizeFromList(names.streetName),
    'geo': pseudonymizeFromList(names.geographicLocation),
    'street_nr': randomInt,
    'transport': pseudonymizeTransport,
    'transport_line': () => '1',
    'age_digits': pseudonymizeAge,
    'day': () => '' + (random.getRandomInt(28) + 1),
    'month-digit': () => '' + (random.getRandomInt(12) + 1),
    'month-word': pseudonymizeWrittenMonth,
    'year': pseudonymizeYear,
    'date-digits': pseudonymizeDate,
    'phone_nr': phoneNumber,
    'email': email,
    'personid_nr': () => '123456-0000',
    'account_nr': (type, labels, str) => replaceNumbersWithZero(str),
    'license_nr': zipCode,
    'url': () => 'url.com',
    'other_nr_seq': (type, labels, str) => replaceNumbersWithZero(str)
};
//# sourceMappingURL=pseudonymization.js.map