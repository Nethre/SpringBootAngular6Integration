import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { DisplayDataDialogComponent } from '../display-data-dialog/display-data-dialog.component';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';

import { RequestData } from '../models/request-data';
import { RequestService } from '../services/request.service';





@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  
  myEmpId:number;
  disableAddRequest: boolean; //true if there is any request which is not inactivated
  comment: string;
  displayedColumns: string[] = ['reqDesc', 'status', 'action'];
  dataSource: MatTableDataSource<RequestData>;

  /** Constants used to fill up our data base. */
  reqData: RequestData[] = [];


  @ViewChild(MatSort) sort: MatSort;


  constructor(public dialog: MatDialog, public requestService: RequestService) {
    this.myEmpId = 1004;    
  }


  ngOnInit() {
    this.requestService.getRequestsForEmployee(this.myEmpId).subscribe(result => {
      if (result) {
        this.reqData.push(result);
        if (this.reqData.length > 0) {
          this.disableAddRequest = true;
        }
        this.dataSource = new MatTableDataSource(this.reqData);
        this.dataSource.sort = this.sort;
      }
    });
  }



  onCancel(request: RequestData) {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      height: '250px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
        dialogRef.componentInstance.onAdd.unsubscribe();
        if (result) {
          request.requestStatus = "inactivated";
          this.dataSource.data = this.filterRequestData(this.reqData);
          this.disableAddRequest = false;
        }
    });
  }

  viewReqDescription(row) {
    const dialogRef = this.dialog.open(DisplayDataDialogComponent, {
      data: {value: row.reqDesc}
    });
  }

  onAddRequest() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.height = '250px';
    dialogConfig.width = '600px';
    const dialogRef = this.dialog.open(RequestDialogComponent, dialogConfig);

    dialogRef.componentInstance.onAdd.subscribe((data) => {
        this.comment = data;
     });

    dialogRef.afterClosed().subscribe((result) => {
      dialogRef.componentInstance.onAdd.unsubscribe();
      console.log(result);
      if (result) {
        console.log(this.comment);
        this.requestService.addRequest(this.myEmpId, this.comment).subscribe(
          response => console.log(response),
          err => console.log(err)
        );
        this.disableAddRequest = true;
        console.log(2);
        //this.dataSource.data = this.filterRequestData(this.reqData);
        console.log(3);
      }
    });
  }

  filterRequestData(reqData: RequestData[]): RequestData[] {
    console.log(reqData);
    console.log(4);
    if(reqData.length === 0){
      console.log(5);
      return null;
    }
    else{
       console.log(6);
      return reqData.filter(request => request.requestStatus !== 'inactivated'); //i changed it to !== from !=
    }
  }

}
