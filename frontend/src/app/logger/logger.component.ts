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
  compTxnID: string;
  compTxnName: string;
  busTxnType: string;
  busProcType: string;
  requestType: string;
  env: string;
  status: string;
  text: string;
  messageID: string;
  reqResXml: string;
}

let ELEMENT_DATA: LoggerData[] = [];

let tableData: any[] = [];

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit {

  displayedColumns: string[] = ['dateTime', 'systemCd', 'clientIP', 'busTxnSeq', 'compTxnID', 'compTxnName',
  'busTxnType', 'busProcType', 'requestType', 'env', 'status', 'text', 'messageID', 'reqResXml'];
  dataSource = ELEMENT_DATA;
  // dataSource = tableData;

  seqForm: FormGroup;
  selectedParam:string = '';
  busTxnSeq:string = '';
  
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
      'busTxnSeq' : ['', Validators.required]
    });


  }

  onSubmit() {
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

      // console.log(tableData);
      this.dataSource = tableData;
    });

  }
  
  
}