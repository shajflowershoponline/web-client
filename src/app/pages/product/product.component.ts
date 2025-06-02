import { Component } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class Productomponent {
  galleryThumbs: Swiper;
  singleProductImg: Swiper;
  productSlider: Swiper;
  itemCarousel2: Swiper;
  testimonialCarousel: Swiper;

  constructor() {
  }

  ngAfterViewInit(): void {
    // Home 01 Slider
    this.galleryThumbs = new Swiper('.single-product-thumb', {
      spaceBetween: 10,
      slidesPerView: 4,
      loop: false,
      freeMode: true,
      loopAdditionalSlides: 5, //looped slides should be the same
      watchSlidesProgress: true,
      // Responsive breakpoints
      breakpoints: {
        // when window width is >= 320px
        320: {
          slidesPerView: 2,
        },
        // when window width is >= 575px
        575: {
          slidesPerView: 3,
        },
        // when window width is >= 767px
        767: {
          slidesPerView: 4,
        },
        // when window width is >= 991px
        991: {
          slidesPerView: 3,
        },
        // when window width is >= 1200px
        1200: {
          slidesPerView: 4,
        },
        }
      });
    this.singleProductImg = new Swiper('.single-product-img', {
      spaceBetween: 10,
      loop: false,
      loopAdditionalSlides: 5, //looped slides should be the same
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: this.galleryThumbs,
      },
      });

	  // Product Carousel
    this.productSlider = new Swiper('.product-slider', {
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        el: ".swiper-pagination",
        type: 'bullets',
        clickable: true,
      },
      //autoplay: {},
      // Responsive breakpoints
      breakpoints: {
        // when window width is >= 320px
        320: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        // when window width is >= 480px
        480: {
          slidesPerView: 2,
          spaceBetween: 10
        },
        // when window width is >= 767px
        768: {
          slidesPerView: 3,
          spaceBetween: 10
        },
        // when window width is >= 1200px
        1200: {
          slidesPerView: 4,
          spaceBetween: 10
          },
        }
    });

	  // item Carousel 2
    this.itemCarousel2 = new Swiper('.item-carousel-2', {
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        el: ".swiper-pagination",
        type: 'bullets',
        clickable: true,
      },
      //autoplay: {},
      // Responsive breakpoints
      breakpoints: {
        // when window width is >= 480px
        480: {
          slidesPerView: 1,
        },
        // when window width is >= 575px
        575: {
          slidesPerView: 2,
        },
        // when window width is >= 767px
        767: {
          slidesPerView: 2,
        },
        // when window width is >= 991px
        991: {
          slidesPerView: 2,
        },
        // when window width is >= 1200px
        1200: {
          slidesPerView: 3,
          },
        }
    });
    
	// Testimonial Carousel
    this.testimonialCarousel = new Swiper('.testimonial-carousel', {
      loop: true,
      speed: 800,
      slidesPerView: 1,
      spaceBetween: 10,
      effect: 'slide',
      navigation: {
        nextEl: '.home1-slider-next',
        prevEl: '.home1-slider-prev',
      },
      //autoplay: {},
  
    });
  }
}
