import {setupCredUrl} from"./setupCredUrl.js"
import {parsingXML} from"./parsingXML.js"
import {writeLogEntry} from"../logs/logs.js"

function formatDate() {
  const date = new Date();
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour format
    timeZoneName: "short",
  };

  // Use toLocaleString to format the date
  const formattedDate = date.toLocaleString("en-GB", options);

  // Split the formatted date into parts
  const [datePart, timePart] = formattedDate.split(", ");

  // Adjust the date part format to "YYYY-MM-DD"
  const [day, month, year] = datePart.split("/");
  const adjustedDatePart = `${year}-${month}-${day}`;

  // Get the timezone
  const timeZone = timePart.split(" ").pop(); // Get the time zone

  // Assemble the final formatted date
  return `${adjustedDatePart} ${timePart.split(" ")[0]} ${timeZone}`;
}

async function offerActivation(offerId, msisdn, lan) {
  const timestamp = formatDate();

  const {language, url} = setupCredUrl(lan);

  const data = {
    event: [
      {
        date: `${timestamp}`,
        id: "104",
        type: "USSD",
        value: `${offerId}`,
      },
    ],
  };
  try {
    const response = await fetch(
      `${url}${language}/msisdn/${msisdn}/kpi/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const offerActivation = true;
    const responseData = await response.text();
    const finalData = parsingXML(responseData, offerActivation);
    writeLogEntry(finalData, msisdn, "CVM_Offer_PACKAGE_ACTIVATION");
    return finalData; // Return the data for further use
  } catch (error) {
    console.error("Error:", error);
  }
}

export {offerActivation};
