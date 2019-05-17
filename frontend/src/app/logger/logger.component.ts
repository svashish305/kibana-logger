import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators , NgForm } from '@angular/forms';
import 'hammerjs';

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

const ELEMENT_DATA: LoggerData[] = [
  { dateTime: '2019-05-15T11:39:16+00:00', systemCd: 'dummySysCode', clientIP: '10.29.95.162', busTxnSeq: '4gyxfi6tp3',
    busTxnType: 'GetClientProfile', busProcType: 'DirectoryandProfile', requestType: 'GET_CLIENT_PROFILE', env: 'gotham',
    status: 'PASS', reqResXml: 'dummyData' },
  { dateTime: '2019-05-15T11:39:16+00:00', systemCd: 'dummySysCode', clientIP: '10.29.95.162', busTxnSeq: '4gyxfi6tp3',
    busTxnType: 'GetClientProfile', busProcType: 'DirectoryandProfile', requestType: 'GET_CLIENT_PROFILE', env: 'gotham',
    status: 'PASS', reqResXml: 'dummyData' },
  { dateTime: '2019-05-15T11:39:16+00:00', systemCd: 'dummySysCode', clientIP: '10.29.95.162', busTxnSeq: '4gyxfi6tp3',
    busTxnType: 'GetClientProfile', busProcType: 'DirectoryandProfile', requestType: 'GET_CLIENT_PROFILE', env: 'gotham',
    status: 'PASS', reqResXml: 'dummyData' }
];

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit {

  displayedColumns: string[] = ['dateTime', 'systemCd', 'clientIP', 'busTxnSeq', 
  'busTxnType', 'busProcType', 'requestType', 'env', 'status', 'reqResXml'];
  dataSource = ELEMENT_DATA;

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

  constructor(private fb: FormBuilder) { 
    
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
    console.log(this.seqForm.value);
  }

}
