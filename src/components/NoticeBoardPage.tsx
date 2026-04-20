"use client";

import { useState, useEffect } from "react";
import { sampleNotices, categories, samplePersonalMessages, staffMembers as sampleStaffMembers } from "@/data/sampleData";
import { Notice, NoticeCategory, PersonalMessage } from "@/types/notice";
import {
  PageHeader,
  PillCard,
  PillText,
  PrimaryButton,
  GhostButton,
  Input,
  Textarea,
  Select,
  FieldLabel,
  SectionHeading,
  EmptyState,
  Tag,
  CheckIcon,
} from "./ui";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  color: string;
}

const CATEGORY_COLORS: Record<NoticeCategory, string> = {
  Urgent: "#ef4444",
  General: "#8b5cf6",
  Rota: "#22c55e",
  "Health & Safety": "#f59e0b",
};

function formatTimeAgo(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffHours < 48) return "yesterday";
  const days = Math.floor(diffHours / 24);
  return `${days}d ago`;
}

export default function NoticeBoardPage() {
  const [viewMode, setViewMode] = useState<"all-staff" | "personal">("all-staff");
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | "All">("All");
  const [notices, setNotices] = useState(sampleNotices);
  const [personalMessages, setPersonalMessages] = useState<PersonalMessage[]>(samplePersonalMessages);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [liveStaff, setLiveStaff] = useState<StaffMember[]>([]);
  const [newNotice, setNewNotice] = useState({
    title: "",
    message: "",
    category: "General" as NoticeCategory,
    postedBy: "Blaine M-S",
  });

  useEffect(() => {
    // Fetch live staff from Square
    fetch('/api/staff')
      .then(r => r.json())
      .then(d => setLiveStaff(d.staff || []))
      .catch(() => {});

    // Fetch notices from Mission Control API
    fetch(`${process.env.NEXT_PUBLIC_MC_URL}/api/staff-board/notices`)
      .then(r => r.json())
      .then(d => {
        if (d.notices && d.notices.length > 0) {
          setNotices(d.notices.map((n: {id:string;title:string;body?:string;message?:string;category?:NoticeCategory;author?:string;postedBy?:string;createdAt:string}) => ({
            id: n.id,
            title: n.title,
            message: n.body || n.message || '',
            category: (n.category || 'General') as NoticeCategory,
            postedBy: n.author || n.postedBy || 'Manager',
            postedAt: new Date(n.createdAt || Date.now()),
          })));
        }
      })
      .catch(() => {});
  }, []);

  const filteredNotices =
    selectedCategory === "All" ? notices : notices.filter((n) => n.category === selectedCategory);

  const handleAddNotice = () => {
    if (!newNotice.title.trim() || !newNotice.message.trim()) return;
    const n: Notice = {
      id: Date.now().toString(),
      title: newNotice.title,
      message: newNotice.message,
      category: newNotice.category,
      postedBy: newNotice.postedBy,
      postedAt: new Date(),
    };
    setNotices((prev) => [n, ...prev]);
    // Persist to Mission Control API (field mapping: body=message, author=postedBy)
    fetch(`${process.env.NEXT_PUBLIC_MC_URL}/api/staff-board/notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: n.title, body: n.message, author: n.postedBy, audience: 'all' }),
    }).catch(() => {});
    setNewNotice({ title: "", message: "", category: "General", postedBy: "Blaine M-S" });
    setShowNoticeForm(false);
  };

  const handleToggleMessageRead = (id: string) => {
    setPersonalMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: !m.read } : m)),
    );
  };

  return (
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
      <PageHeader
        title="Notice Board"
        subtitle="Stay updated with important announcements"
        action={
          viewMode === "all-staff" ? (
            <PrimaryButton onClick={() => setShowNoticeForm((s) => !s)}>
              {showNoticeForm ? "Cancel" : "+ New Notice"}
            </PrimaryButton>
          ) : undefined
        }
      />

      {/* Mode tabs */}
      <div
        className="scroll-row"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface-1)",
          flexShrink: 0,
        }}
      >
        <GhostButton active={viewMode === "all-staff"} onClick={() => setViewMode("all-staff")}>
          All staff
        </GhostButton>
        <GhostButton active={viewMode === "personal"} onClick={() => setViewMode("personal")}>
          Personal
        </GhostButton>
        {viewMode === "all-staff" && (
          <>
            <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 6px" }} />
            {categories.map((c) => (
              <GhostButton
                key={c}
                active={selectedCategory === c}
                onClick={() => setSelectedCategory(c)}
              >
                {c}
              </GhostButton>
            ))}
          </>
        )}
      </div>

      <div style={{ padding: 16, flex: 1 }}>
        {viewMode === "all-staff" ? (
          <>
            {showNoticeForm && (
              <div
                style={{
                  background: "var(--surface-1)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New notice</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      value={newNotice.title}
                      onChange={(e) => setNewNotice((n) => ({ ...n, title: e.target.value }))}
                      placeholder="Notice title"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <FieldLabel>Message</FieldLabel>
                    <Textarea
                      value={newNotice.message}
                      onChange={(e) => setNewNotice((n) => ({ ...n, message: e.target.value }))}
                      placeholder="Notice message"
                      style={{ width: "100%", minHeight: 80 }}
                    />
                  </div>
                  <div className="row-stack" style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <FieldLabel>Category</FieldLabel>
                      <Select
                        value={newNotice.category}
                        onChange={(e) =>
                          setNewNotice((n) => ({
                            ...n,
                            category: e.target.value as NoticeCategory,
                          }))
                        }
                        style={{ width: "100%" }}
                      >
                        {categories
                          .filter((c) => c !== "All")
                          .map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                      </Select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <FieldLabel>Posted by</FieldLabel>
                      <Select
                        value={newNotice.postedBy}
                        onChange={(e) =>
                          setNewNotice((n) => ({ ...n, postedBy: e.target.value }))
                        }
                        style={{ width: "100%" }}
                      >
                        {liveStaff.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <PrimaryButton
                      onClick={handleAddNotice}
                      disabled={!newNotice.title.trim() || !newNotice.message.trim()}
                    >
                      Post notice
                    </PrimaryButton>
                    <GhostButton onClick={() => setShowNoticeForm(false)}>Cancel</GhostButton>
                  </div>
                </div>
              </div>
            )}

            {filteredNotices.length === 0 ? (
              <EmptyState
                title="No notices"
                subtitle={
                  selectedCategory === "All"
                    ? "Post the first notice to get started."
                    : `No ${selectedCategory.toLowerCase()} notices yet.`
                }
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filteredNotices.map((n) => {
                  const color = CATEGORY_COLORS[n.category];
                  return (
                    <PillCard key={n.id} color={color} style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 4,
                            }}
                          >
                            <PillText style={{ fontSize: 13.5, fontWeight: 600 }}>
                              {n.title}
                            </PillText>
                            <Tag label={n.category} color={color} />
                          </div>
                          <div
                            style={{
                              fontSize: 12.5,
                              color: "var(--text-muted)",
                              lineHeight: 1.5,
                              marginBottom: 8,
                            }}
                          >
                            {n.message}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                            Posted by {n.postedBy} · {formatTimeAgo(n.postedAt)}
                          </div>
                        </div>
                      </div>
                    </PillCard>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Staff selector */}
            <div style={{ marginBottom: 16 }}>
              <SectionHeading dotColor="var(--accent)" title="Select your name" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {liveStaff
                  .filter((s) => s.name !== "Blaine Morris-Smith")
                  .map((s) => (
                    <GhostButton
                      key={s.id}
                      active={selectedStaff === s.name}
                      onClick={() =>
                        setSelectedStaff(selectedStaff === s.name ? null : s.name)
                      }
                    >
                      {s.name}
                    </GhostButton>
                  ))}
              </div>
            </div>

            {!selectedStaff ? (
              <EmptyState
                title="Select your name above"
                subtitle="Your personal messages from Blaine will appear here."
              />
            ) : (
              <>
                {(() => {
                  const msgs = personalMessages.filter(
                    (m) =>
                      m.from === "Blaine" && (m.to === selectedStaff || m.to === "All Staff"),
                  );
                  const unread = msgs.filter((m) => !m.read).length;
                  return (
                    <>
                      <SectionHeading
                        dotColor="var(--accent)"
                        title={`Messages for ${selectedStaff}`}
                      />
                      <div style={{ fontSize: 11.5, color: "var(--text-dim)", marginBottom: 12 }}>
                        {msgs.length} total · {unread} unread
                      </div>
                      {msgs.length === 0 ? (
                        <EmptyState title="No messages yet" />
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {msgs.map((m) => (
                            <PillCard
                              key={m.id}
                              color={m.read ? "#4a4d55" : "var(--accent)"}
                              style={{ padding: "12px 16px" }}
                            >
                              <div
                                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                              >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 8,
                                      marginBottom: 6,
                                    }}
                                  >
                                    <PillText style={{ fontSize: 13, fontWeight: 500 }}>
                                      {m.from} → {m.to}
                                    </PillText>
                                    {!m.read && (
                                      <span
                                        style={{
                                          fontSize: 10,
                                          fontWeight: 500,
                                          padding: "1px 6px",
                                          borderRadius: 6,
                                          background: "var(--accent-soft)",
                                          color: "var(--accent-bright)",
                                          border: "1px solid var(--accent)",
                                        }}
                                      >
                                        Unread
                                      </span>
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 12.5,
                                      color: "var(--text-muted)",
                                      lineHeight: 1.5,
                                      marginBottom: 6,
                                    }}
                                  >
                                    {m.content}
                                  </div>
                                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                                    {formatTimeAgo(m.sentAt)}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleToggleMessageRead(m.id)}
                                  style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: 6,
                                    border: `1.5px solid ${
                                      m.read ? "var(--text-dim)" : "var(--accent)"
                                    }`,
                                    background: m.read ? "var(--surface-hover)" : "transparent",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: m.read ? "var(--text-muted)" : "var(--accent)",
                                    flexShrink: 0,
                                  }}
                                  aria-label={m.read ? "Mark unread" : "Mark read"}
                                >
                                  {m.read && <CheckIcon />}
                                </button>
                              </div>
                            </PillCard>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
