import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentsCardSearchComponent } from './components';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Platform } from '@angular/cdk/platform';

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
  safeUrl: SafeUrl;
  loading = false;

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

  get disabled(): boolean {
    if (this.loading) {
      return this.loading;
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
    private platform: Platform,
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
    this.loading = true;
    const url = 'https://decksheet-api.herokuapp.com/dmSheet';
    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("nameKana", this.nameKana);
    formData.append("id", this.dmpId);
    formData.append("mainDeck", this.deckToString(this.main));
    formData.append("hyperSpatial", this.deckToString(this.spatial));
    formData.append("hyperGR", this.deckToString(this.gr));
    formData.append("forbiddenStar", String(this.forbiddenStar));
    formData.append("image", String(this.platform.ANDROID || this.platform.IOS));
    const requestOptions: {[key: string]: any} = {
      responseType: 'arraybuffer'
    };
    this.http.post(url, formData, requestOptions).subscribe((res: any) => {
      const extension = this.platform.ANDROID || this.platform.IOS ? 'png' : 'pdf';
      const file: Blob = new Blob([res], {type: `application/${extension}`});
      const fileURL: string = URL.createObjectURL(file);
      this.safeUrl = this.sanitizer.bypassSecurityTrustUrl(fileURL);
      this.loading = false;
    }, (res: HttpErrorResponse) => {
      alert('エラーが発生しました')
      this.loading = false;
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

  private deckToString(deck: CardInfo[]): string {
    let result = '';
    if (deck.length === 0) {
      return result;
    }
    deck.forEach((cardInfo: CardInfo) => {
      for (let i = 0; i < cardInfo.num; i++) {
        result += (cardInfo.name + ',');
      }
    });
    return result.slice(0, -1);;
  }
}
