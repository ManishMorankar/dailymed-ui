import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

@Injectable()
export class ExportService {
    /**
     *
     */
    constructor(private apiService: ApiService, private toastMsg: ToastrService, private http: HttpClient, ) {

    }

    excel(headers: string[], rows: any[][], fileName = 'Export'): IExportBody {
        var body: IExportBody = <IExportBody>{
            headers: headers.map(header => <IExportHeader>{
                title: header
            }),
            rows: rows
        };

        this.http.post(`${environment.apiBaseUrl}Export/Excel`, body, { responseType: 'blob' })
            .subscribe(data => {
                this.downLoadFile(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;", fileName);
                this.toastMsg.success("Success", "Your data was successfully exported");
            }, err => {
                this.toastMsg.error(err, "An error occured while exporting this data.");
            })

        return body;
    }

    /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
    downLoadFile(data: any, type: string, fileName: string = 'Export') {
        let blob = new Blob([data], { type: type });
        let date: Date = new Date();

        FileSaver.saveAs(blob, `${fileName} ${date.toLocaleString()}.xlsx`);
    }
}

export interface IExportBody {
    headers: IExportHeader[];
    rows: any[][];
}

export interface IExportHeader {
    title: string;
    format?: IExportHeaderFormat;
}

export interface IExportHeaderFormat {
    font?: IExportHeaderFormatFont;
}

export interface IExportHeaderFormatFont {
    size?: number;
    bold?: boolean;
    name?: string;
}