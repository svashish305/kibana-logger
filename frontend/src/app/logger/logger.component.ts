import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators , NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'hammerjs';
import { forEach } from '@angular/router/src/utils/collection';

export interface SeqParam {
  value: string;
  viewValue: string;
}

export interface LoggerData {
  dateTime: string;
  systemCd: string;
  clientIP: string;
  busTxnSeq: string;
  busTxnType: string;
  busProcType: string;
  requestType: string;
  env: string;
  status: string;
  reqResXml: string;
}

let ELEMENT_DATA: LoggerData[] = [
  // { dateTime: '2019-05-15T11:39:16+00:00', systemCd: 'dummySysCode', clientIP: '10.29.95.162', busTxnSeq: '4gyxfi6tp3',
  //   busTxnType: 'GetClientProfile', busProcType: 'DirectoryandProfile', requestType: 'GET_CLIENT_PROFILE', env: 'gotham',
  //   status: 'PASS', reqResXml: 'dummyData' },
  // { dateTime: '2019-05-15T11:39:16+00:00', systemCd: 'dummySysCode', clientIP: '10.29.95.162', busTxnSeq: '4gyxfi6tp3',
  //   busTxnType: 'GetClientProfile', busProcType: 'DirectoryandProfile', requestType: 'GET_CLIENT_PROFILE', env: 'gotham',
  //   status: 'PASS', reqResXml: 'dummyData' },
  // { dateTime: '2019-05-15T11:39:16+00:00', systemCd: 'dummySysCode', clientIP: '10.29.95.162', busTxnSeq: '4gyxfi6tp3',
  //   busTxnType: 'GetClientProfile', busProcType: 'DirectoryandProfile', requestType: 'GET_CLIENT_PROFILE', env: 'gotham',
  //   status: 'PASS', reqResXml: 'dummyData' }
];

let tableData: any[] = [];

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit {

  displayedColumns: string[] = ['dateTime', 'systemCd', 'clientIP', 'busTxnSeq', 
  'busTxnType', 'busProcType', 'requestType', 'env', 'status', 'reqResXml'];
  dataSource = ELEMENT_DATA;
  // dataSource = tableData;

  data = [
    { label: 'Gotham', checked: false },
    { label: 'Voltest', checked: false },
    { label: 'Prod', checked: false },
    { label: 'Live', checked: false },
    { label: 'All', checked: false }
  ];

  onChange(event, index, item) {
    item.checked = !item.checked;
  }

  seqForm: FormGroup;
  selectedParam:string = '';
  busTxnSeq:string = '';
  checkGotham:boolean = false;
  checkVoltest:boolean = false;
  checkLive:boolean = false;
  checkAll:boolean = false;

  // seqParams = ['BusTxnSeq', 'abc', 'xyz']

  seqParams: SeqParam[] = [
    {value: 'BusTxnSeq', viewValue: 'BusTxnSeq'},
    {value: 'Pizza', viewValue: 'Pizza'},
    {value: 'Tacos', viewValue: 'Tacos'}
  ];

  constructor(private fb: FormBuilder, private httpClient: HttpClient) { 
    
  }

  ngOnInit() {
    this.seqForm = this.fb.group({
      'selectedParam' : ['', Validators.required],
      'busTxnSeq' : ['', Validators.required],
      'checkGotham': [false],
      'checkVoltest': [false],
      'checkLive': [false],
      'checkAll': [false]
    });


  }

  onSubmit() {
    // console.log(this.seqForm.value);

    // this.dataSource = tableData;

    const selectedParam  = this.seqForm.get('selectedParam');
    const busTxnSeq = this.seqForm.get('busTxnSeq').value;
    let env = '';

    if (this.data[0].checked)
      env = 'gotham';
    else if (this.data[1].checked)
      env = 'voltest';
    else if (this.data[2].checked)
      env = 'live';
      else if (this.data[3].checked)
      env = 'prod';
    else if (this.data[4].checked)
      env = 'all';

    // console.log(env);

    // const zxtmUrl = `http://elastic.elasticsearch.nat.bt.com/json-dnp-*/_search?q=Request_E2Edata: *${busTxnSeq}*&env=${env}`;
    // for hyperlink, to show audit logs :
    // const bptmUrl = `http://elastic.elasticsearch.nat.bt.com/json-dnp-*/_search?q=e2e.busTxnSeq:${busTxnSeq}&env=${env}`;

    var headers_object = new HttpHeaders();
    headers_object.append("Authorization", "Basic " + btoa("elasticsearch-json:vhZpjq5Jzrm"));
    // headers_object.append("Content-Type", "application/x-www-form-urlencoded");

    const httpOptions = {
      headers: headers_object
    };

    this.httpClient.post('/api/postData', {busTxnSeq, env}, httpOptions).subscribe((res)=>{
      console.log('sending params to backend');
    });

    this.httpClient.get('/api/postData', httpOptions).subscribe((res)=>{
      // console.log(res[0].dateTime);
      console.log('fetching data from backend');

      const n = Object.keys(res).length;
      let i;
      for(i=0; i<n; i++) {
        tableData.push(res[i]);
      } 

      console.log(tableData);
      this.dataSource = tableData;
    });

  }
  
  
}