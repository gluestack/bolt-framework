import chalk from "chalk";
import { Ingress, Option } from "../typings/ingress";
import { writeFile } from "@gluestack/helpers";
import { join } from "path";
import { removefile } from "./fs-removefile";
import { map } from "lodash";
import { Bolt } from "../typings/bolt";
import { BOLT } from "../constants/bolt-configs";
import interpolate from "./data-interpolate";
import { getOs } from "./get-os";

export default async function generateRoutes(
  _yamlContent: Bolt,
  isProd?: boolean
): Promise<any> {
  await removefile(join(process.cwd(), BOLT.NGINX_CONFIG_FILE_NAME));

  if (!_yamlContent.ingress || _yamlContent.ingress.length === 0) {
    console.log(
      chalk.gray(">> No ingress found in config. Skipping route generation...")
    );
    return [];
  }

  // construct all servers
  const serverBlocks = _yamlContent.ingress
    .map((ingress: Ingress) => {
      const domain = ingress.domain || undefined;
      const port = ingress.port || undefined;
      if (!domain || !port) {
        console.log(">> No domain or port found in config");
        return;
      }

      const locationBlocks = ingress.options
        .map((option: Option) => {
          const { location, rewrite_key, rewrite_value, proxy_pass } = option;

          if (!location || !rewrite_key || !rewrite_value || !proxy_pass) {
            console.log(">> Missing required option in ingress config");
            return;
          }

          const generatedProxyPass = generateProxyPass(
            proxy_pass,
            isProd || false
          );

          const client_max_body_size = option.client_max_body_size || 50;
          const proxy_http_version = option.proxy_http_version || 1.1;
          const proxy_cache_bypass =
            option.proxy_cache_bypass || "$http_upgrade";
          const proxy_set_header_upgrade =
            option.proxy_set_header_upgrade || "$http_upgrade";
          const proxy_set_header_host = option.proxy_set_header_host || "$host";
          const proxy_set_header_connection =
            option.proxy_set_header_connection || '"upgrade"';
          const proxy_set_header_x_real_ip =
            option.proxy_set_header_x_real_ip || "$remote_addr";
          const proxy_set_header_x_forwarded_for =
            option.proxy_set_header_x_forwarded_for ||
            "$proxy_add_x_forwarded_for";
          const proxy_set_header_x_forwarded_proto =
            option.proxy_set_header_x_forwarded_proto || "$scheme";

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
  let nginxFile = join(process.cwd(), BOLT.NGINX_CONFIG_FILE_NAME);

  // if prod, use bolt.nginx.deploy.conf file
  if (isProd) {
    nginxConfig = `${serverBlocks}`;
    nginxFile = join(process.cwd(), BOLT.NGINX_CONFIG_DEPLOY_FILE_NAME);
  }

  // interpolate all variables from yaml and inject .env file's vars
  const { content } = await interpolate(
    { content: nginxConfig },
    join(process.cwd(), ".env")
  );

  // write bolt.nginx.conf file
  await writeFile(nginxFile, content);

  console.log(
    chalk.green(
      `>> ${_yamlContent.project_name} created "${BOLT.NGINX_CONFIG_FILE_NAME}".`
    )
  );

  const ports = map(_yamlContent.ingress, "port");

  return ports;
}

function generateProxyPass(proxyPass: string, prod: boolean) {
  let proxyHost: string = "host.docker.internal";
  const operatingSystem = getOs();
  if (operatingSystem === "linux") {
    proxyHost = "localhost";
  }
  const regex = /\${(.+?)_ASSIGNED_HOST}/g;

  if (!prod) {
    proxyPass = proxyPass.replace(regex, proxyHost);
    return proxyPass;
  } else {
    proxyPass = proxyPass.replace(regex, "{$1}");
    return proxyPass;
  }
}
