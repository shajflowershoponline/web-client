export const environment = {
  appName: "Shaj Flower shop",
  production: true,
  oneSignalAppId: "09c8c0ed-5d53-42f9-8384-c66c217bd87e",
  apiBaseUrl: "https://shaj-flower-shop-api.vercel.app/api/v1",
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
