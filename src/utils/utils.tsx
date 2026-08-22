import { useTheme } from '@/theme/themeProvider/paperTheme';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useEffect } from 'react';
import { AppState, Keyboard, Linking, Platform } from 'react-native';
import { MessageType, showMessage } from 'react-native-flash-message';
import InAppBrowser from 'react-native-inappbrowser-reborn';

//to format date bro
export const formatDate = ({
  date,
  parseFormat = '',
  returnFormat = 'MMM DD, YYYY',
}: {
  date: string | Date;
  parseFormat?: string;
  returnFormat?: string;
}): string => {
  dayjs.extend(customParseFormat);
  const parsedDate = parseFormat ? dayjs(date, parseFormat) : dayjs(date);
  return parsedDate.isValid() ? parsedDate.format(returnFormat) : '';
};

// hh:mm AM/PM, e.g. 02:30 PM
export const formatTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${String(hours).padStart(2, '0')}:${minutes} ${period}`;
};

// currency input need this kido
export const formatCurrency = (raw: string): string => {
  if (!raw) return '';
  const cleaned = raw.replace(/[^\d.]/g, '');
  if (!cleaned) return '';
  const parts = cleaned.split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (parts.length === 1) return intPart;
  return `${intPart}.${parts[1].slice(0, 2)}`;
};

//not not=rmal buit nrmal
export const useCustomInAppBrowser = () => {
  const theme = useTheme(); // Access theme colors

  const normalizeUrl = (url: string): string => {
    if (!url) return '';

    try {
      // Trim spaces and fix casing of scheme
      const trimmed = url.trim();

      //accept mailto
      if (url.startsWith('mailto')) {
        return trimmed;
      }

      // If scheme is missing, reject
      if (!/^https?:\/\//i.test(trimmed)) {
        return '';
      }

      // Force lowercase scheme (http/https)
      const fixedScheme = trimmed.replace(/^https?:\/\//i, match =>
        match.toLowerCase(),
      );

      // Validate with URL constructor
      const parsed = new URL(fixedScheme);

      // Must be http or https
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return '';
      }

      return parsed.toString();
    } catch {
      return '';
    }
  };

  const openInAppBrowser = async (url?: string, onClose?: () => void) => {
    if (!url || url.length === 0) {
      return;
    }

    try {
      if (await InAppBrowser.isAvailable()) {
        InAppBrowser.close();
        // useLogoutStore.getState().setIsLoggingOut(true);

        // ✅ Detect if the URL is a PDF & use Google Docs Viewer
        const isPdf = url.toLowerCase().endsWith('.pdf');
        const finalUrl = isPdf
          ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
              normalizeUrl(url),
            )}`
          : normalizeUrl(url);

        await InAppBrowser.open(finalUrl, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: theme.colors.primary,
          preferredControlTintColor: theme.colors.surface,
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: theme.colors.surface,
          secondaryToolbarColor: theme.colors.surfaceVariant,
          navigationBarColor: theme.colors.surface,
          navigationBarDividerColor: theme.colors.surface,
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
          },
        })
          .catch(() => {
            Linking.openURL(finalUrl); // Fallback to system browser
          })
          .finally(() => {
            // useLogoutStore.getState().setIsLoggingOut(false);
          });

        if (onClose) {
          onClose();
        }
      } else {
        // Log('🔗 InAppBrowser not available: Opening in system browser');
        await Linking.openURL(url);
      }
    } catch {}
  };

  return openInAppBrowser;
};

export function showSnackbar(
  msg: string,
  type: MessageType | undefined = 'default',
  delay?: number,
) {
  if (msg.length > 0) {
    showMessage({
      message: msg,
      type: type,
      floating: true,
      ...(delay ? { duration: delay } : {}),
      titleProps: {
        allowFontScaling: false,
      },
    });
  }
}

// Check if the URL is complete (i.e., ends with a valid TLD like .com, .net, etc.)
export const isUrlComplete = (url: string): boolean => {
  const urlCompleteRegex =
    /\.(com|net|org|io|co|us|uk|de|gov|edu|info|biz|app|dev|in|ca|au|nz)(\/|\?|#|$)/i;
  return urlCompleteRegex.test(url);
};

// Utility to extract the last URL from the message text using regex
export const getLastUrlFromText = (text: string): string | null => {
  const unifiedRegex =
    /((https?:\/\/[^\s"<]+)|(www\.[^\s"<]+)|((?:[a-z0-9-]+\.)+(?:com|net|org|io|co|us|uk|de|gov|edu|info|biz|app|dev|in|ca|au|nz)))/gi;
  const matches = [...text.matchAll(unifiedRegex)];
  if (!matches.length) return null;
  return matches[matches.length - 1][0]; // Return the last matched URL
};

// 🔒 Detect JavaScript / script injection (inline, partial, encoded)
export const containsJavaScript = (input?: string): boolean => {
  if (!input) return false;

  let text = input.toLowerCase();

  // Decode URI encoding
  try {
    text = decodeURIComponent(text);
  } catch {}

  // Decode common HTML encodings
  text = text
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#x3c;/gi, '<')
    .replace(/&#60;/gi, '<')
    .replace(/\s+/g, ' ');

  // 🚫 script tags (partial or full)
  if (/<\s*\/?\s*scr/i.test(text)) return true;

  // 🚫 inline JS handlers (onclick, onload, etc.)
  if (/\bon\w+\s*=/i.test(text)) return true;

  // 🚫 javascript: / vbscript:
  if (/(javascript|vbscript)\s*:/i.test(text)) return true;

  // 🚫 JS execution patterns
  if (/(document\.|window\.|eval\(|settimeout\(|setinterval\()/i.test(text))
    return true;

  return false;
};

//calling when. we want to hide the keyboard
export const hideKeyboard = () => {
  if (Keyboard.isVisible()) {
    Keyboard.dismiss();
  }
};

/** added by @YUvraj 10-10-2025 --> dismiss the popup when security minimize popup shows */
export const handlePopupDismiss = (shown: boolean, dimiss: () => void) => {
  if (Platform.OS == 'ios') {
    useEffect(() => {
      if (shown) {
        // closing all modal on background
        const subscription = AppState.addEventListener(
          'change',
          nextAppState => {
            dimiss();
          },
        );

        return () => {
          subscription.remove();
        };
      }
    }, [shown]);
  }
};
