import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { tw_config, tw_events, tw_global } from './tw-dt/tw-dt.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  tw_global: tw_global = new tw_global()
  title = 'tw-dt';

  headerss = ['1', '2', '3'];
  selected_order: string = '';

  constructor(private http: HttpClient) {}

  dt_trigger = new Subject<any>();
  dt_trigger2 = new Subject<any>();
  data: any[] = [];
  data2: any[] = [];

  filter(str: string){
    this.tw_global.tw_events.external_filter.next(str)
  }

  ngOnInit(): void {
    this.tw_global.tw_events.action_row.subscribe(res => {
      console.log("event", res);
    })

    this.tw_global.tw_config.actions.view = true
    this.tw_global.tw_config.actions.edit = true
    this.tw_global.tw_config.actions.delete = true
    this.http
      .get('https://jsonplaceholder.typicode.com/users')
      .subscribe((res) => {
        console.log(res);
        this.data = res as any[];
        this.tw_global.tw_events.dt_trigger.next(this.data);
      });
    // this.http
    //   .get('https://jsonplaceholder.typicode.com/posts')
    //   .subscribe((res) => {
    //     console.log(res);
    //     this.data2 = res as any[];
    //     this.dt_trigger2.next(this.data2);
    //   });
  }
}
