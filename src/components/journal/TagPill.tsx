import type { JournalTag } from '@/types/journal';
import { Text, View } from 'react-native';
import colors from '@/styles/colors';
import { tagPillStyles as styles } from './styles';

export const TAG_LABELS: Record<JournalTag, string> = {
  incident: 'Incident',
  support: 'Support',
};

const TAG_COLORS: Record<JournalTag, { background: string; text: string }> = {
  incident: {
    background: colors.incidentBackground,
    text: colors.error,
  },
  support: {
    background: colors.supportBackground,
    text: colors.primary,
  },
};

interface TagPillProps {
  tag: JournalTag;
}

export default function TagPill({ tag }: TagPillProps) {
  const { background, text } = TAG_COLORS[tag];
  return (
    <View style={[styles.pillContainer, { backgroundColor: background }]}>
      <Text style={[styles.labelText, { color: text }]}>{TAG_LABELS[tag]}</Text>
    </View>
  );
}
