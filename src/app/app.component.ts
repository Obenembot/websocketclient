import {Component} from '@angular/core';

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


  getCarInfo(): Promise<CarInfo> {
    return fetch('/api/car',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          make: 'BMW',
          model: 'M3',
        })
      })
      .then((res: Response) => {
        if (!res.ok) throw new Error('Bad response');
        return res.json(); // parses response body as JSON
      })
      .catch(err => {
        alert('ERROR: ' + err.message); // shows user-friendly error
        throw err; // rethrows the error for further handling
      });
  }

  async getCarInfos(): Promise<CarInfo> {
    try {
      const res: Response = await fetch('/api/car', {method: 'GET'});
      if (!res.ok) throw new Error('Bad response');
      return await res.json();
    } catch (err: any) {
      alert('ERROR: ' + err.message);
      throw err;
    }
  }


}

interface CarInfo {
  id: number;
  model: string;
  isElectric: boolean;
}
