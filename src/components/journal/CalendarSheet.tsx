import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useJournal } from '@/context/JournalContext';
import colors from '@/styles/colors';
import { formatMonthYear, isSameDay, toDayKey } from '@/utils/journalDates';
import PopupModal from './PopupModal';
import { calendarSheetStyles as styles } from './styles';

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface CalendarSheetProps {
  visible: boolean;
  title: string;
  // Day that starts out picked; null for none
  selectedDate: Date | null;
  // Main button text for the picked day, like "Use Nov 1, 2026"
  getConfirmText: (date: Date) => string;
  // Disabled main button text while no day is picked
  emptyConfirmText?: string;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  // Shows a "Clear filter" button when set
  onClear?: () => void;
}

// Builds the month's grid, with nulls for the blanks before the 1st
function getMonthDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const blanks = new Date(year, monthIndex, 1).getDay();
  const dayCount = new Date(year, monthIndex + 1, 0).getDate();
  const days: (Date | null)[] = Array(blanks).fill(null);
  for (let day = 1; day <= dayCount; day++) {
    days.push(new Date(year, monthIndex, day));
  }
  // Pads the last week so every row has 7 cells
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

// Bottom sheet calendar for picking one day. Future days can't be picked, and
// days with diary entries are bold with a dot underneath.
export default function CalendarSheet({
  visible,
  title,
  selectedDate,
  getConfirmText,
  emptyConfirmText = 'Choose a date',
  onConfirm,
  onCancel,
  onClear,
}: CalendarSheetProps) {
  const { entries } = useJournal();
  const [pickedDate, setPickedDate] = useState(selectedDate);
  const [month, setMonth] = useState(() => startOfMonth(selectedDate));

  // Starts fresh each time the sheet opens
  useEffect(() => {
    if (visible) {
      setPickedDate(selectedDate);
      setMonth(startOfMonth(selectedDate));
    }
  }, [visible, selectedDate]);

  const entryDays = useMemo(
    () => new Set(entries.map(entry => toDayKey(new Date(entry.createdAt)))),
    [entries],
  );

  const today = new Date();
  const isCurrentMonth =
    month.getFullYear() === today.getFullYear() &&
    month.getMonth() === today.getMonth();
  const days = getMonthDays(month);
  const weeks = Array.from({ length: days.length / 7 }, (_, i) =>
    days.slice(i * 7, i * 7 + 7),
  );

  const changeMonth = (offset: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1));

  return (
    <PopupModal visible={visible} variant="sheet" onRequestClose={onCancel}>
      <View style={styles.sheetContainer}>
        <View style={styles.handle} />

        <View style={styles.headerContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Pressable onPress={onCancel} hitSlop={12}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>

        <View style={styles.monthRowContainer}>
          <Pressable
            onPress={() => changeMonth(-1)}
            hitSlop={12}
            accessibilityLabel="Previous month"
          >
            <Feather name="chevron-left" size={24} color={colors.black} />
          </Pressable>
          <Text style={styles.monthText}>{formatMonthYear(month)}</Text>
          <Pressable
            onPress={() => changeMonth(1)}
            disabled={isCurrentMonth}
            hitSlop={12}
            accessibilityLabel="Next month"
          >
            <Feather
              name="chevron-right"
              size={24}
              color={isCurrentMonth ? colors.slate300 : colors.black}
            />
          </Pressable>
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.weekRowContainer}>
            {WEEKDAY_LETTERS.map((letter, i) => (
              <Text key={i} style={styles.weekdayText}>
                {letter}
              </Text>
            ))}
          </View>
          {weeks.map((week, i) => (
            <View key={i} style={styles.weekRowContainer}>
              {week.map((day, j) => {
                if (!day)
                  return <View key={j} style={styles.dayCellContainer} />;
                const isFuture = day > today && !isSameDay(day, today);
                const isPicked = pickedDate && isSameDay(day, pickedDate);
                const hasEntries = entryDays.has(toDayKey(day));
                return (
                  <Pressable
                    key={j}
                    onPress={() => setPickedDate(day)}
                    disabled={isFuture}
                    style={styles.dayCellContainer}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: !!isPicked,
                      disabled: isFuture,
                    }}
                  >
                    <View
                      style={[
                        styles.dayCircle,
                        isSameDay(day, today) && styles.dayTodayCircle,
                        isPicked && styles.dayPickedCircle,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          hasEntries && styles.dayWithEntriesText,
                          isFuture && styles.dayFutureText,
                          isPicked && styles.dayPickedText,
                        ]}
                      >
                        {day.getDate()}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.entryDot,
                        hasEntries && styles.entryDotVisible,
                      ]}
                    />
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable
            onPress={() => pickedDate && onConfirm(pickedDate)}
            disabled={!pickedDate}
            style={[
              styles.buttonContainer,
              pickedDate
                ? styles.primaryButtonContainer
                : styles.disabledButtonContainer,
            ]}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.buttonText,
                pickedDate
                  ? styles.primaryButtonText
                  : styles.disabledButtonText,
              ]}
            >
              {pickedDate ? getConfirmText(pickedDate) : emptyConfirmText}
            </Text>
          </Pressable>
          {onClear ? (
            <Pressable
              onPress={onClear}
              style={[styles.buttonContainer, styles.secondaryButtonContainer]}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Clear filter</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </PopupModal>
  );
}

function startOfMonth(date: Date | null) {
  const base = date ?? new Date();
  return new Date(base.getFullYear(), base.getMonth(), 1);
}
