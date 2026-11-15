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
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '@/styles/colors';
import { guideContentSectionStyles as styles } from '@/styles/guideContentStyles';
import { typography } from '@/styles/typography';

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
  onWebsitePress: (url: string) => void,
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
            {block.phone || resourceUrl ? (
              <View style={styles.resourceActions}>
                {block.phone ? (
                  <Pressable
                    accessibilityRole="link"
                    onPress={() => {
                      void openResourceUrl(
                        `tel:${block.phone?.replace(/[^\d+]/g, '')}`,
                      );
                    }}
                    style={styles.resourceAction}
                  >
                    <Text style={styles.resourceActionLabel}>Call</Text>
                  </Pressable>
                ) : null}
                {resourceUrl ? (
                  <Pressable
                    accessibilityRole="link"
                    onPress={() => onWebsitePress(resourceUrl)}
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
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(null);
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
              {renderBlock(block, imageWidth, imageMaxHeight, setWebsiteUrl)}
            </View>
          ))}
        </View>
      </View>
      <Modal
        visible={websiteUrl !== null}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => setWebsiteUrl(null)}
      >
        <View style={styles.websitePromptOverlay}>
          <View accessibilityViewIsModal style={styles.websitePromptDialog}>
            <Text accessibilityRole="header" style={styles.websitePromptTitle}>
              Open website?
            </Text>
            <Text style={styles.websitePromptMessage}>
              Would you like to visit {websiteUrl}?
            </Text>
            <View style={styles.websitePromptActions}>
              <Pressable
                accessibilityRole="button"
                style={[styles.websitePromptButton, styles.websiteCancelButton]}
                onPress={() => setWebsiteUrl(null)}
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
                  if (websiteUrl) {
                    void openResourceUrl(websiteUrl);
                  }
                  setWebsiteUrl(null);
                }}
              >
                <Text style={styles.websiteContinueLabel}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
