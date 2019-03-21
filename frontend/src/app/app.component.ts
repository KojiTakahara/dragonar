import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentsCardSearchComponent } from './components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  numbers: number[] = [];
  zone: string = 'main';
  selectedNumber: number = 1;

  name: string = '';
  nameKana: string = '';
  dmpId: string = '';
  main: CardInfo[] = [];
  mainLength: number = 0;
  gr: CardInfo[] = [];
  grLength: number = 0;
  spatial: CardInfo[] = [];
  spatialLength: number = 0;
  forbiddenStar: boolean = false;

  get disabled(): boolean {
    if (!this.name) {
      return true;
    }
    if (this.mainLength < 40 || 40 < this.mainLength) {
      return true;
    }
    if (this.grLength != 0) {
      if (this.grLength != 12) {
        return true;
      }
    }
    return false;
  }

  @ViewChild(AppComponentsCardSearchComponent) searchInput: AppComponentsCardSearchComponent;

  ngOnInit(): void {
    for (let i = 0; i < 40; i++) {
      this.numbers.push(i + 1);
    }
  }

  add() {
    let cardName: string = this.searchInput.input.nativeElement.value;
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

  isDuplication(list: CardInfo[], cardName: String): boolean {
    return list.some((c: CardInfo) => {
      return c.name === cardName;
    });
  }

  remove(card: CardInfo, zone: string) {
    switch (zone) {
      case 'main':
        this.main = this.main.filter((c: CardInfo) => {
          return c.name != card.name;
        });
        break;
      case 'gr':
        this.gr = this.gr.filter((c: CardInfo) => {
          return c.name != card.name;
        });
        break;
      case 'spatial':
        this.spatial = this.spatial.filter((c: CardInfo) => {
          return c.name != card.name;
        });
        break;
    }
  }

  submit() {

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
