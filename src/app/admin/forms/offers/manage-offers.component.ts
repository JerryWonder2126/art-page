import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { IUpdateObject, OfferInterface, SectionItemInterface } from 'src/app/extra-packs/interfaces/general-interfaces';
import { BackendService } from 'src/app/services/backend/backend.service';
// import { AdminService } from 'src/app/services/admin/admin.service';
import { OffersService } from 'src/app/services/offers.service';

@Component({
  selector: 'art-manage-offers',
  templateUrl: './manage-offers.component.html',
  styleUrls: ['./manage-offers.component.scss']
})
export class ManageOffersComponent implements OnInit {

  @Input() offer!: OfferInterface;
  @Input() update: boolean = false;
  @Input() section_hash!: string;
  @Output() formActionComplete: EventEmitter<any> = new EventEmitter<any>();
  services!: Observable<SectionItemInterface[]>;
  imageNames: string[] = [];

  keys: string[] = ['title', 'short_description', 'long_description', 'price', 'section_hash'];

  fd: FormData = new FormData();
  btnText!: string;
  
  constructor(private adminService: BackendService) { }

  ngOnInit(): void {
    this.services = this.adminService.sections;
    this.btnText = this.update ? 'update' : 'add';
    if (!this.offer) {
      this.offer = {
        title: '',
        short_description: '',
        long_description: '',
        imgurl: [],
        price: 10000,
        section_hash: this.section_hash || '',
        status: 'on sale',
        year: new Date().getFullYear()
      };
    }
    this.imageNames = this.offer.imgurl;
    console.log(this.offer);
  }

  processForm(form: NgForm) {
    if (form.valid) {
      if (!this.update) {
        this.saveOffer(form);
      } else {
        this.updateOffer(form);
      }
    }
  }

  saveOffer(form: NgForm) {
    this.fd.set('data', JSON.stringify(this.offer));
    this.adminService.addOffer(this.fd, this.section_hash)?.subscribe(response => {
      form.reset();
      this.formActionComplete.emit();
    });
  }

  updateOffer(form: NgForm) {
    this.fd.set('data', JSON.stringify(this.offer));
    this.adminService.updateOfferText(this.fd, this.offer.section_hash)?.subscribe(resp => {
      form.reset();
      this.formActionComplete.emit();
    });
  }

  processImage(image: HTMLInputElement) {
    const files = image.files as FileList;
    for(let x=0; x<files.length; x++){
      this.fd.set(`image_${x}`, files[x]);
    }
  }

  updateImage(form: NgForm) {
    if(this.offer.uhash) {
      const data = {
        uhash: this.offer.uhash,
        value: this.offer.imgurl
      };
      this.fd.set('data', JSON.stringify(data));
      this.adminService.updateOfferImages(this.fd, this.offer.section_hash)?.subscribe(resp => {
        form.reset();
        this.formActionComplete.emit();
      });
    }
  }

  deleteImage(url: FormData) {
    const data = JSON.parse(url.get('data') as string);
    data.uhash = this.offer.uhash;
    url.set('data', JSON.stringify(data));
    this.adminService.updateOfferImages(url, this.offer.section_hash)?.subscribe(resp => {
      this.offer.imgurl = data.updateWith;
    });
  }

}
