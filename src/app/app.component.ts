import {Component, OnInit} from '@angular/core';
import {Service} from "./service";
import {OnlineService} from "./online.service";
import {SwUpdate} from "@angular/service-worker";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private service: Service,
              private swUpdate: SwUpdate,
              private onlineService: OnlineService) {
  }

  ngOnInit(): void {
    navigator.serviceWorker.controller?.postMessage('message from component to sw');
    navigator.serviceWorker.addEventListener("message", (event)=>{
      console.log(event.data);
    })
  }

  // updateClient() {
  //   if (!this.swUpdate.isEnabled) {
  //     console.log('not enabled');
  //     return;
  //   }
  //   this.swUpdate.available.subscribe((event) => {
  //     console.log('current', event.current, 'available', event.available);
  //   });
  // }

  testPerform() {
    this.service.testPerform().subscribe(x => console.log(x));
  }

  testFreshness() {
    this.service.testFreshness().subscribe(x => console.log(x));
  }

  testPost(num1: String, num2: String) {
    this.service.testPost(Number(num1), Number(num2)).subscribe(x => {
      console.log(x.body);
      // this.updateClient();
    }, err => {
      console.log(err);
    });
  }

}
