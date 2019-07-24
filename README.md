# Kibana Logger

## Frontend made using Angular

## Backend made using Node + Express server

### to run locally, clone this repo and go to project root folder, then in terminal type:
``` 
npm install
cd backend && npm install
cd ../frontend && npm install
cd .. && npm run dev
```

###Operating Instructions
1. Go to kibana URL to fetch BusTxnSeq, as we are fetching logs based on this parameter itself as of now
....[Kibana URL](http://kibana.elasticsearch.nat.bt.com/app/kibana#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-15m,mode:quick,to:now))&_a=(columns:!(_source),index:'json-dnp_prod-*',interval:auto,query:(query_string:(analyze_wildcard:!t,query:'*')),sort:!('@timestamp',desc))&indexPattern=json-dnp_prod-*&type=histogram)
....![alt text](https://media.giphy.com/media/hVgN6JT9yfy4Oc12Lr/giphy.gif "fetching BusTxnSeq from kibana URL")

#### Author: Shubhashish Verma
