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

export const ComponentLibrary = ({ onDragStart }: ComponentLibraryProps) => {
  const handleDragStart = (e: DragEvent, componentType: ComponentType) => {
    e.dataTransfer.setData("application/json", JSON.stringify(componentType));
    onDragStart(componentType);
  };

  return (
    <div className="w-64 bg-neutral-0 border-r border-neutral-200 p-4">
      <h2 className="text-lg font-semibold text-neutral-800 mb-4">컴포넌트</h2>

      <div className="space-y-2">
        {COMPONENT_TYPES.map((componentType) => {
          const IconComponent = getIcon(componentType.icon);

          return (
            <div
              key={componentType.id}
              draggable
              onDragStart={(e) => handleDragStart(e, componentType)}
              className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg cursor-grab hover:bg-neutral-100 transition-colors border border-neutral-200"
            >
              <IconComponent size={20} className="text-neutral-600" />
              <span className="text-sm font-medium text-neutral-700">
                {componentType.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
