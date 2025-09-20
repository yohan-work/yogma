"use client";

import { useRef, useState } from "react";
import type { DragEvent, MouseEvent } from "react";
import { useProjectStore } from "@/stores/useProjectStore";
import type { ComponentType } from "@/types";
import { CanvasComponent } from "./CanvasComponent";

interface FrameCanvasProps {
  onDrop: (componentType: ComponentType, x: number, y: number) => void;
}

export const FrameCanvas = ({ onDrop }: FrameCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const { components, selectedComponentId, selectComponent, isPreviewMode } =
    useProjectStore();

  const [frameSize] = useState({ width: 680, height: 680 });

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();

    if (!frameRef.current) return;

    const rect = frameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 프레임 경계 내에서만 드롭 허용
    if (x >= 0 && x <= frameSize.width && y >= 0 && y <= frameSize.height) {
      try {
        const componentType = JSON.parse(
          e.dataTransfer.getData("application/json")
        ) as ComponentType;
        onDrop(componentType, x, y);
      } catch (error) {
        console.error("드롭 데이터 파싱 오류:", error);
      }
    }
  };

  const handleCanvasClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectComponent(null);
    }
  };

  const handleFrameClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      selectComponent(null);
    }
  };

  return (
    <div className="flex-1 bg-gray-100 relative overflow-hidden">
      {/* 캔버스 영역 */}
      <div
        ref={canvasRef}
        className="w-full h-full relative overflow-auto"
        onClick={handleCanvasClick}
      >
        {/* 캔버스 중앙에 프레임 배치 */}
        <div className="min-w-full min-h-full flex items-center justify-center p-20">
          <div className="relative">
            {/* 프레임 */}
            <div
              ref={frameRef}
              className="relative bg-white border-2 border-blue-500 rounded-lg shadow-lg"
              style={{
                width: frameSize.width,
                height: frameSize.height,
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleFrameClick}
            >
              {/* 프레임 라벨 */}
              <div className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Frame
              </div>

              {/* 컴포넌트들 */}
              {components.map((component) => (
                <CanvasComponent
                  key={component.id}
                  component={component}
                  isSelected={selectedComponentId === component.id}
                  isPreviewMode={isPreviewMode}
                  onSelect={() => selectComponent(component.id)}
                />
              ))}

              {/* 빈 프레임 안내 */}
              {components.length === 0 && !isPreviewMode && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-lg font-medium mb-2">
                      프레임이 비어있습니다
                    </div>
                    <div className="text-sm">
                      왼쪽 패널에서 컴포넌트를 드래그해서 여기에 놓아보세요
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 프레임 크기 표시 */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
              {frameSize.width} × {frameSize.height}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
