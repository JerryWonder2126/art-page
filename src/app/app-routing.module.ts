import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './about-page/about-page.component';
import { AuthComponent } from './admin/auth/auth.component';
import { MainPageComponent } from './admin/main-page/main-page.component';
import { ContactComponent } from './contact/contact.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { SectionPageComponent } from './section-page/section-page.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: LandingPageComponent},
  {path: 'about', component: AboutPageComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'section', component: SectionPageComponent},
  {path: 'order', component: OrderPageComponent},
  {path: 'admin', component: MainPageComponent},
  {path: 'auth', component: AuthComponent},
  {path: '**', redirectTo: 'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
