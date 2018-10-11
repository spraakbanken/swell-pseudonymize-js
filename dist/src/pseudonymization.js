"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const names = require("./names");
const random = require("./random");
exports.variableMapping = {};
exports.usedForType = {};
function pseudonymize(s, labels) {
    const fun = exports.anonymization[labels[0]];
    if (fun) {
        return fun(labels[0], labels.slice(1), s);
    }
    else {
        return s;
    }
}
exports.pseudonymize = pseudonymize;
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
function pseudonymizeWithVariable(a) {
    return function (type, labels, s) {
        if (!exports.usedForType[type]) {
            exports.usedForType[type] = [];
        }
        if (labels.length > 0) {
            const variableIdx = parseInt(labels[labels.length - 1]);
            if (!isNaN(variableIdx)) {
                if (!exports.variableMapping[type]) {
                    exports.variableMapping[type] = [];
                }
                if (exports.variableMapping[type][variableIdx] != undefined) {
                    return a[exports.variableMapping[type][variableIdx]];
                }
                else {
                    const arrayIdx = getRandomArrayIdx(a, exports.variableMapping[type]);
                    exports.variableMapping[type][variableIdx] = arrayIdx;
                    if (exports.usedForType[type].indexOf(arrayIdx) == -1) {
                        exports.usedForType[type].push(arrayIdx);
                    }
                    return a[arrayIdx];
                }
            }
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
        return pseudonymizeWithVariable(names.school)(type, labels, s);
    }
    else if (instType === 'work') {
        return pseudonymizeWithVariable(names.workplace)(type, labels, s);
    }
    else {
        return pseudonymizeWithVariable(names.otherInstitution)(type, labels, s);
    }
}
function getRandomArrayIdx(a, used = []) {
    if (used.length == a.length) {
        // every element in a has already been used, take a random one
        random.getRandomInt(a.length);
    }
    let idx = 0;
    let loops = 0;
    do {
        idx = random.getRandomInt(a.length);
        loops += 1;
        // TODO this might loop forever, it will (very) probably not happen, fix better solution anyway?
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
    let result = pseudonymizeWithVariable(names.transport)(type, labels, s);
    if (isUpperCase(s[0])) {
        result = s[0].toUpperCase() + result.slice(1);
    }
    return result;
}
exports.anonymization = {
    'firstname:male': pseudonymizeWithVariable(names.maleName),
    'firstname:female': pseudonymizeWithVariable(names.femaleName),
    'firstname:unknown': pseudonymizeWithVariable(names.unknownName),
    'surname': pseudonymizeWithVariable(names.surname),
    'middlename': () => 'A',
    'initials': () => 'A',
    'institution': institution,
    'school': pseudonymizeWithVariable(names.school),
    'work': pseudonymizeWithVariable(names.workplace),
    'other_institution': pseudonymizeWithVariable(names.otherInstitution),
    'country_of_origin': pseudonymizeWithVariable(names.country),
    'country': pseudonymizeWithVariable(names.countryOfOrigin),
    'zip_code': zipCode,
    'region': pseudonymizeWithVariable(names.region),
    'city': pseudonymizeWithVariable(names.city),
    'area': pseudonymizeWithVariable(names.area),
    'street': pseudonymizeWithVariable(names.streetName),
    'geo': pseudonymizeWithVariable(names.geographicLocation),
    'street_nr': randomInt,
    'transport': pseudonymizeTransport,
    'transport_line': () => '1',
    'age': pseudonymizeAge,
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