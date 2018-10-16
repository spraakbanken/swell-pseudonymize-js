import {pseudonymize, anonymization, variableMapping, usedForType} from '../src/pseudonymization'
import * as assert from 'assert'
import {} from 'jasmine';
import * as names from '../src/names'

describe('all', () => {
  
  /*
  * reset saved state for each test
  */
  beforeEach((done) => {
    Object.keys(variableMapping).forEach((key) => delete variableMapping[key])
    Object.keys(usedForType).forEach((key) => delete usedForType[key])
    done()
  })

  describe('name', () => {

    it('should ignore unknown labels', () => {
      assert(pseudonymize('jaja', ['asdf']) == 'jaja')
    })
    
    it('should be able to use every label', () => {
      const allLabels: string[] = Object.keys(anonymization);
      allLabels.forEach((label: string) => {
        pseudonymize('jaja', [label])
      })
    })

    it('should return a male name', () =>
      assert(names.maleName.indexOf(pseudonymize('jaja', ['firstname:male', '1'])) != -1)
    )

    it('should return a female name', () =>
      assert(names.femaleName.indexOf(pseudonymize('jaja', ['firstname:female', '1'])) != -1)
    )
    
    it('should return an gender unknown name', () => {
      assert(names.unknownName.indexOf(pseudonymize('jaja', ['firstname:unknown', '1'])) != -1)
    })

    it('should return same name for same number label', () => {
      const firstName = pseudonymize('jaja', ['firstname:female', '1'])
      const secondName = pseudonymize('jaja', ['firstname:female', '1'])
      assert(firstName === secondName)
    })
    
    it('should return same name for same number multi', () => {
      const res = [1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3].map((idx) => {
        return [idx, pseudonymize('jaja', ['firstname:female', '' + idx])]
      })
      const one = res.filter(([idx, elem]) => idx == 1).map((elem) => elem[1])
      const two = res.filter(([idx, elem]) => idx == 2).map((elem) => elem[1])
      const three = res.filter(([idx, elem]) => idx == 3).map((elem) => elem[1])
      
      assert(one.length == 10)
      one.forEach((elem) => assert(elem === one[0]))
      assert(two.length == 10)
      two.forEach((elem) => assert(elem === two[0]))
      
      assert(three.length == 10)
      three.forEach((elem) => {
        assert(elem === three[0])
      })
      
      assert(one[0] !== two[0])
      assert(two[0] !== three[0])
    })

    it('should never pick the same name twice (if it can be avoided)', () => {
      const seenNames = []
      for(let i = 0; i < names.femaleName.length; i++) {
        const result = pseudonymize('jaja', ['firstname:female'])
        assert(seenNames.indexOf(result) == -1)
        seenNames.push(result)
      }
      const result2 = pseudonymize('jaja', ['firstname:female'])
      assert(seenNames.indexOf(result2) > -1)
    })

    it('should return diffrent name for different number label', () => {
      const firstName = pseudonymize('jaja', ['firstname:female', '1'])
      const secondName = pseudonymize('jaja', ['firstname:female', '2'])
      assert(firstName !== secondName)
    })

    it('should replace middle names with constant initial', () => {
      assert(pseudonymize('Apa', ['middlename']) === 'A')
    })

    it('should return a surname', () => {
      assert(names.surname.indexOf(pseudonymize('jaja', ['surname'])) != -1)
    })

    it('should replace initials with A', () => 
      assert(pseudonymize('GG', ['initials']) === 'A')
    )
  })

  describe('institution', () => {

    it('should replace school names', () => {
      assert(names.school.indexOf(pseudonymize('jaja', ['institution', 'school'])) != -1)
      assert(names.school.indexOf(pseudonymize('jaja', ['school'])) != -1)
    })

    it('should replace workplace names', () => {
      assert(names.workplace.indexOf(pseudonymize('jaja', ['institution', 'work'])) != -1)
      assert(names.workplace.indexOf(pseudonymize('jaja', ['work'])) != -1)
    })

    it('should replace other institution names', () => {
      assert(names.otherInstitution.indexOf(pseudonymize('jaja', ['institution', 'other_institution'])) != -1)
      assert(names.otherInstitution.indexOf(pseudonymize('jaja', ['other_institution'])) != -1)
    })

  })

  describe('geographic', () => {

    it('should return a street name', () => {
        assert(names.streetName.indexOf(pseudonymize('jaja', ['street'])) != -1)
    })
    
    it('should return a random street numbers', () => {
      const streetNr = pseudonymize('3', ['street_nr'])
      assert(parseInt(streetNr) <= 50)
      assert(parseInt(streetNr) > 0)
    })
    
    it('should replace country of origin with random country', () => {
      assert(names.countryOfOrigin.indexOf(pseudonymize('Danmark', ['country_of_origin'])) !== -1)
    })

    it('should replace country with random country', () => {
      assert(names.country.indexOf(pseudonymize('Danmark', ['country'])) !== -1)
    })

    it('should replace city with random city', () => {
      assert(names.city.indexOf(pseudonymize('Flen', ['city'])) !== -1)
    })

    it('should replace geo with random geographic thing', () => {
      assert(names.geographicLocation.indexOf(pseudonymize('Flen', ['geo'])) !== -1)
    })
    
    it('should replace zip codes', () => {
      assert(pseudonymize('SWE-123', ['zip_code']) === 'ABC-000')
      assert(pseudonymize('41323', ['zip_code']) === '00000')
    })

  })

  describe('transportation', () => {
    
    it('should replace transportation types with a random type', () => {
      const result = pseudonymize('transport', ['transport'])
      assert(names.transport.indexOf(result) != -1)
    })
    
    it('should maintain given capitalization of first letter', () => {
      const result = pseudonymize('Transport', ['transport'])
      assert(['B','S','T'].indexOf(result[0]) != -1)
    })
    
    it('should replace lines numbers with random number codes', () => {
      assert(pseudonymize('2', ['transport_line']) === '1')
      assert(pseudonymize('3', ['transport_line']) === '1')
    })
  })

  describe('age', () => {
    
    function testAge(actualAge: string, expectedAge: number) {
      const intAge = parseInt(actualAge)
      assert(intAge >= expectedAge - 2)
      assert(intAge <= expectedAge + 2)
    }
    
    it('should replace number ages within 5 years', () => {
      const age = pseudonymize('10', ['age'])
      testAge(age, 10)
    })
    
    it('should replace string ages within 5 years', () => {
      let age = pseudonymize('arton', ['age'])
      assert(age.match(/^[0-9]+$/) != null)
    })

  })

  describe('dates', () => {
    
    it('should replace day with random number between 1-28', () => {
      const day = parseInt(pseudonymize('12', ['day']))
      assert(day >= 1)
      assert(day <= 28)
    })
    
    it('should replace month digit with random number between 1-12', () => {
      const month = parseInt(pseudonymize('12', ['month-digit']))
      assert(month >= 1)
      assert(month <= 12)
    })
    
    it('should replace written months with random written month', () => {
      const month = pseudonymize('jaja', ['month-word'])
      assert(month[0].toLowerCase() === month[0])
      
      const month2 = pseudonymize('Jaja', ['month-word'])
      assert(month2[0].toUpperCase() === month2[0])
    })
    
    it('should replace year with +/- 2 randomly', () => {
      const year = parseInt(pseudonymize('2018', ['year']))
      assert(year >= 2016)
      assert(year <= 2020)
    })
    
    it('should replace all digits in dates with 1', () => {
      assert(pseudonymize('2018-12-01', ['date-digits']) === '1111-11-11')
      assert(pseudonymize('18/01/12', ['date-digits']) === '11/11/11')
      assert(pseudonymize('180112', ['date-digits']) === '111111')
      assert(pseudonymize('11/12', ['date-digits']) === '11/11')
    })

  })

  describe('other', () => {
    it('should replace emails with placeholder', () => 
      assert(pseudonymize('asdf', ['email']) === 'email@dot.com')
    )
    
    it('should replace telephone numbers with placeholder', () => {
      assert(pseudonymize('012-3456789', ['phone_nr']) === '000-0000000')
      assert(pseudonymize('0120-34-56789', ['phone_nr']) === '0000-00-00000')
    })
    
    it('should replace personal numbers with placeholder', () => {
      assert(pseudonymize('980502-1234', ['personid_nr']) === '123456-0000')
      assert(pseudonymize('bepacepa', ['personid_nr']) === '123456-0000')
    })
    
    it('should replace license number letters with ABC and numbers zeroes', () => {
      assert(pseudonymize('XYZ123', ['license_nr']) === 'ABC000')
      assert(pseudonymize('XYZG-1U2-3', ['license_nr']) === 'ABCD-0E0-0')
    })
    
  })
  
})