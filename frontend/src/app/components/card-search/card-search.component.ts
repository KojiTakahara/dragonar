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

    myControl = new FormControl();
    options: string[] = [];
    private postUrl = 'http://localhost:8080/api/v1/card/search';

    @ViewChild('input') input: ElementRef;

    constructor(private http: HttpClient) { }

    ngOnInit() { }

    search(ev: any) {
        const formData: FormData = new FormData();
        formData.append('keyword', ev.target.value);
        this.http.post(this.postUrl, formData).subscribe((res: any) => {
            this.options = res;
        });
    }
}
