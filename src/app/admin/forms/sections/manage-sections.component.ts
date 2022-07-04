import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { IUpdateObject, SectionItemInterface } from 'src/app/extra-packs/interfaces/general-interfaces';
import { BackendService } from 'src/app/services/backend/backend.service';
// import { AdminService } from 'src/app/services/admin/admin.service';
import { OffersService } from 'src/app/services/offers.service';
import {validate as uuidValidate} from 'uuid';

@Component({
  selector: 'art-manage-sections',
  templateUrl: './manage-sections.component.html',
  styleUrls: ['./manage-sections.component.scss']
})
export class ManageSectionsComponent implements OnInit {

  fd: FormData = new FormData();
  keys = ['title'];
  @Output() formActionComplete: EventEmitter<any> = new EventEmitter<any>();
  @Input() service!: SectionItemInterface;
  @Input() update!: boolean;
  btnText!: string;
  imageName = '';

  constructor(private adminService: BackendService) {}

  ngOnInit(): void {
    this.btnText = this.update ? 'update' : 'add';
    if(!this.service) {
      this.service = {
        id: '',
        title: '',
        imgurl: '',
        uhash: ''
      }
    }
  }
  
  processAddForm(form: NgForm) {
    if (form.valid) {
      if (!this.update) {
        this.addSection(form);
      } else {
        this.updateSection(form);
      }  
    }
  }

  addSection(form: NgForm) {
    this.fd.set('title', form.value['title']);
    const upload$ = this.adminService.addSection(this.fd);
    upload$?.subscribe(response => {
      form.reset();
      this.fd.forEach((value, key) => {
        this.fd.delete(key);
      });
      this.formActionComplete.emit();
    });
  }

  updateSection(form: NgForm) {
    const updateObj = {uhash: this.service.uhash, value: '', type: 'title'}
    this.keys.forEach(key => {
      if (form.form.controls[key].touched) {
        updateObj.value = form.form.controls[key].value;
      }
    });
    this.adminService.updateSectionTitle(updateObj)?.subscribe(resp => {
      this.formActionComplete.emit();
    });
  }

  processImage(imageField: any) {
    this.fd.set('image', imageField.files[0]);
    this.imageName = imageField.files[0].name;
  }

  updateImage(form: NgForm) {
    this.fd.set('uhash', this.service.uhash);
    this.fd.set('value', this.service.imgurl);
    this.fd.set('type', 'imgurl');
    this.adminService.updateSectionImgURL(this.fd)?.subscribe(resp => {
      form.reset();
      this.fd.forEach((value, key) => {
        this.fd.delete(key);
      });
      this.formActionComplete.emit();
    });
  }

  toList(val: any){
    return [val];
  }

}
