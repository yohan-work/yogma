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

export const Toolbar = () => {
  const { isPreviewMode, togglePreviewMode } = useProjectStore();

  const tools = [
    { id: "select", icon: MousePointer2, name: "선택 도구", active: true },
    { id: "frame", icon: Square, name: "프레임", active: false },
    { id: "rectangle", icon: Square, name: "사각형", active: false },
    { id: "circle", icon: Circle, name: "원", active: false },
    { id: "triangle", icon: Triangle, name: "삼각형", active: false },
    { id: "line", icon: Minus, name: "선", active: false },
    { id: "pen", icon: Pen, name: "펜", active: false },
    { id: "text", icon: Type, name: "텍스트", active: false },
    { id: "image", icon: Image, name: "이미지", active: false },
    { id: "hand", icon: Hand, name: "핸드 도구", active: false },
  ];

  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* 왼쪽: 메뉴와 로고 */}
      <div className="flex items-center gap-4">
        <button className="p-1 hover:bg-gray-100 rounded">
          <Menu size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
          <span className="font-semibold text-gray-800">Yogma</span>
        </div>
      </div>

      {/* 중앙: 도구 모음 */}
      <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <button
              key={tool.id}
              className={`p-2 rounded-md transition-colors ${
                tool.active
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200 text-gray-600"
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
        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
          <button className="p-1 hover:bg-gray-200 rounded text-gray-600">
            <ZoomOut size={16} />
          </button>
          <span className="text-sm text-gray-600 px-2 min-w-[60px] text-center">
            100%
          </span>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-600">
            <ZoomIn size={16} />
          </button>
        </div>

        <button
          onClick={togglePreviewMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isPreviewMode
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
        >
          <Play size={14} />
          {isPreviewMode ? "디자인" : "프리뷰"}
        </button>

        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
          <Share size={14} />
          공유
        </button>
      </div>
    </div>
  );
};
