#!/usr/bin/env node
import env from "dotenv";

import Commander from "./libraries/commander";

env.config();
Commander.register();
