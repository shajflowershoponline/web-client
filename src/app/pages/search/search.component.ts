import { QuickProductViewModalComponent } from 'src/app/shared/quick-product-view-modal/quick-product-view-modal.component';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Category } from 'src/app/model/category';
import { Collection } from 'src/app/model/collection';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { CustomerUser } from 'src/app/model/customer-user';
import { StorageService } from 'src/app/services/storage.service';
import { MODAL_TYPE, ModalService } from 'src/app/services/modal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerUserWishlistService } from 'src/app/services/customer-user-wish-list.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  currentUser: CustomerUser;
  viewMode: "GRID" | "LIST" = "GRID";
  searchKeyword: any;
  products: Product[] = [];
  categories: Category[] = [];
  collections: Collection[] = [];
  colors: { name: string; count: number }[] = [];
  pageIndex = 0;
  pageSize = 12;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];
  order: any = { sku: "DESC" };
  filter: {
    apiNotation: string;
    filter?: any;
    name?: string;
    type?: string;
  }[] = [];

  sortBy = new FormControl(2);

  error: string;
  cartCount = 0;
  @ViewChild('quickView') quickView!: QuickProductViewModalComponent;

  isLoading = false;
  constructor(
    private storageService: StorageService,
    private readonly productService: ProductService,
    private readonly customerUserWishlistService: CustomerUserWishlistService,
    private modalService: ModalService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private readonly cartService: CartService) {
    this.route.queryParamMap.subscribe(params => {
      const searchQuery = params.get('q');
      this.productService.setSearch(searchQuery);
      // You can now use `searchQuery` in your component
    });
    this.cartService.cartCount$.subscribe(res => {
      this.cartCount = res;
    });

    this.currentUser = this.storageService.getCurrentUser();
    this.productService.search$.subscribe(res => {
      this.searchKeyword = res ?? "";
      this.filter = [{
        apiNotation: 'name',
        name: 'name',
        filter: this.searchKeyword
      }]
      this.loadProducts();
    });
  }

  get startItem() {
    return (this.pageIndex - 1) * this.pageSize + 1;
  }

  get endItem() {
    const end = this.pageIndex * this.pageSize;
    return end > this.totalItems ? this.totalItems : end;
  }

  get selectedCollection() {
    return this.filter.find(x => x.apiNotation === "collection.collectionId")?.filter ?? [];
  }

  get selectedCategory() {
    return this.filter.find(x => x.apiNotation === "category.categoryId")?.filter ?? [];
  }

  get selectedColor() {
    return this.filter.find(x => x.apiNotation === "color")?.filter ?? [];
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.sortBy.valueChanges.subscribe(res => {
      this.loadProducts();
    })
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  loadProducts() {
    this.isLoading = true;
    try {

      if (Number(this.sortBy.value ?? 0) === 1) {
        this.order = { name: "ASC" };
      } else if (Number(this.sortBy.value ?? 0) === 2) {
        this.order = { interested: "DESC" };
      } else if (Number(this.sortBy.value ?? 0) === 3) {
        this.order = { price: "ASC" };
      } else if (Number(this.sortBy.value ?? 0) === 4) {
        this.order = { price: "DESC" };
      } else if (Number(this.sortBy.value ?? 0) === 5) {
        this.order = { name: "DESC" };
      }
      combineLatest([
        this.productService.getClientPagination({
          customerUserId: this.currentUser?.customerUserId,
          order: this.order,
          columnDef: this.filter,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }),
        this.productService.getSearchFilter({
          columnDef: this.filter
        })
      ]
      ).subscribe(([products, filter]) => {
        this.isLoading = false;
        if (products.success) {
          this.products = products.data.results.map(x => {
            x.interested = Number(x.interested ?? 0);
            x.productImages = x.productImages.sort(
              (a, b) => Number(a.productImageId) - Number(b.productImageId)
            );

            return x;
          });
          this.totalItems = products.data.total;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.pages = this.generatePageArray();

        }

        if (filter.success) {
          this.categories = filter.data.categories;
          this.collections = filter.data.collections;
          this.colors = filter.data.colors;
        }
      }, (res) => {
        this.isLoading = false;
      });
    } catch (ex) {
      this.isLoading = false;
    }
  }

  addFilter(type: "CATEGORY" | "COLLECTION" | "COLOR", value) {
    if (type === "CATEGORY") {
      if (this.filter.some(x => x.apiNotation === "category.categoryId")) {
        if (value && value !== '') {
          this.filter.find(x => x.apiNotation === "category.categoryId").filter.push(value);
        } else {
          this.filter = this.filter.filter(x => x.apiNotation !== "category.categoryId");
        }
      } else {
        this.filter.push({
          apiNotation: "category.categoryId",
          name: "category",
          filter: [value],
          type: "in"
        })
      }
      this.goToPage(0);
      this.loadProducts();
    } else if (type === "COLLECTION") {
      if (this.filter.some(x => x.apiNotation === "collection.collectionId")) {
        if (value && value !== '') {
          this.filter.find(x => x.apiNotation === "collection.collectionId").filter.push(value);
        } else {
          this.filter = this.filter.filter(x => x.apiNotation !== "collection.collectionId");
        }
      } else {
        this.filter.push({
          apiNotation: "collection.collectionId",
          name: "collection",
          filter: [value],
          type: "in"
        })
      }
      this.goToPage(0);
      this.loadProducts();
    } else if (type === "COLOR") {
      if (this.filter.some(x => x.apiNotation === "color")) {
        if (value && value !== '') {
          this.filter.find(x => x.apiNotation === "color").filter.push(value);
        } else {
          this.filter = this.filter.filter(x => x.apiNotation !== "color");
        }
      } else {
        this.filter.push({
          apiNotation: "color",
          name: "color",
          filter: [value],
          type: "in"
        })
      }
      this.goToPage(0);
      this.loadProducts();
    }
  }

  goToPage(index: number) {
    if (index < 0 || index >= this.totalPages) return;
    this.pageIndex = index;
    this.loadProducts(); // server-side call
  }

  generatePageArray(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, this.pageIndex - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage >= this.totalPages) {
      endPage = this.totalPages - 1;
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  onOpenQuickView(product: Product) {
    this.quickView.showModal(product);
  }

  onAddToCart(product: Product) {
    try {
      this.modalService.openPromptModal({
        header: "Add to Cart",
        description: `Do you want to add "${product.name}" to your cart?`,
        confirmText: "Yes",
        confirm: () => {
          this.modalService.close(MODAL_TYPE.PROMPT);

          this.cartService.create({
            productId: product?.productId,
            customerUserId: this.currentUser?.customerUserId,
            quantity: "1",
            price: product?.price,
          }).subscribe(res => {
            if (res.success) {
              this.modalService.openResultModal({
                success: true,
                header: "Flower Added!",
                description: "Added to cart successfully!",
                confirm: () => {
                  this.modalService.close(MODAL_TYPE.RESULT);
                  this.cartService.setCartCount(this.cartCount + 1);
                }
              });
            } else {
              this.error = res.message;
              this.snackBar.open(this.error, 'close', { panelClass: ['style-error'] });
              this.modalService.openResultModal({
                success: false,
                header: "Error Adding to Cart!",
                description: this.error,
                confirm: () => {
                  this.modalService.closeAll();
                }
              });
            }
          }, (res) => {
            this.error = res.error.message;
            this.snackBar.open(this.error, 'close', { panelClass: ['style-error'] });
            this.modalService.openResultModal({
              success: false,
              header: "Error Adding to Cart!",
              description: this.error,
              confirm: () => {
                this.modalService.closeAll();
              }
            });
          });
        }
      });
    } catch (ex) {
      this.error = ex.message;
      this.snackBar.open(this.error, 'close', { panelClass: ['style-error'] });
      this.modalService.openResultModal({
        success: false,
        header: "Error Adding to Cart!",
        description: this.error,
        confirm: () => {
          this.modalService.closeAll();
        }
      });
    }
  }

  onAddToWishlist(product: Product) {
    if (product.iAmInterested) {
      this.modalService.openPromptModal({
        header: "Already added!",
        description: `Do you want to remove "${product.name}" to your wishlist?`,
        confirmText: "Yes, Remove it",
        confirm: () => {
          this.modalService.close(MODAL_TYPE.PROMPT);
          this.customerUserWishlistService.delete(product.customerUserWishlist?.customerUserWishlistId).subscribe(res => {
            this.loadProducts();
            if (res.success) {
              this.modalService.openResultModal({
                success: true,
                header: "Flower removed!",
                description: "Flower removed from wishlist successfully!",
                confirm: () => {
                  this.modalService.close(MODAL_TYPE.RESULT);
                }
              });
            } else {
              this.error = res.message;
              this.snackBar.open(this.error, 'close', { panelClass: ['style-error'] });
              this.modalService.openResultModal({
                success: false,
                header: "Error removing from wishlist!",
                description: this.error,
                confirm: () => {
                  this.modalService.closeAll();
                }
              });
            }
          });
        }
      });
      return
    }
    try {
      this.modalService.openPromptModal({
        header: "Add to Wishlist?",
        description: `Do you want to add "${product.name}" to your wishlist?`,
        confirmText: "Yes",
        confirm: () => {
          this.modalService.close(MODAL_TYPE.PROMPT);

          this.customerUserWishlistService.create({
            productId: product?.productId,
            customerUserId: this.currentUser?.customerUserId,
          }).subscribe(res => {
            if (res.success) {
              this.modalService.openResultModal({
                success: true,
                header: "Flower Added!",
                description: "Added to wishlist successfully!",
                confirm: () => {
                  this.modalService.close(MODAL_TYPE.RESULT);
                  this.loadProducts();
                }
              });
            } else {
              this.error = res.message;
              this.snackBar.open(this.error, 'close', { panelClass: ['style-error'] });
              this.modalService.openResultModal({
                success: false,
                header: "Error Adding to wishlist!",
                description: this.error,
                confirm: () => {
                  this.modalService.closeAll();
                }
              });
            }
          }, (res) => {
            this.error = res.error.message;
            this.snackBar.open(this.error, 'close', { panelClass: ['style-error'] });
            this.modalService.openResultModal({
              success: false,
              header: "Error Adding to wishlist!",
              description: this.error,
              confirm: () => {
                this.modalService.closeAll();
              }
            });
          });
        }
      });
    } catch (ex) {
      this.error = ex.message;
      this.snackBar.open(this.error, 'close', { panelClass: ['style-error'] });
      this.modalService.openResultModal({
        success: false,
        header: "Error Adding to wishlist!",
        description: this.error,
        confirm: () => {
          this.modalService.closeAll();
        }
      });
    }
  }
}

