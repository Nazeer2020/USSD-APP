import {parsingXML} from "./parsingXML.js";
import  {filterOffers} from "./filterOffers.js";
import {setupCredUrl} from "./setupCredUrl.js";

async function fetchingOffers(msisdn, type, lan) {
  // base on the language of customer fetching offers from CVM
  const {language, url} = setupCredUrl(lan);
 

  const response = await fetch(`${url}${language}/msisdn/${msisdn}/offers`);

  const data = await response.text();
  
  // parsing the date from XML to JSON
  const offer = parsingXML(data);

  //   if (offer === undefined) return 'There is no offer available'
  try {
    // filtering the offers based on type of menu item
    const fetchData = filterOffers(offer, type, lan);
    return fetchData;
  } catch (error) {
    return console.error(error);
  }
}

export { fetchingOffers };
