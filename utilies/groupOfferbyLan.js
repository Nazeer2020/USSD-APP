
// const detectLanguage = require('./detectLanguage');
// grouping offers by language
const groupOffersByLanguage = (offers) => {
    return offers.reduce((acc, offer) => {
      const lang = detectLanguage(offer.message);
      if (!acc[lang]) {
        acc[lang] = [];
      }
      acc[lang].push(offer);
      return acc;
    }, {});
  };

export {groupOffersByLanguage};