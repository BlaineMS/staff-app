"use client";

import { useState } from "react";
import {
  PageHeader,
  PillCard,
  PillText,
  PrimaryButton,
  GhostButton,
  Input,
  Select,
  FieldLabel,
  SectionHeading,
  EmptyState,
  Tag,
  StatusBadge,
  PlusIcon,
  MinusIcon,
} from "./ui";

export type StockCategory = "All" | "Draught" | "Spirit" | "Food" | "Consumables";

export interface StockItem {
  id: string;
  name: string;
  category: StockCategory;
  currentStock: number;
  nominalStock: number;
  supplier?: string;
  type?: string;
}

const CATEGORY_COLORS: Record<StockCategory, string> = {
  All: "#9ca3af",
  Draught: "#3b82f6",
  Spirit: "#9333ea",
  Food: "#22c55e",
  Consumables: "#f97316",
};

const sampleStockItems: StockItem[] = [
  { id: "1", name: "Carlsberg Keg", category: "Draught", currentStock: 3, nominalStock: 5, type: "Keg", supplier: "Carlsberg UK" },
  { id: "2", name: "Guinness Keg", category: "Draught", currentStock: 2, nominalStock: 4, type: "Keg", supplier: "Diageo" },
  { id: "3", name: "Peroni Keg", category: "Draught", currentStock: 4, nominalStock: 6, type: "Keg", supplier: "Asahi" },
  { id: "4", name: "Thatchers Gold Keg", category: "Draught", currentStock: 1, nominalStock: 3, type: "Keg", supplier: "Thatchers Cider" },
  { id: "5", name: "Stella Artois Keg", category: "Draught", currentStock: 5, nominalStock: 7, type: "Keg", supplier: "AB InBev" },
  { id: "6", name: "Vodka Smirnoff", category: "Spirit", currentStock: 2, nominalStock: 4, type: "Bottle", supplier: "Diageo" },
  { id: "7", name: "Gin Bombay Sapphire", category: "Spirit", currentStock: 3, nominalStock: 5, type: "Bottle", supplier: "Bacardi" },
  { id: "8", name: "Rum Bacardi", category: "Spirit", currentStock: 1, nominalStock: 3, type: "Bottle", supplier: "Bacardi" },
  { id: "9", name: "Whiskey Jack Daniels", category: "Spirit", currentStock: 4, nominalStock: 6, type: "Bottle", supplier: "Brown-Forman" },
  { id: "10", name: "Tequila Jose Cuervo", category: "Spirit", currentStock: 2, nominalStock: 4, type: "Bottle", supplier: "Becle" },
  { id: "11", name: "Chips (Case)", category: "Food", currentStock: 8, nominalStock: 12, type: "Case", supplier: "McCain" },
  { id: "12", name: "Burger Buns (Pack)", category: "Food", currentStock: 6, nominalStock: 10, type: "Pack", supplier: "Warburtons" },
  { id: "13", name: "Chicken Wings (Kg)", category: "Food", currentStock: 3, nominalStock: 5, type: "Pack", supplier: "Local Butcher" },
  { id: "14", name: "Nachos (Case)", category: "Food", currentStock: 5, nominalStock: 8, type: "Case", supplier: "Tyrrells" },
  { id: "15", name: "Napkins (Box)", category: "Consumables", currentStock: 4, nominalStock: 8, type: "Box", supplier: "Kimberly-Clark" },
  { id: "16", name: "Cleaning Spray", category: "Consumables", currentStock: 2, nominalStock: 4, type: "Bottle", supplier: "Diversey" },
  { id: "17", name: "Bin Liners (Roll)", category: "Consumables", currentStock: 3, nominalStock: 6, type: "Roll", supplier: "Polybags Ltd" },
  { id: "18", name: "Toilet Paper (Case)", category: "Consumables", currentStock: 7, nominalStock: 10, type: "Case", supplier: "Essity" },
];

function getStockStatus(current: number, nominal: number) {
  if (current === 0) return "out-of-stock" as const;
  if (current < nominal * 0.3) return "low" as const;
  if (current < nominal) return "warning" as const;
  return "good" as const;
}

const STATUS_COLOR: Record<"out-of-stock" | "low" | "warning" | "good", string> = {
  "out-of-stock": "#ef4444",
  low: "#f59e0b",
  warning: "#eab308",
  good: "#22c55e",
};
const STATUS_LABEL = {
  "out-of-stock": "Out of stock",
  low: "Very low",
  warning: "Low",
  good: "Good",
};

export default function Stock() {
  const [stockItems, setStockItems] = useState<StockItem[]>(sampleStockItems);
  const [submitted, setSubmitted] = useState<Set<StockCategory>>(new Set());
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    type: "Keg",
    nominalStock: 1,
    supplier: "",
    category: "Draught" as StockCategory,
  });

  const grouped = stockItems.reduce((acc, item) => {
    if (item.category !== "All") {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
    }
    return acc;
  }, {} as Record<StockCategory, StockItem[]>);

  const cats = Object.keys(grouped) as StockCategory[];

  const increment = (id: string) =>
    setStockItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, currentStock: i.currentStock + 1 } : i)),
    );
  const decrement = (id: string) =>
    setStockItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, currentStock: Math.max(0, i.currentStock - 1) } : i)),
    );
  const setStock = (id: string, v: string) => {
    const n = Math.max(0, parseInt(v) || 0);
    setStockItems((prev) => prev.map((i) => (i.id === id ? { ...i, currentStock: n } : i)));
  };

  const handleAdd = () => {
    if (!newItem.name.trim() || newItem.nominalStock < 1) return;
    setStockItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newItem.name,
        category: newItem.category,
        currentStock: 0,
        nominalStock: newItem.nominalStock,
        type: newItem.type,
        supplier: newItem.supplier,
      },
    ]);
    setNewItem({ name: "", type: "Keg", nominalStock: 1, supplier: "", category: "Draught" });
    setShowAdd(false);
  };

  const submitCategory = async (category: StockCategory, items: StockItem[]) => {
    const deficit = items
      .filter((i) => i.currentStock < i.nominalStock)
      .map((i) => ({
        name: i.name,
        category: i.category,
        quantityNeeded: i.nominalStock - i.currentStock,
        supplier: i.supplier || "Unknown",
        purchased: false,
      }));
    setSubmitted((prev) => new Set(prev).add(category));
    if (deficit.length === 0) {
      alert(`${category} submitted. All items are adequately stocked.`);
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/staff-board/shopping-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: deficit }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      alert(`${category} submitted. ${deficit.length} item(s) added to shopping list.`);
    } catch {
      alert(`${category} submitted locally, but shopping list update failed.`);
    }
  };

  return (
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
      <PageHeader
        title="Stock"
        subtitle="Inventory & restock levels"
        action={<PrimaryButton onClick={() => setShowAdd((s) => !s)}>+ Add item</PrimaryButton>}
      />

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 18 }}>
        {showAdd && (
          <div
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Add stock item</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <FieldLabel>Name</FieldLabel>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem((n) => ({ ...n, name: e.target.value }))}
                  placeholder="Item name"
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <FieldLabel>Type</FieldLabel>
                  <Select
                    value={newItem.type}
                    onChange={(e) => setNewItem((n) => ({ ...n, type: e.target.value }))}
                    style={{ width: "100%" }}
                  >
                    <option value="Keg">Keg</option>
                    <option value="Bottle">Bottle</option>
                    <option value="Case">Case</option>
                    <option value="Pack">Pack</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
                <div style={{ flex: 1 }}>
                  <FieldLabel>Full stock (nominal)</FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    value={newItem.nominalStock}
                    onChange={(e) =>
                      setNewItem((n) => ({ ...n, nominalStock: parseInt(e.target.value) || 1 }))
                    }
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <FieldLabel>Supplier</FieldLabel>
                  <Input
                    value={newItem.supplier}
                    onChange={(e) => setNewItem((n) => ({ ...n, supplier: e.target.value }))}
                    placeholder="Supplier"
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <FieldLabel>Category</FieldLabel>
                  <Select
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem((n) => ({ ...n, category: e.target.value as StockCategory }))
                    }
                    style={{ width: "100%" }}
                  >
                    <option value="Draught">Draught</option>
                    <option value="Spirit">Spirit</option>
                    <option value="Food">Food</option>
                    <option value="Consumables">Consumables</option>
                  </Select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <PrimaryButton
                  onClick={handleAdd}
                  disabled={!newItem.name.trim() || newItem.nominalStock < 1}
                >
                  Add item
                </PrimaryButton>
                <GhostButton onClick={() => setShowAdd(false)}>Cancel</GhostButton>
              </div>
            </div>
          </div>
        )}

        {cats.length === 0 ? (
          <EmptyState title="No stock items yet" />
        ) : (
          cats.map((cat) => {
            const color = CATEGORY_COLORS[cat];
            const items = grouped[cat];
            const isSubmitted = submitted.has(cat);
            return (
              <div key={cat}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{ width: 10, height: 10, borderRadius: "50%", background: color }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text)",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {cat}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-dim)",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "1px 7px",
                    }}
                  >
                    {items.length} items
                  </span>
                  {isSubmitted && <StatusBadge label="Submitted" color="#22c55e" />}
                  <div style={{ flex: 1 }} />
                  <GhostButton onClick={() => submitCategory(cat, items)} disabled={isSubmitted}>
                    {isSubmitted ? "Submitted" : `Submit ${cat}`}
                  </GhostButton>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {items.map((item) => {
                    const status = getStockStatus(item.currentStock, item.nominalStock);
                    const pct = Math.min(100, (item.currentStock / item.nominalStock) * 100);
                    return (
                      <PillCard key={item.id} color={color} style={{ padding: "12px 14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 6,
                                flexWrap: "wrap",
                              }}
                            >
                              <PillText style={{ fontSize: 13, fontWeight: 500 }}>
                                {item.name}
                              </PillText>
                              <Tag label={item.category} color={color} />
                              <StatusBadge
                                label={STATUS_LABEL[status]}
                                color={STATUS_COLOR[status]}
                              />
                            </div>
                            <div
                              style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 6 }}
                            >
                              Nominal {item.nominalStock}
                              {item.type ? ` · ${item.type}` : ""}
                              {item.supplier ? ` · ${item.supplier}` : ""}
                            </div>
                            <div
                              style={{
                                height: 3,
                                background: "rgba(255,255,255,0.06)",
                                borderRadius: 2,
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  width: `${pct}%`,
                                  background: STATUS_COLOR[status],
                                  borderRadius: 2,
                                  transition: "width 0.3s",
                                }}
                              />
                            </div>
                          </div>
                          <div
                            style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
                          >
                            <IconButton onClick={() => decrement(item.id)} aria-label="decrement">
                              <MinusIcon />
                            </IconButton>
                            <input
                              type="number"
                              min={0}
                              value={item.currentStock}
                              onChange={(e) => setStock(item.id, e.target.value)}
                              style={{
                                width: 52,
                                textAlign: "center",
                                background: "var(--surface-2)",
                                border: "1px solid var(--border)",
                                borderRadius: 6,
                                padding: "6px 8px",
                                color: "var(--text)",
                                fontSize: 13,
                                fontWeight: 600,
                                outline: "none",
                              }}
                            />
                            <IconButton onClick={() => increment(item.id)} aria-label="increment">
                              <PlusIcon />
                            </IconButton>
                          </div>
                        </div>
                      </PillCard>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  ...rest
}: {
  children: React.ReactNode;
  onClick?: () => void;
  "aria-label"?: string;
}) {
  return (
    <button
      onClick={onClick}
      {...rest}
      style={{
        width: 26,
        height: 26,
        borderRadius: 6,
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        color: "var(--text-muted)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 120ms",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-hover)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-2)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
      }}
    >
      {children}
    </button>
  );
}
