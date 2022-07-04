import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BackendResponseInterface, OfferInterface, SectionItemInterface } from 'src/app/extra-packs/interfaces/general-interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private BASE_URL = environment.baseURL;
  private SECTIONS_URL = `${this.BASE_URL}/sections/`;
  private OFFERS_URL = `${this.BASE_URL}/offers/`;
  private API_BASE_URL = `${this.BASE_URL}/auth`;

  private _sections: BehaviorSubject<SectionItemInterface[]> = new BehaviorSubject<SectionItemInterface[]>([]);

  private _offers: BehaviorSubject<OfferInterface[]> = new BehaviorSubject<OfferInterface[]>([]);

  get sections() {
    return this._sections.asObservable();
  }

  get offers() {
    return this._offers.asObservable();
  }

  constructor(private http: HttpClient, private router: Router) {
    this.loadAllSections();
  }

  private loadAllSections() {
    this.http.get<BackendResponseInterface>(this.SECTIONS_URL, {observe: 'body', responseType: 'json'}).subscribe((response) => {
      if(!response.error) {
        this._sections.next(response.rows.reverse());
        // this._sections.next([]);
      }
    });
  }

  addSection(body: any) {
    const options = this._getRequestOptions();
    if (options) {
      return this.http.post<BackendResponseInterface>(this.SECTIONS_URL, body, options).pipe(
        map(response => {
        if(!response.body?.error) {
          this.loadAllSections();
        }
        return response.body?.rows;
      }));
    }
    return ;
  }

  private _updateSection(type: string, body: any) {
    const options = this._getRequestOptions();
    if (options) {
      return this.http.put<BackendResponseInterface>(`${this.SECTIONS_URL}?type=${type}`, body, options).pipe(map(resp => {
        this.loadAllSections();
        return resp.body?.rows;
      }));
    }
    return ;
  }

  updateSectionTitle(body: any) {
    return this._updateSection('title', body);
  }

  updateSectionImgURL(body: any) {
    return this._updateSection('imgurl', body);
  }

  deleteSection(uhash: string) {
    const options = this._getRequestOptions();
    if (options) {
      return this.http.delete<BackendResponseInterface>(`${this.SECTIONS_URL}?section_hash=${uhash}`, options).pipe(map(res => {
        this.loadAllSections();
        return res.body;
      }));;
    }
    return ;
  }

  // Manage Offers
  addOffer(fd: FormData, section_hash: string) {
    const options = this._getRequestOptions();
    if (options) {
      return this.http.post<BackendResponseInterface>(this.OFFERS_URL, fd, options).pipe(map(res => {
        this.getOffersForService(section_hash);
        return res.body;
      }));
    }
    return ;
  }

  updateOfferText(fd: FormData, section_hash: string) {
    const options = this._getRequestOptions();
    if (options) {
      return this.http.put<BackendResponseInterface>(`${this.OFFERS_URL}?type=text`, fd, options).pipe(map(resp => {
        this.getOffersForService(section_hash);
        return resp.body?.rows;
      }));
    }
    return ;
  }

  updateOfferImages(fd: FormData, section_hash: string) {
    const options = this._getRequestOptions();
    if (options) {
      return this.http.put<BackendResponseInterface>(`${this.OFFERS_URL}?type=imgurl`, fd, options).pipe(map(resp => {
        this.getOffersForService(section_hash);
        return resp.body?.rows;
      }));
    }
    return ;
  }

  // updateOfferImages(form: FormData, section_hash: string) {
  //   return this.http.put<BackendResponseInterface>(this.OFFERS_URL+'kl', form).pipe(map(resp => {
  //     this.getOffersForService(section_hash);
  //     return resp.rows;
  //   }));;
  // }

  deleteOffer(uhash: string, section_hash: string) {
    const options = this._getRequestOptions();
    if (options) {
      return this.http.delete<BackendResponseInterface>(`${this.OFFERS_URL}?offer_hash=${uhash}`, options).pipe(map(res => {
        this.getOffersForService(section_hash);
        return res.body;
      }));
    }
    return ;
  }
  
  parseOffers(offers: any[]) {
    //Simply to convert price to a number and remove symbol added to it by postgres
    return offers.map(value => {
      value.price = value.price.substring(1);
      value.price = value.price.replaceAll(',', '');
      return value as OfferInterface;
    });
  }

  getOffersForService(service_hash:string) {
    const getOffer$ = this.http.get<BackendResponseInterface>(`${this.OFFERS_URL}?section=${service_hash}`);
    getOffer$.subscribe(response => {
      this._offers.next(this.parseOffers(response.rows.reverse()));
      // this._offers.next([]);
    });
  }

  getOfferByHash(offer_hash: string) {
    const getOffer$ = this.http.get<BackendResponseInterface>(`${this.OFFERS_URL}?uhash=${offer_hash}`);
    return getOffer$.pipe(map(response => this.parseOffers(response.rows)[0] as OfferInterface));
  }

  getLatestOffers() {
    const getOffer$ = this.http.get<BackendResponseInterface>(`${this.OFFERS_URL}?latest=${true}`);
    return getOffer$.pipe(map(response => this.parseOffers(response.rows) as OfferInterface[]));
  }

  getConnectLink(type: string, form: FormData) {
    return this.http.post<BackendResponseInterface>(`${this.BASE_URL}social/?type=${type}`, form).pipe(map(response => response.rows));
  }

  login() {
    const presentURL = location.href;
    const loginURL = `${this.API_BASE_URL}/?callback=${presentURL}`;
    window.open(loginURL);
  }

  logout(next='/') {
    sessionStorage.removeItem('authenticated');
    sessionStorage.removeItem('token');
    const url = `${next}`;
    this.router.navigateByUrl(url);
  }

  setAccessToken(token: string) {
    sessionStorage.setItem('authenticated', 'true');
    sessionStorage.setItem('token', token);
  }

  private _getRequestOptions() {
    const loggedIn = sessionStorage.getItem('authenticated');
    const token = sessionStorage.getItem('token');
    if (!loggedIn && !token) {
      this.router.navigateByUrl('auth');
      return false;
    }
    return {
      headers: {
        'X-ACCESS-TOKEN': token || '' as const,
      },
      observe: 'response' as const,
      responseType: 'json' as const
    };
  }
 
}
