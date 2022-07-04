import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'art-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  loggedIn!: boolean;
  

  constructor(
    private authService: BackendService, 
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit(): void {
    this.loggedIn = Boolean(sessionStorage.getItem('authenticated'));
    this.route.queryParamMap.subscribe(param => {
      if (this.loggedIn) {
        const next = param.get('next');
        const callback = next ? next : '/admin';
        this.router.navigateByUrl(callback);
      } else {
        const token = param.get('access-token');
        if (token) {
          this.authService.setAccessToken(token);
          this.router.navigateByUrl('admin');
        }
      }
    });

  }

  handleLoginState() {
    if (this.loggedIn) {
      // process logout
    } else {
      // process login
      this.authService.login();
    }
  }

}
