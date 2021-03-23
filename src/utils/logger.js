import fs from "fs";
import path from "path";
import bunyan from 'bunyan';

const logPath = path.resolve("storage", "logs", "app.log");
if (!fs.existsSync(logPath)) {
  fs.mkdirSync(path.dirname(logPath), {recursive: true});
  fs.writeFileSync(logPath, "");
}
export default bunyan.createLogger({
  name: process.env.APP_NAME,
  stream: fs.createWriteStream(
    logPath
  ),
});