import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MainDataInterface, OfferInterface, SectionInnerItemInterface, SectionItemInterface } from '../extra-packs/interfaces/general-interfaces';
import { BackendService } from './backend/backend.service';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  private _offers: BehaviorSubject<OfferInterface[]> = new BehaviorSubject<OfferInterface[]>([]);

  private _services: BehaviorSubject<SectionItemInterface[]> = new BehaviorSubject<SectionItemInterface[]>([]);

  constructor (private backendService: BackendService) {
    this.init();
  }

  init() {
    this.loadServices();
    this.backendService.offers.subscribe(response => {
      this._offers.next(response);
    });
  }

  get offers() {
    return this._offers.asObservable();
  }

  get services() {
    return this._services.asObservable();
  }

  loadServices() {
    this.backendService.sections.subscribe(response => {
      this._services.next(response);
    });
  }

  updateSectionTitle(body: any) {
    return this.backendService.updateSectionTitle(body)
  }

  getOffersForService(section_hash: string) {
    this.backendService.getOffersForService(section_hash);
  }

  getCurrentOffers() {
    return this._offers.getValue();
  }

  addOffer(form: FormData, section_hash: string): Observable<any> {
    return this.backendService.addOffer(form, section_hash).pipe(map(response => {
      const newOffer = response.rows as OfferInterface;
      const updatedOffers = [
        ...this._offers.getValue(),
        newOffer
      ]
      this._offers.next(updatedOffers);
      return newOffer;
    }));;
  }

  updateOffer(offer: OfferInterface) {
    return this.backendService.updateOffer(offer)
  }

  deleteOffer(uhash: string, section_hash: string) {
    return this.backendService.deleteOffer(uhash, section_hash).pipe(map(response => {
      return 'deleted succesfully';
    }));
  }

  getServiceTitleFromHash(uhash: string) {
    return this.services.pipe(map(response => {
      const foundItem = response.find((value) => value.uhash === uhash);
      console.log(foundItem);
      return foundItem ? foundItem.title : '';
    }));
  }

  addSection(body: any) {
    return this.backendService.addSection(body);
  }

  deleteSection(uhash: string) {
    return this.backendService.deleteSection(uhash).pipe(map(response => {
      return 'deleted succesfully';
    }));
  }

  getOfferTitleFromHash(uhash: string) {
    return this.offers.pipe(map(response => {
      const foundItem = response.find((value) => value.uhash === uhash);
      console.log(foundItem);
      return foundItem ? foundItem.title : '';
    }));
  }

  getOffer(offer_hash: string) {
    return this._offers.getValue().find((value) => value.uhash === offer_hash);
  }

}
