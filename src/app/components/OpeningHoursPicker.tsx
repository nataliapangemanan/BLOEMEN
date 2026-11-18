import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface OpeningHoursPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const DAYS = [
  { value: 'senin', label: 'Senin' },
  { value: 'selasa', label: 'Selasa' },
  { value: 'rabu', label: 'Rabu' },
  { value: 'kamis', label: 'Kamis' },
  { value: 'jumat', label: 'Jumat' },
  { value: 'sabtu', label: 'Sabtu' },
  { value: 'minggu', label: 'Minggu' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return { value: `${hour}:00`, label: `${hour}:00` };
});

export default function OpeningHoursPicker({ value, onChange, disabled = false }: OpeningHoursPickerProps) {
  const [startDay, setStartDay] = useState('senin');
  const [endDay, setEndDay] = useState('sabtu');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('20:00');

  // Parse initial value
  useEffect(() => {
    if (value) {
      // Parse format: "Senin - Sabtu: 08:00 - 20:00"
      const match = value.match(/(\w+)\s*-\s*(\w+):\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/i);
      if (match) {
        const [, start, end, timeStart, timeEnd] = match;
        setStartDay(start.toLowerCase());
        setEndDay(end.toLowerCase());
        setStartTime(timeStart);
        setEndTime(timeEnd);
      }
    }
  }, []);

  // Update parent when values change
  useEffect(() => {
    const startDayLabel = DAYS.find(d => d.value === startDay)?.label || 'Senin';
    const endDayLabel = DAYS.find(d => d.value === endDay)?.label || 'Sabtu';
    const formattedValue = `${startDayLabel} - ${endDayLabel}: ${startTime} - ${endTime}`;
    onChange(formattedValue);
  }, [startDay, endDay, startTime, endTime]);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Start Day */}
        <div>
          <Label htmlFor="startDay" className="text-sm mb-2 block">
            Hari Mulai
          </Label>
          <Select value={startDay} onValueChange={setStartDay} disabled={disabled}>
            <SelectTrigger id="startDay">
              <SelectValue placeholder="Pilih hari" />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* End Day */}
        <div>
          <Label htmlFor="endDay" className="text-sm mb-2 block">
            Hari Selesai
          </Label>
          <Select value={endDay} onValueChange={setEndDay} disabled={disabled}>
            <SelectTrigger id="endDay">
              <SelectValue placeholder="Pilih hari" />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Start Time */}
        <div>
          <Label htmlFor="startTime" className="text-sm mb-2 block">
            Jam Buka
          </Label>
          <Select value={startTime} onValueChange={setStartTime} disabled={disabled}>
            <SelectTrigger id="startTime">
              <SelectValue placeholder="Pilih jam" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {HOURS.map((hour) => (
                <SelectItem key={hour.value} value={hour.value}>
                  {hour.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* End Time */}
        <div>
          <Label htmlFor="endTime" className="text-sm mb-2 block">
            Jam Tutup
          </Label>
          <Select value={endTime} onValueChange={setEndTime} disabled={disabled}>
            <SelectTrigger id="endTime">
              <SelectValue placeholder="Pilih jam" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {HOURS.map((hour) => (
                <SelectItem key={hour.value} value={hour.value}>
                  {hour.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-3 bg-secondary/50 rounded-lg flex items-start gap-2">
        <Clock className="w-4 h-4 mt-0.5 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm font-medium">Pratinjau Jam Operasional:</p>
          <p className="text-sm text-muted-foreground mt-1">
            {DAYS.find(d => d.value === startDay)?.label} - {DAYS.find(d => d.value === endDay)?.label}: {startTime} - {endTime}
          </p>
        </div>
      </div>
    </div>
  );
}