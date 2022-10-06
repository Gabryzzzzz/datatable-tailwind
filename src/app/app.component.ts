import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tw-dt';

  headerss = ["1", "2", "3"]
  selected_order: string = ""

  constructor(private http: HttpClient) { }

  dt_trigger = new Subject<any>()
  dt_trigger2 = new Subject<any>()
  data: any[] = []
  data2: any[] = []

  ngOnInit(): void {

    this.http.get("https://jsonplaceholder.typicode.com/users").subscribe(res => {
      console.log(res);
      this.data = res as any[]
      this.dt_trigger.next(this.data)
    })
    this.http.get("https://jsonplaceholder.typicode.com/posts").subscribe(res => {
      console.log(res);
      this.data2 = res as any[]
      this.dt_trigger2.next(this.data2)
    })

  }

}
