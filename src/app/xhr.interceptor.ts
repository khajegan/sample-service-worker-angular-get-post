import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {catchError, Observable, of, throwError} from "rxjs";
import Dexie from "dexie";

@Injectable()
export class XhrInterceptor implements HttpInterceptor {
  xhrRequest?: {
    url: string,
    method: string,
    payload: any
  };
  statusCodes = [0, 504];
  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
      return next.handle(req).pipe(
        catchError(error => {
          if (this.statusCodes.includes(error.status)) {
            var db = new Dexie('db_test');
            db.version(1).stores({
              xhrRequests: '++id,url,payload,method'
            });
            // @ts-ignore
            const addedBefore = db.xhrRequests.where({url: req.url, payload: req.body, method: req.method}).toArray();
            addedBefore.then((result: any) => {
              if (result.length === 0) {
                // @ts-ignore
                db.xhrRequests.add({
                  url: req.url,
                  payload: req.body,
                  method: req.method
                });
                console.log('Saved to IndexedDB');
              } else {
                console.log('Duplicate Record');
              }
            });
            return of(new HttpResponse({
              status: 208,
              body: 'Handled by IndexedDB',
              statusText: 'IndexedDB',
              url: req.url,
              headers: req.headers
            }));
          } else {
            return of(new HttpResponse({
              status: error.status,
              body: error.message,
              statusText: error.statusText,
              url: error.url,
              headers: error.headers
            }))
          }
          // return throwError(()=> new HttpResponse({status: 200, body: 'Saved to IndexedDB', statusText:'IndexedDB', url: this.postRequest?.url}));
        }));
    }
    return next.handle(req);
  }
}
