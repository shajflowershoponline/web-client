// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appName: "Shaj Flower shop",
  production: false,
  oneSignalAppId: "651fe52b-1a5e-4045-b722-5efb0c841f76",
  apiBaseUrl: "https://shaj-flower-shop-api-eight.vercel.app/api/v1",
  openRouteServiceAPIKey: "5b3ce3597851110001cf6248a5e16664c28b4743a047d680fc89228e",
  maximLocationServiceURL: "https://client-sea.taximaxim.com/en-US/service",
  api: {
    auth: {
      login: "/auth/login/customer/",
      registerCustomer: "/auth/register/customer/",
      registerVerify: "/auth/register/verifyCustomer/",
      resetSubmit: "/auth/reset/customerUserResetPasswordSubmit/",
      resetVerify: "/auth/reset/customerUserVerify/",
      resetPassword: "/auth/reset/customerUserResetPassword/",
    },
    users: {
      getByCode: "/customer-user/",
      updateProfile: "/customer-user/updateProfile/"
    },
    cart: {
      getItems: "/cart/getItems/",
      create: "/cart/",
      update: "/cart/",
      manageCoupon: "/cart/coupon",
      getActiveCoupon: "/cart/customerUserCoupon/",
    },
    systemConfig: {
      getAll: "/system-config/"
    },
    geolocation: {
      searchAddress: "/geolocation/search/"
    },
    order: {
      getAdvanceSearch: "/order/my-orders/",
      getByCode: "/order/",
      create: "/order/",
      updateStatus: "/order/status/",
    },
    delivery: {
      calculate: "/delivery/calculate/"
    },
    category: {
      getAdvanceSearch: "/category/page/",
      getByCode: "/category/",
    },
    collection: {
      getAdvanceSearch: "/collection/page/",
      getByCode: "/collection/",
    },
    product: {
      getAdvanceSearch: "/product/page/",
      getSearchFilter: "/product/get-search-filter/",
      getByCode: "/product/",
    },
    customerUserWishlist: {
      getAdvanceSearch: "/customer-user-wish-list/page/",
      getByCode: "/customer-user-wish-list/",
      getBySKU: "/customer-user-wish-list/get-by-sku/",
      create: "/customer-user-wish-list/",
      delete: "/customer-user-wish-list/",
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
