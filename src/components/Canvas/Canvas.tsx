"use client";

import { useRef } from "react";
import type { DragEvent, MouseEvent } from "react";
import { useProjectStore } from "@/stores/useProjectStore";
import type { ComponentType } from "@/types";
import { CanvasComponent } from "./CanvasComponent";

interface CanvasProps {
  onDrop: (componentType: ComponentType, x: number, y: number) => void;
}

export const Canvas = ({ onDrop }: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { components, selectedComponentId, selectComponent, isPreviewMode } =
    useProjectStore();

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();

    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    try {
      const componentType = JSON.parse(
        e.dataTransfer.getData("application/json")
      ) as ComponentType;
      onDrop(componentType, x, y);
    } catch (error) {
      console.error("드롭 데이터 파싱 오류:", error);
    }
  };

  const handleCanvasClick = (e: MouseEvent) => {
    // 캔버스 자체를 클릭했을 때만 선택 해제
    if (e.target === e.currentTarget) {
      selectComponent(null);
    }
  };

  return (
    <div className="flex-1 bg-gray-100 relative overflow-hidden">
      {/* 헤더 */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-800">Yogma</h1>
          <div className="text-sm text-gray-500">
            {isPreviewMode ? "프리뷰 모드" : "디자인 모드"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => useProjectStore.getState().togglePreviewMode()}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isPreviewMode
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            {isPreviewMode ? "디자인 모드" : "프리뷰 모드"}
          </button>
        </div>
      </div>

      {/* 캔버스 영역 */}
      <div
        ref={canvasRef}
        className="w-full h-full relative bg-white m-4 rounded-lg shadow-sm border border-gray-200"
        style={{
          width: "calc(100% - 2rem)",
          height: "calc(100% - 5rem)",
          backgroundImage: `
            radial-gradient(circle, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
      >
        {components.map((component) => (
          <CanvasComponent
            key={component.id}
            component={component}
            isSelected={selectedComponentId === component.id}
            isPreviewMode={isPreviewMode}
            onSelect={() => selectComponent(component.id)}
          />
        ))}

        {/* 빈 캔버스 안내 */}
        {components.length === 0 && !isPreviewMode && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-lg font-medium mb-2">
                캔버스가 비어있습니다
              </div>
              <div className="text-sm">
                왼쪽 패널에서 컴포넌트를 드래그해서 여기에 놓아보세요
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
