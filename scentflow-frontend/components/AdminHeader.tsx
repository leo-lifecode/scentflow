"use client";

import { Search, Bell, ChevronDown } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle: string;
  badgeCount?: number;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function AdminHeader({
  title,
  subtitle,
  badgeCount = 4,
  searchValue = "",
  onSearchChange,
}: AdminHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 py-5 flex items-center justify-between border-b border-slate-200/70">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100/80 border-transparent rounded-full focus:bg-white focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all placeholder-slate-400"
          />
        </div>

        <button
          aria-label="Notifications"
          className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#121316] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
            {badgeCount}
          </span>
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-200 flex items-center justify-center font-semibold text-xs border border-amber-300/40">
            MA
          </div>
          <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-950">
            Maison Admin
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
        </div>
      </div>
    </header>
  );
}