"use client";

import { useState, useEffect } from "react";
import { staffMembers as sampleStaffMembers } from "@/data/sampleData";
import {
  PageHeader,
  PillCard,
  PillText,
  GhostButton,
  Tag,
  SectionHeading,
  EmptyState,
  Checkbox,
} from "./ui";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  color: string;
}

export type TaskCategory = "Opening" | "Closing" | "Cellar" | "Kitchen" | "Bar" | "General" | "Personal";

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  completed: boolean;
  assignedTo?: string;
}

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  Opening: "#8b5cf6",
  Closing: "#ec4899",
  Cellar: "#0ea5e9",
  Kitchen: "#22c55e",
  Bar: "#f59e0b",
  General: "#9ca3af",
  Personal: "#a855f7",
};

// STAFF_COLORS will be replaced with live staff data

const generalTasks: Task[] = [
  { id: "1", name: "Open up and disable alarm", category: "Opening", completed: false },
  { id: "2", name: "Check cellar temperature", category: "Cellar", completed: false },
  { id: "3", name: "Wipe down all tables", category: "Bar", completed: false },
  { id: "4", name: "Restock beer fridges", category: "Bar", completed: false },
  { id: "5", name: "Check toilet cleanliness", category: "General", completed: false },
  { id: "6", name: "Cash up float", category: "Opening", completed: false },
  { id: "7", name: "Check gas levels", category: "Cellar", completed: false },
  { id: "8", name: "Clean coffee machine", category: "Kitchen", completed: false },
  { id: "9", name: "Lock up and set alarm", category: "Closing", completed: false },
  { id: "10", name: "Empty bins", category: "Closing", completed: false },
];

const personalTasks: Task[] = [
  { id: "p1", name: "Deep clean the cellar", category: "Personal", completed: false, assignedTo: "Tracy" },
  { id: "p2", name: "Fix the wobbly bar stool", category: "Personal", completed: false, assignedTo: "Tracy" },
  { id: "p3", name: "Update the specials board", category: "Personal", completed: false, assignedTo: "Sacha" },
  { id: "p4", name: "Call the drinks supplier", category: "Personal", completed: false, assignedTo: "Sacha" },
  { id: "p5", name: "Organize storage room", category: "Personal", completed: false, assignedTo: "Kylie" },
  { id: "p6", name: "Check first aid kit", category: "Personal", completed: false, assignedTo: "Ella" },
  { id: "p7", name: "Clean beer lines", category: "Personal", completed: false, assignedTo: "Nick" },
  { id: "p8", name: "Update staff contact list", category: "Personal", completed: false, assignedTo: "Tom" },
  { id: "p9", name: "Restock cocktail garnishes", category: "Personal", completed: false, assignedTo: "Becca" },
  { id: "p10", name: "Clean coffee machine thoroughly", category: "Personal", completed: false, assignedTo: "Kim" },
  { id: "p11", name: "Check outdoor furniture condition", category: "Personal", completed: false, assignedTo: "Col" },
];

export default function Tasks() {
  const [selectedStaff, setSelectedStaff] = useState<string>("All");
  const [tasks, setTasks] = useState<Task[]>([...generalTasks, ...personalTasks]);
  const [liveStaff, setLiveStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    // Fetch live staff from Square
    fetch('/api/staff')
      .then(r => r.json())
      .then(d => setLiveStaff(d.staff || []))
      .catch(() => {});

    // Fetch persisted tasks from Mission Control API
    fetch('http://localhost:3000/api/staff-board/staff-tasks')
      .then(r => r.json())
      .then(d => {
        if (d.tasks && d.tasks.length > 0) {
          // Merge API tasks with local defaults (API takes precedence by id)
          setTasks(prev => {
            const apiIds = new Set(d.tasks.map((t: Task) => t.id));
            const localOnly = prev.filter(t => !apiIds.has(t.id));
            return [...d.tasks, ...localOnly];
          });
        }
      })
      .catch(() => {});
  }, []);

  const getStaffColor = (name: string) => {
    return liveStaff.find(s => s.name === name)?.color ?? "#9ca3af";
  };

  const staffList = ["All", ...liveStaff.map(s => s.name)];

  const handleToggle = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      const task = updated.find(t => t.id === id);
      if (task) {
        // Map local task format to MC API format
        fetch('http://localhost:3000/api/staff-board/staff-tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: task.name,
            description: task.category,
            assignee: task.assignedTo || 'general',
            status: task.completed ? 'done' : 'todo',
            priority: 'medium',
          }),
        }).catch(() => {});
      }
      return updated;
    });
  };

  const filtered = tasks.filter((t) =>
    selectedStaff === "All" ? !t.assignedTo : !t.assignedTo || t.assignedTo === selectedStaff,
  );

  const sorted = [...filtered].sort((a, b) => Number(a.completed) - Number(b.completed));
  const personals = sorted.filter((t) => t.assignedTo);
  const generals = sorted.filter((t) => !t.assignedTo);

  const completed = filtered.filter((t) => t.completed).length;

  return (
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
      <PageHeader
        title="Tasks"
        subtitle="Daily tasks across the pub"
        action={
          <span
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "5px 10px",
            }}
          >
            {completed} / {filtered.length} done
          </span>
        }
      />

      {/* Staff filter */}
      <div
        className="scroll-row"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 16px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface-1)",
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 11.5, color: "var(--text-dim)", marginRight: 4 }}>Staff</span>
        {staffList.map((name) => (
          <GhostButton
            key={name}
            active={selectedStaff === name}
            onClick={() => setSelectedStaff(name)}
          >
            {name}
          </GhostButton>
        ))}
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 18 }}>
        {selectedStaff !== "All" && personals.length > 0 && (
          <div>
            <SectionHeading
              dotColor={CATEGORY_COLORS.Personal}
              title={`Personal tasks — ${selectedStaff}`}
              count={personals.length}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {personals.map((t) => (
                <TaskRow key={t.id} task={t} onToggle={handleToggle} />
              ))}
            </div>
          </div>
        )}

        <div>
          <SectionHeading
            dotColor={CATEGORY_COLORS.General}
            title="General tasks"
            count={generals.length}
          />
          {generals.length === 0 ? (
            <EmptyState title="All tasks completed" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {generals.map((t) => (
                <TaskRow key={t.id} task={t} onToggle={handleToggle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: string) => void }) {
    const color = CATEGORY_COLORS[task.category];
    const staffColor = task.assignedTo ? getStaffColor(task.assignedTo) : null;
    return (
      <PillCard color={color} style={{ padding: "10px 14px", opacity: task.completed ? 0.6 : 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Checkbox checked={task.completed} onClick={() => onToggle(task.id)} color={color} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <PillText
              style={{
                fontSize: 13,
                fontWeight: 500,
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "var(--text-muted)" : "var(--text)",
              }}
            >
              {task.name}
            </PillText>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {staffColor && task.assignedTo && <Tag label={task.assignedTo} color={staffColor} />}
            <Tag label={task.category} color={color} />
          </div>
        </div>
      </PillCard>
    );
  }
}
