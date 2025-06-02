export const environment = {
  appName: "Shaj Flower shop",
  production: true,
  oneSignalAppId: "09c8c0ed-5d53-42f9-8384-c66c217bd87e",
  apiBaseUrl: "https://shaj-flower-shop-api.vercel.app/api/v1",
  openRouteServiceAPIKey: "5b3ce3597851110001cf6248a5e16664c28b4743a047d680fc89228e",
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
      manageCoupon: "/cart/coupon"
    },
    systemConfig: {
      getAll: "/system-config/"
    },
  }
};
