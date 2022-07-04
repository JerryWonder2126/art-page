import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingBoxComponent } from './landing-page/landing-box/landing-box.component';
import { ContactComponent } from './contact/contact.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { SectionPageComponent } from './section-page/section-page.component';
import { ServiceItemComponent } from './service-item/service-item.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { DetailsPageComponent } from './details-page/details-page.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { AutoFocus } from './helpers/auto-focus.directive';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { ManageOffersComponent } from './admin/forms/offers/manage-offers.component';
import { MainPageComponent } from './admin/main-page/main-page.component';
import { ManageSectionsComponent } from './admin/forms/sections/manage-sections.component';
import { SectionModalComponent } from './admin/modals/section/section-modal.component';
import { OfferModalComponent } from './admin/modals/offer/offer-modal.component';
import { NetworkInterceptor } from './interceptor/network.interceptor';
import { ImageListComponent } from './admin/image-list/image-list.component';
import { AuthComponent } from './admin/auth/auth.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LandingBoxComponent,
    ContactComponent,
    AboutPageComponent,
    SectionPageComponent,
    ServiceItemComponent,
    OrderPageComponent,
    DetailsPageComponent,
    OrderFormComponent,
    AutoFocus,
    NavigationComponent,
    FooterComponent,
    ManageOffersComponent,
    MainPageComponent,
    ManageSectionsComponent,
    SectionModalComponent,
    OfferModalComponent,
    ImageListComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
