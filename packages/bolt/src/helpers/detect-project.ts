import * as fs from "fs";
import { join } from "path";
import searchForFile from "./search-for-file";
import searchForFolder from "./search-for-folder";

export default function detectProjectType(path: string): string {
  if (isNextJSProject(path)) {
    return "NextJS";
  } else if (isReactProject(path)) {
    return "React";
  } else if (isNuxtJSProject(path)) {
    return "NuxtJS";
  } else if (isVueProject(path)) {
    return "Vue";
  } else if (isAngularProject(path)) {
    return "Angular";
  } else if (isNodeProject(path)) {
    return "Node.js";
  } else if (isExpressProject(path)) {
    return "Express.js";
  } else if (isPythonProject(path)) {
    return "Python";
  } else if (isFlutterProject(path)) {
    return "Flutter";
  } else if (isDjangoProject(path)) {
    return "Django";
  } else if (isRailsProject(path)) {
    return "Ruby on Rails";
  } else if (isLaravelProject(path)) {
    return "Laravel";
  } else if (isGoProject(path)) {
    return "Go";
  } else if (isElixirPhoenixProject(path)) {
    return "Elixir Phoenix";
  } else if (isDenoProject(path)) {
    return "Deno";
  } else if (isRedwoodJSProject(path)) {
    return "RedwoodJS";
  } else if (isRubyProject(path)) {
    return "Ruby";
  } else if (isCrystalProject(path)) {
    return "Crystal";
  } else if (isStaticWebsite(path)) {
    return "Static Website";
  } else if (isRemixProject(path)) {
    return "Remix";
  } else if (isHasuraProject(path)) {
    return "Hasura";
  } else if (isPostgres(path)) {
    return "Postgres";
  } else if (isMySQL(path)) {
    return "MySQL";
  } else if (isMinio(path)) {
    return "Minio";
  } else {
    return "Unknown";
  }
}

// Project detection functions
function isReactProject(path: string): boolean {
  // Check if package.json file exists
  if (fs.existsSync(`${path}/package.json`)) {
    const packageJson = JSON.parse(
      fs.readFileSync(`${path}/package.json`, "utf-8"),
    );
    // Check if "react" is a dependency or devDependency
    if (packageJson.dependencies && packageJson.dependencies.react) {
      return true;
    } else if (
      packageJson.devDependencies &&
      packageJson.devDependencies.react
    ) {
      return true;
    }
  }
  return false;
}

function isAngularProject(path: string): boolean {
  // Check if package.json file exists
  if (fs.existsSync(`${path}/package.json`)) {
    const packageJson = JSON.parse(
      fs.readFileSync(`${path}/package.json`, "utf-8"),
    );
    // Check if "@angular/core" is a dependency or devDependency
    if (packageJson.dependencies && packageJson.dependencies["@angular/core"]) {
      return true;
    } else if (
      packageJson.devDependencies &&
      packageJson.devDependencies["@angular/core"]
    ) {
      return true;
    }
  }
  return false;
}

function isVueProject(path: string): boolean {
  // Check if package.json file exists
  if (fs.existsSync(`${path}/package.json`)) {
    const packageJson = JSON.parse(
      fs.readFileSync(`${path}/package.json`, "utf-8"),
    );
    // Check if "vue" is a dependency or devDependency
    if (packageJson.dependencies && packageJson.dependencies.vue) {
      return true;
    } else if (packageJson.devDependencies && packageJson.devDependencies.vue) {
      return true;
    }
  }
  return false;
}

function isNodeProject(path: string): boolean {
  // Check if package.json file exists
  if (fs.existsSync(`${path}/package.json`)) {
    const packageJson = JSON.parse(
      fs.readFileSync(`${path}/package.json`, "utf-8"),
    );
    // Check if "main" field is set to a JavaScript file
    if (packageJson.main && packageJson.main.endsWith(".js")) {
      return true;
    }
  }
  return false;
}

function isExpressProject(path: string): boolean {
  // Check if package.json file exists
  if (fs.existsSync(`${path}/package.json`)) {
    const packageJson = JSON.parse(
      fs.readFileSync(`${path}/package.json`, "utf-8"),
    );
    if (packageJson.dependencies && packageJson.dependencies.express) {
      return true;
    }
  }
  return false;
}

function isPythonProject(path: string): boolean {
  // Check if requirements.txt file exists
  if (fs.existsSync(`${path}/requirements.txt`)) {
    return true;
  }
  // Check if setup.py file exists
  if (fs.existsSync(`${path}/setup.py`)) {
    return true;
  }
  return false;
}

function isFlutterProject(path: string): boolean {
  // Check if pubspec.yaml file exists
  if (fs.existsSync(`${path}/pubspec.yaml`)) {
    const pubspec = fs.readFileSync(`${path}/pubspec.yaml`, "utf-8");
    // Check if "flutter" is specified as a dependency
    if (pubspec.includes("flutter:")) {
      return true;
    }
  }
  return false;
}
function isDjangoProject(path: string): boolean {
  // Check if manage.py file exists
  if (fs.existsSync(`${path}/manage.py`)) {
    return true;
  }
  return false;
}

function isRailsProject(path: string): boolean {
  // Check if Gemfile file exists
  if (fs.existsSync(`${path}/Gemfile`)) {
    const gemfile = fs.readFileSync(`${path}/Gemfile`, "utf-8");
    // Check if "rails" is specified as a gem
    if (gemfile.includes("gem 'rails'")) {
      return true;
    }
  }
  return false;
}

function isLaravelProject(path: string): boolean {
  // Check if composer.json file exists
  if (fs.existsSync(`${path}/composer.json`)) {
    const composerJson = JSON.parse(
      fs.readFileSync(`${path}/composer.json`, "utf-8"),
    );
    // Check if "laravel/framework" is a dependency or devDependency
    if (composerJson.require && composerJson.require["laravel/framework"]) {
      return true;
    } else if (
      composerJson["require-dev"] &&
      composerJson["require-dev"]["laravel/framework"]
    ) {
      return true;
    }
  }
  return false;
}

function isGoProject(path: string): boolean {
  // Check if go.mod file exists
  if (fs.existsSync(`${path}/go.mod`)) {
    return true;
  }
  return false;
}

function isElixirPhoenixProject(path: string): boolean {
  // Check if mix.exs file exists
  if (fs.existsSync(`${path}/mix.exs`)) {
    const mixfile = fs.readFileSync(`${path}/mix.exs`, "utf-8");
    // Check if "phoenix" is specified as a dependency
    if (mixfile.includes("phoenix:")) {
      return true;
    }
  }
  return false;
}

function isDenoProject(path: string): boolean {
  // Check if deps.ts file exists
  if (fs.existsSync(`${path}/deps.ts`)) {
    return true;
  }
  return false;
}

function isRedwoodJSProject(path: string): boolean {
  // Check if redwood.toml file exists
  if (fs.existsSync(`${path}/redwood.toml`)) {
    return true;
  }
  return false;
}

function isRubyProject(path: string): boolean {
  // Check if Gemfile file exists
  if (fs.existsSync(`${path}/Gemfile`)) {
    return true;
  }
  return false;
}

function isNuxtJSProject(path: string): boolean {
  // Check if nuxt.config.js file exists
  if (fs.existsSync(`${path}/nuxt.config.js`)) {
    return true;
  }
  return false;
}

function isNextJSProject(path: string): boolean {
  // Check if next.config.js file exists
  if (fs.existsSync(`${path}/next.config.js`)) {
    return true;
  }
  return false;
}

function isCrystalProject(path: string): boolean {
  // Check if shard.yml file exists
  if (fs.existsSync(`${path}/shard.yml`)) {
    return true;
  }
  return false;
}

function isStaticWebsite(path: string): boolean {
  // Check if index.html file exists
  if (fs.existsSync(`${path}/index.html`)) {
    return true;
  }
  return false;
}

function isRemixProject(path: string): boolean {
  // Check if remix.config.js file exists
  if (fs.existsSync(`${path}/remix.config.js`)) {
    return true;
  }
  return false;
}

function isHasuraProject(path: string): boolean {
  const metadataPath = join(path, "migrations");
  const packageJsonPath = join(path, "package.json");
  const configPath = join(path, "config.yaml");
  const dockerComposePath = join(path, "docker-compose.yaml");

  // Check if the metadata directory exists
  if (!fs.existsSync(metadataPath)) {
    return false;
  }

  // Check if the package.json file exists and has Hasura-specific dependencies
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const dependencies = packageJson.dependencies || {};
    if (dependencies["graphql-engine"] || dependencies["@hasura/cli"]) {
      return true;
    }
  }

  // Check if any of the configuration files exist
  if (fs.existsSync(configPath) || fs.existsSync(dockerComposePath)) {
    return true;
  }

  return false;
}

function isPostgres(path: string): boolean {
  const files = ["pg_hba.conf", "postgresql.conf", "PG_VERSION"];

  for (const file of files) {
    if (searchForFile(path, file) !== undefined) {
      return true;
    }
  }
  const folders = ["init.db", "db"];

  for (const folder of folders) {
    if (searchForFolder(path, folder) !== undefined) {
      return true;
    }
  }

  return false;
}

function isMySQL(path: string): boolean {
  const files = ["ibdata1", "ib_logfile0", "ib_logfile1", "mysql-bin.index"];

  for (const file of files) {
    if (searchForFile(path, file) !== undefined) {
      return true;
    }
  }

  return false;
}

function isMinio(path: string): boolean {
  const files = [".minio.sys"];

  for (const file of files) {
    if (searchForFolder(path, file) !== undefined) {
      return true;
    }
  }

  return false;
}
