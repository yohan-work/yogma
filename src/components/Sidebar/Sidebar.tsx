"use client";

import { useState } from "react";
import { ComponentLibrary } from "@/components/ComponentLibrary/ComponentLibrary";
import { PagesPanel } from "@/components/PagesPanel/PagesPanel";
import { LayersPanel } from "@/components/LayersPanel/LayersPanel";
import { TemplatesPanel } from "@/components/TemplatesPanel/TemplatesPanel";
import type { ComponentType } from "@/types";

interface SidebarProps {
  onDragStart: (componentType: ComponentType) => void;
}

export const Sidebar = ({ onDragStart }: SidebarProps) => {
  const [activeTab, setActiveTab] = useState<
    "pages" | "components" | "templates"
  >("pages");

  return (
    <div className="w-64 bg-neutral-0 border-r border-neutral-200 flex flex-col">
      {/* 탭 헤더 */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("pages")}
          className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
            activeTab === "pages"
              ? "text-primary-900 border-b-2 border-primary-900 bg-neutral-50"
              : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50"
          }`}
        >
          Pages
        </button>
        <button
          onClick={() => setActiveTab("components")}
          className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
            activeTab === "components"
              ? "text-primary-900 border-b-2 border-primary-900 bg-neutral-50"
              : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50"
          }`}
        >
          Components
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
            activeTab === "templates"
              ? "text-primary-900 border-b-2 border-primary-900 bg-neutral-50"
              : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50"
          }`}
        >
          Templates
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
        ) : activeTab === "components" ? (
          <div className="flex-1 overflow-y-auto">
            <ComponentLibrary onDragStart={onDragStart} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <TemplatesPanel />
          </div>
        )}
      </div>
    </div>
  );
};
