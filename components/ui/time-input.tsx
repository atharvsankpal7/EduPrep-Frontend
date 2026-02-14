import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeInputProps {
  value: number; // in minutes
  onChange: (value: number) => void;
  className?: string;
}

export function TimeInput({ value, onChange, className }: TimeInputProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Sync internal state with external value prop
  useEffect(() => {
    // Avoid updating if the internal state matches the external value (to prevent loops/jitter)
    const totalSeconds = Math.round(value * 60);
    const currentTotalSeconds = hours * 3600 + minutes * 60 + seconds;

    // Allow a small tolerance for float comparison or just strict equality for integers
    if (Math.abs(totalSeconds - currentTotalSeconds) > 1) {
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }
  }, [value]);

  const handleTimeChange = (type: 'hours' | 'minutes' | 'seconds', val: string) => {
    const numVal = Math.max(0, parseInt(val) || 0);

    let newHours = hours;
    let newMinutes = minutes;
    let newSeconds = seconds;

    if (type === 'hours') newHours = numVal;
    if (type === 'minutes') newMinutes = numVal;
    if (type === 'seconds') newSeconds = numVal;

    // Update local state immediately for responsiveness
    setHours(newHours);
    setMinutes(newMinutes);
    setSeconds(newSeconds);

    // Calculate total minutes and notify parent
    const totalMinutes = (newHours * 60) + newMinutes + (newSeconds / 60);
    onChange(totalMinutes);
  };

  return (
    <div className={`flex items-end gap-2 ${className}`}>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Hours</Label>
        <Input
          type="number"
          min={0}
          value={hours}
          onChange={(e) => handleTimeChange('hours', e.target.value)}
          className="w-16"
        />
      </div>
      <span className="pb-2 font-bold text-muted-foreground">:</span>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Minutes</Label>
        <Input
          type="number"
          min={0}
          max={59}
          value={minutes}
          onChange={(e) => handleTimeChange('minutes', e.target.value)}
          className="w-16"
        />
      </div>
      <span className="pb-2 font-bold text-muted-foreground">:</span>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Seconds</Label>
        <Input
          type="number"
          min={0}
          max={59}
          value={seconds}
          onChange={(e) => handleTimeChange('seconds', e.target.value)}
          className="w-16"
        />
      </div>
    </div>
  );
}
