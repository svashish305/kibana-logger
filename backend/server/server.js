const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;
const axios = require("axios");
const fs = require("fs");

const username = 'elasticsearch-json';
const password = 'vhZpjq5Jzrm';

let index = '';
let url = '';

let dateTime = '';
let systemCd = '';
let clientIP = '';
let busTxnSeq = '';
let busTxnType = '';
let busProcType = '';
let requestType = '';
let env = '';
let status = '';
let compTxnID = '';
let compTxnName = '';
let text = '';
let messageID = '';
let reqResXml = '';

let combinedItem = {dateTime, systemCd, clientIP, busTxnSeq, compTxnID, compTxnName, busTxnType, busProcType, requestType, env, status, text, messageID, reqResXml};
let item = {dateTime, systemCd, clientIP, busTxnSeq, compTxnID, compTxnName, busTxnType, busProcType, requestType, env, status, text, messageID, reqResXml};

let items = [];
let combinedItems = [];

let content = [];

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
  
  // console.log(env);

  if (env === 'prod') {
    index = 'json-dnp_prod-*';
    url = `http://elastic.elasticsearch.nat.bt.com/${index}/_search?q=e2e.busTxnSeq:${busTxnSeq}`;
  }
  else {
    index = 'json-dnp-*';
    url = `http://elastic.elasticsearch.nat.bt.com/${index}/_search?q=Request_E2Edata: *${busTxnSeq}*&env=${env}`;
  }    
  
  // console.log(url);

  async function getData(url) {
    try {
      const Response = await axios.get(url, {
          auth: {
              username: username,
              password: password
          }
      });

      const data = Response.data.hits.hits;

      // console.log(data[0]);

      data.forEach(element => {
        item.dateTime = element._source.Timestamp;
        // item1.clientIP = element._source.Client_IP.substr(2);
        item.clientIP = element._source.Client_IP;
        item.reqResXml = `${element._source.Request_body} ${element._source.Response_body}`;
        // item.systemCd = element._source.doc['REQUEST-SYSTEM-CD'];
        item.busTxnSeq = element._source.e2e.busTxnSeq;
        item.compTxnID = element._source.e2e.compTxnID;
        item.compTxnName = element._source.e2e.compTxnName;
        item.busTxnType = element._source.e2e.busTxnType;
        item.busProcType = element._source.e2e.busProcType;
        // item.requestType = element._source.doc['REQUEST-TYPE'];
        item.env = element._source.env;
        // item.status = element._source.doc['STATUS'];
        // item.text = element._source['TEXT'];
        // item.messageID = element._source['MESSAGEID'];

        items.push(item);  

        // console.log(item);
      });

      // (async () => {
      //   console.log(items)
      // })()

      return items;

    } catch (error) {
      console.log(error);
    }

  };

  getData(url).then((data) => {
    // console.log(data);

    return new Promise(function(resolve, reject) {
      fs.writeFile('./a.json', JSON.stringify(data, null, 4), function(err) {
        if (err) reject(err);
        else resolve(data);
      });
    }); 

    // return data1;
  });

  res.send({msg: 'fetching log data'});
});

// display the logs
app.get('/postData', (req, res) => {
  
  const a = fs.readFileSync('./a.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    content = JSON.parse(jsonString);
    // console.log(content);
    process();
  });

  function process() {
    // console.log(content[0]); 
  }

  let theArray = JSON.parse(a.toString());
  let i=0;
  const n = theArray.length;
  for(i=0; i<n; i++) {
    combinedItem.dateTime = theArray[i].dateTime;
    combinedItem.systemCd = theArray[i].systemCd;
    combinedItem.clientIP = theArray[i].clientIP;
    combinedItem.busTxnSeq = theArray[i].busTxnSeq;
    combinedItem.compTxnID = theArray[i].compTxnID;
    combinedItem.compTxnName = theArray[i].compTxnName;
    combinedItem.busTxnType = theArray[i].busTxnType;
    combinedItem.busProcType = theArray[i].busProcType;
    combinedItem.requestType = theArray[i].requestType;
    combinedItem.env = theArray[i].env;
    combinedItem.status = theArray[i].status;
    combinedItem.text = theArray[i].text;
    combinedItem.messageID = theArray[i].messageID;
    combinedItem.reqResXml = theArray[i].reqResXml;

    combinedItems.push(combinedItem);
  }

  // console.log(combinedItems);

  res.send(combinedItems);

});