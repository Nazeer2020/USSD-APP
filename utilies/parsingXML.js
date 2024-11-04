import { xml2js } from "https://deno.land/x/xml2js@1.0.0/mod.ts";

// parsing the XML using xml2js library
// function parsingXML(data, offerActivation) {
//   let parsed;
//   const parser = new xml2js.Parser();

//   // Parse the XML string
//   parser.parseString(data, (err, result) => {
//     if (err) {
//       console.error("Error parsing XML:", err);
//       return;
//     }

//     // Access the parsed data
//     const statusCode = result.response.status[0].code[0];
//     const statusMessage = result.response.status[0].message[0];

//     if (offerActivation) {
//       parsed = { status: statusCode, message: statusMessage };
//       return;
//     }

//     if (result.response.offers === undefined) {
//       parsed = "There is no affer availabile for you.";
//       return;
//     }

//     // Extract offers
//     const offers = result.response.offers[0]["recharge-offer"];
//     const offerList = offers.map((offer) => ({
//       id: offer.id[0],
//       message: offer.message[0],
//       shortMessage: offer.shortMessage[0],
//       price: offer.price[0],
//       category: offer.category[0],
//       order: offer.order[0],
//     }));

//     // Output the offers
//     parsed = offerList;
//   });

//   return parsed;
// }

function parsingXML(data){
  const xml = data;
  const obj = xml2js(xml, {
    compact: true,
  });
  
  const json = JSON.stringify(obj, null, 4);
  const parsedData =  JSON.parse(json)
  return parsedData.response.offers["recharge-offer"];
}



export { parsingXML };
