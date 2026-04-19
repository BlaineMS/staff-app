"use client";

import { useState } from "react";
import NoticeBoardPage from "@/components/NoticeBoardPage";
import Tasks from "@/components/Tasks";
import Stock from "@/components/Stock";
import Events from "@/components/Events";
import {
  BoardIcon,
  TasksIcon,
  StockIcon,
  EventsIcon,
  RotaIcon,
  GridIcon,
  SearchIcon,
  EyeIcon,
  RefreshIcon,
} from "@/components/ui";

type NavId = "notice-board" | "tasks" | "stock" | "events" | "rota";

const NAV_ITEMS: { id: NavId; label: string; icon: () => React.ReactElement; soon?: boolean }[] = [
  { id: "notice-board", label: "Notice Board", icon: BoardIcon },
  { id: "tasks", label: "Tasks", icon: TasksIcon },
  { id: "stock", label: "Stock", icon: StockIcon },
  { id: "events", label: "Events", icon: EventsIcon },
  { id: "rota", label: "Rota", icon: RotaIcon, soon: true },
];

export default function Home() {
  const [active, setActive] = useState<NavId>("notice-board");

  const renderPage = () => {
    switch (active) {
      case "notice-board":
        return <NoticeBoardPage />;
      case "tasks":
        return <Tasks />;
      case "stock":
        return <Stock />;
      case "events":
        return <Events />;
      case "rota":
        return (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-dim)",
              fontSize: 13,
            }}
          >
            Rota — coming soon
          </div>
        );
      default:
        return <NoticeBoardPage />;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        padding: 0,
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100vh",
          background: "var(--surface-0)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            height: 44,
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: 10,
            flexShrink: 0,
            background: "var(--surface-1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: "linear-gradient(135deg, #6e79e0, #4c55bd)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              <GridIcon />
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text)",
                letterSpacing: "-0.01em",
              }}
            >
              Staff App
            </span>
            <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: 2 }}>
              · The Catherine Wheel
            </span>
          </div>
          <div style={{ flex: 1 }} />
          <div
            className="app-topbar-search"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "4px 9px",
              cursor: "text",
              minWidth: 220,
              transition: "border-color 120ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-strong)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
            }}
          >
            <span style={{ color: "var(--text-dim)", display: "flex" }}>
              <SearchIcon />
            </span>
            <span style={{ fontSize: 12.5, color: "var(--text-dim)", flex: 1 }}>Search…</span>
            <span
              style={{
                fontSize: 10.5,
                color: "var(--text-dim)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "1px 5px",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              ⌘K
            </span>
          </div>
          <button
            style={{
              color: "var(--text-dim)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 6,
              display: "flex",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <EyeIcon />
          </button>
          <button
            style={{
              color: "var(--text-dim)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 6,
              display: "flex",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <RefreshIcon />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
          {/* Sidebar (desktop) */}
          <div
            className="app-sidebar"
            style={{
              width: 212,
              flexShrink: 0,
              background: "var(--surface-0)",
              borderRight: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              padding: "10px 8px",
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                color: "var(--text-dim)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "6px 10px 8px",
              }}
            >
              Workspace
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => !item.soon && setActive(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "6px 10px",
                    cursor: item.soon ? "not-allowed" : "pointer",
                    background: isActive ? "var(--surface-hover)" : "transparent",
                    borderRadius: 6,
                    marginBottom: 1,
                    transition: "background 100ms, color 100ms",
                    color: isActive
                      ? "var(--text)"
                      : item.soon
                      ? "var(--text-faint)"
                      : "var(--text-muted)",
                    userSelect: "none",
                    opacity: item.soon ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive && !item.soon) {
                      (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
                      (e.currentTarget as HTMLDivElement).style.color = "var(--text)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive && !item.soon) {
                      (e.currentTarget as HTMLDivElement).style.background = "transparent";
                      (e.currentTarget as HTMLDivElement).style.color = "var(--text-muted)";
                    }
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 16,
                      height: 16,
                      opacity: isActive ? 1 : 0.85,
                    }}
                  >
                    <Icon />
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 500, letterSpacing: "-0.005em", flex: 1 }}>
                    {item.label}
                  </span>
                  {item.soon && (
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--text-dim)",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--border)",
                        borderRadius: 4,
                        padding: "1px 5px",
                      }}
                    >
                      soon
                    </span>
                  )}
                </div>
              );
            })}
            <div style={{ flex: 1 }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderTop: "1px solid var(--border)",
                marginTop: 8,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6e79e0, #4c55bd)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "#fff",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                B
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: "var(--text)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Blaine
                </div>
                <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Manager</div>
              </div>
            </div>
          </div>

          {/* Main */}
          <div
            className="app-main"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              background: "var(--bg)",
            }}
          >
            {renderPage()}
          </div>

          {/* Bottom nav (mobile) */}
          <nav
            className="app-bottom-nav"
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              height: 56,
              background: "var(--surface-1)",
              borderTop: "1px solid var(--border)",
              display: "none",
              alignItems: "stretch",
              justifyContent: "space-around",
              zIndex: 40,
              paddingBottom: "env(safe-area-inset-bottom, 0)",
            }}
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => !item.soon && setActive(item.id)}
                  disabled={item.soon}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    cursor: item.soon ? "not-allowed" : "pointer",
                    color: isActive
                      ? "var(--text)"
                      : item.soon
                      ? "var(--text-faint)"
                      : "var(--text-muted)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 3,
                    padding: "6px 4px",
                    opacity: item.soon ? 0.55 : 1,
                    borderTop: isActive ? "1.5px solid var(--accent)" : "1.5px solid transparent",
                    transition: "color 120ms, border-color 120ms",
                  }}
                >
                  <Icon />
                  <span style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: "-0.005em" }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
