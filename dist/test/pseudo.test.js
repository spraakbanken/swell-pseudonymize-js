"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pseudonymization_1 = require("../src/pseudonymization");
const assert = require("assert");
const names = require("../src/names");
describe('all', () => {
    /*
    * reset saved state for each test
    */
    beforeEach((done) => {
        Object.keys(pseudonymization_1.variableMapping).forEach((key) => delete pseudonymization_1.variableMapping[key]);
        Object.keys(pseudonymization_1.usedForType).forEach((key) => delete pseudonymization_1.usedForType[key]);
        done();
    });
    describe('name', () => {
        it('should ignore unknown labels', () => {
            assert(pseudonymization_1.pseudonymize('jaja', ['asdf']) == 'jaja');
        });
        it('should be able to use every label', () => {
            const allLabels = Object.keys(pseudonymization_1.anonymization);
            allLabels.forEach((label) => {
                pseudonymization_1.pseudonymize('jaja', [label]);
            });
        });
        it('should return a male name', () => assert(names.maleName.indexOf(pseudonymization_1.pseudonymize('jaja', ['firstname_male', '1'])) != -1));
        it('should return a female name', () => assert(names.femaleName.indexOf(pseudonymization_1.pseudonymize('jaja', ['firstname_female', '1'])) != -1));
        it('should return an gender unknown name', () => {
            assert(names.unknownName.indexOf(pseudonymization_1.pseudonymize('jaja', ['firstname_unknown', '1'])) != -1);
        });
        it('should return same name for same number label', () => {
            const firstName = pseudonymization_1.pseudonymize('jaja', ['firstname_female', '1']);
            const secondName = pseudonymization_1.pseudonymize('jaja', ['firstname_female', '1']);
            assert(firstName === secondName);
        });
        it('should return same name for same number multi', () => {
            const res = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3].map((idx) => {
                return [idx, pseudonymization_1.pseudonymize('jaja', ['firstname_female', '' + idx])];
            });
            const one = res.filter(([idx, elem]) => idx == 1).map((elem) => elem[1]);
            const two = res.filter(([idx, elem]) => idx == 2).map((elem) => elem[1]);
            const three = res.filter(([idx, elem]) => idx == 3).map((elem) => elem[1]);
            assert(one.length == 10);
            one.forEach((elem) => assert(elem === one[0]));
            assert(two.length == 10);
            two.forEach((elem) => assert(elem === two[0]));
            assert(three.length == 10);
            three.forEach((elem) => {
                assert(elem === three[0]);
            });
            assert(one[0] !== two[0]);
            assert(two[0] !== three[0]);
        });
        it('should never pick the same name twice (if it can be avoided)', () => {
            const seenNames = [];
            for (let i = 0; i < names.femaleName.length; i++) {
                const result = pseudonymization_1.pseudonymize('jaja', ['firstname_female']);
                assert(seenNames.indexOf(result) == -1);
                seenNames.push(result);
            }
            const result2 = pseudonymization_1.pseudonymize('jaja', ['firstname_female']);
            assert(seenNames.indexOf(result2) > -1);
        });
        it('should return diffrent name for different number label', () => {
            const firstName = pseudonymization_1.pseudonymize('jaja', ['firstname_female', '1']);
            const secondName = pseudonymization_1.pseudonymize('jaja', ['firstname_female', '2']);
            assert(firstName !== secondName);
        });
        it('should replace middle names with constant initial', () => {
            assert(pseudonymization_1.pseudonymize('Apa', ['middlename']) === 'A');
        });
        it('should return a surname', () => {
            assert(names.surname.indexOf(pseudonymization_1.pseudonymize('jaja', ['surname'])) != -1);
        });
        it('should replace initials with A', () => assert(pseudonymization_1.pseudonymize('GG', ['initials']) === 'A'));
        it('should add extra tags as affix', () => {
            assert(pseudonymization_1.pseudonymize('jaja', ['firstname_female', 'pl', 'quux', 'gen']).substr(-7) === '-pl-gen');
            const name1 = pseudonymization_1.pseudonymize('jaja', ['firstname_female', '3']);
            const affixName1 = pseudonymization_1.pseudonymize('jaja', ['firstname_female', '3', 'gen']);
            const affixName2 = pseudonymization_1.pseudonymize('jaja', ['firstname_female', 'gen', '3']);
            assert(affixName1 === name1 + '-gen');
            assert(affixName1 == affixName2);
        });
    });
    describe('institution', () => {
        it('should replace school names', () => {
            assert(names.school.indexOf(pseudonymization_1.pseudonymize('jaja', ['institution', 'school'])) != -1);
            assert(names.school.indexOf(pseudonymization_1.pseudonymize('jaja', ['school'])) != -1);
        });
        it('should replace workplace names', () => {
            assert(names.workplace.indexOf(pseudonymization_1.pseudonymize('jaja', ['institution', 'work'])) != -1);
            assert(names.workplace.indexOf(pseudonymization_1.pseudonymize('jaja', ['work'])) != -1);
        });
        it('should replace other institution names', () => {
            assert(names.otherInstitution.indexOf(pseudonymization_1.pseudonymize('jaja', ['institution', 'other_institution'])) != -1);
            assert(names.otherInstitution.indexOf(pseudonymization_1.pseudonymize('jaja', ['other_institution'])) != -1);
        });
    });
    describe('geographic', () => {
        it('should return a place name', () => {
            assert(names.place.indexOf(pseudonymization_1.pseudonymize('jaja', ['place'])) != -1);
            assert(names.placeForeign.indexOf(pseudonymization_1.pseudonymize('jaja', ['place_foreign'])) != -1);
        });
        it('should return a random street numbers', () => {
            const streetNr = pseudonymization_1.pseudonymize('3', ['street_nr']);
            assert(parseInt(streetNr) <= 50);
            assert(parseInt(streetNr) > 0);
        });
        it('should replace country of origin with random country', () => {
            assert(names.countryOfOrigin.indexOf(pseudonymization_1.pseudonymize('Danmark', ['country_of_origin'])) !== -1);
        });
        it('should replace country with random country', () => {
            assert(names.country.indexOf(pseudonymization_1.pseudonymize('Danmark', ['country'])) !== -1);
        });
        it('should replace city with random city', () => {
            assert(names.city.indexOf(pseudonymization_1.pseudonymize('Flen', ['city'])) !== -1);
            assert(names.cityForeign.indexOf(pseudonymization_1.pseudonymize('Flen', ['city_foreign'])) !== -1);
        });
        it('should replace geo with random geographic thing', () => {
            assert(names.geographicLocation.indexOf(pseudonymization_1.pseudonymize('Flen', ['geo'])) !== -1);
        });
        it('should replace zip codes', () => {
            assert(pseudonymization_1.pseudonymize('SWE-123', ['zip_code']) === 'ABC-000');
            assert(pseudonymization_1.pseudonymize('41323', ['zip_code']) === '00000');
        });
    });
    describe('transportation', () => {
        it('should replace transportation types with a random type', () => {
            const result = pseudonymization_1.pseudonymize('transport', ['transport_name']);
            assert(names.transport.indexOf(result) != -1);
        });
        it('should maintain given capitalization of first letter', () => {
            const result = pseudonymization_1.pseudonymize('Transport', ['transport_name']);
            assert(['B', 'S', 'T'].indexOf(result[0]) != -1);
        });
        it('should replace lines numbers with random number codes', () => {
            assert(pseudonymization_1.pseudonymize('2', ['transport_nr']) === '1');
            assert(pseudonymization_1.pseudonymize('3', ['transport_nr']) === '1');
        });
    });
    describe('age', () => {
        function testAge(actualAge, expectedAge) {
            const intAge = parseInt(actualAge);
            assert(intAge >= expectedAge - 2);
            assert(intAge <= expectedAge + 2);
        }
        it('should replace number ages within 5 years', () => {
            const age = pseudonymization_1.pseudonymize('10', ['age_digits']);
            testAge(age, 10);
        });
        it('should replace string ages within 5 years', () => {
            let age = pseudonymization_1.pseudonymize('arton', ['age_string', '18']);
            testAge(age, 18);
        });
        it('uses variable index', () => {
            let age1 = pseudonymization_1.pseudonymize('10', ['age_digits', '2']);
            let age2 = pseudonymization_1.pseudonymize('11', ['age_digits', '2']);
            assert(age1 == age2);
        });
    });
    describe('dates', () => {
        it('should replace day with random number between 1-28', () => {
            const day = parseInt(pseudonymization_1.pseudonymize('12', ['day']));
            assert(day >= 1);
            assert(day <= 28);
        });
        it('should replace month digit with random number between 1-12', () => {
            const month = parseInt(pseudonymization_1.pseudonymize('12', ['month_digit']));
            assert(month >= 1);
            assert(month <= 12);
        });
        it('should replace written months with random written month', () => {
            const month = pseudonymization_1.pseudonymize('jaja', ['month_word']);
            assert(month[0].toLowerCase() === month[0]);
            const month2 = pseudonymization_1.pseudonymize('Jaja', ['month_word']);
            assert(month2[0].toUpperCase() === month2[0]);
        });
        it('should replace year with +/- 2 randomly', () => {
            const year = parseInt(pseudonymization_1.pseudonymize('2018', ['year']));
            assert(year >= 2016);
            assert(year <= 2020);
        });
        it('should not make up negative or zero years', () => {
            for (let i = 0; i < 20; i++) {
                assert(parseInt(pseudonymization_1.pseudonymize('1', ['year'])) > 0);
            }
        });
        it('should replace all digits in dates with 1', () => {
            assert(pseudonymization_1.pseudonymize('2018-12-01', ['date_digits']) === '1111-11-11');
            assert(pseudonymization_1.pseudonymize('18/01/12', ['date_digits']) === '11/11/11');
            assert(pseudonymization_1.pseudonymize('180112', ['date_digits']) === '111111');
            assert(pseudonymization_1.pseudonymize('11/12', ['date_digits']) === '11/11');
        });
    });
    describe('other', () => {
        it('should replace emails with placeholder', () => assert(pseudonymization_1.pseudonymize('asdf', ['email']) === 'email@dot.com'));
        it('should replace telephone numbers with placeholder', () => {
            assert(pseudonymization_1.pseudonymize('012-3456789', ['phone_nr']) === '000-0000000');
            assert(pseudonymization_1.pseudonymize('0120-34-56789', ['phone_nr']) === '0000-00-00000');
        });
        it('should replace personal numbers with placeholder', () => {
            assert(pseudonymization_1.pseudonymize('980502-1234', ['personid_nr']) === '123456-0000');
            assert(pseudonymization_1.pseudonymize('bepacepa', ['personid_nr']) === '123456-0000');
        });
        it('should replace license number letters with ABC and numbers zeroes', () => {
            assert(pseudonymization_1.pseudonymize('XYZ123', ['license_nr']) === 'ABC000');
            assert(pseudonymization_1.pseudonymize('XYZG-1U2-3', ['license_nr']) === 'ABCD-0E0-0');
        });
    });
});
//# sourceMappingURL=pseudo.test.js.map