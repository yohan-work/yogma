"use client";

import { Eye, EyeOff, Lock, Unlock, MoreHorizontal } from "lucide-react";
import { useProjectStore } from "@/stores/useProjectStore";

export const LayersPanel = () => {
  const { components, selectedComponentId, selectComponent, updateComponent } =
    useProjectStore();

  const toggleVisibility = (componentId: string, currentVisible: boolean) => {
    updateComponent(componentId, { visible: !currentVisible });
  };

  const toggleLock = (componentId: string, currentLocked: boolean) => {
    updateComponent(componentId, { locked: !currentLocked });
  };

  return (
    <div className="w-full bg-white border-t border-gray-200">
      <div className="p-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">Layers</h3>
      </div>

      <div className="max-h-48 overflow-y-auto">
        {components.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            레이어가 없습니다
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {components.map((component, index) => (
              <div
                key={component.id}
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                  selectedComponentId === component.id
                    ? "bg-blue-100 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => selectComponent(component.id)}
              >
                {/* 컴포넌트 아이콘 */}
                <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {component.type.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* 컴포넌트 이름 */}
                <span className="flex-1 text-sm text-gray-700 truncate">
                  {component.type} {components.length - index}
                </span>

                {/* 컨트롤 버튼들 */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(component.id, component.visible);
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-opacity"
                    title={component.visible ? "숨기기" : "보이기"}
                  >
                    {component.visible ? (
                      <Eye size={12} className="text-gray-500" />
                    ) : (
                      <EyeOff size={12} className="text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLock(component.id, component.locked);
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-opacity"
                    title={component.locked ? "잠금 해제" : "잠금"}
                  >
                    {component.locked ? (
                      <Lock size={12} className="text-gray-500" />
                    ) : (
                      <Unlock size={12} className="text-gray-400" />
                    )}
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={12} className="text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
