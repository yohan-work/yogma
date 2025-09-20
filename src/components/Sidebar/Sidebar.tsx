"use client";

import { useState } from "react";
import { ComponentLibrary } from "@/components/ComponentLibrary/ComponentLibrary";
import { PagesPanel } from "@/components/PagesPanel/PagesPanel";
import { LayersPanel } from "@/components/LayersPanel/LayersPanel";
import type { ComponentType } from "@/types";

interface SidebarProps {
  onDragStart: (componentType: ComponentType) => void;
}

export const Sidebar = ({ onDragStart }: SidebarProps) => {
  const [activeTab, setActiveTab] = useState<"pages" | "components">("pages");

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* 탭 헤더 */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("pages")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "pages"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          Pages
        </button>
        <button
          onClick={() => setActiveTab("components")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "components"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          Component
        </button>
      </div>

      {/* 탭 내용 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === "pages" ? (
          <>
            <div className="flex-1 overflow-y-auto">
              <PagesPanel />
            </div>
            <LayersPanel />
          </>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <ComponentLibrary onDragStart={onDragStart} />
          </div>
        )}
      </div>
    </div>
  );
};
