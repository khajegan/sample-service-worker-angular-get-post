import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable()
export class Service {
  constructor(private http: HttpClient) {
  }

  testPerform() {
    return this.http.get('https://httpbin.org/get').pipe(map(res => res));
  }

  testFreshness() {
    // return this.http.get('https://httpbin.org/get').pipe(map(res=>res));
    // return this.http.get('https://jsonplaceholder.typicode.com/albums').pipe(map(res=>res));
    return this.http.get('http://localhost:8082/url').pipe(map(res => res));
  }

  testPost(number1: number, number2: number) {
    return this.http.post('http://localhost:8082/url', JSON.stringify({num1: number1, num2: number2}), {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json',
      observe: 'response'
    }).pipe(map(res => res));
  }
}
