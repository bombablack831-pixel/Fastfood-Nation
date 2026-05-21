import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome back!",
      "search_placeholder": "Search for food, restaurants...",
      "home": "Home",
      "offers": "Offers",
      "cart": "Cart",
      "profile": "Profile",
      "orders": "Orders",
      "wallet": "Wallet",
      "fastpass": "FastPass",
      "logout": "Logout",
      "add_to_cart": "Add to Cart",
      "popular_dishes": "Popular Dishes",
      "top_restaurants": "Top Restaurants"
    }
  },
  ur: {
    translation: {
      "welcome": "خوش آمدید!",
      "search_placeholder": "کھانا، ریستوراں تلاش کریں...",
      "home": "ہوم",
      "offers": "آفرز",
      "cart": "کارٹ",
      "profile": "پروفائل",
      "orders": "آرڈرز",
      "wallet": "والٹ",
      "fastpass": "فاسٹ پاس",
      "logout": "لاگ آؤٹ",
      "add_to_cart": "کارٹ میں شامل کریں",
      "popular_dishes": "مشہور پکوان",
      "top_restaurants": "بہترین ریستوراں"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
