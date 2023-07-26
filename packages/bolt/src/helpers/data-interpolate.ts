import { readfile } from './fs-readfile';

interface EnvVar {
  key: string;
  value: string;
}

const interpolateEnvVariables = async (data: any, envFilePath: string): Promise<any> => {
  const envContent = await readfile(envFilePath);
  if (!envContent) {
    return data;
  }

  const envVars: EnvVar[] = envContent
    .split('\n')
    .filter((line: any) => line.trim() && !line.trim().startsWith('#'))
    .map((line: any) => {
      const [key, value] = line.split('=');
      return { key: key.trim(), value: value.trim() };
    });

  const interpolateObject = (obj: any): any => {
    if (typeof obj === 'string') {
      const regex = /\${(.+?)}/g;
      return obj.replace(regex, (_, varName) => {
        const envVar = envVars.find(env => env.key === varName);
        return envVar ? envVar.value : '';
      });
    } else if (Array.isArray(obj)) {
      return obj.map(item => interpolateObject(item));
    } else if (typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        newObj[key] = interpolateObject(obj[key]);
      }
      return newObj;
    } else {
      return obj;
    }
  };

  return interpolateObject(data);
}

export default interpolateEnvVariables;
