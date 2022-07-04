import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader/loader.service';
import { Router } from '@angular/router';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {

  completedRequest = 0;
  totalRequest = 0;

  constructor(private loader: LoaderService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loader.show();
    this.totalRequest++;
    return next.handle(request)
    .pipe(finalize(() => {
      this.completedRequest++;
      if (this.completedRequest === this.totalRequest) {
        this.loader.hide();
        this.completedRequest = 0;
        this.totalRequest = 0;
      }
    }), catchError((err: any, caught: Observable<any>) => {
      if (!(err.error instanceof ErrorEvent)) {
        if (err.status == 401) {
          sessionStorage.removeItem('authenticated');
          sessionStorage.removeItem('token');
          this.router.navigateByUrl('auth');
        }
      }
      return [];
    }));
  }
}
