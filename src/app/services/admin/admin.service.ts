import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// import { OfferInterface, SectionItemInterface } from 'src/app/extra-packs/interfaces/general-interfaces';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
// import { OffersService } from '../offers.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  /** Simply for authentication */

  private _authState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  accessToken!: string;
  // private _services: BehaviorSubject<SectionItemInterface[]> = new BehaviorSubject<SectionItemInterface[]>([]);

  private BASE_URL = environment.baseURL;
  private API_BASE_URL = `${this.BASE_URL}/auth`;
  constructor(private http: HttpClient) {
    this.init();
  }

  init() {
    // Fetch login state, simply check if last session is still active
  }

  get authState() {
    return this._authState.value;
  }

  login() {
    const presentURL = location.href;
    const loginURL = `${this.API_BASE_URL}?callback=${presentURL}`;
    window.open(loginURL);
    
    // window.location.replace(loginURL);
  }

  getAuthState () {
    return this.http.get<any>(`${this.API_BASE_URL}/status?cne=jsdk`).pipe(map((resp: any) => {
      return resp.active;
    }));
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  // get services() {
  //   return this._services.asObservable();
  // }

  // addOffer(form: FormData, section_hash: string): Observable<any> {
  //   return this.offersService.addOffer(form, section_hash);
  // }

  // deleteOffer(uhash: string, section_hash: string): Observable<any> {
  //   return this.offersService.deleteOffer(uhash, section_hash);
  // }

  // updateOffer(form: FormData, section_hash: string) {
  //   return this.offersService.updateOffer(form, section_hash);
  // }

  // updateOfferImages(form: FormData, section_hash: string) {
  //   return this.offersService.updateOfferImages(form, section_hash);
  // }

  // addSection(form: FormData): Observable<any> {
  //   return this.offersService.addSection(form);
  // }

  // updateSectionTitle(body: any) {
  //   return this.offersService.updateSectionTitle(body)
  // }

  // updateSectionImgURL(body: any) {
  //   return this.offersService.updateSectionImgURL(body)
  // }

  // deleteSection(uhash: string): Observable<any> {
  //   return this.offersService.deleteSection(uhash);
  // }

  // getOffersForService(section_hash: string) {
  //   this.offersService.getOffersForService(section_hash)
  // }

}
