import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveEnd, Router, RouterOutlet } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { OneSignalService } from './services/one-signal.service';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { RouteService } from './services/route.service';
import { LoaderService } from './services/loader.service';
import { Modal } from 'bootstrap';
import { SystemConfigService } from './services/system-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'web-client';
  lastScrollTop = 0;
  showScrollToTop = false;
  headerClass = "";
  footerClass = "";
  showLoader = false;
  constructor(
    private titleService:Title,
    private router: Router,
    private renderer: Renderer2,
    private routeService: RouteService,
    private loaderService: LoaderService,
    private oneSignalService: OneSignalService,
    private systemConfigService: SystemConfigService) {
    this.oneSignalService.init();
    this.setupTitleListener();
    this.router.events.subscribe((event) => {
    if (event.constructor.name === 'NavigationStart') {
      this.systemConfigService.init();
    }
  });
  }
  private setupTitleListener() {
    this.loaderService.data$.subscribe((res: { show: boolean}) => {
      if(res.show) {
        this.showLoader = true;
      } else {
        this.showLoader = false;
      }
    });
    this.router.events.pipe(filter(e => e instanceof ResolveEnd)).subscribe((e: any) => {
      const { data } = this.getDeepestChildSnapshot(e.state.root);
      this.routeService.changeData(data);
      if(data?.['title']){
        this.title = data['title'];
        this.headerClass = data['headerClass'];
        this.footerClass = data['footerClass'];
        this.titleService.setTitle(`${this.title} | ${environment.appName}`);
      }
    });
  }


  ngAfterViewInit() {
  }


  getDeepestChildSnapshot(snapshot: ActivatedRouteSnapshot) {
    let deepestChild = snapshot.firstChild;
    while (deepestChild?.firstChild) {
      deepestChild = deepestChild.firstChild
    };
    return deepestChild || snapshot
  }
}
