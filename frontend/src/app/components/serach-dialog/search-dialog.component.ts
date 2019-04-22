import { Component, ViewEncapsulation, Inject, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-components-search-dialog',
    templateUrl: './search-dialog.component.html',
    styleUrls: ['./search-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponentsSearchDialogComponent {

    @ViewChild('input') input: ElementRef;
    @Output() select: EventEmitter<any> = new EventEmitter();
    items: {[key: string]: any} = [];
    loading = false;
    private postUrl = '/api/v1/card/search';

    constructor(
        public dialogRef: MatDialogRef<AppComponentsSearchDialogComponent>,
        private http: HttpClient,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    search() {
        this.loading = true;
        const formData: FormData = new FormData();
        formData.append('keyword', this.input.nativeElement.value);
        this.http.post(this.postUrl, formData).subscribe((res: any) => {
            res.sort((a, b) => {
                if (a.Name < b.Name) { return -1; }
                if (a.Name > b.Name) { return 1; }
                return 0;
            });
            this.items = res;
            this.loading = false;
        }, () => {
            this.loading = false;
        });
    }
}
