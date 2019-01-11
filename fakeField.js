const faker = require('faker');

const fakeField = (field) => {

  const categories = {
    address: [
      'zipCode',
      'city',
      'cityPrefix',
      'citySuffix',
      'streetName',
      'streetAddress',
      'streetSuffix',
      'streetPrefix',
      'secondaryAddress',
      'county',
      'country',
      'countryCode',
      'state',
      'stateAbbr',
      'latitude',
      'longitude',
    ],
    commerce: ['color', 'department', 'productName', 'price', 'productAdjective', 'productMaterial', 'product'],
    company: [
      'suffixes',
      'companyName',
      'companySuffix',
      'catchPhrase',
      'bs',
      'catchPhraseAdjective',
      'catchPhraseDescriptor',
      'catchPhraseNoun',
      'bsAdjective',
      'bsBuzz',
      'bsNoun',
    ],
    database: ['column', 'type', 'collation', 'engine'],
    date: ['future', 'between', 'recent', 'month', 'weekday'],
    finance: [
      'account',
      'accountName',
      'mask',
      'amount',
      'transactionType',
      'currencyCode',
      'currencyName',
      'currencySymbol',
      'bitcoinAddress',
      'iban',
      'bic',
    ],
    hacker: ['abbreviation', 'adjective', 'noun', 'verb', 'ingverb', 'phrase'],
    image: [
      'image',
      'avatar',
      'imageUrl',
      'abstract',
      'animals',
      'business',
      'cats',
      'city',
      'food',
      'nightlife',
      'fashion',
      'people',
      'nature',
      'sports',
      'technics',
      'transport',
      'dataUri',
    ],
    internet: [
      'avatar',
      'email',
      'exampleEmail',
      'userName',
      'protocol',
      'url',
      'domainName',
      'domainSuffix',
      'domainWord',
      'ip',
      'ipv6',
      'userAgent',
      'color',
      'mac',
      'password',
    ],
    lorem: ['word', 'words', 'sentence', 'slug', 'sentences', 'paragraph', 'paragraphs', 'text', 'lines'],
    name: [
      'firstName',
      'lastName',
      'findName',
      'jobTitle',
      'prefix',
      'suffix',
      'title',
      'jobDescriptor',
      'jobArea',
      'jobType',
    ],
    phone: ['phoneNumber', 'phoneNumberFormat', 'phoneFormats'],
  };

  const cache = {}

  let faked;
  //if cached return cache val if not find val
  if (cache[field]) {
    faked = cache[field]
  } else {
    //use some to break out of itteration when match val is found
    Object.entries(categories)
      .some(([category, values]) => {
        if (values.includes(field)) {
          const fakerFunc = faker[category][field]()
          cache[field] = fakerFunc
          faked = fakerFunc
          return true
        }
      });
  }
  return faked

}

module.exports = fakeField;
