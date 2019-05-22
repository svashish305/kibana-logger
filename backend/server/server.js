const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;
const axios = require("axios");
const fs = require("fs");

const username = 'elasticsearch-json';
const password = 'vhZpjq5Jzrm';

let zxtmUrl = '';
let bptmUrl = '';

let dateTime = '';
let systemCd = '';
let clientIP = '';
let busTxnSeq = '';
let busTxnType = '';
let busProcType = '';
let requestType = '';
let env = '';
let status = '';
let reqResXml = '';

let item1 = {dateTime, clientIP, reqResXml};
let item1s = [];
let item2 = {systemCd, busTxnSeq, busTxnType, busProcType, requestType, env, status};
let item2s = [];
var n;
let combinedItem = {dateTime, systemCd, clientIP, busTxnSeq, busTxnType, busProcType, requestType, env, status, reqResXml};
let combinedItems = [];
let a1 = [];
let a2 = [];

app.use(bodyParser.json());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO ANGULAR' });
});

// save the logs
app.post('/postData', (req, res) => {
  
  busTxnSeq = req.body.busTxnSeq;
  env = req.body.env;

  zxtmUrl = `http://elastic.elasticsearch.nat.bt.com/json-dnp-*/_search?q=Request_E2Edata: *${busTxnSeq}*&env=${env}`;
  bptmUrl = `http://elastic.elasticsearch.nat.bt.com/json-dnp-*/_search?q=e2e.busTxnSeq:${busTxnSeq}&env=${env}`; 

  async function getZxtmData(zxtmUrl) {
    try {
      const zxtmResponse = await axios.get(zxtmUrl, {
          auth: {
              username: username,
              password: password
          }
      });

      const zxtmData = zxtmResponse.data.hits.hits;

      zxtmData.forEach(element => {
        item1.dateTime = element._source.Timestamp;
        item1.clientIP = element._source.Client_IP.substr(2);
        item1.reqResXml = `${element._source.Request_body} ${element._source.Response_body}`

        item1s.push(item1);  

        // console.log(item1);
      });

      (async () => {
        // console.log(item1s)
      })()

      return item1s;

    } catch (error) {
      console.log(error);
    }

  };

  async function getBptmData(bptmUrl) {
    try {
      const bptmResponse = await axios.get(bptmUrl, {
          auth: {
              username: username,
              password: password
          }
      });
      const bptmData = bptmResponse.data.hits.hits;  

      bptmData.forEach(element => {
        // item2.systemCd = element._source.doc['REQUEST-SYSTEM-CD'];
        item2.busTxnSeq = element._source.e2e.busTxnSeq;
        item2.busTxnType = element._source.e2e.busTxnType;
        item2.busProcType = element._source.e2e.busProcType;
        // item2.requestType = element._source.doc['REQUEST-TYPE'];
        item2.env = element._source.env;
        // item2.status = element._source.doc['STATUS'];

        item2s.push(item2);

        // console.log(item2);
      });

      (async () => {
        // console.log(item2s)
      })()

      return item2s;

    } catch (error) {
      console.log(error);
    }

  };

  getZxtmData(zxtmUrl).then((data1) => {
    // console.log(data1);

    return new Promise(function(resolve, reject) {
      fs.writeFile('./a1.json', JSON.stringify(data1, null, 4), function(err) {
         if (err) reject(err);
         else resolve(data1);
      });
    }); 

    // return data1;
  });

  getBptmData(bptmUrl).then((data2) => {
    // console.log(data2);

    return new Promise(function(resolve, reject) {
      fs.writeFile('./a2.json', JSON.stringify(data2, null, 4), function(err) {
         if (err) reject(err);
         else resolve(data2);
      });
    }); 

    // return data2;
  });

  res.send({msg: 'fetching log data'});
});

// display the logs
app.get('/postData', (req, res) => {
  var count = 0;
  var handler = function(error, content){
    count++;
    if (error){
      console.log(error);
    }
    else{
      res.write(content);
    }

    if (count == 1) {
      res.write(',\n');
    }
    if (count == 2) {
      res.end();
    }
  }

  fs.readFile('./a1.json', handler);
  fs.readFile('./a2.json', handler);
});