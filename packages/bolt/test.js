const axios = require("axios");
let data = JSON.stringify({
  access_key: "f825b35e5d0f70d5b4b0e0f3ea35daadf9903d1f",
  secret_key:
    "c966f789b57625b10decabd811b525cc11735bc9a4d2f706b4c10693f0314257",
});

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "http://localhost:8000/api/deployment/login",
  headers: {
    "Content-Type": "application/json",
  },
  data: data,
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
