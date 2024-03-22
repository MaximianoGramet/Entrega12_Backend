import dotenv from 'dotenv';
import { Command } from "commander";

const program = new Command();

program
  .option('-d, --debug', 'Variable para debug')
  .option('-p, --port <port>', 'Puerto del servidor')
  .option('--mode <mode>', 'Modo de trabajo', 'develop')
  .requiredOption('-u, --user <user>', 'Usuario que va a utilizar el aplicativo.', 'User not declared.');

program.parse(process.argv)

console.log("Modo Options: ", program.opts().mode);
console.log("Remaining arguments: ", program.args);

const { mode, port } = program.opts()

const envPath = mode === "production" ? "./src/config/.env.production" : "./src/config/.env.development";
dotenv.config({ path: envPath })

if (port) {
  dotenv.config({ path: "./src/config/.env.production" })
}

const config = {
  port: process.env.PORT,
  urlMongo: process.env.MONGO_URL,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  gmailPassword: process.env.GMAIL_PASSWORD
};

export default config;
