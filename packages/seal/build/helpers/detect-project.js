"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path_1 = require("path");
const search_for_file_1 = __importDefault(require("./search-for-file"));
const search_for_folder_1 = __importDefault(require("./search-for-folder"));
function detectProjectType(path) {
    if (isNextJSProject(path)) {
        return "NextJS";
    }
    else if (isReactProject(path)) {
        return "React";
    }
    else if (isNuxtJSProject(path)) {
        return "NuxtJS";
    }
    else if (isVueProject(path)) {
        return "Vue";
    }
    else if (isAngularProject(path)) {
        return "Angular";
    }
    else if (isNodeProject(path)) {
        return "Node.js";
    }
    else if (isExpressProject(path)) {
        return "Express.js";
    }
    else if (isPythonProject(path)) {
        return "Python";
    }
    else if (isFlutterProject(path)) {
        return "Flutter";
    }
    else if (isDjangoProject(path)) {
        return "Django";
    }
    else if (isRailsProject(path)) {
        return "Ruby on Rails";
    }
    else if (isLaravelProject(path)) {
        return "Laravel";
    }
    else if (isGoProject(path)) {
        return "Go";
    }
    else if (isElixirPhoenixProject(path)) {
        return "Elixir Phoenix";
    }
    else if (isDenoProject(path)) {
        return "Deno";
    }
    else if (isRedwoodJSProject(path)) {
        return "RedwoodJS";
    }
    else if (isRubyProject(path)) {
        return "Ruby";
    }
    else if (isCrystalProject(path)) {
        return "Crystal";
    }
    else if (isStaticWebsite(path)) {
        return "Static Website";
    }
    else if (isRemixProject(path)) {
        return "Remix";
    }
    else if (isHasuraProject(path)) {
        return "Hasura";
    }
    else if (isPostgres(path)) {
        return "Postgres";
    }
    else if (isMySQL(path)) {
        return "MySQL";
    }
    else if (isMinio(path)) {
        return "Minio";
    }
    else {
        return "Unknown";
    }
}
exports.default = detectProjectType;
// Project detection functions
function isReactProject(path) {
    // Check if package.json file exists
    if (fs.existsSync(`${path}/package.json`)) {
        const packageJson = JSON.parse(fs.readFileSync(`${path}/package.json`, "utf-8"));
        // Check if "react" is a dependency or devDependency
        if (packageJson.dependencies && packageJson.dependencies.react) {
            return true;
        }
        else if (packageJson.devDependencies &&
            packageJson.devDependencies.react) {
            return true;
        }
    }
    return false;
}
function isAngularProject(path) {
    // Check if package.json file exists
    if (fs.existsSync(`${path}/package.json`)) {
        const packageJson = JSON.parse(fs.readFileSync(`${path}/package.json`, "utf-8"));
        // Check if "@angular/core" is a dependency or devDependency
        if (packageJson.dependencies && packageJson.dependencies["@angular/core"]) {
            return true;
        }
        else if (packageJson.devDependencies &&
            packageJson.devDependencies["@angular/core"]) {
            return true;
        }
    }
    return false;
}
function isVueProject(path) {
    // Check if package.json file exists
    if (fs.existsSync(`${path}/package.json`)) {
        const packageJson = JSON.parse(fs.readFileSync(`${path}/package.json`, "utf-8"));
        // Check if "vue" is a dependency or devDependency
        if (packageJson.dependencies && packageJson.dependencies.vue) {
            return true;
        }
        else if (packageJson.devDependencies && packageJson.devDependencies.vue) {
            return true;
        }
    }
    return false;
}
function isNodeProject(path) {
    // Check if package.json file exists
    if (fs.existsSync(`${path}/package.json`)) {
        const packageJson = JSON.parse(fs.readFileSync(`${path}/package.json`, "utf-8"));
        // Check if "main" field is set to a JavaScript file
        if (packageJson.main && packageJson.main.endsWith(".js")) {
            return true;
        }
    }
    return false;
}
function isExpressProject(path) {
    // Check if package.json file exists
    if (fs.existsSync(`${path}/package.json`)) {
        const packageJson = JSON.parse(fs.readFileSync(`${path}/package.json`, "utf-8"));
        if (packageJson.dependencies && packageJson.dependencies.express) {
            return true;
        }
    }
    return false;
}
function isPythonProject(path) {
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
function isFlutterProject(path) {
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
function isDjangoProject(path) {
    // Check if manage.py file exists
    if (fs.existsSync(`${path}/manage.py`)) {
        return true;
    }
    return false;
}
function isRailsProject(path) {
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
function isLaravelProject(path) {
    // Check if composer.json file exists
    if (fs.existsSync(`${path}/composer.json`)) {
        const composerJson = JSON.parse(fs.readFileSync(`${path}/composer.json`, "utf-8"));
        // Check if "laravel/framework" is a dependency or devDependency
        if (composerJson.require && composerJson.require["laravel/framework"]) {
            return true;
        }
        else if (composerJson["require-dev"] &&
            composerJson["require-dev"]["laravel/framework"]) {
            return true;
        }
    }
    return false;
}
function isGoProject(path) {
    // Check if go.mod file exists
    if (fs.existsSync(`${path}/go.mod`)) {
        return true;
    }
    return false;
}
function isElixirPhoenixProject(path) {
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
function isDenoProject(path) {
    // Check if deps.ts file exists
    if (fs.existsSync(`${path}/deps.ts`)) {
        return true;
    }
    return false;
}
function isRedwoodJSProject(path) {
    // Check if redwood.toml file exists
    if (fs.existsSync(`${path}/redwood.toml`)) {
        return true;
    }
    return false;
}
function isRubyProject(path) {
    // Check if Gemfile file exists
    if (fs.existsSync(`${path}/Gemfile`)) {
        return true;
    }
    return false;
}
function isNuxtJSProject(path) {
    // Check if nuxt.config.js file exists
    if (fs.existsSync(`${path}/nuxt.config.js`)) {
        return true;
    }
    return false;
}
function isNextJSProject(path) {
    // Check if next.config.js file exists
    if (fs.existsSync(`${path}/next.config.js`)) {
        return true;
    }
    return false;
}
function isCrystalProject(path) {
    // Check if shard.yml file exists
    if (fs.existsSync(`${path}/shard.yml`)) {
        return true;
    }
    return false;
}
function isStaticWebsite(path) {
    // Check if index.html file exists
    if (fs.existsSync(`${path}/index.html`)) {
        return true;
    }
    return false;
}
function isRemixProject(path) {
    // Check if remix.config.js file exists
    if (fs.existsSync(`${path}/remix.config.js`)) {
        return true;
    }
    return false;
}
function isHasuraProject(path) {
    const metadataPath = (0, path_1.join)(path, "migrations");
    const packageJsonPath = (0, path_1.join)(path, "package.json");
    const configPath = (0, path_1.join)(path, "config.yaml");
    const dockerComposePath = (0, path_1.join)(path, "docker-compose.yaml");
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
function isPostgres(path) {
    const files = ["pg_hba.conf", "postgresql.conf", "PG_VERSION"];
    for (const file of files) {
        if ((0, search_for_file_1.default)(path, file) !== undefined) {
            return true;
        }
    }
    const folders = ["init.db", "db"];
    for (const folder of folders) {
        if ((0, search_for_folder_1.default)(path, folder) !== undefined) {
            return true;
        }
    }
    return false;
}
function isMySQL(path) {
    const files = ["ibdata1", "ib_logfile0", "ib_logfile1", "mysql-bin.index"];
    for (const file of files) {
        if ((0, search_for_file_1.default)(path, file) !== undefined) {
            return true;
        }
    }
    return false;
}
function isMinio(path) {
    const files = [".minio.sys"];
    for (const file of files) {
        if ((0, search_for_folder_1.default)(path, file) !== undefined) {
            return true;
        }
    }
    return false;
}
