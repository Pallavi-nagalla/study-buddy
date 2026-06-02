"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { BookOpen, LogOut } from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <BookOpen className="text-blue-400" size={24} />
        <span className="text-lg font-bold text-white">Study Buddy</span>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
      >
        <LogOut size={16} />
        Logout
      </button>
    </nav>
  );
}
