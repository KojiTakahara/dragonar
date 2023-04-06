import {
    Component,
    ElementRef,
    EventEmitter,
    Output,
    ViewChild,
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
export class AppComponentsCardSearchComponent {

    myControl = new FormControl();
    value = '';
    options: any[] = [];
    processing = false;
    private postUrl = '/api/v1/card/search';

    @ViewChild('input') input: ElementRef;
    @Output() selected = new EventEmitter();

    constructor(private http: HttpClient) { }

    search(ev: any) {
        if (this.processing) {
            return;
        }
        this.processing = true;
        setTimeout(() => {
            const formData: FormData = new FormData();
            formData.append('keyword', ev.target.value);
            this.http.post(this.postUrl, formData).subscribe((res: any) => {
                this.options = res;
                this.processing = false;
            });
        }, 1500);
    }

    select(ev: MatAutocompleteSelectedEvent) {
        this.value = ev.option.value.Name;
        this.selected.emit(ev.option);
    }
}
