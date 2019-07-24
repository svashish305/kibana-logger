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
1. To Clone using SVN, Update 'kibana logger' from Trunk branch into local SVN repos folder
   Or to clone using git, head over to gitlab repo [Gitlab Repo for kibana logger](https://gitlab.tool.nat.bt.com/612394207/kibana-logger), and clone with
   git clone into local git repos directory
2. Open VS Code (or your favourite editor) and open the cloned repo, also open the integrated terminal, preferrably use git bash, or if VS Code has cmd
   /powershell, open a separate Git Bash window
3. Here's how to run the logger over local dev server (only after all the npm install commands, refer the above header for commands): 
    (![alt text](https://media.giphy.com/media/kgg2sOZwTirUj4BVO7/giphy.gif "running in localhost")
4. Go to logger app in browser [Kibana Logger on localhost](http://localhost:4200)
5. Go to kibana URL to fetch BusTxnSeq, as we are fetching logs based on this parameter itself as of now
    [Kibana URL](http://kibana.elasticsearch.nat.bt.com/app/kibana#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-15m,mode:quick,to:now))&_a=(columns:!(_source),index:'json-dnp_prod-*',interval:auto,query:(query_string:(analyze_wildcard:!t,query:'*')),sort:!('@timestamp',desc))&indexPattern=json-dnp_prod-*&type=histogram)
    ![alt text](https://media.giphy.com/media/hVgN6JT9yfy4Oc12Lr/giphy.gif "fetching BusTxnSeq from kibana URL")
6. Select BusTxnSeq from dropdown and paste the copied string in the adjacent input field, click Search:
    ![alt text](https://media.giphy.com/media/WQCi7zFseSjdhWKM5O/giphy.gif "operating logger app")
7. Reload every search for fetching fresh logs, as well as clear the contets of a.json file (issue due to async file write), also suggested to Ctrl+C
   running dev server and running again using 'npm run dev' (optional though)
    ![alt text](https://media.giphy.com/media/VIhDMbrJqPxKp0iIEb/giphy.gif "fixes for next usage")
8. Enjoy!


#### Author: Shubhashish Verma
##### Made by :heart:
