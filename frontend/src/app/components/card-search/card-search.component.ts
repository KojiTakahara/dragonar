import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-components-card-search',
    templateUrl: './card-search.component.html',
    styleUrls: ['./card-search.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponentsCardSearchComponent implements OnInit {
    
    private myControl = new FormControl();
    private options: string[] = [];
    private postUrl: string = 'http://localhost:8080/api/v1/card/search';

    @ViewChild('input') input: ElementRef;

    constructor(private http: HttpClient) { }

    ngOnInit() { }
  
    search(ev: any) {
        let formData: FormData = new FormData(); 
        formData.append('keyword', ev.target.value);
        this.http.post(this.postUrl, formData).subscribe((res: any) => {
            this.options = res;
        });
    }
}