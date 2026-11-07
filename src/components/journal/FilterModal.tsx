import { Fragment } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Button from '@/components/Button/Button';
import colors from '@/styles/colors';
import PopupModal from './PopupModal';
import { filterModalStyles as styles } from './styles';

export type SortOrder = 'newest' | 'oldest';

export interface YearGroup {
  year: string;
  // Month titles like "October 2026" that have entries
  months: string[];
}

interface FilterModalProps {
  visible: boolean;
  yearGroups: YearGroup[];
  // A year or month title; null shows all entries
  selectedPeriod: string | null;
  sortOrder: SortOrder;
  onSelectPeriod: (period: string | null) => void;
  onSelectSortOrder: (sortOrder: SortOrder) => void;
  onClose: () => void;
}

interface OptionRowProps {
  label: string;
  selected: boolean;
  indented?: boolean;
  onPress: () => void;
}

function OptionRow({ label, selected, indented, onPress }: OptionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.optionContainer, indented && styles.optionIndented]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.optionText, selected && styles.optionSelectedText]}>
        {label}
      </Text>
      {selected ? (
        <Feather name="check" size={18} color={colors.primary} />
      ) : null}
    </Pressable>
  );
}

// Changes apply to the list right away; Done just closes the popup
export default function FilterModal({
  visible,
  yearGroups,
  selectedPeriod,
  sortOrder,
  onSelectPeriod,
  onSelectSortOrder,
  onClose,
}: FilterModalProps) {
  return (
    <PopupModal visible={visible} onRequestClose={onClose}>
      <View style={styles.dialogContainer}>
        <Text style={styles.titleText}>Filter entries</Text>

        <Text style={styles.sectionLabelText}>SORT BY</Text>
        <View>
          <OptionRow
            label="Newest first"
            selected={sortOrder === 'newest'}
            onPress={() => onSelectSortOrder('newest')}
          />
          <OptionRow
            label="Oldest first"
            selected={sortOrder === 'oldest'}
            onPress={() => onSelectSortOrder('oldest')}
          />
        </View>

        <Text style={styles.sectionLabelText}>DATE</Text>
        <ScrollView style={styles.monthList}>
          <OptionRow
            label="All entries"
            selected={selectedPeriod === null}
            onPress={() => onSelectPeriod(null)}
          />
          {yearGroups.map(({ year, months }) => (
            <Fragment key={year}>
              <OptionRow
                label={year}
                selected={selectedPeriod === year}
                onPress={() => onSelectPeriod(year)}
              />
              {months.map(month => (
                <OptionRow
                  key={month}
                  label={month}
                  selected={selectedPeriod === month}
                  indented
                  onPress={() => onSelectPeriod(month)}
                />
              ))}
            </Fragment>
          ))}
        </ScrollView>

        <Button
          disabled={false}
          text="Done"
          onPress={onClose}
          containerStyle={styles.doneButtonContainer}
        />
      </View>
    </PopupModal>
  );
}
