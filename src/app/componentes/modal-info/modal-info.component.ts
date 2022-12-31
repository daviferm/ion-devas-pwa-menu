import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
})
export class ModalInfoComponent implements OnInit {

  @Input() pageActive: string;
  @Input() modalOpen: boolean;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  ionModalDidDismiss( e ) {
    if ( e ) {
      this.closeModal.emit( true );
    }
  }

}
