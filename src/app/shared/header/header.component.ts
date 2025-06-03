import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CommonModule } from '@angular/common';
import { CartService } from 'src/app/services/cart.service';
import { AiSearchService } from 'src/app/services/ai-search.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { CustomerUser } from 'src/app/model/customer-user';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  currentUser: CustomerUser;
  @Input() headerClass: string;
  promptPlaceholder = [];
  isOpenOffCanvas = false;
  cartCount = 0;
  searchPlaceholder = "Type something like: 'Find calming flower colors for a bedroom'...";
  searchType: "KEYWORD" | "AI" = "KEYWORD"

  searchKeyword = null;
  showSearchBar = false;
  animateCartCount = false;
  constructor(
    private readonly cartService: CartService,
    private readonly aiSearchService: AiSearchService,
    private readonly productService: ProductService,
    private readonly storageService: StorageService,
    private router: Router, private route: ActivatedRoute
  ) {
    this.currentUser = this.storageService.getCurrentUser();
    this.aiSearchService.init();
    this.aiSearchService.prompts$.subscribe(prompts => {
      this.promptPlaceholder = prompts;
      this.setRandomPrompt();
    });
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        // Option 1: Simple URL string
        if (document.querySelector("#mobileMenu")) {
          document.querySelector("#mobileMenu").classList.remove("open");
          document.body.classList.remove("fix");
        }
        const url = event.urlAfterRedirects;
        if (!(url.includes("/ai-search") || url.includes("/search"))) {
          this.searchKeyword = null;
          this.showSearchBar = false;
        } else {
          this.showSearchBar = true;
        }
      });
    this.productService.search$.subscribe(res => {
      this.searchKeyword = res ?? "";
    });
  }

  get isShopPage() {
    const currentUrl = this.router?.url ?? "";
    return currentUrl.startsWith("/ai-search") || currentUrl.startsWith('/search') || currentUrl.startsWith('/categories') || currentUrl.startsWith('/collections');
  }

  get isSearchPage() {
    const currentUrl = this.router?.url ?? "";
    return currentUrl.startsWith("/ai-search") || currentUrl.startsWith('/search');
  }

  get isAuthenticated() {
    return this.currentUser && this.currentUser?.customerUserCode;
  }

  triggerCartAnimation() {
    this.animateCartCount = false;
    setTimeout(() => this.animateCartCount = true, 10); // retrigger animation
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
      this.triggerCartAnimation();
    });
  }

  setRandomPrompt() {
    const randomIndex = Math.floor(Math.random() * this.promptPlaceholder.length);
    this.searchPlaceholder = `💡 ${this.promptPlaceholder[randomIndex]}`;
  }

  ngAfterViewInit() {
    document.querySelectorAll('.menu-item-has-children > a').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const parent = link.parentElement;
        parent.classList.toggle('open');
        const dropdown = parent.querySelector('.dropdown');
        if (dropdown) dropdown.classList.toggle('show');
      });
    });

    const target = document.querySelector('.main-header');

    if (target) {
      let prevClass = [];
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            const classList = Array.from((mutation.target as HTMLElement).classList);;
            // Trigger your custom logic here
            if (!((this.router?.url ?? "").startsWith("/ai-search") || (this.router?.url ?? "").startsWith('/search'))) {
              if (this.showSearchBar && !prevClass.includes('sticky') && classList.some(x => x === 'sticky')) {
                this.showSearchBar = false;
              }
            }
            prevClass = classList;
          }
        });
      });

      observer.observe(target, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }
  }

  onSearchToggleClick() {
    this.showSearchBar = this.isSearchPage ? this.isSearchPage : !this.showSearchBar;
    if (((this.router?.url ?? "").startsWith("/ai-search") || (this.router?.url ?? "").startsWith('/search'))) {
      this.scrollToTopAndFocus();
    }
  }

  scrollToTopAndFocus(): void {
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Delay to wait for scroll animation
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>(".ai-search-area input");
      if (input) {
        input.focus();

        // Optionally trigger 'touched' logic (especially useful with Angular forms)
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('blur')); // Simulate user interaction if needed
      }
    }, 800); // Adjust delay to match scroll duration (e.g., 500-1000 ms)
  }

  autoResizeSearch(event: Event) {
    this.setRandomPrompt();
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // reset first
    textarea.style.height = `${textarea.scrollHeight}px`; // then set new height
  }


  submitSearch() {
    const trimmed = this.searchKeyword.trim();
    if (this.searchType === "AI") {
      // this.router.navigate([], {
      //   queryParams: { q: trimmed },
      //   queryParamsHandling: 'merge', // Keep other params if needed
      // });
    } else {
      this.router.navigate(['/search'], {
        queryParams: { q: trimmed },
        queryParamsHandling: 'merge', // Keep other params if needed
      });
    }
    this.productService.setSearch(trimmed);
    this.scrollToTopAndFocus();
  }

  onMobileMenuClick() {
    if (document.querySelector("#mobileMenu")) {
      document.querySelector("#mobileMenu").classList.toggle("open");
      document.body.classList.toggle("fix");
    }
  }
}
