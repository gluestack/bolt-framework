export interface Option {
  location: string;

  rewrite_key: string;
  rewrite_value: string;

  client_max_body_size?: number;

  proxy_http_version?: number;
  proxy_cache_bypass?: string;
  proxy_set_header_upgrade?: string;
  proxy_set_header_host?: string;
  proxy_set_header_connection?: string;
  proxy_set_header_x_real_ip?: string;
  proxy_set_header_x_forwarded_for?: string;
  proxy_set_header_x_forwarded_proto?: string;

  proxy_pass: string;
}

export interface Ingress {
  domain: string;
  port: number;

  options: Option[];
}
