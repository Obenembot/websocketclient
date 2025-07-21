import { Component } from '@angular/core';

import {CompatClient, Stomp} from "@stomp/stompjs";
// @ts-ignore
import * as SockJS from 'sockjs-client';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular8-springboot-websocket';

  greeting: any;

  ngOnInit() {
    this.connect();
  }


  stompClient: CompatClient | any;
  private stompClientSubscription: Subscription = new Subscription();

  connect(): void {
    const socket = new SockJS('http://localhost:8081/ws');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame: { command: string; }) => {
      if (frame.command === 'CONNECTED') {
         let topic = "/topic/greetings";
        this.stompClientSubscription = this.stompClient.subscribe(topic, (alertJSON: any) => {
          const alert = JSON.parse(alertJSON.body);
          this.greeting = alert.name;
          console.log('message from web socket', alert)
        });
      }
    });
  }

}
