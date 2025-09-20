"use client";

import { useState } from "react";
import { getTemplatesByCategory, type Template } from "@/data/templates";
import { useProjectStore } from "@/stores/useProjectStore";
import {
  FileText,
  LayoutDashboard,
  Navigation,
  FileImage,
  Plus,
} from "lucide-react";

interface TemplatesPanelProps {
  onTemplateSelect?: (template: Template) => void;
}

export const TemplatesPanel = ({ onTemplateSelect }: TemplatesPanelProps) => {
  const [selectedCategory, setSelectedCategory] =
    useState<Template["category"]>("forms");
  const { addComponent, addComponentsAsGroup, selectComponent } =
    useProjectStore();

  const categories = [
    { id: "forms" as const, name: "폼", icon: FileText },
    { id: "dashboard" as const, name: "대시보드", icon: LayoutDashboard },
    { id: "navigation" as const, name: "네비게이션", icon: Navigation },
    { id: "content" as const, name: "콘텐츠", icon: FileImage },
  ];

  const handleTemplateClick = (template: Template) => {
    console.log("템플릿 선택됨:", template.name);

    // 기존 선택 해제
    selectComponent(null);

    if (template.shouldGroup && template.components.length > 1) {
      // 그룹으로 추가하는 경우 - 한 번에 처리
      addComponentsAsGroup(
        template.components,
        template.groupName || template.name
      );
    } else {
      // 개별 컴포넌트로 추가
      template.components.forEach((componentData) => {
        addComponent(componentData);
      });
    }

    // 콜백 호출 (필요한 경우)
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  const filteredTemplates = getTemplatesByCategory(selectedCategory);

  return (
    <div className="w-full bg-neutral-0 h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-3 border-b border-neutral-100">
        <h3 className="text-sm font-semibold text-neutral-800">Templates</h3>
      </div>

      {/* 카테고리 탭 */}
      <div className="border-b border-neutral-100">
        <div className="flex overflow-x-auto">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? "text-primary-900 border-b-2 border-primary-900 bg-neutral-50"
                    : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50"
                }`}
              >
                <IconComponent size={14} />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 템플릿 목록 */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredTemplates.length === 0 ? (
          <div className="text-center text-neutral-400 text-sm py-8">
            이 카테고리에는 템플릿이 없습니다
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateClick(template)}
                className="group cursor-pointer border border-neutral-200 rounded-lg p-3 hover:border-primary-300 hover:shadow-sm transition-all"
              >
                {/* 템플릿 미리보기 영역 */}
                <div className="w-full h-24 bg-neutral-100 rounded-md mb-3 flex items-center justify-center border-2 border-dashed border-neutral-300 group-hover:border-primary-300 transition-colors">
                  <div className="text-neutral-400 group-hover:text-primary-600 transition-colors">
                    <Plus size={24} />
                  </div>
                </div>

                {/* 템플릿 정보 */}
                <div>
                  <h4 className="text-sm font-medium text-neutral-800 mb-1">
                    {template.name}
                  </h4>
                  <p className="text-xs text-neutral-600 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-neutral-500">
                      {template.components.length}개 컴포넌트
                    </span>
                    <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                      사용하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
