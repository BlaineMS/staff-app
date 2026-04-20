import { NextResponse } from "next/server";

let cache: { data: unknown; ts: number } | null = null;
const TTL = 5 * 60 * 1000;

const COLORS = [
  "#3b82f6","#f97316","#14b8a6","#f59e0b","#22c55e",
  "#7c3aed","#ec4899","#a855f7","#ef4444","#0891b2","#84cc16","#f43f5e"
];

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) return NextResponse.json(cache.data);

  try {
    const token = process.env.SQUARE_ACCESS_TOKEN || "EAAAl1Yw9IHmy4yZX1AAZNSdzDiYEsxQg9POtpWznTxexUsoPcCF6SRkpK6njpFu";
    const res = await fetch("https://connect.squareup.com/v2/team-members/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Square-Version": "2026-01-15",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: { filter: { status: "ACTIVE" } }, limit: 100 }),
    });

    const d = await res.json();
    const members = d.team_members || [];

    const staff = members.map((m: { id: string; given_name?: string; family_name?: string }, i: number) => ({
      id: m.id,
      name: `${m.given_name || ""} ${m.family_name || ""}`.trim(),
      role: "Bar Staff",
      color: COLORS[i % COLORS.length],
    }));

    // Promote Blaine to Manager
    const result = {
      staff: staff.map((s: { id: string; name: string; role: string; color: string }) =>
        s.name.toLowerCase().includes("blaine") ? { ...s, role: "Manager", color: "#7c3aed" } : s
      ),
    };

    cache = { data: result, ts: Date.now() };
    return NextResponse.json(result);
  } catch {
    // Fallback to known active staff
    const result = {
      staff: [
        { id: "TMDjmSLVfFU7SOcI", name: "Ella Townsend",       role: "Bar Staff", color: "#3b82f6" },
        { id: "TMN5S_DnAqovBNEU", name: "Colin Morris-Smith",  role: "Bar Staff", color: "#f97316" },
        { id: "TMUokqRLNBOZkisU", name: "Kim Morris-Smith",    role: "Bar Staff", color: "#14b8a6" },
        { id: "TMdBEDNSDl1RUCEr", name: "Tracy Willoughby",    role: "Bar Staff", color: "#f59e0b" },
        { id: "TMdQFh3wIOFJYM18", name: "Sacha Nisbet",        role: "Bar Staff", color: "#22c55e" },
        { id: "TMjkSH_H8YEd-_M4", name: "Blaine Morris-Smith", role: "Manager",   color: "#7c3aed" },
        { id: "TMlKjRWk7M2P6p8L", name: "Nick Hill",           role: "Bar Staff", color: "#ec4899" },
        { id: "TMlxjhG-sV6LaGn-", name: "Kylie Flynn",         role: "Bar Staff", color: "#a855f7" },
      ],
    };
    cache = { data: result, ts: Date.now() };
    return NextResponse.json(result);
  }
}
