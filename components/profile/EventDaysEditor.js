import { useEffect, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { updateEvent } from "@/utils/api/wedding-timeline";

const inputClass =
  "w-full bg-wedsy-ivory-2 border border-wedsy-rose-100 px-3 py-2 text-[14px] text-wedsy-ink focus:outline-none focus:border-wedsy-burgundy-soft transition-colors";

function FieldGroup({ label, error, children }) {
  return (
    <div>
      <label className="block text-[10px] tracking-[1.5px] uppercase text-wedsy-ink-3 font-medium mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] text-wedsy-burgundy mt-1">{error}</p>}
    </div>
  );
}

function toDateInputValue(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toTimeInputValue(value) {
  if (!value) return "";
  if (/^\d{2}:\d{2}$/.test(value)) return value;
  const match = String(value).match(/(\d{1,2}):(\d{2})/);
  if (!match) return "";
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function normalizeDayForEditing(day) {
  return {
    ...day,
    date: toDateInputValue(day?.date),
    time: toTimeInputValue(day?.time),
    name: day?.name || "",
    venue: day?.venue || "",
  };
}

export default function EventDaysEditor({
  eventDays,
  eventId,
  token,
  focusIndex,
  onSave,
  onCancel,
}) {
  const [editingDays, setEditingDays] = useState(() =>
    (eventDays || []).map(normalizeDayForEditing)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [confirmingDeleteIndex, setConfirmingDeleteIndex] = useState(null);
  const [pendingFocusIndex, setPendingFocusIndex] = useState(null);
  const refsArray = useRef([]);

  useEffect(() => {
    if (focusIndex == null) return;
    const row = refsArray.current[focusIndex];
    if (!row) return;
    const input = row.querySelector("input");
    if (input) input.focus();
  }, [focusIndex]);

  useEffect(() => {
    if (pendingFocusIndex == null) return;
    const row = refsArray.current[pendingFocusIndex];
    if (!row) return;
    const input = row.querySelector("input");
    if (input) input.focus();
    setPendingFocusIndex(null);
  }, [pendingFocusIndex]);

  const handleAddDay = () => {
    setEditingDays((days) => {
      const next = [...days, { name: "", date: "", time: "", venue: "" }];
      setPendingFocusIndex(next.length - 1);
      return next;
    });
  };

  const handleRemoveDay = (index) => {
    setEditingDays((days) => days.filter((_, i) => i !== index));
    setConfirmingDeleteIndex(null);
    setValidationErrors((errors) => {
      const next = {};
      Object.entries(errors).forEach(([key, val]) => {
        const idx = parseInt(key, 10);
        if (idx < index) next[idx] = val;
        else if (idx > index) next[idx - 1] = val;
      });
      return next;
    });
  };

  const updateField = (i, field, value) => {
    setEditingDays((days) =>
      days.map((d, idx) => (idx === i ? { ...d, [field]: value } : d))
    );
    setValidationErrors((prev) => {
      if (!prev[i] || !prev[i][field]) return prev;
      const next = { ...prev, [i]: { ...prev[i] } };
      delete next[i][field];
      if (Object.keys(next[i]).length === 0) delete next[i];
      return next;
    });
  };

  const handleSave = async () => {
    const errors = {};
    editingDays.forEach((day, i) => {
      const rowErrors = {};
      if (!day.name?.trim()) rowErrors.name = "Required";
      if (!day.date) rowErrors.date = "Required";
      if (!day.time) rowErrors.time = "Required";
      if (!day.venue?.trim()) rowErrors.venue = "Required";
      if (Object.keys(rowErrors).length > 0) errors[i] = rowErrors;
    });
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSaving(true);
    setSaveError(null);
    const payload = {
      eventDays: editingDays.map((d) => ({
        ...d,
        name: d.name.trim(),
        venue: d.venue.trim(),
      })),
    };
    const { error } = await updateEvent(eventId, payload, token);
    if (error) {
      setSaveError("Couldn't save changes. Try again.");
      setIsSaving(false);
      return;
    }
    setIsSaving(false);
    if (onSave) await onSave();
  };

  return (
    <div className="bg-wedsy-ivory border border-wedsy-rose-100 mt-4 mx-6 lg:mx-0 p-5 lg:p-6">
      <div className="flex justify-between items-baseline mb-4">
        <p className="wedsy-eyebrow">EDIT EVENT DAYS</p>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="text-[11px] tracking-[2px] uppercase text-wedsy-ink-3 hover:text-wedsy-burgundy font-medium disabled:opacity-50"
        >
          Cancel
        </button>
      </div>

      <div className="space-y-4">
        {editingDays.map((day, i) => (
          <div
            key={i}
            ref={(el) => {
              refsArray.current[i] = el;
            }}
            className="border border-wedsy-rose-100 bg-white p-4 space-y-3 lg:grid lg:grid-cols-[1fr_1fr_120px_1.5fr_auto] lg:gap-3 lg:space-y-0 lg:items-end"
          >
            <FieldGroup label="Day name" error={validationErrors[i]?.name}>
              <input
                type="text"
                value={day.name}
                onChange={(e) => updateField(i, "name", e.target.value)}
                className={inputClass}
                placeholder="e.g., Mehendi"
              />
            </FieldGroup>
            <FieldGroup label="Date" error={validationErrors[i]?.date}>
              <input
                type="date"
                value={day.date}
                onChange={(e) => updateField(i, "date", e.target.value)}
                className={inputClass}
              />
            </FieldGroup>
            <FieldGroup label="Time" error={validationErrors[i]?.time}>
              <input
                type="time"
                value={day.time}
                onChange={(e) => updateField(i, "time", e.target.value)}
                className={inputClass}
              />
            </FieldGroup>
            <FieldGroup label="Venue" error={validationErrors[i]?.venue}>
              <input
                type="text"
                value={day.venue}
                onChange={(e) => updateField(i, "venue", e.target.value)}
                className={inputClass}
                placeholder="e.g., Bangalore International Centre"
              />
            </FieldGroup>
            {editingDays.length > 1 ? (
              confirmingDeleteIndex === i ? (
                <div className="flex items-center gap-2 lg:justify-self-end pt-2 lg:pt-0">
                  <span className="font-serif italic text-[12px] text-wedsy-burgundy">Remove?</span>
                  <button type="button" onClick={() => handleRemoveDay(i)} className="text-[11px] tracking-[1.5px] uppercase text-wedsy-burgundy hover:text-wedsy-rose-600 font-medium">Yes</button>
                  <button type="button" onClick={() => setConfirmingDeleteIndex(null)} className="text-[11px] tracking-[1.5px] uppercase text-wedsy-ink-3 hover:text-wedsy-ink">Cancel</button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmingDeleteIndex(i)} aria-label="Remove this day" className="text-wedsy-ink-3 hover:text-wedsy-burgundy lg:justify-self-end p-1">
                  <Trash2 size={16} />
                </button>
              )
            ) : (
              <div title="Need at least one day" className="text-wedsy-ink-3 opacity-30 lg:justify-self-end p-1">
                <Trash2 size={16} />
              </div>
            )}
          </div>
        ))}
      </div>

      <button type="button" onClick={handleAddDay} disabled={isSaving} className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[2px] uppercase text-wedsy-rose-600 hover:text-wedsy-burgundy font-medium disabled:opacity-50">
        <Plus size={14} />
        Add another day
      </button>

      {saveError && (
        <p className="font-serif italic text-[12px] text-wedsy-burgundy mt-3 text-center">
          {saveError}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="text-[11px] tracking-[2px] uppercase text-wedsy-ink-3 px-6 py-3 hover:text-wedsy-burgundy font-medium disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="text-[11px] tracking-[2px] uppercase bg-wedsy-burgundy text-wedsy-ivory px-8 py-3 hover:bg-wedsy-burgundy-soft font-medium disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
