#!/usr/bin/env node

import { join } from "path";
import dotenv from "dotenv";
dotenv.config({
  path: join(__dirname, "..", ".env"),
});

import Commander from "./libraries/commander";
(async function () {
  await Commander.register();
})();
