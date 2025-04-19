interface TimeRangeSelectorProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

const timeRanges = [
  { value: "1w", label: "1 Week" },
  { value: "1m", label: "1 Month" },
  { value: "3m", label: "3 Months" },
  { value: "6m", label: "6 Months" },
  { value: "1y", label: "1 Year" },
  { value: "all", label: "All Time" },
];

export default function TimeRangeSelector({
  selectedRange,
  onRangeChange,
}: TimeRangeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            selectedRange === range.value
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => onRangeChange(range.value)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
