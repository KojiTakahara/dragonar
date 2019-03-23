import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentsCardSearchComponent } from './components';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  numbers: number[] = [];
  zone = 'main';
  selectedNumber = 1;

  name = '';
  nameKana = '';
  dmpId = '';
  main: CardInfo[] = [];
  mainLength = 0;
  gr: CardInfo[] = [];
  grLength = 0;
  spatial: CardInfo[] = [];
  spatialLength = 0;
  forbiddenStar = false;

  private _disabled = false;

  get disabled(): boolean {
    if (this._disabled) {
      return this._disabled;
    }
    if (!this.name) {
      return true;
    }
    if (this.mainLength < 40 || 40 < this.mainLength) {
      return true;
    }
    if (this.grLength !== 0) {
      if (this.grLength !== 12) {
        return true;
      }
    }
    return false;
  }

  @ViewChild(AppComponentsCardSearchComponent) searchInput: AppComponentsCardSearchComponent;

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient) {}

  ngOnInit(): void {
    for (let i = 0; i < 40; i++) {
      this.numbers.push(i + 1);
    }
  }

  add() {
    const cardName = this.searchInput.input.nativeElement.value;
    if (!cardName) {
      return;
    }
    switch (this.zone) {
      case 'main':
        if (!this.isDuplication(this.main, cardName)) {
          this.main.push({name: cardName, num: this.selectedNumber});
          this.mainLength += this.selectedNumber;
        }
        break;
      case 'gr':
        if (!this.isDuplication(this.gr, cardName)) {
          this.gr.push({name: cardName, num: this.selectedNumber});
          this.grLength += this.selectedNumber;
        }
        break;
      case 'spatial':
        if (!this.isDuplication(this.spatial, cardName)) {
          this.spatial.push({name: cardName, num: this.selectedNumber});
          this.spatialLength += this.selectedNumber;
        }
        break;
    }
  }

  isDuplication(list: CardInfo[], cardName): boolean {
    return list.some((c: CardInfo) => {
      return c.name === cardName;
    });
  }

  remove(card: CardInfo, zone: string) {
    switch (zone) {
      case 'main':
        this.main = this.main.filter((c: CardInfo) => {
          return c.name !== card.name;
        });
        break;
      case 'gr':
        this.gr = this.gr.filter((c: CardInfo) => {
          return c.name !== card.name;
        });
        break;
      case 'spatial':
        this.spatial = this.spatial.filter((c: CardInfo) => {
          return c.name !== card.name;
        });
        break;
    }
  }

  submit() {
    this._disabled = true;
    const url = 'https://decksheet-api.herokuapp.com/dmSheet';

    const formData: FormData = new FormData();
    formData.append('name', 'ev.target.value');

    let deck = '';
    for (let i = 1; i < 40; i++) {
      deck = deck + i + ',';
    }

    formData.append('mainDeck', deck + '40]');

    // {responseType:'arraybuffer'}

    const body = JSON.stringify({name: 'aa', mainDeck: deck + '40'});
    const requestOptions: {[key: string]: any} = {
      params: {name: 'aa', mainDeck: deck + '40', image: false},
      responseType: 'arraybuffer'
    };

    // const requestOptions: {[key: string]: any} = {
    //   headers: {'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest'}
    // };
    this.http.post(url, null, requestOptions).subscribe((res: any) => {

      console.log(res);

      const file: any = new Blob([res], {type: 'application/pdf'});
      const fileURL: any = URL.createObjectURL(file);

      // const reader: any = new FileReader();
      // reader.onload(e: any) => {
      //   const bdata: any = btoa(reader.result);
      //   const datauri: any = 'data:application/pdf;base64,' + bdata;
      //   window.location.href = datauri;
      // }
      // reader.readAsBinaryString(file);

      // not ios
      const safeUrl: any = this.sanitizer.bypassSecurityTrustUrl(fileURL);
      window.open(fileURL);
      this._disabled = false;
    });
  }

  changeZone() {
    switch (this.zone) {
      case 'main':
        this.zone = 'gr';
        break;
      case 'gr':
        this.zone = 'spatial';
        break;
      case 'spatial':
        this.zone = 'main';
        break;
      default:
        this.zone = 'main';
        break;
    }
  }
}
