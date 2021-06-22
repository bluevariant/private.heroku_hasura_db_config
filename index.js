#!/usr/bin/env node

const ngrok = require("ngrok");
const fs = require("fs-extra");
const path = require("path");
const prompts = require("prompts");
const { exec } = require("child_process");

const homedir = require("os").homedir();
const configDir = path.join(homedir, ".private.heroku_hasura_db_config.config");
const configFile = path.join(configDir, "config.json");

async function main() {
  await fs.ensureFile(configFile);

  if (process.argv.includes("config")) {
    const response = await prompts([
      {
        type: "text",
        name: "postgresUsername",
        message: "Postgres username?",
      },
      {
        type: "text",
        name: "postgresPassword",
        message: "Postgres password?",
      },
      {
        type: "text",
        name: "postgresDatabase",
        message: "Postgres database?",
      },
      {
        type: "text",
        name: "herokuApp",
        message: "Heroku app?",
      },
    ]);

    console.log("Saved config following:\n", JSON.stringify(response, null, 2));

    return fs.writeFile(configFile, JSON.stringify(response, null, 2));
  }

  const config = await fs.readJSON(configFile, { throws: false });

  if (config === null) {
    return console.error("No config found!");
  }

  const url = await ngrok.connect({ proto: "tcp", addr: 5432 });
  const host = url.replace("tcp://", "");
  const databaseUrl = [
    "postgres://",
    config["postgresUsername"],
    ":",
    config["postgresPassword"],
    "@",
    host,
    "/",
    config["postgresDatabase"],
  ].join("");

  exec(
    `heroku config:set DATABASE_URL=${databaseUrl} --app ${config["herokuApp"]}`,
    (error, stdout, stderr) => {
      console.log({
        error,
        stdout,
        stderr,
      });

      if (error) process.exit(1);
    }
  );
}

main().catch(console.error);