import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import { useClipboard, useIntervalFn } from "@vueuse/core";

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(relativeTime);

export function useTimestamp() {
  const currentUnix = ref(Math.floor(Date.now() / 1000));
  const timestampInput = ref("");
  const selectedTimezone = ref("Browser");
  const dateInput = ref("");
  const datePickerValue = ref<Date | null>(null);

  useIntervalFn(() => {
    currentUnix.value = Math.floor(Date.now() / 1000);
  }, 1000);

  const timezones = computed(() => {
    try {
      return ["Browser", ...Intl.supportedValuesOf("timeZone")];
    } catch {
      return ["Browser"];
    }
  });

  function resolveTimezone(): string {
    return selectedTimezone.value === "Browser"
      ? dayjs.tz.guess()
      : selectedTimezone.value;
  }

  function parseTimestamp(input: string): dayjs.Dayjs | null {
    const trimmed = input.trim();
    if (!trimmed) return null;
    const num = Number(trimmed);
    if (isNaN(num)) return null;
    const ms = Math.abs(num) > 9999999999 ? num : num * 1000;
    const d = dayjs(ms);
    return d.isValid() ? d : null;
  }

  const parsedTimestamp = computed(() => parseTimestamp(timestampInput.value));

  const hasError = computed(() => {
    if (!timestampInput.value?.trim()) return false;
    return parsedTimestamp.value === null;
  });

  const errorMessage = computed(() => {
    if (!hasError.value) return "";
    return "Invalid timestamp. Enter a valid Unix timestamp in seconds or milliseconds.";
  });

  const humanReadable = computed(() => {
    const d = parsedTimestamp.value;
    if (!d) return "-";
    const tzName = resolveTimezone();
    const formatted = d.tz(tzName).format("dddd, MMMM D, YYYY [at] hh:mm:ss A");
    const abbr = new Intl.DateTimeFormat("en", {
      timeZone: tzName,
      timeZoneName: "short",
    })
      .formatToParts(d.toDate())
      .find((p) => p.type === "timeZoneName")?.value ?? tzName;
    return `${formatted} ${abbr}`;
  });

  const relativeTimeStr = computed(() => {
    const d = parsedTimestamp.value;
    if (!d) return "-";
    return d.fromNow();
  });

  const dateOnly = computed(() => {
    const d = parsedTimestamp.value;
    if (!d) return "-";
    return d.tz(resolveTimezone()).format("YYYY-MM-DD");
  });

  const timeOnly = computed(() => {
    const d = parsedTimestamp.value;
    if (!d) return "-";
    return d.tz(resolveTimezone()).format("HH:mm:ss");
  });

  // Date to Timestamp
  watch(datePickerValue, (val) => {
    if (val) {
      dateInput.value = dayjs(val).format("YYYY-MM-DD HH:mm:ss");
    }
  });

  const timestampResult = computed(() => {
    if (!dateInput.value?.trim()) return "";
    const d = dayjs(dateInput.value.trim());
    if (!d.isValid()) return "";
    return String(d.unix());
  });

  // Clipboard
  const { copy, copied } = useClipboard();

  return {
    currentUnix,
    timestampInput,
    timezone: selectedTimezone,
    timezones,
    hasError,
    errorMessage,
    humanReadable,
    relativeTime: relativeTimeStr,
    dateOnly,
    timeOnly,
    dateInput,
    datePickerValue,
    timestampResult,
    copied,
    copy,
  };
}
