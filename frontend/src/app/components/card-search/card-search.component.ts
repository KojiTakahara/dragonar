import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
    selector: 'app-components-card-search',
    templateUrl: './card-search.component.html',
    styleUrls: ['./card-search.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponentsCardSearchComponent implements OnInit {

    myControl = new FormControl();
    value = '';
    options: any[] = [];
    private postUrl = '/api/v1/card/search';

    @Output('selected') selectedEmitter = new EventEmitter();

    constructor(private http: HttpClient) { }

    ngOnInit() { }

    search(ev: any) {
        const formData: FormData = new FormData();
        formData.append('keyword', ev.target.value);
        this.http.post(this.postUrl, formData).subscribe((res: any) => {
            this.options = res;
        });
    }

    select(ev: MatAutocompleteSelectedEvent) {
        this.value = ev.option.value.Name;
        this.selectedEmitter.emit(ev.option);
    }
}
