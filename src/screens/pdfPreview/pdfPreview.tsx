import { CustomText, SafeScreen, TextVariants } from '@/components';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { useAppRoute } from '@/utils/navigationUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Pdf from 'react-native-pdf';

export type PdfPreviewProps = {
  /** local file path or uri of the pdf to preview */
  uri: string;
};

const toFileUri = (uri: string) =>
  uri.includes('://') ? uri : `file://${uri}`;

const PdfPreview = () => {
  /** for getting the parameter */
  const { uri } = useAppRoute('PdfPreview').params;

  /** to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  /** for translations */
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <SafeScreen style={styles.main}>
      {error ? (
        <View style={styles.centered}>
          <CustomText
            variant={TextVariants.bodyMedium}
            color={theme.colors.error}
          >
            {t('UnableToLoadPDF')}
          </CustomText>
        </View>
      ) : (
        <Pdf
          source={{ uri: toFileUri(uri) }}
          style={styles.pdf}
          onLoadComplete={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}

      {loading && !error && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
    </SafeScreen>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      flex: 1,
    },
    pdf: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    centered: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
    },
  });

export default PdfPreview;
