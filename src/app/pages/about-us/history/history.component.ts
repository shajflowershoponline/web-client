import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
  title
  constructor(private readonly route: ActivatedRoute) {
    this.title = this.route.snapshot.data["title"];
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if(this.title === 'History') {
      document.querySelector("header").classList.add("hidden");
      document.querySelector("footer").classList.add("hidden");
    }
  }
}
