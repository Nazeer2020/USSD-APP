import {fetchingOffers} from  "./fetchingOffers.js"
import {writeLogEntry} from  "../logs/logs.js"
import {offerActivation} from  "./offerActivation.js"

function activatingData(msisdn, id, message, lan) {
  return offerActivation(id, msisdn, lan)
    .then((res) => {
      if (res.status === "200" && res.message === "Success") {
        if (lan === "en") return `Dear customer package is activated!`;
        if (lan === "fa") return `مشتری عزیز بسته فعال گردید‍‍`;
        if (lan === "ps") return `ګرانه پیریدونکی بسته فعاله شو`;
      } else {
        if (lan === "en") return `Dear customer offer is not activated!`;
        if (lan === "fa") return "مشتری عزیز پیشکش فعال نشد";
        if (lan === "ps") return "ګرانه بیردونکی فعال نشو";
      }
    })
    .catch((error) => {
      console.log(error);
      return error.message;
    });
}

async function normalizingMenu(msisdn, type, lan) {
  try {
    const data = await fetchingOffers(msisdn, type, lan);
    
    if (!data) {
      writeLogEntry(data, msisdn, "CVM_Offer_RESPONSE");
      throw new Error("There is no offer available for you");
    }

    // storing the CVM response in the log file.
    writeLogEntry(data, msisdn, "CVM_Offer_RESPONSE");

    // formating the offer id and option list.
    const result = data.reduce(
      (acc, item, index) => {
        const id = `${item.id._text}`;
        acc.offerId[index + 1] = id;
        acc.options[index + 1] = () =>
          activatingData(msisdn, item.id._text, item.message._text, lan);
        return acc;
      },
      { offerId: {}, options: {} }
    );
    // converting the message of CVM into a menu text format
    const message = data
      .map((item, index) => `${index + 1}. ${item.shortMessage._text}`)
      .map((message) => message.replace(/\n/g, ""))
      .join("\n");
    // returning the menu in object format
    return {
      message: message,
      options: result.options,
      offerId: result.offerId,
    };
  } catch (err) {
    console.error(err);
    return `${err.message}`;
  }
}

 export { normalizingMenu};
