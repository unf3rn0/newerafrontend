export const siteConfig = {
  name: "NewEra",
  description: "Premium clothing house with a clean manual-payment shopping experience.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  currency: "TJS",
  colors: {
    accent: "#40C0F8",
    primary: "#00A8E0",
    primaryDark: "#003F5C",
  },
  contacts: {
    instagram: "https://www.instagram.com/newerafashionhouse",
    phone: "+992886870110",
    phoneDisplay: "+992 88 687 01 10",
  },
  assets: {
    favicon: "/assets/favicon.ico",
    brandMark: "/assets/brand-mark.svg",
    logo: "/assets/logo.png",
    paymentQr: "/assets/payment-qr.png",
    home: {
      aboutImage: {
        alt: "Minimal NewEra premium wardrobe rack with tailored clothing",
        src: "/assets/home/premium-wardrobe.jpg",
      },
      heroBackground: {
        alt: "NewEra campaign hero background",
        src: "/assets/home/hero-background.jpg",
      },
    },
    icons: {
      bag: "/assets/icons/bag.svg",
      delivery: "/assets/icons/delivery.svg",
      diamond: "/assets/icons/diamond.svg",
      instagram: "/assets/icons/instagram.svg",
      phone: "/assets/icons/phone.svg",
      qrPayment: "/assets/icons/qr-payment.svg",
      return: "/assets/icons/return.svg",
      search: "/assets/icons/search.svg",
      shield: "/assets/icons/shield.svg",
      support: "/assets/icons/support.svg",
      user: "/assets/icons/user.svg",
    },
  },
};
