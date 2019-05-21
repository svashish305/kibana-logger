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
let getZxtmData = '';
let getBptmData = '';

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

let item1 = {dateTime, systemCd, clientIP, reqResXml};
let item1s = [];
let item2 = {busTxnSeq, busTxnType, busProcType, requestType, env, status};
let item2s = [];
var n;
let combinedItem = {dateTime, systemCd, clientIP, busTxnSeq, busTxnType, busProcType, requestType, env, status, reqResXml};
let combinedItems = [];

app.use(bodyParser.json());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO ANGULAR' });
});

app.post('/postData', (req, res) => {
  
  busTxnSeq = req.body.busTxnSeq;
  env = req.body.env;

  zxtmUrl = `http://elastic.elasticsearch.nat.bt.com/json-dnp-*/_search?q=Request_E2Edata: *${busTxnSeq}*&env=${env}`;
  bptmUrl = `http://elastic.elasticsearch.nat.bt.com/json-dnp-*/_search?q=e2e.busTxnSeq:${busTxnSeq}&env=${env}`; 

  getZxtmData = async zxtmUrl => {
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
        item1.systemCd = 'dummySysCode';
        item1.clientIP = element._source.Client_IP.substr(2);
        item1.reqResXml = `${element._source.Request_body} ${element._source.Response_body}`

        item1s.push(item1);  

        // console.log(item1);
      });

      return (async () => {
        console.log(item1s)
        // return item1s;
      })()

      // fs.writeFile("./db.json", JSON.stringify(combinedItems, null, 4), (err) => {
      //   if (err) {
      //       console.error(err);
      //       return;
      //   };
      //   console.log("File has been created");
      // });

    } catch (error) {
      console.log(error);
    }

  };

  getBptmData = async bptmUrl => {
    try {
      const bptmResponse = await axios.get(bptmUrl, {
          auth: {
              username: username,
              password: password
          }
      });
      const bptmData = bptmResponse.data.hits.hits;  

      bptmData.forEach(element => {
        item2.busTxnSeq = element._source.e2e.busTxnSeq;
        item2.busTxnType = element._source.e2e.busTxnType;
        item2.busProcType = element._source.e2e.busProcType;
        // item2.requestType = element._source.doc['REQUEST-TYPE'];
        item2.env = element._source.env;
        // item2.status = element._source.doc['STATUS'];

        item2s.push(item2);

        // console.log(item2);
      });

      return (async () => {
        console.log(item2s)
        // return item2s;
      })()

    } catch (error) {
      console.log(error);
    }

  };

  const a1 = getZxtmData(zxtmUrl);
  const a2 = getBptmData(bptmUrl);


  // if (item1s.length <= item2s.length) {
  //   n = item1s.length;
  // } else if (item1s.length > item2s.length) {
  //   n = item2s.length;
  // } 
  // for(var i=0, j=0, k=0; i< item1s.length, j < item2s.length, k< n; i++, j++, k++) {
  //   combinedItem[k].dateTime = item1s[i].dateTime;
  //   combinedItem[k].systemCd = item1s[i].systemCd;
  //   combinedItem[k].clientIP = item1s[i].clientIP;
  //   combinedItem[k].busTxnSeq = item2s[j].busTxnSeq;
  //   combinedItem[k].busTxnType = item2s[j].busTxnType;
  //   combinedItem[k].busProcType = item2s[j].busProcType;
  //   combinedItem[k].requestType = item2s[j].requestType;
  //   combinedItem[k].env = item2s[j].env;
  //   combinedItem[k].status = item2s[j].status;
  //   combinedItem[k].reqResXml = item2s[j].reqResXml;

  //   // combinedItems.push(combinedItem);
  //   console.log(combinedItem[k]);
  // }

  res.send({msg: 'fetching log data'});
});

app.get('/postData', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    res.send(JSON.parse(jsonString)); 
  });
});