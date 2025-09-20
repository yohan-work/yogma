import React, { useState, useRef } from "react";
import type { ComponentGroup } from "@/types";
import type { MouseEvent } from "react";
import { useProjectStore } from "@/stores/useProjectStore";

interface GroupComponentProps {
  group: ComponentGroup;
  isSelected: boolean;
  isPreviewMode: boolean;
  onSelect: () => void;
}

export const GroupComponent = ({
  group,
  isSelected,
  isPreviewMode,
  onSelect,
}: GroupComponentProps) => {
  const { moveGroup } = useProjectStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const groupRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (!isPreviewMode && !group.locked) {
      onSelect();
    }
  };

  const handleDoubleClick = (e: MouseEvent) => {
    // 더블클릭 시 그룹 내 텍스트 컴포넌트 편집을 위해 이벤트 전파를 허용
    e.stopPropagation();

    // 클릭 위치에서 텍스트 컴포넌트를 찾아서 편집 모드로 전환
    const { components } = useProjectStore.getState();
    const clickX = e.clientX;
    const clickY = e.clientY;

    // 그룹에 속한 텍스트 컴포넌트 중에서 클릭된 위치에 있는 것을 찾기
    const textComponent = components.find(
      (comp) =>
        comp.groupId === group.id &&
        comp.type === "text" &&
        clickX >= comp.x &&
        clickX <= comp.x + comp.width &&
        clickY >= comp.y &&
        clickY <= comp.y + comp.height
    );

    if (textComponent) {
      // 텍스트 컴포넌트를 찾았다면 해당 컴포넌트의 편집 모드를 활성화
      // 이는 CanvasComponent에서 처리되도록 이벤트를 다시 발생시킴
      const textElement = document.querySelector(
        `[data-component-id="${textComponent.id}"]`
      );
      if (textElement) {
        const doubleClickEvent = new MouseEvent("dblclick", {
          bubbles: true,
          cancelable: true,
          clientX: clickX,
          clientY: clickY,
        });
        textElement.dispatchEvent(doubleClickEvent);
      }
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    console.log("GroupComponent handleMouseDown:", {
      groupId: group.id,
      isSelected,
      isPreviewMode,
      locked: group.locked,
    });

    if (isPreviewMode || group.locked) return;

    e.stopPropagation();

    // 그룹이 선택되지 않았다면 먼저 선택
    if (!isSelected) {
      console.log("그룹 선택 중...");
      onSelect();
    }

    // 선택 상태와 관계없이 드래그 시작
    console.log("드래그 시작:", {
      x: e.clientX,
      y: e.clientY,
      groupX: group.x,
      groupY: group.y,
    });
    setIsDragging(true);
    setDragStart({
      x: e.clientX - group.x,
      y: e.clientY - group.y,
    });
  };

  // 전역 마우스 이벤트 처리
  React.useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        const deltaX = newX - group.x;
        const deltaY = newY - group.y;
        console.log("그룹 이동 중:", {
          newX,
          newY,
          deltaX,
          deltaY,
          groupId: group.id,
        });
        moveGroup(group.id, deltaX, deltaY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, group.id, group.x, group.y, moveGroup]);

  // 그룹이 숨겨진 경우 렌더링하지 않음
  if (!group.visible) {
    return null;
  }

  return (
    <div
      ref={groupRef}
      className={`absolute ${group.locked ? "opacity-70" : ""}`}
      style={{
        left: group.x - 5,
        top: group.y - 5,
        width: group.width + 10,
        height: group.height + 10,
        pointerEvents: "auto",
        zIndex: 10, // 개별 컴포넌트보다 위에 표시
      }}
    >
      {/* 그룹 경계선 */}
      <div
        className={`w-full h-full border-2 border-dashed rounded-lg ${
          group.locked
            ? "cursor-not-allowed"
            : isDragging
            ? "cursor-grabbing"
            : "cursor-pointer"
        } ${
          isSelected && !isPreviewMode
            ? "border-primary-500 bg-primary-50/10"
            : "border-neutral-300 bg-transparent hover:border-primary-400 hover:bg-primary-50/5"
        } transition-colors`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
      />

      {/* 그룹 라벨 */}
      {isSelected && !isPreviewMode && (
        <div className="absolute -top-8 left-0 bg-primary-600 text-white text-xs px-2 py-1 rounded-md shadow-sm pointer-events-none font-medium">
          {group.name}
        </div>
      )}
    </div>
  );
};
