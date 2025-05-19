import { useSettings } from '@/contexts/SettingsContext';

// Available languages
export const supportedLanguages = {
  'en-US': 'EN (US)',
  'nl-BE': 'NL (BE)',
  'fr-BE': 'FR (BE)',
  'tr-TR': 'TR (TR)',
};

// Define available language keys type
export type LanguageCode = keyof typeof supportedLanguages;

// Base translations type
export interface TranslationContent {
  // Common
  appName: string;
  save: string;
  cancel: string;
  ok: string;
  yes: string;
  no: string;
  loading: string;
  error: string;
  success: string;
  
  // Auth
  login: string;
  logout: string;
  username: string;
  password: string;
  
  // Profile
  myProfile: string;
  editProfile: string;
  personalInfo: string;
  employmentStatus: string;
  contactInfo: string;
  education: string;
  skills: string;
  languages: string;
  jobPreferences: string;
  userNotFound: string;
  currentStatus: string;
  details: string;
  currentEmployer: string;
  position: string;
  since: string;
  email: string;
  phone: string;
  address: string;
  viewProfile: string;
  favoritedJobs: string;
  noFavoritedJobs: string;
  browseJobs: string;
  desiredRole: string;
  desiredSalary: string;
  preferredLocation: string;
  workType: string;
  availableFrom: string;
  
  // Settings
  settings: string;
  appSettings: string;
  appearance: string;
  theme: string;
  textSize: string;
  light: string;
  dark: string;
  system: string;
  small: string;
  medium: string;
  large: string;
  currentTheme: string;
  adjustTextSize: string;
  settingsSaved: string;
  accountSettings: string;
  notificationSettings: string;
  privacySettings: string;
  helpAndSupport: string;
  
  // Language & Region
  languageAndRegion: string;
  interfaceLanguage: string;
  changeLanguage: string;
  defaultCurrency: string;
  setCurrency: string;
  
  // Data Management
  dataManagement: string;
  resetCache: string;
  clearCache: string;
  storageUsage: string;
  viewStorage: string;
  confirmReset: string;
  resetSuccess: string;
  resetError: string;
  
  // About
  about: string;
  version: string;
  copyright: string;
  
  // Jobs
  jobs: string;
  jobSearch: string;
  noJobsFound: string;
  
  // Documents
  documents: string;
  documentUpload: string;
  
  // Assignments
  assignments: string;
  myAssignments: string;
}

// Translation key type
export type TranslationKey = keyof TranslationContent;

// All translations
export const translations: Record<LanguageCode, TranslationContent> = {
  // English translations
  'en-US': {
    // Common
    appName: 'VDAB Unofficial',
    save: 'Save',
    cancel: 'Cancel',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Auth
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    
    // Profile
    myProfile: 'My Profile',
    editProfile: 'Edit Profile',
    personalInfo: 'Personal Information',
    employmentStatus: 'Employment Status',
    contactInfo: 'Contact Information',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    jobPreferences: 'Job Preferences',
    userNotFound: 'User not found',
    currentStatus: 'Current Status',
    details: 'Details',
    currentEmployer: 'Current Employer',
    position: 'Position',
    since: 'Since',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    viewProfile: 'View Profile',
    favoritedJobs: 'Favorited Jobs',
    noFavoritedJobs: 'No favorited jobs yet',
    browseJobs: 'Browse Jobs',
    desiredRole: 'Desired Role',
    desiredSalary: 'Desired Salary',
    preferredLocation: 'Preferred Location',
    workType: 'Work Type',
    availableFrom: 'Available From',
    
    // Settings
    settings: 'Settings',
    appSettings: 'App Settings',
    appearance: 'Appearance',
    theme: 'Theme',
    textSize: 'Text Size',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    currentTheme: 'Current theme',
    adjustTextSize: 'Adjust text size throughout the app',
    settingsSaved: 'Your settings have been saved successfully.',
    accountSettings: 'Account Settings',
    notificationSettings: 'Notification Settings',
    privacySettings: 'Privacy Settings',
    helpAndSupport: 'Help & Support',
    
    // Language & Region
    languageAndRegion: 'Language & Region',
    interfaceLanguage: 'Interface Language',
    changeLanguage: 'Change the application language',
    defaultCurrency: 'Default Currency',
    setCurrency: 'Set your preferred currency for salaries and payments',
    
    // Data Management
    dataManagement: 'Data Management',
    resetCache: 'Reset Application Cache',
    clearCache: 'Clear temporary files and app data',
    storageUsage: 'Storage Usage',
    viewStorage: 'View app storage and manage data',
    confirmReset: 'Are you sure you want to reset the application cache? This will clear all temporary data.',
    resetSuccess: 'Application cache has been reset successfully.',
    resetError: 'Failed to reset cache. Please try again.',
    
    // About
    about: 'About',
    version: 'Version',
    copyright: '© 2023 VDAB Mobile App Team',
    
    // Jobs
    jobs: 'Jobs',
    jobSearch: 'Job Search',
    noJobsFound: 'No jobs found',
    
    // Documents
    documents: 'Documents',
    documentUpload: 'Document Upload',
    
    // Assignments
    assignments: 'Assignments',
    myAssignments: 'My Assignments',
  },
  
  // Turkish translations
  'tr-TR': {
    // Common
    appName: 'VDAB Resmi Olmayan',
    save: 'Kaydet',
    cancel: 'İptal',
    ok: 'Tamam',
    yes: 'Evet',
    no: 'Hayır',
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',
    
    // Auth
    login: 'Giriş Yap',
    logout: 'Çıkış Yap',
    username: 'Kullanıcı Adı',
    password: 'Şifre',
    
    // Profile
    myProfile: 'Profilim',
    editProfile: 'Profili Düzenle',
    personalInfo: 'Kişisel Bilgiler',
    employmentStatus: 'İş Durumu',
    contactInfo: 'İletişim Bilgileri',
    education: 'Eğitim',
    skills: 'Yetenekler',
    languages: 'Diller',
    jobPreferences: 'İş Tercihleri',
    userNotFound: 'Kullanıcı bulunamadı',
    currentStatus: 'Mevcut Durum',
    details: 'Detaylar',
    currentEmployer: 'Mevcut İşveren',
    position: 'Pozisyon',
    since: 'Başlangıç',
    email: 'E-posta',
    phone: 'Telefon',
    address: 'Adres',
    viewProfile: 'Profili Görüntüle',
    favoritedJobs: 'Favori İşler',
    noFavoritedJobs: 'Henüz favori işiniz yok',
    browseJobs: 'İşlere Göz At',
    desiredRole: 'İstenen Rol',
    desiredSalary: 'İstenen Maaş',
    preferredLocation: 'Tercih Edilen Konum',
    workType: 'Çalışma Tipi',
    availableFrom: 'Müsait Olma Tarihi',
    
    // Settings
    settings: 'Ayarlar',
    appSettings: 'Uygulama Ayarları',
    appearance: 'Görünüm',
    theme: 'Tema',
    textSize: 'Yazı Boyutu',
    light: 'Aydınlık',
    dark: 'Karanlık',
    system: 'Sistem',
    small: 'Küçük',
    medium: 'Orta',
    large: 'Büyük',
    currentTheme: 'Mevcut tema',
    adjustTextSize: 'Uygulama genelinde yazı boyutunu ayarlayın',
    settingsSaved: 'Ayarlarınız başarıyla kaydedildi.',
    accountSettings: 'Hesap Ayarları',
    notificationSettings: 'Bildirim Ayarları',
    privacySettings: 'Gizlilik Ayarları',
    helpAndSupport: 'Yardım & Destek',
    
    // Language & Region
    languageAndRegion: 'Dil ve Bölge',
    interfaceLanguage: 'Arayüz Dili',
    changeLanguage: 'Uygulama dilini değiştirin',
    defaultCurrency: 'Varsayılan Para Birimi',
    setCurrency: 'Maaşlar ve ödemeler için tercih ettiğiniz para birimini ayarlayın',
    
    // Data Management
    dataManagement: 'Veri Yönetimi',
    resetCache: 'Uygulama Önbelleğini Sıfırla',
    clearCache: 'Geçici dosyaları ve uygulama verilerini temizle',
    storageUsage: 'Depolama Kullanımı',
    viewStorage: 'Uygulama depolamasını görüntüle ve verileri yönet',
    confirmReset: 'Uygulama önbelleğini sıfırlamak istediğinizden emin misiniz? Bu, tüm geçici verileri temizleyecektir.',
    resetSuccess: 'Uygulama önbelleği başarıyla sıfırlandı.',
    resetError: 'Önbellek sıfırlanamadı. Lütfen tekrar deneyin.',
    
    // About
    about: 'Hakkında',
    version: 'Sürüm',
    copyright: '© 2023 VDAB Mobil Uygulama Ekibi',
    
    // Jobs
    jobs: 'İşler',
    jobSearch: 'İş Arama',
    noJobsFound: 'İş bulunamadı',
    
    // Documents
    documents: 'Belgeler',
    documentUpload: 'Belge Yükleme',
    
    // Assignments
    assignments: 'Görevler',
    myAssignments: 'Görevlerim',
  },
  
  // Add placeholder languages with English content as fallback
  'nl-BE': {} as TranslationContent,
  'fr-BE': {} as TranslationContent
};

// Initialize placeholder languages with English content
translations['nl-BE'] = { ...translations['en-US'] };
translations['fr-BE'] = { ...translations['en-US'] };

// Translation hook
export function useTranslation() {
  const { settings } = useSettings();
  
  // Get current language from settings
  const currentLanguage = (settings.language || 'en-US') as LanguageCode;
  
  // Function to translate a key
  const t = (key: TranslationKey, replacements?: Record<string, string>): string => {
    // Get translations for current language, fallback to English
    const languageTranslations = translations[currentLanguage] || translations['en-US'];
    
    // Get the translation for the key, fallback to the key itself
    let translation = (languageTranslations[key] || translations['en-US'][key] || key) as string;
    
    // Replace any variables in the translation
    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(
          new RegExp(`{${placeholder}}`, 'g'), 
          replacements[placeholder]
        );
      });
    }
    
    return translation;
  };
  
  return { t, currentLanguage };
} 