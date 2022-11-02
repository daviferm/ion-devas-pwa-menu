import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ListaInteface } from '../../interfaces/markers.interface';
import { IonButton, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-upload-img',
  templateUrl: './upload-img.component.html',
  styleUrls: ['./upload-img.component.scss'],
})
export class UploadImgComponent implements OnInit {

  @ViewChild('botomImg') botomImg: ElementRef;
  @ViewChild('mdlUpload') mdlUpload: ElementRef;

  @Input() Tarea: ListaInteface;
  @Input() idxItem: number;
  @Output() cerrarModalUpload: EventEmitter<ListaInteface> = new EventEmitter<ListaInteface>();
  @Output() actualizarStorage: EventEmitter<ListaInteface> = new EventEmitter<ListaInteface>();
  imagen: any;
  botomGuardar: IonButton;

  constructor( private renderer: Renderer2,
               private animationCtrl: AnimationController ) { }

  ngOnInit() {
    this.imagen = this.Tarea.items[this.idxItem].urlImg;

    setTimeout( () => {
      this.botomGuardar = this.botomImg.nativeElement.firstChild;
    }, 100 )
  }

  onFileChanged( file ) {
    if ( file ) {
      this.renderer.setAttribute( this.botomGuardar, 'disabled', 'false' );
      this.imagen = file[0].base64;
    }
  }

  guardarImagen() {
    
    if ( this.imagen ) {
      this.Tarea.items[this.idxItem].urlImg = this.imagen;
      const modalUpload = this.animationCtrl.create()
        .addElement( this.mdlUpload.nativeElement )
        .duration(400)
        .fill('forwards')
        .fromTo('opacity', 1, 0)

      modalUpload.play();

      setTimeout( () => {
        this.cerrarModalUpload.emit( this.Tarea );
      }, 400);
    }
  }

  eliminarImg() {
    this.Tarea.items[this.idxItem].urlImg = null;
    this.imagen = null;
  }

  cerrarModal( e, close?: boolean ) {

    if ( e.target.className.includes('fondo-negro') || close ) {

      const modalUpload = this.animationCtrl.create()
        .addElement( this.mdlUpload.nativeElement )
        .duration(400)
        .fill('forwards')
        .fromTo('opacity', 1, 0)

      modalUpload.play();

      setTimeout( () => {
        this.cerrarModalUpload.emit( this.Tarea );
      }, 400);
    }
  }


}
