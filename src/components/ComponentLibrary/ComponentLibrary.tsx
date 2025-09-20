import { Type, Square, MousePointer, Image } from "lucide-react";
import type { ComponentType } from "@/types";
import type { DragEvent } from "react";

const COMPONENT_TYPES: ComponentType[] = [
  {
    id: "text",
    type: "text",
    name: "텍스트",
    icon: "Type",
  },
  {
    id: "button",
    type: "button",
    name: "버튼",
    icon: "MousePointer",
  },
  {
    id: "input",
    type: "input",
    name: "입력 필드",
    icon: "Square",
  },
  {
    id: "image",
    type: "image",
    name: "이미지",
    icon: "Image",
  },
];

const getIcon = (iconName: string) => {
  const icons = {
    Type,
    Square,
    MousePointer,
    Image,
  };
  return icons[iconName as keyof typeof icons] || Square;
};

interface ComponentLibraryProps {
  onDragStart: (componentType: ComponentType) => void;
}

export const ComponentLibrary = ({
  onDragStart,
}: ComponentLibraryProps) => {
  const handleDragStart = (
    e: DragEvent,
    componentType: ComponentType
  ) => {
    e.dataTransfer.setData("application/json", JSON.stringify(componentType));
    onDragStart(componentType);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">컴포넌트</h2>

      <div className="space-y-2">
        {COMPONENT_TYPES.map((componentType) => {
          const IconComponent = getIcon(componentType.icon);

          return (
            <div
              key={componentType.id}
              draggable
              onDragStart={(e) => handleDragStart(e, componentType)}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-grab hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <IconComponent size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {componentType.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-md font-semibold text-gray-800 mb-3">템플릿</h3>
        <div className="space-y-2">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
            <span className="text-sm font-medium text-blue-700">로그인 폼</span>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition-colors">
            <span className="text-sm font-medium text-green-700">
              회원가입 폼
            </span>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-100 transition-colors">
            <span className="text-sm font-medium text-purple-700">
              대시보드 카드
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
