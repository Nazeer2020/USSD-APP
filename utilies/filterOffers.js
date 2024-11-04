// const groupOffersByLanguage = require("./groupOfferbyLan");

// filtering offers base on the type
function filterOffers(offers, type, lan) {
  try {
    if(typeof offers === "string") throw new Error("There is no offer for you")
    const offerType = offers.filter((offer) => offer.category._text === type);
   
    if(offerType.length === 0) throw new Error("There is no offer in this category");
    return offerType
    // if the all responses have all languages below logic work.

    // const { English, DARI, PASHTO } = groupOffersByLanguage(offerType);

    // if (lan === "en") return English;
    // if (lan === "fs") return DARI;
    // if (lan === "ps") return PASHTO;
  } catch (error) {
    return console.log(error);
  }
}

export {filterOffers};
