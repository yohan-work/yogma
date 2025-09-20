"use client";

import { useProjectStore } from "@/stores/useProjectStore";
import { ChevronDown, Link, Eye } from "lucide-react";
import { useState } from "react";

export const EnhancedPropertyPanel = () => {
  const { components, selectedComponentId, updateComponent } =
    useProjectStore();
  const [expandedSections, setExpandedSections] = useState({
    position: true,
    size: true,
    style: true,
    fill: true,
    border: true,
    shadow: true,
  });

  const selectedComponent = components.find(
    (c) => c.id === selectedComponentId
  );

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center text-gray-400 mt-8">
          <div className="text-sm">컴포넌트를 선택하면</div>
          <div className="text-sm">속성을 편집할 수 있습니다</div>
        </div>
      </div>
    );
  }

  const updateProperty = (key: string, value: string | number | boolean) => {
    updateComponent(selectedComponent.id, {
      properties: {
        ...selectedComponent.properties,
        [key]: value,
      },
    });
  };

  const properties = selectedComponent.properties;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const SectionHeader = ({
    title,
    section,
    children,
  }: {
    title: string;
    section: keyof typeof expandedSections;
    children?: React.ReactNode;
  }) => (
    <div className="mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${
            expandedSections[section] ? "rotate-180" : ""
          }`}
        />
      </button>
      {expandedSections[section] && (
        <div className="mt-2 space-y-3">{children}</div>
      )}
    </div>
  );

  const InputField = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    suffix,
  }: {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    suffix?: string;
  }) => (
    <div>
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Design</h2>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-gray-100 rounded">
              <Eye size={16} className="text-gray-500" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Link size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-600 capitalize">
          {selectedComponent.type}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Position */}
        <SectionHeader title="Position" section="position">
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="X"
              value={Math.round(selectedComponent.x)}
              onChange={(value) =>
                updateComponent(selectedComponent.id, {
                  x: parseInt(value) || 0,
                })
              }
            />
            <InputField
              label="Y"
              value={Math.round(selectedComponent.y)}
              onChange={(value) =>
                updateComponent(selectedComponent.id, {
                  y: parseInt(value) || 0,
                })
              }
            />
          </div>
        </SectionHeader>

        {/* Size */}
        <SectionHeader title="Size" section="size">
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Width"
              value={selectedComponent.width}
              onChange={(value) =>
                updateComponent(selectedComponent.id, {
                  width: parseInt(value) || 0,
                })
              }
            />
            <InputField
              label="Height"
              value={selectedComponent.height}
              onChange={(value) =>
                updateComponent(selectedComponent.id, {
                  height: parseInt(value) || 0,
                })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <Link size={14} className="text-gray-500" />
            </button>
            <span className="text-xs text-gray-500">Fixed</span>
          </div>
        </SectionHeader>

        {/* Style */}
        <SectionHeader title="Style" section="style">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Visible</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button className="px-3 py-1 text-xs bg-white rounded shadow-sm">
                  Yes
                </button>
                <button className="px-3 py-1 text-xs text-gray-500">No</button>
              </div>
            </div>
            <InputField
              label="Opacity"
              value="1"
              onChange={() => {}}
              type="number"
            />
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Overflow
              </label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Visible</option>
                <option>Hidden</option>
                <option>Scroll</option>
              </select>
            </div>
            <InputField
              label="Radius"
              value="0"
              onChange={() => {}}
              type="number"
            />
          </div>
        </SectionHeader>

        {/* Fill */}
        <SectionHeader title="Fill" section="fill">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white border border-gray-300 rounded"></div>
              <span className="text-sm text-gray-700">White</span>
              <button className="ml-auto text-xs text-gray-500">—</button>
            </div>
          </div>
        </SectionHeader>

        {/* Border */}
        <SectionHeader title="Border" section="border">
          <div className="text-center text-gray-400 text-sm py-4">추가</div>
        </SectionHeader>

        {/* Shadow */}
        <SectionHeader title="Shadow" section="shadow">
          <div className="text-center text-gray-400 text-sm py-4">추가</div>
        </SectionHeader>

        {/* Component-specific properties */}
        {selectedComponent.type === "text" && (
          <SectionHeader title="Text" section="style">
            <div className="space-y-3">
              <InputField
                label="Content"
                value={(properties.text as string) || ""}
                onChange={(value) => updateProperty("text", value)}
                placeholder="텍스트를 입력하세요"
              />
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Font Size
                </label>
                <select
                  value={(properties.fontSize as string) || "14px"}
                  onChange={(e) => updateProperty("fontSize", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="12px">12px</option>
                  <option value="14px">14px</option>
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                  <option value="20px">20px</option>
                  <option value="24px">24px</option>
                  <option value="32px">32px</option>
                </select>
              </div>
            </div>
          </SectionHeader>
        )}

        {selectedComponent.type === "button" && (
          <SectionHeader title="Button" section="style">
            <div className="space-y-3">
              <InputField
                label="Text"
                value={(properties.text as string) || ""}
                onChange={(value) => updateProperty("text", value)}
                placeholder="버튼 텍스트"
              />
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Variant
                </label>
                <select
                  value={(properties.variant as string) || "primary"}
                  onChange={(e) => updateProperty("variant", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                </select>
              </div>
            </div>
          </SectionHeader>
        )}
      </div>
    </div>
  );
};
