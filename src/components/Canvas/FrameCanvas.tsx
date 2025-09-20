"use client";

import { useRef, useState } from "react";
import type { DragEvent, MouseEvent } from "react";
import { useProjectStore } from "@/stores/useProjectStore";
import type { ComponentType } from "@/types";
import { CanvasComponent } from "./CanvasComponent";
import { GroupComponent } from "./GroupComponent";

interface FrameCanvasProps {
  onDrop: (componentType: ComponentType, x: number, y: number) => void;
}

export const FrameCanvas = ({ onDrop }: FrameCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const {
    components,
    groups,
    selectedComponentIds,
    selectedGroupId,
    selectComponent,
    selectMultipleComponents,
    selectGroup,
    clearSelection,
    isPreviewMode,
    zoomLevel,
    activeTool,
    addComponent,
  } = useProjectStore();

  const [frameSize] = useState({ width: 680, height: 680 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });

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

  const handleFrameMouseDown = (e: MouseEvent) => {
    console.log("🎯 프레임 클릭됨!", {
      target: e.target,
      currentTarget: e.currentTarget,
      activeTool,
      isPreviewMode,
      targetTagName: (e.target as Element)?.tagName,
      currentTargetTagName: (e.currentTarget as Element)?.tagName,
    });

    // 이벤트 전파 중지
    e.preventDefault();
    e.stopPropagation();

    // 프리뷰 모드에서는 도구 기능 비활성화
    if (isPreviewMode) {
      console.log("⚠️ 프리뷰 모드 - 선택 해제만");
      selectComponent(null);
      return;
    }

    const frameRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - frameRect.left;
    const y = e.clientY - frameRect.top;

    if (activeTool === "select") {
      // 드래그 선택 시작
      setIsSelecting(true);
      setSelectionStart({ x, y });
      setSelectionEnd({ x, y });

      // Ctrl/Cmd 키가 눌려있지 않으면 기존 선택 해제
      if (!e.ctrlKey && !e.metaKey) {
        clearSelection();
      }
    } else {
      // 도형 생성
      console.log("🎨 도형 생성 시도:", { activeTool, x, y });
      createComponentByTool(activeTool, x, y);
    }
  };

  const handleFrameMouseMove = (e: MouseEvent) => {
    if (!isSelecting) return;

    const frameRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - frameRect.left;
    const y = e.clientY - frameRect.top;

    setSelectionEnd({ x, y });
  };

  const handleFrameMouseUp = (e: MouseEvent) => {
    if (!isSelecting) return;

    setIsSelecting(false);

    // 선택 영역 계산
    const minX = Math.min(selectionStart.x, selectionEnd.x);
    const minY = Math.min(selectionStart.y, selectionEnd.y);
    const maxX = Math.max(selectionStart.x, selectionEnd.x);
    const maxY = Math.max(selectionStart.y, selectionEnd.y);

    // 선택 영역이 너무 작으면 무시
    if (Math.abs(maxX - minX) < 5 && Math.abs(maxY - minY) < 5) {
      return;
    }

    // 선택 영역에 포함된 컴포넌트들 찾기
    const selectedComponents = components.filter((component) => {
      const compRight = component.x + component.width;
      const compBottom = component.y + component.height;

      return (
        component.x < maxX &&
        compRight > minX &&
        component.y < maxY &&
        compBottom > minY
      );
    });

    if (selectedComponents.length > 0) {
      const newSelectedIds = selectedComponents.map((c) => c.id);

      if (e.ctrlKey || e.metaKey) {
        // Ctrl/Cmd + 드래그: 기존 선택에 추가
        const combinedSelection = [
          ...new Set([...selectedComponentIds, ...newSelectedIds]),
        ];
        selectMultipleComponents(combinedSelection);
      } else {
        // 일반 드래그: 새로운 선택
        selectMultipleComponents(newSelectedIds);
      }
    }
  };

  const createComponentByTool = (tool: string, x: number, y: number) => {
    console.log("createComponentByTool 호출됨:", { tool, x, y });
    const getDefaultProperties = (type: string) => {
      switch (type) {
        case "rectangle":
        case "frame":
          return {
            backgroundColor: "#f3f4f6",
            borderColor: "#d1d5db",
            borderWidth: 1,
            borderRadius: 4,
          };
        case "circle":
          return {
            backgroundColor: "#f3f4f6",
            borderColor: "#d1d5db",
            borderWidth: 1,
          };
        case "triangle":
          return {
            backgroundColor: "#f3f4f6",
            borderColor: "#d1d5db",
            borderWidth: 1,
          };
        case "text":
          return {
            text: "텍스트",
            fontSize: "16px",
            fontWeight: "normal",
            color: "#374151",
            textAlign: "left",
          };
        case "line":
          return {
            strokeColor: "#374151",
            strokeWidth: 2,
          };
        default:
          return {};
      }
    };

    const getDefaultSize = (type: string) => {
      switch (type) {
        case "rectangle":
        case "frame":
          return { width: 120, height: 80 };
        case "circle":
          return { width: 80, height: 80 };
        case "triangle":
          return { width: 80, height: 80 };
        case "text":
          return { width: 100, height: 24 };
        case "line":
          return { width: 100, height: 2 };
        default:
          return { width: 100, height: 100 };
      }
    };

    const size = getDefaultSize(tool);
    const properties = getDefaultProperties(tool);

    const newComponent = {
      type: tool as ComponentType["type"],
      x: Math.max(0, x - size.width / 2), // 클릭 위치를 중심으로
      y: Math.max(0, y - size.height / 2),
      width: size.width,
      height: size.height,
      properties,
      states: [
        {
          id: "default",
          name: "Default",
          properties: {},
          isDefault: true,
        },
      ],
      currentState: "default",
      visible: true,
      locked: false,
    };

    console.log("컴포넌트 추가:", newComponent);
    addComponent(newComponent);
  };

  return (
    <div className="flex-1 bg-neutral-100 relative overflow-hidden">
      {/* 캔버스 영역 */}
      <div
        ref={canvasRef}
        className="w-full h-full relative overflow-auto"
        onClick={handleCanvasClick}
      >
        {/* 캔버스 중앙에 프레임 배치 */}
        <div className="min-w-full min-h-full flex items-center justify-center p-20">
          <div
            className="relative"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "center",
            }}
          >
            {/* 프레임 */}
            <div
              ref={frameRef}
              className={`relative bg-neutral-0 border-2 border-primary-900 rounded-lg shadow-lg ${
                activeTool === "select" ? "cursor-default" : "cursor-crosshair"
              }`}
              style={{
                width: frameSize.width,
                height: frameSize.height,
                minHeight: frameSize.height, // 최소 높이 보장
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onMouseDown={handleFrameMouseDown}
              onMouseMove={handleFrameMouseMove}
              onMouseUp={handleFrameMouseUp}
            >
              {/* 프레임 라벨 */}
              <div className="absolute -top-8 left-0 bg-primary-900 text-neutral-0 text-xs px-2 py-1 rounded">
                Frame
              </div>

              {/* 그룹 렌더링 */}
              {groups.map((group) => (
                <GroupComponent
                  key={group.id}
                  group={group}
                  isSelected={selectedGroupId === group.id}
                  isPreviewMode={isPreviewMode}
                  onSelect={() => selectGroup(group.id)}
                />
              ))}

              {/* 컴포넌트들 */}
              {components.map((component) => (
                <CanvasComponent
                  key={component.id}
                  component={component}
                  isSelected={selectedComponentIds.includes(component.id)}
                  isPreviewMode={isPreviewMode}
                  onSelect={() => {
                    if (selectedComponentIds.includes(component.id)) {
                      // 이미 선택된 경우 - 다중 선택 모드에서는 해제하지 않음
                      return;
                    }
                    selectComponent(component.id);
                  }}
                />
              ))}

              {/* 드래그 선택 영역 표시 */}
              {isSelecting && (
                <div
                  className="absolute border-2 border-primary-600 bg-primary-100 bg-opacity-20 pointer-events-none"
                  style={{
                    left: Math.min(selectionStart.x, selectionEnd.x),
                    top: Math.min(selectionStart.y, selectionEnd.y),
                    width: Math.abs(selectionEnd.x - selectionStart.x),
                    height: Math.abs(selectionEnd.y - selectionStart.y),
                  }}
                />
              )}

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
