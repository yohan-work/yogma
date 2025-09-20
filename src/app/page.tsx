"use client";

import { Toolbar } from "@/components/Toolbar/Toolbar";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { FrameCanvas } from "@/components/Canvas/FrameCanvas";
import { EnhancedPropertyPanel } from "@/components/PropertyPanel/EnhancedPropertyPanel";
import { useProjectStore } from "@/stores/useProjectStore";
import type { ComponentType } from "@/types";

export default function Home() {
  const { addComponent } = useProjectStore();

  const handleDragStart = (componentType: ComponentType) => {
    // 드래그 시작 시 필요한 로직이 있다면 여기에 추가
    console.log("드래그 시작:", componentType);
  };

  const handleDrop = (componentType: ComponentType, x: number, y: number) => {
    // 기본 컴포넌트 속성 설정
    const getDefaultProperties = (type: ComponentType["type"]) => {
      switch (type) {
        case "text":
          return {
            text: "텍스트",
            fontSize: "14px",
            color: "#374151",
            fontWeight: "normal",
          };
        case "button":
          return {
            text: "버튼",
            variant: "primary" as const,
            backgroundColor: "#3b82f6",
            textColor: "#ffffff",
            disabled: false,
          };
        case "input":
          return {
            placeholder: "입력하세요",
            inputType: "text",
            width: "200px",
            disabled: false,
            hasError: false,
          };
        case "image":
          return {
            src: "",
            alt: "이미지",
            width: "150px",
            height: "100px",
          };
        default:
          return {};
      }
    };

    // 기본 상태 설정
    const defaultStates = [
      {
        id: "default",
        name: "기본",
        properties: {},
        isDefault: true,
      },
    ];

    // 컴포넌트 타입별 추가 상태
    if (componentType.type === "button") {
      defaultStates.push(
        {
          id: "hover",
          name: "호버",
          properties: { backgroundColor: "#2563eb" },
          isDefault: false,
        },
        {
          id: "loading",
          name: "로딩",
          properties: { text: "로딩 중...", disabled: true },
          isDefault: false,
        }
      );
    } else if (componentType.type === "input") {
      defaultStates.push(
        {
          id: "error",
          name: "에러",
          properties: { hasError: true, placeholder: "올바른 값을 입력하세요" },
          isDefault: false,
        },
        {
          id: "success",
          name: "성공",
          properties: { hasError: false },
          isDefault: false,
        }
      );
    }

    const newComponent = {
      type: componentType.type,
      x,
      y,
      width: 200,
      height: 40,
      properties: getDefaultProperties(componentType.type),
      states: defaultStates,
      currentState: "default",
    };

    addComponent(newComponent);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 상단 툴바 */}
      <Toolbar />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽 사이드바 */}
        <Sidebar onDragStart={handleDragStart} />

        {/* 중앙 캔버스 */}
        <FrameCanvas onDrop={handleDrop} />

        {/* 오른쪽 속성 패널 */}
        <EnhancedPropertyPanel />
      </div>
    </div>
  );
}
