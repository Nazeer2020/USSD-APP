// const fs = require("fs");
// const ini = require("ini");
import { parse, stringify } from "https://deno.land/x/ini/mod.ts";


const configFile = await Deno.readTextFile("./conf/application.ini");
const config = parse(configFile);

const url = config.CVM_URL.url.trim();
const englishCredentials = config.CVM_CREDENTIALS.englishCredentials.trim();
const dariCredentials = config.CVM_CREDENTIALS.dariCredentials.trim();
const pashtoCredentials = config.CVM_CREDENTIALS.pashtoCredentials.trim();

function setupCredUrl(lan) {
  
  switch (lan) {
      case "en":
          return {language:englishCredentials, url:url};
      case "fa":
          return {language:dariCredentials, url:url};
      case "ps":
          return {language:pashtoCredentials,url: url};
      default:
          throw new Error(`Unsupported language: ${lan}`);
  }
}

export {setupCredUrl};
