import {Component} from '@angular/core';
import {Service} from "./service";
import {OnlineService} from "./online.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private service: Service,
              private onlineService: OnlineService) {
  }

  testPerform() {
    this.service.testPerform().subscribe(x => console.log(x));
  }

  testFreshness() {
    this.service.testFreshness().subscribe(x => console.log(x));
  }

  testPost(num1: String, num2: String) {
    this.service.testPost(Number(num1),Number(num2)).subscribe(x => {
      console.log(x.body);
    }, err => {
      console.log(err);
    });
  }

}
