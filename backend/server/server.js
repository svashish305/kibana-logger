const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;
const axios = require("axios");
const fs = require("fs");

const username = 'elasticsearch-json';
const password = 'vhZpjq5Jzrm';

// let zxtmUrl = '';
// let bptmUrl = '';

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

// let item1 = {dateTime, clientIP, reqResXml};
// let item1s = [];
// let item2 = {systemCd, busTxnSeq, compTxnID, compTxnName, busTxnType, busProcType, requestType, env, status, text, messageID};
// let item2s = [];
let combinedItem = {dateTime, systemCd, clientIP, busTxnSeq, compTxnID, compTxnName, busTxnType, busProcType, requestType, env, status, text, messageID, reqResXml};
let item = {dateTime, systemCd, clientIP, busTxnSeq, compTxnID, compTxnName, busTxnType, busProcType, requestType, env, status, text, messageID, reqResXml};

let items = [];
let combinedItems = [];

let content = [];
// let content1 = [];
// let content2 = [];

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
  
  if (env === 'prod')
    index = 'json-dnp_prod-*'
  else
    index = 'json-dnp-*';

  url = `http://elastic.elasticsearch.nat.bt.com/${index}/_search?q=Request_E2Edata: *${busTxnSeq}*&env=${env}`;
  // zxtmUrl = `http://elastic.elasticsearch.nat.bt.com/json-dnp-*/_search?q=Request_E2Edata: *${busTxnSeq}*&env=${env}`;
  // zxtmUrl = `http://elastic.elasticsearch.nat.bt.com/json-dnp_prod-*/_search`;

  // bptmUrl = `http://elastic.elasticsearch.nat.bt.com/json-dnp-*/_search?q=e2e.busTxnSeq:${busTxnSeq}&env=${env}`; 
  // bptmUrl = `http://elastic.elasticsearch.nat.bt.com/json-dnp_prod-*/_search`; 

  async function getData(url) {
    try {
      const zxtmResponse = await axios.get(url, {
          auth: {
              username: username,
              password: password
          }
      });

      const data = zxtmResponse.data.hits.hits;

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

  // async function getZxtmData(zxtmUrl) {
  //   try {
  //     const zxtmResponse = await axios.get(zxtmUrl, {
  //         auth: {
  //             username: username,
  //             password: password
  //         }
  //     });

  //     const zxtmData = zxtmResponse.data.hits.hits;

  //     // console.log(zxtmData[0]);

  //     zxtmData.forEach(element => {
  //       item1.dateTime = element._source.Timestamp;
  //       // item1.clientIP = element._source.Client_IP.substr(2);
  //       item1.clientIP = element._source.Client_IP;
  //       item1.reqResXml = `${element._source.Request_body} ${element._source.Response_body}`

  //       item1s.push(item1);  

  //       // console.log(item1);
  //     });

  //     // (async () => {
  //     //   console.log(item1s)
  //     // })()

  //     return item1s;

  //   } catch (error) {
  //     console.log(error);
  //   }

  // };

  // async function getBptmData(bptmUrl) {
  //   try {
  //     const bptmResponse = await axios.get(bptmUrl, {
  //         auth: {
  //             username: username,
  //             password: password
  //         }
  //     });
  //     const bptmData = bptmResponse.data.hits.hits;  

  //     // console.log(bptmData[0]);

  //     bptmData.forEach(element => {
  //       // console.log(element);
  //       // item2.systemCd = element._source.doc['REQUEST-SYSTEM-CD'];
  //       item2.busTxnSeq = element._source.e2e.busTxnSeq;
  //       item2.compTxnID = element._source.e2e.compTxnID;
  //       item2.compTxnName = element._source.e2e.compTxnName;
  //       item2.busTxnType = element._source.e2e.busTxnType;
  //       item2.busProcType = element._source.e2e.busProcType;
  //       // item2.requestType = element._source.doc['REQUEST-TYPE'];
  //       item2.env = element._source.env;
  //       // item2.status = element._source.doc['STATUS'];
  //       // item2.text = element._source['TEXT'];
  //       // item2.messageID = element._source['MESSAGEID'];

  //       item2s.push(item2);

  //       // console.log(item2);
  //     });

  //     // (async () => {
  //     //   console.log(item2s)
  //     // })()

  //     return item2s;

  //   } catch (error) {
  //     console.log(error);
  //   }

  // };

  // getZxtmData(zxtmUrl).then((data1) => {
  //   // console.log(data1);

  //   return new Promise(function(resolve, reject) {
  //     fs.writeFile('./a1.json', JSON.stringify(data1, null, 4), function(err) {
  //       if (err) reject(err);
  //       else resolve(data1);
  //     });
  //   }); 

  //   // return data1;
  // });

  // getBptmData(bptmUrl).then((data2) => {
  //   // console.log(data2);

  //   return new Promise(function(resolve, reject) {
  //     fs.writeFile('./a2.json', JSON.stringify(data2, null, 4), function(err) {
  //       if (err) reject(err);
  //       else resolve(data2);
  //     });
  //   }); 

       // return data2;
  // });

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

  // const a1 = fs.readFileSync('./a1.json', 'utf8', (err, jsonString) => {
  //   if (err) {
  //       console.log("File read failed:", err)
  //       return
  //   }
  //   content1 = JSON.parse(jsonString);
  //   // console.log(content1);
  //   process1();
  // });

  // function process1() {
  //   // console.log(content1[0]); 
  // }

  // const a2 = fs.readFileSync('./a2.json', 'utf8', (err, jsonString) => {
  //   if (err) {
  //       console.log("File read failed:", err)
  //       return
  //   }
  //   content2 = JSON.parse(jsonString);
  //   process2();
  // });

  // function process2() {
  //   // console.log(content2[0]); 
  // }

  // // read the arrays into a1 and a2, now time to play with them
  // let first = JSON.parse(a1);
  // let second = JSON.parse(a2);
  // let i=0;
  // let j=0;
  // const n = Math.min(first.length, second.length);
  // // console.log(first[0]);
  // // console.log(second[0]);

  // // console.log(`${first.length} ${second.length}`);

  // for(i=0, j=0; i<n, j<n; i++, j++) {
  //   combinedItem.dateTime = first[i].dateTime;
  //   combinedItem.systemCd = second[j].systemCd;
  //   combinedItem.clientIP = first[i].clientIP;
  //   combinedItem.busTxnSeq = second[j].busTxnSeq;
  //   combinedItem.compTxnID = second[j].compTxnID;
  //   combinedItem.compTxnName = second[j].compTxnName;
  //   combinedItem.busTxnType = second[j].busTxnType;
  //   combinedItem.busProcType = second[j].busProcType;
  //   combinedItem.requestType = second[j].requestType;
  //   combinedItem.env = second[j].env;
  //   combinedItem.status = second[j].status;
  //   combinedItem.text = second[j].text;
  //   combinedItem.messageID = second[j].messageID;
  //   combinedItem.reqResXml = first[i].reqResXml;

  //   combinedItems.push(combinedItem);
  // }

  // // console.log(combinedItems);

  // res.send(combinedItems);
});