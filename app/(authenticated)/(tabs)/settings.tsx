import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecruitmentLoader } from '@/components/RecruitmentLoader';
import { neutral, primary } from '@/constants/Colors';
import { useSettings } from '@/contexts/SettingsContext';
import { supportedLanguages, useTranslation } from '@/utils/i18n';

// Available languages
const LANGUAGES = Object.entries(supportedLanguages).map(([code, name]) => ({
  code,
  name
}));

// Available currencies
const CURRENCIES = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
];

// Font size range
const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 24;

export default function SettingsScreen() {
  const router = useRouter();
  const deviceColorScheme = useColorScheme();
  const { 
    settings, 
    isLoading, 
    updateTheme, 
    updateLanguage, 
    updateFontSize, 
    updateCurrency, 
    resetCache,
    getEffectiveTheme 
  } = useSettings();
  
  const { t } = useTranslation();
  
  const [isResettingCache, setIsResettingCache] = useState(false);
  const [localFontSize, setLocalFontSize] = useState(settings.fontSize);
  const [hasChanges, setHasChanges] = useState(false);
  const saveCallbackRef = useRef<(() => void) | null>(null);
  
  // Display the actual theme based on system or user preference
  const effectiveTheme = getEffectiveTheme();
  
  // Handle theme change
  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    await updateTheme(newTheme);
    setHasChanges(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Handle language change
  const handleLanguageChange = async (value: string) => {
    await updateLanguage(value);
    setHasChanges(true);
  };
  
  // Handle font size change
  const handleFontSizeChange = async (value: number) => {
    const newSize = Math.min(Math.max(MIN_FONT_SIZE, Math.round(value)), MAX_FONT_SIZE);
    setLocalFontSize(newSize);
    await updateFontSize(newSize);
    setHasChanges(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Handle currency change
  const handleCurrencyChange = async (value: string) => {
    await updateCurrency(value);
    setHasChanges(true);
  };
  
  // Font size buttons for increasing/decreasing size
  const increaseFontSize = () => {
    if (settings.fontSize < MAX_FONT_SIZE) {
      handleFontSizeChange(settings.fontSize + 1);
    }
  };
  
  const decreaseFontSize = () => {
    if (settings.fontSize > MIN_FONT_SIZE) {
      handleFontSizeChange(settings.fontSize - 1);
    }
  };
  
  // Reset application cache
  const handleResetCache = () => {
    Alert.alert(
      t('resetCache'),
      t('confirmReset'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('resetCache'),
          style: 'destructive',
          onPress: async () => {
            setIsResettingCache(true);
            
            try {
              await resetCache();
              
              // Wait a moment for visual feedback
              setTimeout(() => {
                setIsResettingCache(false);
                Alert.alert(t('success'), t('resetSuccess'));
              }, 1500);
            } catch (error) {
              setIsResettingCache(false);
              Alert.alert(t('error'), t('resetError'));
            }
          },
        },
      ]
    );
  };
  
  // Set up save callback
  useEffect(() => {
    const handleSave = () => {
      if (hasChanges) {
        // Show success message
        Alert.alert(
          t('success'),
          t('settingsSaved'),
          [
            {
              text: 'OK',
              onPress: () => {
                setHasChanges(false);
                router.back();
              }
            }
          ]
        );
      } else {
        router.back();
      }
    };

    saveCallbackRef.current = handleSave;
    return () => {
      saveCallbackRef.current = null;
    };
  }, [hasChanges, router, t]);
  
  if (isLoading || isResettingCache) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <RecruitmentLoader 
          size="large" 
          text={isResettingCache ? t('clearCache') : t('loading')} 
        />
      </SafeAreaView>
    );
  }

  // Custom Picker rendering based on platform
  const renderLanguagePicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <Picker
          selectedValue={settings.language}
          onValueChange={handleLanguageChange}
          style={styles.picker}
        >
          {LANGUAGES.map((lang) => (
            <Picker.Item key={lang.code} label={lang.name} value={lang.code} />
          ))}
        </Picker>
      );
    } else {
      return (
        <View style={styles.androidPickerContainer}>
          <Text style={styles.androidPickerValue}>
            {LANGUAGES.find(lang => lang.code === settings.language)?.name || LANGUAGES[0].name}
          </Text>
          <TouchableOpacity
            style={styles.androidPickerButton}
            onPress={() => {
              Alert.alert(
                t('interfaceLanguage'),
                t('changeLanguage'),
                LANGUAGES.map(lang => ({
                  text: lang.name,
                  onPress: () => handleLanguageChange(lang.code)
                }))
              );
            }}
          >
            <Ionicons name="chevron-down" size={20} color={neutral.slateGray} />
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderCurrencyPicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <Picker
          selectedValue={settings.currency}
          onValueChange={handleCurrencyChange}
          style={styles.picker}
        >
          {CURRENCIES.map((currency) => (
            <Picker.Item key={currency.code} label={`${currency.symbol} ${currency.name}`} value={currency.code} />
          ))}
        </Picker>
      );
    } else {
      const currentCurrency = CURRENCIES.find(c => c.code === settings.currency) || CURRENCIES[0];
      return (
        <View style={styles.androidPickerContainer}>
          <Text style={styles.androidPickerValue}>
            {`${currentCurrency.symbol} ${currentCurrency.name}`}
          </Text>
          <TouchableOpacity
            style={styles.androidPickerButton}
            onPress={() => {
              Alert.alert(
                t('defaultCurrency'),
                t('setCurrency'),
                CURRENCIES.map(currency => ({
                  text: `${currency.symbol} ${currency.name}`,
                  onPress: () => handleCurrencyChange(currency.code)
                }))
              );
            }}
          >
            <Ionicons name="chevron-down" size={20} color={neutral.slateGray} />
          </TouchableOpacity>
        </View>
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Appearance Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('appearance')}</Text>
          
          {/* Theme Selection */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>{t('theme')}</Text>
            <View style={styles.themeOptions}>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  settings.theme === 'light' && styles.themeOptionSelected,
                ]}
                onPress={() => handleThemeChange('light')}
              >
                <Ionicons
                  name="sunny"
                  size={24}
                  color={settings.theme === 'light' ? primary.tealGreen : neutral.slateGray}
                />
                <Text style={[
                  styles.themeText,
                  settings.theme === 'light' && styles.themeTextSelected,
                ]}>
                  {t('light')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  settings.theme === 'dark' && styles.themeOptionSelected,
                ]}
                onPress={() => handleThemeChange('dark')}
              >
                <Ionicons
                  name="moon"
                  size={24}
                  color={settings.theme === 'dark' ? primary.tealGreen : neutral.slateGray}
                />
                <Text style={[
                  styles.themeText,
                  settings.theme === 'dark' && styles.themeTextSelected,
                ]}>
                  {t('dark')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  settings.theme === 'system' && styles.themeOptionSelected,
                ]}
                onPress={() => handleThemeChange('system')}
              >
                <Ionicons
                  name="phone-portrait"
                  size={24}
                  color={settings.theme === 'system' ? primary.tealGreen : neutral.slateGray}
                />
                <Text style={[
                  styles.themeText,
                  settings.theme === 'system' && styles.themeTextSelected,
                ]}>
                  {t('system')}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.settingDescription}>
              {t('currentTheme')}: <Text style={styles.highlightText}>{effectiveTheme === 'dark' ? t('dark') : t('light')}</Text>
            </Text>
          </View>
          
          {/* Font Size */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>{t('textSize')}</Text>
            <View style={styles.sliderContainer}>
              <TouchableOpacity
                style={styles.fontSizeButton}
                onPress={decreaseFontSize}
                disabled={settings.fontSize <= MIN_FONT_SIZE}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={settings.fontSize <= MIN_FONT_SIZE ? neutral.cloudGray : primary.tealGreen}
                />
              </TouchableOpacity>
              
              <View style={styles.fontSizeSlider}>
                <View style={styles.fontSizeTrack}>
                  <View 
                    style={[
                      styles.fontSizeFill, 
                      { 
                        width: `${((settings.fontSize - MIN_FONT_SIZE) / (MAX_FONT_SIZE - MIN_FONT_SIZE)) * 100}%` 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.fontSizeLabel}>
                  {`${MIN_FONT_SIZE}pt`}
                </Text>
                <Text style={[styles.fontSizeLabel, styles.fontSizeLabelRight]}>
                  {`${MAX_FONT_SIZE}pt`}
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.fontSizeButton}
                onPress={increaseFontSize}
                disabled={settings.fontSize >= MAX_FONT_SIZE}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={settings.fontSize >= MAX_FONT_SIZE ? neutral.cloudGray : primary.tealGreen}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.fontSizeValue}>{settings.fontSize}pt</Text>
            <Text style={styles.settingDescription}>
              {t('adjustTextSize')}
            </Text>
            <View style={styles.fontSizePreview}>
              <Text style={[styles.previewText, { fontSize: settings.fontSize }]}>
                Sample Text
              </Text>
            </View>
          </View>
        </View>
        
        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('languageAndRegion')}</Text>
          
          {/* Language Selection */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>{t('interfaceLanguage')}</Text>
            <View style={styles.pickerContainer}>
              {renderLanguagePicker()}
            </View>
            <Text style={styles.settingDescription}>
              {t('changeLanguage')}
            </Text>
          </View>
          
          {/* Currency Selection */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>{t('defaultCurrency')}</Text>
            <View style={styles.pickerContainer}>
              {renderCurrencyPicker()}
            </View>
            <Text style={styles.settingDescription}>
              {t('setCurrency')}
            </Text>
          </View>
        </View>
        
        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dataManagement')}</Text>
          
          {/* Reset Cache */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>{t('resetCache')}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleResetCache}
            >
              <MaterialIcons name="delete-sweep" size={20} color="#fff" />
              <Text style={styles.buttonText}>{t('clearCache')}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Storage Usage */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>{t('storageUsage')}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // Future implementation for storage details
                Alert.alert('Coming Soon', 'This feature will be available in a future update.');
              }}
            >
              <MaterialIcons name="storage" size={20} color="#fff" />
              <Text style={styles.buttonText}>{t('viewStorage')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about')}</Text>
          <View style={styles.aboutInfo}>
            <Text style={styles.appName}>{t('appName')}</Text>
            <Text style={styles.versionText}>{t('version')}: 0.1.0</Text>
            <Text style={styles.copyright}>{t('copyright')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FA',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F8FA',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: neutral.charcoal,
    marginBottom: 16,
  },
  settingGroup: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: neutral.charcoal,
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 14,
    color: neutral.slateGray,
    marginTop: 8,
  },
  highlightText: {
    color: primary.tealGreen,
    fontWeight: '500',
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: neutral.cloudGray,
    marginHorizontal: 4,
  },
  themeOptionSelected: {
    borderColor: primary.tealGreen,
    backgroundColor: 'rgba(0, 141, 151, 0.05)',
  },
  themeText: {
    marginTop: 8,
    fontSize: 14,
    color: neutral.slateGray,
  },
  themeTextSelected: {
    color: primary.tealGreen,
    fontWeight: '500',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  fontSizeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: neutral.cloudGray,
  },
  fontSizeSlider: {
    flex: 1,
    marginHorizontal: 12,
    height: 40,
    position: 'relative',
  },
  fontSizeTrack: {
    height: 6,
    backgroundColor: neutral.cloudGray,
    borderRadius: 3,
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
  },
  fontSizeFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: primary.tealGreen,
  },
  fontSizeLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    fontSize: 12,
    color: neutral.slateGray,
  },
  fontSizeLabelRight: {
    left: 'auto',
    right: 0,
  },
  fontSizeValue: {
    fontSize: 16,
    fontWeight: '500',
    color: primary.tealGreen,
    textAlign: 'center',
    marginTop: 8,
  },
  fontSizePreview: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: neutral.cloudGray,
  },
  previewText: {
    color: neutral.charcoal,
    fontWeight: '400',
  },
  pickerContainer: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: neutral.cloudGray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  androidPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 50,
  },
  androidPickerValue: {
    fontSize: 16,
    color: neutral.charcoal,
  },
  androidPickerButton: {
    padding: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: primary.tealGreen,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginLeft: 8,
  },
  aboutInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: neutral.charcoal,
  },
  versionText: {
    fontSize: 16,
    color: neutral.slateGray,
    marginTop: 4,
  },
  copyright: {
    fontSize: 14,
    color: neutral.slateGray,
  },
}); 