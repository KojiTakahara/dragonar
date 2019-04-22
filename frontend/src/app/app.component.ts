import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Platform } from '@angular/cdk/platform';
import { MatDialog } from '@angular/material';
import { forkJoin } from 'rxjs';
import {　AppComponentsSearchDialogComponent } from './components';

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

  teamSheet = false;
  teamName = '';
  seat = '';

  dmgp = false;

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

  constructor(
    public platform: Platform,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private http: HttpClient) {}

  ngOnInit(): void {
    for (let i = 0; i < 40; i++) {
      this.numbers.push(i + 1);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AppComponentsSearchDialogComponent, {
      height: '90%',
      width: '90%',
      data: {}
    });
    dialogRef.componentInstance.select.subscribe(item => {
      this.add(item);
    });
  }

  setZone(item: any) {
    switch (item.Type) {
      case 'サイキック・クリーチャー':
      case '進化サイキック・クリーチャー':
      case '進化サイキック・クリーチャー(超無限進化)':
      case 'サイキック・スーパー・クリーチャー':
      case 'ドラグハート・ウエポン':
      case 'ドラグハート・クリーチャー':
      case 'ドラグハート・フォートレス':
        this.zone = 'spatial';
        break;
      case 'GRクリーチャー':
        this.zone = 'gr';
        break;
      default:
        this.zone = 'main';
        break;
    }
  }

  add(item) {
    if (!item) {
      return;
    }
    this.setZone(item);
    const cardName = item.Name;
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

  drop(event: CdkDragDrop<string[]>, list) {
    moveItemInArray(list, event.previousIndex, event.currentIndex);
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
    const requestOptions: {[key: string]: any} = {
      responseType: 'arraybuffer'
    };
    const formData = this.createFormData();
    forkJoin(
      this.http.post(url, formData, requestOptions),
      this.http.post('/api/v1/deck', formData)
    ).subscribe(([res, res2]: any) => {
      const extension = this.platform.ANDROID || this.platform.IOS ? 'png' : 'pdf';
      const file: Blob = new Blob([res], {type: `application/${extension}`});
      const fileURL: string = URL.createObjectURL(file);
      this.safeUrl = this.sanitizer.bypassSecurityTrustUrl(fileURL);
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      alert('エラーが発生しました');
      this.loading = false;
    });
  }

  createFormData() {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('nameKana', this.nameKana);
    formData.append('id', this.dmpId);
    formData.append('mainDeck', this.deckToString(this.main));
    formData.append('hyperSpatial', this.deckToString(this.spatial));
    formData.append('hyperGR', this.deckToString(this.gr));
    formData.append('forbiddenStar', String(this.forbiddenStar));
    formData.append('image', String(this.platform.ANDROID || this.platform.IOS));

    formData.append('teamSheet', String(this.teamSheet));
    formData.append('teamName', this.teamName);
    formData.append('seat', this.seat);

    formData.append('dmgp', String(this.dmgp));
    return formData;
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
    return result.slice(0, -1);
  }
}

/**
  case 'クリーチャー':
  case '進化クリーチャー':
  case '進化クリーチャー(進化V)':
  case '進化クリーチャー(進化GV)':
  case '進化クリーチャー(マナ進化)':
  case '進化クリーチャー(マナ進化V)':
  case '進化クリーチャー(マナ進化GV)':
  case '進化クリーチャー(手札進化)':
  case '進化クリーチャー(手札進化V)':
  case '進化クリーチャー(墓地進化)':
  case '進化クリーチャー(墓地進化GV)':
  case '進化クリーチャー(デッキ進化)':
  case '進化クリーチャー(Mデッキ進化)':
  case '進化クリーチャー(究極進化)':
  case '進化クリーチャー(究極進化MAX)':
  case '進化クリーチャー(超無限進化)':
  case '進化クリーチャー(超無限墓地進化)':
  case '進化クリーチャー(超無限進化・Ω)':
  case 'エグザイル・クリーチャー':
  case '進化エグザイル・クリーチャー':
  case '禁断クリーチャー':
  case '最終禁断クリーチャー':
  case 'NEOクリーチャー':
  case 'D2フィールド':
  case '最終禁断フィールド':
  case '幸せのフィールド':
  case 'DGフィールド':
  case '呪文':
  case 'クロスギア':
  case '進化クロスギア':
  case '城':
  case '禁断の鼓動':
  case 'オレガ・オーラ':
 */
