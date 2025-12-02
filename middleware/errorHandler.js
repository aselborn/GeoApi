/*
    Middleware for handling errors in the application.
    Saving errors to file for later analysis could be added here.
*/

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, "../logs/error.log");

if (!fs.existsSync(path.join(__dirname, "../logs"))) {
  fs.mkdirSync(path.join(__dirname, "../logs"));
}


export function errorHandler(err, req, res, next) {
    
     const timestamp = new Date().toISOString();

    const logEntry = `
            ================= ERROR ================
            Time:        ${timestamp}
            Status:      ${err.status || 500}
            Message:     ${err.message}
            Path:        ${req.method} ${req.originalUrl}
            IP:          ${req.ip}
            User-Agent:  ${req.headers["user-agent"]}
            Stack:
            ${err.stack}
            ========================================

            `;

    fs.appendFile(logFilePath, logEntry, (fsErr) => {
        if (fsErr) {
            console.error("Kunde inte skriva logfil till disk.:", fsErr);
        }
    });

    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    });
}