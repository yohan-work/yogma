"use client";

import {
  MousePointer2,
  Square,
  Type,
  Image,
  Circle,
  Triangle,
  Minus,
  Pen,
  Hand,
  ZoomIn,
  ZoomOut,
  Play,
  Share,
  Menu,
} from "lucide-react";
import { useProjectStore } from "@/stores/useProjectStore";
import type { ToolType } from "@/types";
import { Logo } from "@/components/Logo/Logo";

export const Toolbar = () => {
  const {
    isPreviewMode,
    togglePreviewMode,
    activeTool,
    setActiveTool,
    zoomLevel,
    zoomIn,
    zoomOut,
    setZoomLevel,
  } = useProjectStore();

  const tools: Array<{
    id: ToolType;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    name: string;
  }> = [
    { id: "select", icon: MousePointer2, name: "선택 도구" },
    { id: "frame", icon: Square, name: "프레임" },
    { id: "rectangle", icon: Square, name: "사각형" },
    { id: "circle", icon: Circle, name: "원" },
    { id: "triangle", icon: Triangle, name: "삼각형" },
    { id: "line", icon: Minus, name: "선" },
    { id: "pen", icon: Pen, name: "펜" },
    { id: "text", icon: Type, name: "텍스트" },
    { id: "image", icon: Image, name: "이미지" },
    { id: "hand", icon: Hand, name: "핸드 도구" },
  ];

  const handleToolClick = (toolId: ToolType) => {
    setActiveTool(toolId);
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setZoomLevel(value);
    }
  };

  return (
    <div className="h-12 bg-neutral-0 border-b border-neutral-200 flex items-center justify-between px-4">
      {/* 왼쪽: 메뉴와 로고 */}
      <div className="flex items-center gap-4">
        <button className="p-1 hover:bg-neutral-100 rounded transition-colors">
          <Menu size={20} className="text-neutral-600" />
        </button>
        <Logo size="sm" variant="dark" showText={true} />
      </div>

      {/* 중앙: 도구 모음 */}
      <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className={`p-2 rounded-md transition-colors ${
                activeTool === tool.id
                  ? "bg-primary-900 text-neutral-0 shadow-sm"
                  : "hover:bg-neutral-200 text-neutral-600"
              }`}
              title={tool.name}
            >
              <IconComponent size={16} />
            </button>
          );
        })}
      </div>

      {/* 오른쪽: 줌, 프리뷰, 공유 */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
          <button
            onClick={zoomOut}
            className="p-1 hover:bg-neutral-200 rounded text-neutral-600 transition-colors"
            title="줌 아웃"
          >
            <ZoomOut size={16} />
          </button>
          <input
            type="number"
            value={zoomLevel}
            onChange={handleZoomChange}
            className="text-sm text-neutral-600 px-2 w-16 text-center bg-transparent border-none outline-none"
            min="10"
            max="500"
          />
          <span className="text-sm text-neutral-600">%</span>
          <button
            onClick={zoomIn}
            className="p-1 hover:bg-neutral-200 rounded text-neutral-600 transition-colors"
            title="줌 인"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        <button
          onClick={togglePreviewMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isPreviewMode
              ? "bg-accent-600 text-neutral-0 shadow-sm"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          <Play size={14} />
          {isPreviewMode ? "편집 모드" : "프리뷰"}
        </button>

        <button className="flex items-center gap-2 px-3 py-1.5 bg-primary-900 text-neutral-0 rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors shadow-sm">
          <Share size={14} />
          공유
        </button>
      </div>
    </div>
  );
};
