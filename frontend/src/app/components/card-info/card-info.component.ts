import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation
} from '@angular/core';

@Component({
    selector: 'app-components-card-info',
    templateUrl: './card-info.component.html',
    styleUrls: ['./card-info.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponentsCardInfoComponent {

    @Input() card: CardInfo;
    @Output() remove: EventEmitter<any> = new EventEmitter();
    @Output() change: EventEmitter<number> = new EventEmitter();

    plus() {
        if (this.card.num < 40) {
            this.card.num++;
            this.change.emit(1);
        }
    }

    minus() {
        if (0 < this.card.num) {
            this.card.num--;
            this.change.emit(-1);
        }
        if (this.card.num === 0) {
            this.remove.emit();
        }
    }
}
