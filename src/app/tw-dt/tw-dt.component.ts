import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

export class pagination {
  current_index: number = 1;
  number_of_pages: number = 0;
  total_elements: number = 0;
  element_per_page: number = 5;
  pages_array: number[] = [];
}

export class actions {
  view: boolean = false;
  edit: boolean = false;
  delete: boolean = false;
}

export class tw_action_event {
  row: any = undefined;
  event: string = '';

  constructor(row: any, event: string) {
    this.row = row;
    this.event = event;
  }
}

export class tw_config {
  table_title: string = 'Table';
  actions: actions = new actions();
  headers: string[] = [];
}

export class tw_events {
  clicked_row = new EventEmitter<any>();
  action_row = new EventEmitter<tw_action_event>();
  dt_trigger = new Subject<any>();
  external_filter = new Subject<any>();
}

export class tw_global {
  tw_config: tw_config = new tw_config();
  tw_events: tw_events = new tw_events();
}

@Component({
  selector: 'app-tw-dt',
  templateUrl: './tw-dt.component.html',
  styleUrls: ['./tw-dt.component.css'],
})
export class TwDtComponent implements OnInit {
  @Input() tw_global: tw_global = new tw_global();

  public data: any[] = [];
  public c_data: any[] = [];

  epps: number[] = [5, 10, 20, 50, 100, 500, 1000]; //Element per page 's' (epp)
  selected_epp: number = 5;
  pagination: pagination = new pagination();

  id: string = this.makeid(9);

  selected_order: string = 'Select an order';

  constructor() {}

  ngOnInit(): void {

    this.tw_global.tw_events.external_filter.subscribe(res => {
      this.flt = res
      this.filter()
    })

    this.tw_global.tw_events.dt_trigger.subscribe((res) => {
      this.data = res;
      this.c_data = res;
      this.setup_headers();
      this.init_pagination();
      this.filter();
    });
  }

  send_event_row(row: any, action: string) {
    this.tw_global.tw_events.action_row.emit(new tw_action_event(row, action));
  }

  PaginatorSearch(page: number, data = JSON.parse(JSON.stringify(this.data))) {
    page -= 1;
    if (page < 0) {
      this.pagination.current_index = 1;
      page = 0;
    }

    if (page >= this.pagination.number_of_pages) {
      this.pagination.current_index = this.pagination.number_of_pages;
      page -= 1;
    }

    this.pagination.pages_array = [];
    for (let index = 0; index < this.pagination.number_of_pages; index++) {
      this.pagination.pages_array.push(index + 1);
    }

    // console.log('page', page);
    // console.log('this.pagination.number_of_pages', this.pagination.number_of_pages);
    // this.c_data = this.c_data.splice(this.pagination.current_index, this.pagination.element_per_page)

    this.data.sort((a, b) => this.sort_function(a, b, this.selected_order));

    this.c_data = data.slice(
      page * this.pagination.element_per_page,
      (page + 1) * this.pagination.element_per_page
    );
    // console.log("this.c_data", this.c_data);

    this.init_pagination(this.data);
  }

  init_pagination(data = JSON.parse(JSON.stringify(this.c_data))) {
    this.pagination.total_elements = data.length;
    this.pagination.number_of_pages = Math.ceil(
      this.pagination.total_elements / this.pagination.element_per_page
    );
    // console.log("pagination", this.pagination)
    // this.PaginatorSearch(0)
  }

  page_plus() {
    this.pagination.current_index += 1;
    this.PaginatorSearch(this.pagination.current_index);
    // this.init_pagination()
  }

  page_minus() {
    this.pagination.current_index -= 1;
    this.PaginatorSearch(this.pagination.current_index);
    // this.init_pagination()
  }

  flt: string = '';
  async filter(filter: string = this.flt) {
    filter.toLowerCase();
    this.c_data = this.filterByValue(this.data, filter);
    this.order_by(this.selected_order);
    this.init_pagination(this.c_data);
    this.PaginatorSearch(0, this.c_data);
  }

  sort_function: any = function (a: any, b: any, key: any) {
    // console.log("!(isNaN(a[key]) && isNaN(b[key]))", !(isNaN(a[key]) && isNaN(b[key])));
    if (!(isNaN(a[key]) && isNaN(b[key]))) {
      if (a[key] > b[key]) {
        return 1;
      } else {
        return -1;
      }
    }
    if (a[key].toString().toLowerCase() > b[key].toString().toLowerCase()) {
      return 1;
    } else {
      return -1;
    }
  };

  order_by(key: string = this.selected_order, data: any[] = []): any[] {
    // console.log("id", this.id);
    // Object.keys(this.c_data).sort().map(key=>this.c_data[key])
    // this.c_data = this.data
    if (data.length != 0) {
      return data.sort((a, b) => this.sort_function(a, b, key));
    }

    return this.c_data.sort((a, b) => this.sort_function(a, b, key));
    // console.log("key", key);
  }

  filterByValue(array: any[], string: string) {
    return array.filter((o) =>
      Object.keys(o).some((k) =>
        o[k].toString().toLowerCase().includes(string.toLowerCase())
      )
    );
  }

  setup_headers() {
    if (this.tw_global.tw_config.headers.length == 0) {
      this.tw_global.tw_config.headers = [];
      for (let key in this.data[0]) {
        this.tw_global.tw_config.headers.push(key);
      }
      this.tw_global.tw_config.headers.sort(function (a, b) {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
    }
    this.selected_order = this.tw_global.tw_config.headers[0];
    this.c_data = this.order_by(this.selected_order);
  }

  makeid(length: number): string {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
