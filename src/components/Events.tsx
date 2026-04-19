"use client";

import { useState, useMemo } from "react";
import { Event, EventType } from "@/types/event";
import { sampleEvents, eventTypes, getEventTypeConfig } from "@/data/sampleEvents";
import {
  PageHeader,
  PillCard,
  PillText,
  PrimaryButton,
  GhostButton,
  Input,
  Select,
  Textarea,
  FieldLabel,
  SectionHeading,
  EmptyState,
  Tag,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "./ui";

const TYPE_COLORS: Record<EventType, string> = {
  "own-event": "#3b82f6",
  "private-hire": "#9333ea",
  "aunt-sally": "#22c55e",
  darts: "#f97316",
  pool: "#ec4899",
};

export default function Events() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    type: "own-event" as EventType,
    startTime: "19:00",
    endTime: "22:00",
    notes: "",
    setupConditions: "",
    staffNotes: "",
    location: "",
    organizer: "Blaine",
    attendees: 0,
  });

  const monthName = currentDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const { gridDays, monthEvents } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const prevLast = new Date(year, month, 0).getDate();

    const prev = Array.from({ length: firstDayOfWeek }, (_, i) => {
      return new Date(year, month - 1, prevLast - firstDayOfWeek + i + 1);
    });
    const cur = Array.from({ length: lastDay.getDate() }, (_, i) => new Date(year, month, i + 1));
    const nextCount = 42 - (prev.length + cur.length);
    const next = Array.from({ length: nextCount }, (_, i) => new Date(year, month + 1, i + 1));
    const days = [...prev, ...cur, ...next];

    const me = events.filter(
      (e) => e.date.getFullYear() === year && e.date.getMonth() === month,
    );

    return {
      gridDays: days.map((d) => ({
        date: d,
        events: events.filter(
          (e) =>
            e.date.getDate() === d.getDate() &&
            e.date.getMonth() === d.getMonth() &&
            e.date.getFullYear() === d.getFullYear(),
        ),
      })),
      monthEvents: me,
    };
  }, [currentDate, events]);

  const isToday = (d: Date) => {
    const t = new Date();
    return (
      d.getDate() === t.getDate() &&
      d.getMonth() === t.getMonth() &&
      d.getFullYear() === t.getFullYear()
    );
  };
  const isCurrentMonth = (d: Date) =>
    d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();

  const handleAdd = () => {
    if (!newEvent.title.trim() || !newEvent.date || !newEvent.startTime || !newEvent.endTime) return;
    setEvents((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newEvent.title,
        date: new Date(newEvent.date),
        type: newEvent.type,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        notes: newEvent.notes,
        setupConditions: newEvent.setupConditions,
        staffNotes: newEvent.staffNotes,
        location: newEvent.location || undefined,
        organizer: newEvent.organizer || undefined,
        attendees: newEvent.attendees || undefined,
      },
    ]);
    setNewEvent({
      title: "",
      date: new Date().toISOString().split("T")[0],
      type: "own-event",
      startTime: "19:00",
      endTime: "22:00",
      notes: "",
      setupConditions: "",
      staffNotes: "",
      location: "",
      organizer: "Blaine",
      attendees: 0,
    });
    setShowAdd(false);
  };

  const selectedDayEvents = selectedDate
    ? gridDays.find(
        (d) =>
          d.date.getDate() === selectedDate.getDate() &&
          d.date.getMonth() === selectedDate.getMonth() &&
          d.date.getFullYear() === selectedDate.getFullYear(),
      )?.events || []
    : [];

  return (
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
      <PageHeader
        title="Events"
        subtitle="Pub events, fixtures & private hires"
        action={<PrimaryButton onClick={() => setShowAdd((s) => !s)}>+ New event</PrimaryButton>}
      />

      {/* Legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface-1)",
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 11.5, color: "var(--text-dim)", marginRight: 4 }}>Types</span>
        {eventTypes.map((t) => (
          <Tag key={t.type} label={t.label} color={TYPE_COLORS[t.type]} />
        ))}
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <GhostButton onClick={() => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>
            <ChevronLeftIcon />
          </GhostButton>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text)",
              minWidth: 160,
              textAlign: "center",
              letterSpacing: "-0.01em",
            }}
          >
            {monthName}
          </div>
          <GhostButton onClick={() => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
            <ChevronRightIcon />
          </GhostButton>
          <div style={{ flex: 1 }} />
          <GhostButton onClick={() => setCurrentDate(new Date())}>Today</GhostButton>
        </div>

        {showAdd && (
          <div
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New event</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <FieldLabel>Title</FieldLabel>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent((n) => ({ ...n, title: e.target.value }))}
                  style={{ width: "100%" }}
                  placeholder="Event title"
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <FieldLabel>Date</FieldLabel>
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent((n) => ({ ...n, date: e.target.value }))}
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <FieldLabel>Type</FieldLabel>
                  <Select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent((n) => ({ ...n, type: e.target.value as EventType }))}
                    style={{ width: "100%" }}
                  >
                    {eventTypes.map((t) => (
                      <option key={t.type} value={t.type}>
                        {t.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <FieldLabel>Start</FieldLabel>
                  <Input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent((n) => ({ ...n, startTime: e.target.value }))}
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <FieldLabel>End</FieldLabel>
                  <Input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent((n) => ({ ...n, endTime: e.target.value }))}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <FieldLabel>Location</FieldLabel>
                  <Input
                    value={newEvent.location}
                    onChange={(e) => setNewEvent((n) => ({ ...n, location: e.target.value }))}
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <FieldLabel>Organizer</FieldLabel>
                  <Input
                    value={newEvent.organizer}
                    onChange={(e) => setNewEvent((n) => ({ ...n, organizer: e.target.value }))}
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ width: 100 }}>
                  <FieldLabel>Attendees</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    value={newEvent.attendees}
                    onChange={(e) =>
                      setNewEvent((n) => ({ ...n, attendees: parseInt(e.target.value) || 0 }))
                    }
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Notes</FieldLabel>
                <Textarea
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent((n) => ({ ...n, notes: e.target.value }))}
                  style={{ width: "100%", minHeight: 56 }}
                />
              </div>
              <div>
                <FieldLabel>Setup conditions</FieldLabel>
                <Textarea
                  value={newEvent.setupConditions}
                  onChange={(e) => setNewEvent((n) => ({ ...n, setupConditions: e.target.value }))}
                  style={{ width: "100%", minHeight: 56 }}
                />
              </div>
              <div>
                <FieldLabel>Staff notes</FieldLabel>
                <Textarea
                  value={newEvent.staffNotes}
                  onChange={(e) => setNewEvent((n) => ({ ...n, staffNotes: e.target.value }))}
                  style={{ width: "100%", minHeight: 56 }}
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <PrimaryButton
                  onClick={handleAdd}
                  disabled={
                    !newEvent.title.trim() ||
                    !newEvent.date ||
                    !newEvent.startTime ||
                    !newEvent.endTime
                  }
                >
                  Add event
                </PrimaryButton>
                <GhostButton onClick={() => setShowAdd(false)}>Cancel</GhostButton>
              </div>
            </div>
          </div>
        )}

        {/* Calendar grid */}
        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                style={{
                  padding: "8px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  textAlign: "center",
                }}
              >
                {d}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {gridDays.map((dd, i) => {
              const inMonth = isCurrentMonth(dd.date);
              const today = isToday(dd.date);
              const has = dd.events.length > 0;
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (has) {
                      setSelectedDate(dd.date);
                      setModalOpen(true);
                    }
                  }}
                  disabled={!has}
                  style={{
                    minHeight: 86,
                    borderRight: (i + 1) % 7 === 0 ? "none" : "1px solid var(--border)",
                    borderBottom: i < 35 ? "1px solid var(--border)" : "none",
                    padding: 6,
                    background: today ? "var(--accent-soft)" : "transparent",
                    color: inMonth ? "var(--text)" : "var(--text-faint)",
                    cursor: has ? "pointer" : "default",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    transition: "background 120ms",
                  }}
                  onMouseEnter={(e) => {
                    if (has)
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = today
                      ? "var(--accent-soft)"
                      : "transparent";
                  }}
                >
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: today ? 600 : 500,
                      color: today ? "var(--accent-bright)" : inMonth ? "var(--text)" : "var(--text-faint)",
                    }}
                  >
                    {dd.date.getDate()}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {dd.events.slice(0, 2).map((ev) => {
                      const color = TYPE_COLORS[ev.type];
                      return (
                        <div
                          key={ev.id}
                          title={`${ev.title} · ${ev.startTime}–${ev.endTime}`}
                          style={{
                            fontSize: 10.5,
                            padding: "1px 5px",
                            borderRadius: 4,
                            background: `${color}22`,
                            color,
                            border: `1px solid ${color}44`,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                    {dd.events.length > 2 && (
                      <span style={{ fontSize: 10, color: "var(--text-dim)" }}>
                        +{dd.events.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Month list */}
        <div>
          <SectionHeading dotColor="var(--accent)" title={`Events in ${monthName}`} count={monthEvents.length} />
          {monthEvents.length === 0 ? (
            <EmptyState title="No events this month" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {monthEvents.map((ev) => {
                const color = TYPE_COLORS[ev.type];
                const cfg = getEventTypeConfig(ev.type);
                return (
                  <PillCard
                    key={ev.id}
                    color={color}
                    style={{ padding: "12px 16px", cursor: "pointer" }}
                    onClick={() => {
                      setSelectedDate(ev.date);
                      setModalOpen(true);
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 4,
                            flexWrap: "wrap",
                          }}
                        >
                          <PillText style={{ fontSize: 13, fontWeight: 500 }}>{ev.title}</PillText>
                          <Tag label={cfg.label} color={color} />
                        </div>
                        <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                          {ev.date.toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}{" "}
                          · {ev.startTime}–{ev.endTime}
                          {ev.location ? ` · ${ev.location}` : ""}
                        </div>
                      </div>
                    </div>
                  </PillCard>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {modalOpen && selectedDate && (
        <EventDetailsModal
          date={selectedDate}
          events={selectedDayEvents}
          onClose={() => {
            setModalOpen(false);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}

function EventDetailsModal({
  date,
  events,
  onClose,
}: {
  date: Date;
  events: Event[];
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.55)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 560,
          maxHeight: "80vh",
          overflow: "auto",
          background: "var(--surface-1)",
          border: "1px solid var(--border-strong)",
          borderRadius: 10,
          boxShadow: "0 10px 32px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
              {date.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
              {events.length} event{events.length !== 1 ? "s" : ""}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CloseIcon />
          </button>
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {events.map((ev) => {
            const color = TYPE_COLORS[ev.type];
            const cfg = getEventTypeConfig(ev.type);
            return (
              <div
                key={ev.id}
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: 14,
                  boxShadow: `inset 2px 0 0 ${color}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <PillText style={{ fontSize: 13.5, fontWeight: 600 }}>{ev.title}</PillText>
                  <Tag label={cfg.label} color={color} />
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginBottom: 10 }}>
                  {ev.startTime}–{ev.endTime}
                  {ev.location ? ` · ${ev.location}` : ""}
                  {ev.organizer ? ` · ${ev.organizer}` : ""}
                  {ev.attendees ? ` · ${ev.attendees} attending` : ""}
                </div>
                {ev.notes && <ModalField label="Notes" value={ev.notes} />}
                {ev.setupConditions && <ModalField label="Setup" value={ev.setupConditions} />}
                {ev.staffNotes && <ModalField label="Staff notes" value={ev.staffNotes} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ModalField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          fontSize: 10.5,
          color: "var(--text-dim)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 3,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 12.5, color: "var(--text)", lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}
