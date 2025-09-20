import React, { useState, useRef } from "react";
import type { ComponentInstance } from "@/types";
import type { MouseEvent } from "react";
import Image from "next/image";
import { useProjectStore } from "@/stores/useProjectStore";

interface CanvasComponentProps {
  component: ComponentInstance;
  isSelected: boolean;
  isPreviewMode: boolean;
  onSelect: () => void;
}

export const CanvasComponent = ({
  component,
  isSelected,
  isPreviewMode,
  onSelect,
}: CanvasComponentProps) => {
  const { updateComponent } = useProjectStore();
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditingText, setIsEditingText] = useState(false);
  const [editText, setEditText] = useState("");
  const componentRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (!isPreviewMode && !component.locked) {
      // 그룹에 속한 컴포넌트는 개별 선택하지 않고 그룹을 선택
      if (component.groupId) {
        const { selectGroup } = useProjectStore.getState();
        selectGroup(component.groupId);
      } else {
        onSelect();
      }
    }
  };

  const handleDoubleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (!isPreviewMode && !component.locked && component.type === "text") {
      // 그룹에 속한 컴포넌트도 텍스트 편집 허용
      startTextEditing();
    }
  };

  const startTextEditing = () => {
    const currentText = (component.properties.text as string) || "텍스트";
    setEditText(currentText);
    setIsEditingText(true);

    // 다음 프레임에서 포커스 설정
    setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
        textInputRef.current.select();
      }
    }, 0);
  };

  const finishTextEditing = () => {
    if (editText.trim() !== "") {
      updateComponent(component.id, {
        properties: {
          ...component.properties,
          text: editText.trim(),
        },
      });
    }
    setIsEditingText(false);
    setEditText("");
  };

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    // 텍스트 편집 중에는 모든 키 이벤트의 전파를 막음
    e.stopPropagation();

    if (e.key === "Enter") {
      e.preventDefault();
      finishTextEditing();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsEditingText(false);
      setEditText("");
    }
    // 다른 키들(Backspace, Delete 등)은 기본 동작 허용
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (isPreviewMode || !isSelected || component.locked || component.groupId)
      return;

    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - component.x,
      y: e.clientY - component.y,
    });
  };

  const handleResizeMouseDown = (e: MouseEvent) => {
    if (isPreviewMode || component.locked) return;

    e.stopPropagation();
    setIsResizing(true);
  };

  // 전역 마우스 이벤트 처리
  React.useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        updateComponent(component.id, { x: newX, y: newY });
      } else if (isResizing) {
        const rect = componentRef.current?.getBoundingClientRect();
        if (rect) {
          const newWidth = Math.max(20, e.clientX - rect.left);
          const newHeight = Math.max(20, e.clientY - rect.top);
          updateComponent(component.id, { width: newWidth, height: newHeight });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, component.id, updateComponent]);

  const renderComponent = () => {
    const { type, properties } = component;
    const currentState =
      component.states.find((s) => s.id === component.currentState) ||
      component.states[0];
    const currentProps = currentState
      ? { ...properties, ...currentState.properties }
      : properties;

    // 타입 안전성을 위한 헬퍼 함수
    const getProp = (
      key: string,
      defaultValue: string | number | boolean = ""
    ) => {
      const value = currentProps[key as keyof typeof currentProps];
      return value !== undefined ? value : defaultValue;
    };

    switch (type) {
      case "text":
        return (
          <div
            className="p-2 text-gray-800 w-full h-full flex items-center"
            style={{
              fontSize: getProp("fontSize", "14px") as string,
              color: getProp("color", "#374151") as string,
              fontWeight: getProp("fontWeight", "normal") as string,
            }}
          >
            {isEditingText ? (
              <input
                ref={textInputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={finishTextEditing}
                onKeyDown={handleTextKeyDown}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="w-full h-full bg-transparent border-none outline-none resize-none"
                style={{
                  fontSize: getProp("fontSize", "14px") as string,
                  color: getProp("color", "#374151") as string,
                  fontWeight: getProp("fontWeight", "normal") as string,
                  fontFamily: "inherit",
                }}
              />
            ) : (
              <span className="w-full">
                {getProp("text", "텍스트") as string}
              </span>
            )}
          </div>
        );

      case "button":
        return (
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              getProp("variant", "primary") === "secondary"
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={getProp("disabled", false) as boolean}
            style={{
              backgroundColor: getProp("backgroundColor", "#3b82f6") as string,
              color: getProp("textColor", "#ffffff") as string,
            }}
          >
            {getProp("text", "버튼") as string}
          </button>
        );

      case "input":
        return (
          <input
            type={getProp("inputType", "text") as string}
            placeholder={getProp("placeholder", "입력하세요") as string}
            className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getProp("hasError", false)
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-white"
            }`}
            disabled={getProp("disabled", false) as boolean}
            style={{
              width: getProp("width", "200px") as string,
            }}
          />
        );

      case "image":
        return (
          <div
            className="bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center relative"
            style={{
              width: getProp("width", "150px") as string,
              height: getProp("height", "100px") as string,
            }}
          >
            {getProp("src", "") ? (
              <Image
                src={getProp("src", "") as string}
                alt={getProp("alt", "이미지") as string}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <span className="text-gray-500 text-sm">이미지</span>
            )}
          </div>
        );

      case "rectangle":
      case "frame":
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: getProp("backgroundColor", "#f3f4f6") as string,
              border: `${getProp("borderWidth", 1)}px solid ${getProp(
                "borderColor",
                "#d1d5db"
              )}`,
              borderRadius: `${getProp("borderRadius", 4)}px`,
            }}
          />
        );

      case "circle":
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: getProp("backgroundColor", "#f3f4f6") as string,
              border: `${getProp("borderWidth", 1)}px solid ${getProp(
                "borderColor",
                "#d1d5db"
              )}`,
              borderRadius: "50%",
            }}
          />
        );

      case "triangle":
        return (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundColor: "transparent",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${component.width / 2}px solid transparent`,
                borderRight: `${component.width / 2}px solid transparent`,
                borderBottom: `${component.height}px solid ${getProp(
                  "backgroundColor",
                  "#f3f4f6"
                )}`,
              }}
            />
          </div>
        );

      case "line":
        return (
          <div
            className="w-full h-full flex items-center"
            style={{
              backgroundColor: "transparent",
            }}
          >
            <div
              className="w-full"
              style={{
                height: `${getProp("strokeWidth", 2)}px`,
                backgroundColor: getProp("strokeColor", "#374151") as string,
              }}
            />
          </div>
        );

      default:
        return (
          <div className="p-2 bg-gray-100 text-gray-600">
            알 수 없는 컴포넌트: {type}
          </div>
        );
    }
  };

  // 컴포넌트가 숨겨진 경우 렌더링하지 않음
  if (!component.visible) {
    return null;
  }

  return (
    <div
      ref={componentRef}
      data-component-id={component.id}
      className={`absolute ${
        component.locked
          ? "cursor-not-allowed"
          : isDragging
          ? "cursor-grabbing"
          : "cursor-pointer"
      } ${
        isSelected && !isPreviewMode
          ? "ring-2 ring-primary-900 ring-offset-2"
          : ""
      } ${component.locked ? "opacity-70" : ""}`}
      style={{
        left: component.x,
        top: component.y,
        width: component.width,
        height: component.height,
        pointerEvents: component.groupId && !isEditingText ? "none" : "auto",
        zIndex: isEditingText ? 20 : component.groupId ? 1 : 5,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
    >
      {renderComponent()}

      {/* 선택된 컴포넌트의 핸들 */}
      {isSelected && !isPreviewMode && (
        <>
          {/* 리사이즈 핸들 */}
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary-900 border border-neutral-0 rounded-sm cursor-se-resize hover:bg-primary-800 transition-colors"
            onMouseDown={handleResizeMouseDown}
          />

          {/* 컴포넌트 라벨 */}
          <div className="absolute -top-6 left-0 bg-primary-900 text-neutral-0 text-xs px-2 py-1 rounded">
            {component.type}
          </div>
        </>
      )}
    </div>
  );
};
