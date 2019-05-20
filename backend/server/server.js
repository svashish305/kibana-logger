const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;
const axios = require("axios");

let env = '';
let busTxnSeq = '';

app.use(bodyParser.json());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO ANGULAR' });
});

app.post('/postData', (req, res) => {
  // res.json(req.body);
  // console.log(req.body);
  busTxnSeq = req.body.busTxnSeq;
  env = req.body.env;

  // console.log(`env: ${env} busTxnSeq: ${busTxnSeq}`);

  const url = `http://elastic.elasticsearch.nat.bt.com/json-dnp-*/_search?q=Request_E2Edata: *${busTxnSeq}*&env=${env}`;
  const username = 'elasticsearch-json';
  const password = 'vhZpjq5Jzrm';
  const getData = async url => {
    try {
      const response = await axios.get(url, {
          auth: {
              username: username,
              password: password
          }
      });
      const data = response.data.hits.hits;
      console.log(data[0]);

      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  
  // getData(url);

  res.send(getData(url));
});

app.get('/postData', (req, res) => {
  res.send(req.body);
});