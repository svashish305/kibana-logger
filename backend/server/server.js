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

  // console.log(`env: ${env} busTxnSeq: ${busTxnSeq}`);

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
      // console.log(zxtmData[0]._source.Timestamp);
      // console.log('dummySysCode');
      // console.log(zxtmData[0]._source.Client_IP);
      // console.log(zxtmData[0]._source.Request_body);
      // console.log(zxtmData[0]._source.Response_body);

      fs.writeFile("./db.json", JSON.stringify(zxtmData[0], null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("File has been created");
      });
      
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
      // console.log(bptmData[0]._source.e2e.busTxnSeq);      
      // console.log(bptmData[0]._source.e2e.busTxnType);
      // console.log(bptmData[0]._source.e2e.busProcType);   
      // console.log(bptmData[0]._source.doc.REQUEST-TYPE);   
      // console.log(zxtmData[0]._source.env);
      console.log(bptmData[0]._source.doc.STATUS);   



      
      // fs.writeFile("./db.json", JSON.stringify(bptmData[0], null, 4), (err) => {
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

  

  getZxtmData(zxtmUrl);
  getBptmData(bptmUrl);

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