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

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  viewMode: "GRID" | "LIST" = "GRID";

  searchKeyword: any;
  products: Product[] = [];
  categories: Category[] = [];
  collections: Collection[] = [];
  pageIndex = 0;
  pageSize = 12;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];
  order: any = { sku: "DESC" };
  filter: {
    apiNotation: string;
    filter?: string;
    name?: string;
    type?: string;
  }[] = [];

  sortBy = new FormControl(1);

  @ViewChild('quickView') quickView!: QuickProductViewModalComponent;
  constructor(private readonly productService: ProductService) {
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
    return this.filter.some(x => x.apiNotation === "collection.collectionId") ? this.filter.find(x => x.apiNotation === "collection.collectionId")?.filter : null;
  }

  get selectedCategory() {
    return this.filter.some(x => x.apiNotation === "category.categoryId") ? this.filter.find(x => x.apiNotation === "category.categoryId")?.filter : null;
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.sortBy.valueChanges.subscribe(res=> {
      console.log(res);
      if(res === 1) {
        this.order ={ sku: "DESC" };
      } else if(res === 1) {
        this.order ={ sku: "DESC" };
      } else if(res === 1) {
        this.order ={ sku: "DESC" };
      } else if(res === 1) {
        this.order ={ sku: "DESC" };
      } else if(res === 1) {
        this.order ={ sku: "DESC" };
      } else if(res === 1) {
        this.order ={ sku: "DESC" };
      } else if(res === 1) {
        this.order ={ sku: "DESC" };
      } else if(res === 1) {
        this.order ={ sku: "DESC" };
      }
      this.loadProducts();
    })
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  loadProducts() {
    combineLatest([this.productService.getAdvanceSearch({
      order: this.order,
      columnDef: this.filter,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }), this.productService.getSearchFilter({
      columnDef: this.filter
    })]).subscribe(([products, filter]) => {
      if (products.success) {
        this.products = products.data.results;
        this.totalItems = products.data.total;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.pages = this.generatePageArray();
        this.categories = products.data.categories;
      }

      if (filter.success) {
        this.categories = filter.data.categories;
        this.collections = filter.data.collections;
      }
    });
  }

  addFilter(type: "CATEGORY" | "COLLECTION", value) {
    if (type === "CATEGORY") {
      if (this.filter.some(x => x.apiNotation === "category.categoryId")) {
        if(value && value !== '') {
          this.filter.find(x => x.apiNotation === "category.categoryId").filter = value;
        } else {
          this.filter = this.filter.filter(x => x.apiNotation !== "category.categoryId");
        }
      } else {
        this.filter.push({
          apiNotation: "category.categoryId",
          name: "category",
          filter: value,
          type: "number"
        })
      }
      this.loadProducts();
    } else if (type === "COLLECTION") {
      if (this.filter.some(x => x.apiNotation === "collection.collectionId")) {
        if(value && value !== '') {
          this.filter.find(x => x.apiNotation === "collection.collectionId").filter = value;
        } else {
          this.filter = this.filter.filter(x => x.apiNotation !== "collection.collectionId");
        }
      } else {
        this.filter.push({
          apiNotation: "collection.collectionId",
          name: "collection",
          filter: value,
          type: "number"
        })
      }
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
}

