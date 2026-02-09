import cronstrue from "cronstrue";
import { CronExpressionParser, type CronDate } from "cron-parser";

export interface CronPreset {
  label: string;
  expression: string;
}

export interface ExecutionEntry {
  date: string;
  time: string;
}

export function useCron() {
  const cron = ref("* * * * *");
  const timezone = ref("Browser");
  const nextRuns = ref(5);
  const lastRuns = ref(5);

  const presets: CronPreset[] = [
    { label: "Every Minute", expression: "* * * * *" },
    { label: "Every 5 Minutes", expression: "*/5 * * * *" },
    { label: "Every 30 Minutes", expression: "*/30 * * * *" },
    { label: "Every Hour", expression: "0 * * * *" },
    { label: "Every Day at midnight", expression: "0 0 * * *" },
    { label: "Every Monday at 9 am", expression: "0 9 * * 1" },
    { label: "First day of the month", expression: "0 0 1 * *" },
  ];

  const timezones = computed(() => {
    try {
      return ["Browser", ...Intl.supportedValuesOf("timeZone")];
    } catch {
      return ["Browser"];
    }
  });

  const parsed = computed(() => {
    if (!cron.value?.trim()) {
      return { description: "", error: false };
    }
    try {
      return { description: cronstrue.toString(cron.value), error: false };
    } catch {
      return { description: "", error: true };
    }
  });

  const description = computed(() => parsed.value.description);
  const hasError = computed(() => parsed.value.error);

  function getTimezone(): string | undefined {
    return timezone.value === "Browser" ? undefined : timezone.value;
  }

  function formatExecution(cronDate: CronDate, tz?: string): ExecutionEntry {
    const date = cronDate.toDate();
    const opts: Intl.DateTimeFormatOptions = tz ? { timeZone: tz } : {};
    return {
      date: date.toLocaleDateString(undefined, {
        ...opts,
        year: "numeric",
        month: "short",
        day: "numeric",
        weekday: "short",
      }),
      time: date.toLocaleTimeString(undefined, {
        ...opts,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  }

  const nextExecutions = computed<ExecutionEntry[]>(() => {
    if (hasError.value || !cron.value?.trim()) return [];
    try {
      const tz = getTimezone();
      const parser = CronExpressionParser.parse(cron.value, tz ? { tz } : {});
      return parser.take(Number(nextRuns.value) || 5).map((d) => formatExecution(d, tz));
    } catch {
      return [];
    }
  });

  const lastExecutions = computed<ExecutionEntry[]>(() => {
    if (hasError.value || !cron.value?.trim()) return [];
    try {
      const tz = getTimezone();
      const parser = CronExpressionParser.parse(cron.value, tz ? { tz } : {});
      return parser.take((Number(lastRuns.value) || 5) * -1).map((d) => formatExecution(d, tz));
    } catch {
      return [];
    }
  });

  function setPreset(expression: string) {
    cron.value = expression;
  }

  return {
    cron,
    timezone,
    nextRuns,
    lastRuns,
    hasError,
    description,
    presets,
    timezones,
    nextExecutions,
    lastExecutions,
    setPreset,
  };
}
