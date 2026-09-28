export const supportedLocales = ['en', 'bn', 'hi', 'ur'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export const defaultLocale: SupportedLocale = 'en';

const messages: Record<SupportedLocale, Record<string, string>> = {
  en: {
    'Errors.NotFound': 'The requested resource was not found.',
    'Errors.InvalidRequest': 'The request is invalid.',
    'Errors.Unauthorized': 'You are not authorized to perform this action.',
    'Errors.Server': 'Something went wrong. Please try again.',
    'Notifications.Updated': 'Updated successfully.',
  },
  bn: {
    'Errors.NotFound': 'অনুরোধ করা তথ্য পাওয়া যায়নি।',
    'Errors.InvalidRequest': 'অনুরোধটি সঠিক নয়।',
    'Errors.Unauthorized': 'এই কাজটি করার অনুমতি আপনার নেই।',
    'Errors.Server': 'কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।',
    'Notifications.Updated': 'সফলভাবে আপডেট হয়েছে।',
  },
  hi: {
    'Errors.NotFound': 'अनुरोधित जानकारी नहीं मिली।',
    'Errors.InvalidRequest': 'अनुरोध अमान्य है।',
    'Errors.Unauthorized': 'आपको यह कार्रवाई करने की अनुमति नहीं है।',
    'Errors.Server': 'कुछ गलत हुआ। कृपया फिर कोशिश करें।',
    'Notifications.Updated': 'सफलतापूर्वक अपडेट किया गया।',
  },
  ur: {
    'Errors.NotFound': 'درخواست کردہ معلومات نہیں ملیں۔',
    'Errors.InvalidRequest': 'درخواست درست نہیں ہے۔',
    'Errors.Unauthorized': 'آپ کو یہ کارروائی کرنے کی اجازت نہیں ہے۔',
    'Errors.Server': 'کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔',
    'Notifications.Updated': 'کامیابی سے اپ ڈیٹ ہو گیا۔',
  },
};

export const resolveLocale = (value?: string | string[]): SupportedLocale => {
  const candidate = Array.isArray(value) ? value[0] : value;
  return supportedLocales.includes(candidate as SupportedLocale) ? candidate as SupportedLocale : defaultLocale;
};

export const message = (key: string, locale: SupportedLocale = defaultLocale) =>
  messages[locale][key] ?? messages[defaultLocale][key] ?? key;