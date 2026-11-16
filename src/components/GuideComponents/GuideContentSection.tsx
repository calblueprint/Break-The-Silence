import type {
  GuideBlock,
  GuideContentSectionData,
  ImageBlock,
} from '@/data/guidesTypes';
import { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import SafeExitButton from '@/components/SafeExitButton';
import colors from '@/styles/colors';
import { guideContentSectionStyles as styles } from '@/styles/guideContentStyles';
import tabNavigationStyles from '@/styles/tabNavigationStyles';
import { typography } from '@/styles/typography';

type ExternalResource = {
  type: 'website' | 'phone';
  url: string;
};

async function openResourceUrl(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Unable to open link', 'Please try again later.');
  }
}

function renderBlock(
  block: GuideBlock,
  imageWidth: number,
  imageMaxHeight: number,
  onResourcePress: (resource: ExternalResource) => void,
) {
  switch (block.type) {
    case 'text':
      return <Text style={typography.p2}>{block.content}</Text>;
    case 'heading':
      return (
        <Text
          style={
            block.headingSize === 'large'
              ? typography.h2
              : block.level === 2
                ? typography.h3
                : typography.h4
          }
        >
          {block.text}
        </Text>
      );
    case 'list':
      return (
        <View>
          {block.title ? (
            <Text style={[typography.h4, styles.blockTitle]}>
              {block.title}
            </Text>
          ) : null}
          {block.items.map((item, index) => {
            const marker =
              block.style === 'number'
                ? `${(block.start ?? 1) + index}.`
                : block.style === 'emoji'
                  ? (item.emoji ?? '')
                  : block.style === 'none'
                    ? ''
                    : block.style === 'check'
                      ? '✓'
                      : '•';

            return (
              <View key={item.id} style={styles.listItem}>
                <Text style={[typography.p2, styles.marker]}>{marker}</Text>
                <Text style={[typography.p2, styles.listText]}>
                  {item.text}
                </Text>
              </View>
            );
          })}
        </View>
      );
    case 'callout': {
      const calloutVariantStyle = {
        info: styles.calloutInfo,
        warning: styles.calloutWarning,
        success: styles.calloutSuccess,
        neutral: styles.calloutNeutral,
      }[block.variant];
      return (
        <View style={[styles.callout, calloutVariantStyle]}>
          {block.title ? (
            <Text style={[typography.h4, styles.blockTitle]}>
              {block.title}
            </Text>
          ) : null}
          <Text style={typography.p2}>{block.content}</Text>
        </View>
      );
    }
    case 'resource': {
      const resourceUrl = block.url;
      const resourcePhone = block.phone;
      const description = block.description ?? block.phone;
      return (
        <View style={styles.resourceCard}>
          <View style={styles.resourceHeader}>
            <View style={styles.resourceDetails}>
              <Text style={styles.resourceTitle}>{block.title}</Text>
              {description ? (
                <Text style={styles.resourceDescription}>{description}</Text>
              ) : null}
            </View>
            {resourcePhone || resourceUrl ? (
              <View style={styles.resourceActions}>
                {resourcePhone ? (
                  <Pressable
                    accessibilityRole="link"
                    onPress={() =>
                      onResourcePress({
                        type: 'phone',
                        url: `tel:${resourcePhone.replace(/[^\d+]/g, '')}`,
                      })
                    }
                    style={styles.resourceAction}
                  >
                    <Text style={styles.resourceActionLabel}>Call</Text>
                  </Pressable>
                ) : null}
                {resourceUrl ? (
                  <Pressable
                    accessibilityRole="link"
                    onPress={() =>
                      onResourcePress({ type: 'website', url: resourceUrl })
                    }
                    style={styles.resourceAction}
                  >
                    <Feather
                      name="arrow-right"
                      size={16}
                      color={colors.white}
                    />
                  </Pressable>
                ) : null}
              </View>
            ) : null}
          </View>
          {resourceUrl ? (
            <Text style={styles.resourceUrl}>{resourceUrl}</Text>
          ) : null}
        </View>
      );
    }
    case 'image':
      return (
        <View>
          <GuideImage
            block={block}
            width={imageWidth}
            maxHeight={imageMaxHeight}
          />
          {block.caption ? (
            <Text style={[typography.p3, styles.paragraph]}>
              {block.caption}
            </Text>
          ) : null}
        </View>
      );
  }
}

function GuideImage({
  block,
  width,
  maxHeight,
}: {
  block: ImageBlock;
  width: number;
  maxHeight: number;
}) {
  const [loadFailed, setLoadFailed] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number>();
  const isRemoteImage = /^https?:\/\//i.test(block.src);
  const imageHeight = imageAspectRatio
    ? Math.min(maxHeight, width / imageAspectRatio)
    : maxHeight;

  if (loadFailed || !isRemoteImage) {
    return (
      <View style={[styles.imageFallback, { width }]}>
        <Text style={styles.imageFallbackTitle}>Image couldn’t load</Text>
        <Text style={typography.p3}>{block.alt}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: block.src }}
      accessibilityLabel={block.alt}
      style={[styles.image, { width, height: imageHeight }]}
      resizeMode="contain"
      onLoad={({ nativeEvent }) => {
        const { width: sourceWidth, height: sourceHeight } = nativeEvent.source;
        if (sourceWidth > 0 && sourceHeight > 0) {
          setImageAspectRatio(sourceWidth / sourceHeight);
        }
      }}
      onError={event => {
        console.error(
          `Failed to load guide image ${block.id}: ${event.nativeEvent.error}`,
        );
        setLoadFailed(true);
      }}
    />
  );
}

export default function GuideContentSection({
  contentSection,
}: {
  contentSection: GuideContentSectionData;
}) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [pendingResource, setPendingResource] =
    useState<ExternalResource | null>(null);
  const imageWidth = Math.max(screenWidth - 48, 1);
  const imageMaxHeight = screenHeight * 0.5;

  return (
    <>
      <View style={styles.contentSection}>
        <Text
          style={[
            contentSection.headingSize === 'large'
              ? typography.h2
              : typography.h4,
          ]}
        >
          {contentSection.title}
        </Text>
        <View style={styles.contentSectionBlocks}>
          {contentSection.description ? (
            <Text style={typography.p2}>{contentSection.description}</Text>
          ) : null}
          {contentSection.blocks.map(block => (
            <View key={block.id}>
              {renderBlock(
                block,
                imageWidth,
                imageMaxHeight,
                setPendingResource,
              )}
            </View>
          ))}
        </View>
      </View>
      <Modal
        visible={pendingResource !== null}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => setPendingResource(null)}
      >
        <View
          accessibilityViewIsModal
          style={[
            styles.websitePromptOverlay,
            {
              // Reserve space below the 44px Safe Exit button, including its hitSlop.
              paddingTop: insets.top + 64,
              paddingBottom: Math.max(insets.bottom, 24),
            },
          ]}
        >
          <ScrollView
            style={styles.websitePromptDialog}
            contentContainerStyle={styles.websitePromptContent}
          >
            <Text accessibilityRole="header" style={styles.websitePromptTitle}>
              {pendingResource?.type === 'phone'
                ? 'Open phone app?'
                : 'Open website?'}
            </Text>
            <Text style={styles.websitePromptMessage}>
              {pendingResource?.type === 'phone'
                ? 'Continuing may open your phone app and leave a call-history record.'
                : `Would you like to visit ${pendingResource?.url}?`}
            </Text>
            <View style={styles.websitePromptActions}>
              <Pressable
                accessibilityRole="button"
                style={[styles.websitePromptButton, styles.websiteCancelButton]}
                onPress={() => setPendingResource(null)}
              >
                <Text style={styles.websiteCancelLabel}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={[
                  styles.websitePromptButton,
                  styles.websiteContinueButton,
                ]}
                onPress={() => {
                  if (pendingResource) {
                    void openResourceUrl(pendingResource.url);
                  }
                  setPendingResource(null);
                }}
              >
                <Text style={styles.websiteContinueLabel}>Continue</Text>
              </Pressable>
            </View>
          </ScrollView>
          <SafeExitButton
            style={[
              tabNavigationStyles.safeExitButton,
              { top: insets.top + 4 },
            ]}
            onExit={() => setPendingResource(null)}
          />
        </View>
      </Modal>
    </>
  );
}
