'use client';

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen p-6 border-r border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Staff App</h1>
        <p className="text-white/60 text-sm">The Catherine Wheel</p>
      </div>
      
      <nav className="space-y-1">
        <div className="w-full text-left px-4 py-3 rounded-xl bg-primary/20 text-primary border border-primary/30">
          <span className="font-medium">Notice Board</span>
        </div>
        <div className="w-full text-left px-4 py-3 rounded-xl text-white/70">
          <span className="font-medium">Coming Soon</span>
          <p className="text-white/40 text-xs mt-1">Shifts & Schedule</p>
        </div>
        <div className="w-full text-left px-4 py-3 rounded-xl text-white/70">
          <span className="font-medium">Coming Soon</span>
          <p className="text-white/40 text-xs mt-1">Staff Directory</p>
        </div>
      </nav>
      
      <div className="mt-8 pt-8 border-t border-white/10">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-3 flex items-center justify-center">
            <span className="text-white font-bold">CW</span>
          </div>
          <p className="text-white/80 text-sm">The Catherine Wheel</p>
          <p className="text-white/60 text-xs mt-1">Staff Portal v1.0</p>
        </div>
      </div>
    </div>
  );
}