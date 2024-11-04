import { join } from "https://deno.land/std/path/mod.ts";




// Function to format a log entry
function formatLogEntry(CVMResponse, msisdn, filename) {
  
  const timestamp = new Date().toISOString();
  const formattedResponse = JSON.stringify(CVMResponse);
  
  return `${filename}|${timestamp}|${msisdn}|${formattedResponse}\n`;
}

// Write a log entry to the file
let callCount = 0;

async function writeLogEntry(message, user, filename, folder = "") {
  const logDate = new Date().toISOString().substr(0, 10);
  const logFileName = `log-${logDate}.txt`;
  const logFilePath = join(`${Deno.cwd()}/logs`, logFileName);
  const logEntry = formatLogEntry(message, user, filename);

  // Append log entry to the file
  await Deno.writeTextFile(logFilePath, logEntry, { append: true });

  if (folder !== "") {
    const logFilePathCsv = join(Deno.cwd(), folder, logFileName.replace('.txt', '.csv'));
    await Deno.writeTextFile(logFilePathCsv, logEntry, { append: true });
    callCount++;
    console.log(callCount, "it is call count");
  }

  await deletingLogFiles("logs");
}

// Function to delete old log files
async function deletingLogFiles(logDir) {
  const now = new Date();
  const daysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Read the directory
  try {
    for await (const dirEntry of Deno.readDir(logDir)) {
      if (dirEntry.isFile && /^log-\d{4}-\d{2}-\d{2}\.txt$/.test(dirEntry.name)) {
        const fileDate = new Date(dirEntry.name.substring(4, 14));
        
        // Check if the file is older than 30 days
        if (fileDate < daysAgo) {
          await Deno.remove(join(logDir, dirEntry.name));
          console.log(`Deleted ${dirEntry.name}`);
        }
      }
    }
  } catch (error) {
    console.error("Error reading directory:", error);
  }
}



export { writeLogEntry, formatLogEntry };
