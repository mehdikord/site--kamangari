/**
 * Everything the client has to replace before launch lives in this file.
 * Phone numbers, addresses and social handles below are placeholders.
 */
export const site = {
  name: "دخانیات کمانگری",
  shortName: "کمانگری",
  slogan: "اصالت در کالا، اطمینان در خرید",
  intro: "عرضه‌ی عمده و جزئی قلیان، لوازم و محصولات دخانی، با ضمانت اصالت و ارسال به سراسر کشور.",
  phone: { label: "۰۲۱-۰۰۰۰۰۰۰۰", href: "tel:+982100000000" },
  mobile: { label: "۰۹۱۲-۰۰۰-۰۰۰۰", href: "tel:+989120000000" },
  email: "info@example.com",
  address: "تهران، نشانی فروشگاه پس از تأیید مشتری درج می‌شود",
  hours: "حضوری شنبه تا پنجشنبه، ۹ تا ۲۱",
  messengers: [
    { id: "telegram", label: "تلگرام", href: "https://t.me/", handle: "شناسه‌ی تلگرام" },
    { id: "whatsapp", label: "واتساپ", href: "https://wa.me/", handle: "شماره‌ی واتساپ" },
    { id: "instagram", label: "اینستاگرام", href: "https://instagram.com/", handle: "صفحه‌ی اینستاگرام" },
    { id: "bale", label: "بله", href: "https://ble.ir/", handle: "شناسه‌ی بله" },
    { id: "eitaa", label: "ایتا", href: "https://eitaa.com/", handle: "شناسه‌ی ایتا" },
    { id: "rubika", label: "روبیکا", href: "https://rubika.ir/", handle: "شناسه‌ی روبیکا" },
  ],
  healthWarning: "دخانیات عامل سرطان، سکته و بیماری‌های قلبی و ریوی است. فروش به افراد زیر ۱۸ سال ممنوع است.",
  quitLine: "مشاوره‌ی رایگان ترک دخانیات و پرسش سلامت: ۴۰۳۰",
} as const;

/** Mock behaviour. Keep `noIndex` on until the client has cleared the legal and licensing questions. */
export const demo = {
  noIndex: true,
  otp: "12345",
  otpSeconds: 120,
} as const;
