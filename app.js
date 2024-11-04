
import { parse, stringify } from "https://deno.land/x/ini/mod.ts";
import express from "npm:express@4.19.2";
import { normalizingMenu } from "./utilies/normalizingMenu.js"
import { fetchingLanuage } from "./utilies/fetchLanguage.js"
import { writeLogEntry } from "./logs/logs.js"


const app = express();

// Read the INI file
const configFile = await Deno.readTextFile('./conf/application.ini');
const config = parse(configFile);

const serverPort = config.server.port;

// In-memory store for session states
const sessionStore = {};


// Define initial menu structure
const menus = {
  main: {
    message: "Welcome \n1. DATA\n2. VOICE\n3. SMS\n4. COMBO",
    messagePersain: ` خوش آمدید \n1. انترنت\n2. تماس ها\n3. پیامها\n4. ترکیبی`,
    messagePashto : ` ښه راغلاست\n1. انترنت\n2. اړیکه\n3. پیامها‍\n4. ترکیبي`,
    options: {
      1: "data",
      2: "voice",
      3: "sms",
      4: "combo",
    },
  },
 
};

// Function to get menu based on user input
async function getMenu(type, phoneNumber, lan) {
  try {
    if (type === "data" || type === "voice" || type === "combo" || type === "sms") {
      return await normalizingMenu(phoneNumber, type.toUpperCase(), lan); // Fetch the menu dynamically from the CVM base on the selected option in the main menu
    }
    return menus[type] || { message: "Menu not found." };
  } catch (err) {
    console.error("Error fetching menu:", err);
    return { message: "An error occurred while fetching the menu." }; // Handle the error gracefully
  }
}
// customized function to display base on the language of customer
function customizedMenuByLanguage(lan){
  if (lan === "en") {
    return menus["main"].message;
  } else if (lan === "fa") {
    return menus["main"].messagePersain;
  } else if (lan === "ps") {
    return menus["main"].messagePashto;
  }
}

// USSD endpoint


app.get("/ussdApp", async (req, res) => {
  let lan;
  const { text, phoneNumber, sessionId } = req.query;
  writeLogEntry(req.query, phoneNumber, "USSD_GATEWAY_REQUEST")

  // Initialize session state if it doesn't exist and fetch the language of customer from MTX.
  if (!sessionStore[sessionId]) {
    const { language } = await fetchingLanuage(phoneNumber);
    sessionStore[sessionId] = {
      menu: "main",
      previousMenu: null, // Initialize previous menu
      lan: language
    };
  }

  // Getting the language of customer from session which is stored
  lan = sessionStore[sessionId].lan;
  // Initializing the response variable
  let responseMessage = "";

  try {
    if (text === "0") {
      // Go back to the previous menu
      const previousMenu = sessionStore[sessionId].previousMenu;
      if (previousMenu) {
        sessionStore[sessionId].menu = previousMenu; // Set the current menu to previous
        responseMessage = customizedMenuByLanguage(lan)
      } else {
        responseMessage = "You are already at the main menu."; // Handle case where there's no previous menu
      }
    } else if (!text || text === "888") {
      // Show the main menu based on customer language
      responseMessage = customizedMenuByLanguage(lan)
    } else {
      // Based on the user input show the menu
      const currentMenu = sessionStore[sessionId].menu;
      const selectedOption = menus[currentMenu].options[text];

      // Store the current menu as previous before changing it
      sessionStore[sessionId].previousMenu = currentMenu;

      switch (true) {
        case typeof selectedOption === "function":
          // Call the handler function
          responseMessage = await selectedOption(phoneNumber);
          break;

        case typeof selectedOption === "string":
          // Fetch the new menu and update session
          const newMenu = await getMenu(selectedOption, phoneNumber, lan);
    
          if (typeof newMenu === 'string') throw new Error('There is no offer available for you');
          sessionStore[sessionId].menu = selectedOption; // Update session with the new menu
          menus[selectedOption] = newMenu;
          responseMessage = newMenu.message;
          break;

        default:
          
          if (lan === "en") {
            responseMessage = "Invalid option. Reply 0 to go back.";
          } else if (lan === "fa") {
            responseMessage = 'گزینه نامعتبر برای بازگشت 0 پاسخ دهید.';
          } else if (lan === "ps") {
            responseMessage = 'ناسم انتخاب. د بیرته تګ لپاره 0 ځواب ورکړئ.';
          }
          break;
      }
    }
  } catch (err) {
    if (lan === "en") {
      responseMessage = `${err.message}`;
    } else if (lan === "fa") {
      responseMessage = 'هیچ پیشکشی برای شما وجود ندارد';
    } else if (lan === "ps") {
      responseMessage = 'ستاسو لپاره هیڅ وړاندیز شتون نلري';
    }
  }

  // Sending the response to the client
  res.set('Freeflow', 'FC');
  res.send(responseMessage);
});

// Start the server
app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});



