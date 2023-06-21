import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OnlineService {
  isOnline = new BehaviorSubject<boolean>(window.navigator.onLine);

  constructor() {
    this.listenToOnlineStatus();
  }

  private listenToOnlineStatus() {
    window.addEventListener('online', () => {
      this.isOnline.next(true);
      console.log('online');
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        // @ts-ignore
        navigator.serviceWorker.ready.then(swRegistration => swRegistration.sync.register('post-data')).catch(console.log);
      }
    });
    window.addEventListener('offline', () => {
      this.isOnline.next(false);
      console.log('offline');
    });
  }
}
