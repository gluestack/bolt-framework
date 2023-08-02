var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "chalk", "@gluestack/helpers", "path", "./fs-removefile", "lodash", "../constants/bolt-configs", "./data-interpolate", "./get-os"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const helpers_1 = require("@gluestack/helpers");
    const path_1 = require("path");
    const fs_removefile_1 = require("./fs-removefile");
    const lodash_1 = require("lodash");
    const bolt_configs_1 = require("../constants/bolt-configs");
    const data_interpolate_1 = __importDefault(require("./data-interpolate"));
    const get_os_1 = require("./get-os");
    function generateRoutes(_yamlContent, isProd) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, fs_removefile_1.removefile)((0, path_1.join)(process.cwd(), bolt_configs_1.BOLT.NGINX_CONFIG_FILE_NAME));
            if (!_yamlContent.ingress || _yamlContent.ingress.length === 0) {
                console.log(chalk_1.default.gray(">> No ingress found in config. Skipping route generation..."));
                return [];
            }
            // construct all servers
            const serverBlocks = _yamlContent.ingress
                .map((ingress) => {
                const domain = ingress.domain || undefined;
                const port = ingress.port || undefined;
                if (!domain || !port) {
                    console.log(">> No domain or port found in config");
                    return;
                }
                const locationBlocks = ingress.options
                    .map((option) => {
                    const { location, rewrite_key, rewrite_value, proxy_pass } = option;
                    if (!location || !rewrite_key || !rewrite_value || !proxy_pass) {
                        console.log(">> Missing required option in ingress config");
                        return;
                    }
                    const generatedProxyPass = generateProxyPass(proxy_pass, isProd || false);
                    const client_max_body_size = option.client_max_body_size || 50;
                    const proxy_http_version = option.proxy_http_version || 1.1;
                    const proxy_cache_bypass = option.proxy_cache_bypass || "$http_upgrade";
                    const proxy_set_header_upgrade = option.proxy_set_header_upgrade || "$http_upgrade";
                    const proxy_set_header_host = option.proxy_set_header_host || "$host";
                    const proxy_set_header_connection = option.proxy_set_header_connection || '"upgrade"';
                    const proxy_set_header_x_real_ip = option.proxy_set_header_x_real_ip || "$remote_addr";
                    const proxy_set_header_x_forwarded_for = option.proxy_set_header_x_forwarded_for ||
                        "$proxy_add_x_forwarded_for";
                    const proxy_set_header_x_forwarded_proto = option.proxy_set_header_x_forwarded_proto || "$scheme";
                    return `
    location ${location} {
      rewrite ${rewrite_key} ${rewrite_value} break;
      client_max_body_size ${client_max_body_size}M;
      proxy_http_version ${proxy_http_version};
      proxy_set_header Upgrade ${proxy_set_header_upgrade};
      proxy_set_header Host ${proxy_set_header_host};
      proxy_set_header Connection ${proxy_set_header_connection};
      proxy_cache_bypass ${proxy_cache_bypass};
      proxy_set_header X-Real-IP ${proxy_set_header_x_real_ip};
      proxy_set_header X-Forwarded-For ${proxy_set_header_x_forwarded_for};
      proxy_set_header X-Forwarded-Proto ${proxy_set_header_x_forwarded_proto};
      proxy_pass ${generatedProxyPass};
    }`;
                })
                    .join("\n");
                return `
  server {
    listen ${port};
    server_name ${domain};
    ${locationBlocks}
  }`;
            })
                .join("\n");
            // prepare bolt.nginx.conf file's content
            let nginxConfig = `
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;
events {
  worker_connections 1024;
}
http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;
  log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
    '\$status \$body_bytes_sent "\$http_referer" '
    '"\$http_user_agent" "\$http_x_forwarded_for"';
  access_log /var/log/nginx/access.log main;
  sendfile on;
  keepalive_timeout 65;
  gzip on;
  gzip_disable "msie6";
  gzip_comp_level 6;
  gzip_min_length 1100;
  gzip_buffers 16 8k;
  gzip_proxied any;
  gzip_types
    text/plain
    text/css
    text/js
    text/xml
    text/javascript
    application/javascript
    application/json
    application/xml
    application/rss+xml
    image/svg+xml;
  ${serverBlocks}
}
`;
            // prepare bolt.nginx.conf file's path
            let nginxFile = (0, path_1.join)(process.cwd(), bolt_configs_1.BOLT.NGINX_CONFIG_FILE_NAME);
            // if prod, use bolt.nginx.deploy.conf file
            if (isProd) {
                nginxConfig = `${serverBlocks}`;
                nginxFile = (0, path_1.join)(process.cwd(), bolt_configs_1.BOLT.NGINX_CONFIG_DEPLOY_FILE_NAME);
            }
            // interpolate all variables from yaml and inject .env file's vars
            const { content } = yield (0, data_interpolate_1.default)({ content: nginxConfig }, (0, path_1.join)(process.cwd(), ".env"));
            // write bolt.nginx.conf file
            yield (0, helpers_1.writeFile)(nginxFile, content);
            console.log(chalk_1.default.green(`>> ${_yamlContent.project_name} created "${bolt_configs_1.BOLT.NGINX_CONFIG_FILE_NAME}".`));
            const ports = (0, lodash_1.map)(_yamlContent.ingress, "port");
            return ports;
        });
    }
    exports.default = generateRoutes;
    function generateProxyPass(proxyPass, prod) {
        let proxyHost = "host.docker.internal";
        const operatingSystem = (0, get_os_1.getOs)();
        if (operatingSystem === "linux") {
            proxyHost = "localhost";
        }
        const regex = /\${(.+?)_ASSIGNED_HOST}/g;
        if (!prod) {
            proxyPass = proxyPass.replace(regex, proxyHost);
            return proxyPass;
        }
        else {
            proxyPass = proxyPass.replace(regex, "{$1}");
            return proxyPass;
        }
    }
});
