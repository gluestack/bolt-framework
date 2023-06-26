const inquirer = require('inquirer');
import { SEAL_DOMAIN } from '../../../config';
import { Glue } from '@gluestack/glue-server-sdk-js';
import Store from "../../../libraries/store";

export const auth = async (doAuth: boolean, store: Store) => {
  const creds = {
    email: store.get('email'),
    password: store.get('password')
  };

  // prompts to collect credentials from users
  if (doAuth || !creds.email || !creds.password) {
    const results = await inquirer.prompt([{
      name: 'email',
      message: 'Please enter your email',
      type: 'input'
    }, {
      name: 'password',
      message: 'Please enter your password',
      type: 'password'
    }]);

    creds.email = results.email;
    creds.password = results.password;

    // store credentials in the store
    store.set('email', results.email);
    store.set('password', results.password);
  }

  const glue = new Glue(SEAL_DOMAIN);
  const response = await glue.auth.login({...creds, role: "owner"});
  if (!response || !response.id) {
    console.log(`> Authentication failed. Message: ${response}`);
    process.exit(-1);
  }
  if (!response.is_verified) {
    console.log(`> Authentication failed. Message: Account is not verified`);
    process.exit(-1);
  }

  // store user data in the store
  store.set('team', response.team);
  delete response.team;
  store.set('user', response);
};
