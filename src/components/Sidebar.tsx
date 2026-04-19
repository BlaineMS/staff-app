'use client';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    { id: 'notice-board', label: 'Notice Board' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'stock', label: 'Stock', soon: false },
    { id: 'events', label: 'Events', soon: false },
    { id: 'rota', label: 'Rota', soon: true },
  ];

  return (
    <header className="w-full border-b border-white/10 bg-black/30 backdrop-blur-sm px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <span className="text-white font-bold text-xs">CW</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-white text-sm font-semibold leading-none">Staff App</p>
          <p className="text-white/50 text-xs mt-0.5">The Catherine Wheel</p>
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.soon && onTabChange?.(tab.id)}
            disabled={tab.soon}
            className={`px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap transition-all
              ${tab.soon
                ? 'text-white/30 cursor-not-allowed'
                : activeTab === tab.id
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
          >
            {tab.label}
            {tab.soon && <span className="ml-1 text-xs opacity-60">soon</span>}
          </button>
        ))}
      </nav>
    </header>
  );
}
