"use client";

import { useProjectStore } from "@/stores/useProjectStore";
import { ChevronDown, Link, Eye } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import React from "react";

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

  // PropertyPanel 전체에서 키보드 이벤트를 완전히 차단하는 핸들러
  const handlePanelKeyDown = useCallback((e: React.KeyboardEvent) => {
    // 모든 키보드 이벤트를 완전히 차단
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    // 기본 동작은 허용 (input 필드의 정상 동작을 위해)
    // preventDefault는 호출하지 않음
  }, []);

  // PropertyPanel 전체에서 포커스 이벤트를 차단하는 핸들러
  const handlePanelFocus = useCallback((e: React.FocusEvent) => {
    e.stopPropagation();
  }, []);

  const handlePanelBlur = useCallback((e: React.FocusEvent) => {
    e.stopPropagation();
  }, []);

  // PropertyPanel에서 직접 키보드 이벤트를 차단하는 useEffect
  useEffect(() => {
    const panelElement = document.querySelector(".property-panel-container");

    if (panelElement) {
      const handleKeyDown = (e: Event) => {
        const keyboardEvent = e as KeyboardEvent;
        // PropertyPanel 내부에서 발생하는 모든 키보드 이벤트를 차단
        keyboardEvent.stopPropagation();
        keyboardEvent.stopImmediatePropagation();

        // 기본 동작은 허용 (input 필드의 정상 동작을 위해)
        // preventDefault는 호출하지 않음
      };

      // 캡처 단계에서 이벤트를 차단 (더 높은 우선순위)
      panelElement.addEventListener("keydown", handleKeyDown, true);

      return () => {
        panelElement.removeEventListener("keydown", handleKeyDown, true);
      };
    }
  }, []);

  const updateProperty = useCallback(
    (key: string, value: string | number | boolean) => {
      if (selectedComponent) {
        updateComponent(selectedComponent.id, {
          properties: {
            ...selectedComponent.properties,
            [key]: value,
          },
        });
      }
    },
    [selectedComponent, updateComponent]
  );

  // 컴포넌트 업데이트 함수들을 메모이제이션
  const handleXChange = useCallback(
    (value: string) => {
      if (selectedComponent) {
        updateComponent(selectedComponent.id, {
          x: parseInt(value) || 0,
        });
      }
    },
    [selectedComponent, updateComponent]
  );

  const handleYChange = useCallback(
    (value: string) => {
      if (selectedComponent) {
        updateComponent(selectedComponent.id, {
          y: parseInt(value) || 0,
        });
      }
    },
    [selectedComponent, updateComponent]
  );

  const handleWidthChange = useCallback(
    (value: string) => {
      if (selectedComponent) {
        updateComponent(selectedComponent.id, {
          width: parseInt(value) || 0,
        });
      }
    },
    [selectedComponent, updateComponent]
  );

  const handleHeightChange = useCallback(
    (value: string) => {
      if (selectedComponent) {
        updateComponent(selectedComponent.id, {
          height: parseInt(value) || 0,
        });
      }
    },
    [selectedComponent, updateComponent]
  );

  // 텍스트 속성 업데이트 함수들
  const handleTextChange = useCallback(
    (value: string) => {
      if (selectedComponent) {
        updateProperty("text", value);
      }
    },
    [selectedComponent, updateProperty]
  );

  const handleFontSizeChange = useCallback(
    (value: string) => {
      if (selectedComponent) {
        updateProperty("fontSize", value);
      }
    },
    [selectedComponent, updateProperty]
  );

  // 버튼 속성 업데이트 함수들
  const handleButtonTextChange = useCallback(
    (value: string) => {
      if (selectedComponent) {
        updateProperty("text", value);
      }
    },
    [selectedComponent, updateProperty]
  );

  const handleVariantChange = useCallback(
    (value: string) => {
      if (selectedComponent) {
        updateProperty("variant", value);
      }
    },
    [selectedComponent, updateProperty]
  );

  // 스타일 속성 업데이트 함수들
  const handleOpacityChange = useCallback(
    (value: string) => {
      if (selectedComponent) {
        const opacity = parseFloat(value);
        if (!isNaN(opacity) && opacity >= 0 && opacity <= 1) {
          updateProperty("opacity", opacity);
        }
      }
    },
    [selectedComponent, updateProperty]
  );

  const handleOverflowChange = useCallback(
    (value: string) => {
      if (selectedComponent) {
        updateProperty("overflow", value);
      }
    },
    [selectedComponent, updateProperty]
  );

  const handleRadiusChange = useCallback(
    (value: string) => {
      if (selectedComponent) {
        updateProperty("borderRadius", parseInt(value) || 0);
      }
    },
    [selectedComponent, updateProperty]
  );

  const handleVisibleChange = useCallback(
    (visible: boolean) => {
      if (selectedComponent) {
        updateComponent(selectedComponent.id, { visible });
      }
    },
    [selectedComponent, updateComponent]
  );

  const handleBackgroundColorChange = useCallback(
    (value: string) => {
      if (selectedComponent) {
        updateProperty("backgroundColor", value);
      }
    },
    [selectedComponent, updateProperty]
  );

  const handleBorderWidthChange = useCallback(
    (value: string) => {
      if (selectedComponent) {
        updateProperty("borderWidth", parseInt(value) || 0);
      }
    },
    [selectedComponent, updateProperty]
  );

  const handleBorderColorChange = useCallback(
    (value: string) => {
      if (selectedComponent) {
        updateProperty("borderColor", value);
      }
    },
    [selectedComponent, updateProperty]
  );

  const handleBorderStyleChange = useCallback(
    (value: string) => {
      if (selectedComponent) {
        updateProperty("borderStyle", value);
      }
    },
    [selectedComponent, updateProperty]
  );

  // Shadow 관련 상태와 핸들러
  const [shadowConfig, setShadowConfig] = useState({
    x: 0,
    y: 4,
    blur: 6,
    spread: 0,
    color: "#00000026",
  });

  // Shadow 속성을 파싱하는 함수
  const parseShadow = useCallback((boxShadow: string | undefined) => {
    if (!boxShadow || boxShadow === "none") {
      return { x: 0, y: 4, blur: 6, spread: 0, color: "#00000026" };
    }
    // 간단한 파싱: "2px 4px 6px 0px rgba(0,0,0,0.15)"
    const parts = boxShadow.match(
      /(-?\d+)px\s+(-?\d+)px\s+(-?\d+)px\s+(-?\d+)px\s+(.+)/
    );
    if (parts) {
      return {
        x: parseInt(parts[1]),
        y: parseInt(parts[2]),
        blur: parseInt(parts[3]),
        spread: parseInt(parts[4]),
        color: parts[5],
      };
    }
    return { x: 0, y: 4, blur: 6, spread: 0, color: "#00000026" };
  }, []);

  // Shadow 상태 업데이트
  React.useEffect(() => {
    if (selectedComponent?.properties.boxShadow) {
      setShadowConfig(
        parseShadow(selectedComponent.properties.boxShadow as string)
      );
    }
  }, [
    selectedComponent?.id,
    selectedComponent?.properties.boxShadow,
    parseShadow,
  ]);

  const handleShadowChange = useCallback(
    (key: keyof typeof shadowConfig, value: string | number) => {
      const newShadow = { ...shadowConfig, [key]: value };
      setShadowConfig(newShadow);

      // boxShadow 문자열 생성
      const boxShadowValue = `${newShadow.x}px ${newShadow.y}px ${newShadow.blur}px ${newShadow.spread}px ${newShadow.color}`;
      if (selectedComponent) {
        updateProperty("boxShadow", boxShadowValue);
      }
    },
    [shadowConfig, selectedComponent, updateProperty]
  );

  const removeShadow = useCallback(() => {
    if (selectedComponent) {
      updateProperty("boxShadow", "none");
      setShadowConfig({ x: 0, y: 4, blur: 6, spread: 0, color: "#00000026" });
    }
  }, [selectedComponent, updateProperty]);

  const toggleSection = useCallback(
    (section: keyof typeof expandedSections) => {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    },
    []
  );

  // 선택된 컴포넌트가 없으면 빈 패널 표시
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

  const properties = selectedComponent.properties;

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

  const InputField = React.memo(
    ({
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
    }) => {
      const inputRef = useRef<HTMLInputElement>(null);

      const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
          // 모든 키 이벤트의 전파를 완전히 차단
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();

          // 특정 키에만 기본 동작 방지
          if (e.key === "Enter") {
            e.preventDefault();
            // Enter 키 시 blur 처리로 편집 완료
            inputRef.current?.blur();
          } else if (e.key === "Escape") {
            e.preventDefault();
            // Escape 키 시 blur 처리로 편집 취소
            inputRef.current?.blur();
          }
          // 다른 키들(Backspace, Delete 등)은 기본 동작 허용
        },
        []
      );

      const handleFocus = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
          // 포커스 시 이벤트 전파 차단
          e.stopPropagation();
        },
        []
      );

      const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
          // blur 시 이벤트 전파 차단
          e.stopPropagation();
        },
        []
      );

      return (
        <div>
          <label className="block text-xs text-gray-600 mb-1">{label}</label>
          <div className="relative">
            <input
              ref={inputRef}
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
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
    }
  );

  InputField.displayName = "InputField";

  return (
    <div
      className="w-80 bg-white border-l border-gray-200 overflow-y-auto property-panel-container"
      onKeyDown={handlePanelKeyDown}
      onFocus={handlePanelFocus}
      onBlur={handlePanelBlur}
    >
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
              onChange={handleXChange}
            />
            <InputField
              label="Y"
              value={Math.round(selectedComponent.y)}
              onChange={handleYChange}
            />
          </div>
        </SectionHeader>

        {/* Size */}
        <SectionHeader title="Size" section="size">
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Width"
              value={selectedComponent.width}
              onChange={handleWidthChange}
            />
            <InputField
              label="Height"
              value={selectedComponent.height}
              onChange={handleHeightChange}
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
                <button
                  onClick={() => handleVisibleChange(true)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    selectedComponent.visible
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleVisibleChange(false)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    !selectedComponent.visible
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
            <InputField
              label="Opacity"
              value={(properties.opacity as number) ?? 1}
              onChange={handleOpacityChange}
              type="number"
            />
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Overflow
              </label>
              <select
                value={(properties.overflow as string) || "visible"}
                onChange={(e) => handleOverflowChange(e.target.value)}
                onKeyDown={(e) => {
                  // 모든 키 이벤트의 전파를 완전히 차단
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();

                  // 특정 키에만 기본 동작 방지
                  if (e.key === "Escape") {
                    e.preventDefault();
                    (e.target as HTMLSelectElement).blur();
                  }
                }}
                onFocus={(e) => e.stopPropagation()}
                onBlur={(e) => e.stopPropagation()}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
                <option value="scroll">Scroll</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <InputField
              label="Radius"
              value={(properties.borderRadius as number) ?? 0}
              onChange={handleRadiusChange}
              type="number"
            />
          </div>
        </SectionHeader>

        {/* Fill */}
        <SectionHeader title="Fill" section="fill">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={(properties.backgroundColor as string) || "#ffffff"}
                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                }}
                onFocus={(e) => e.stopPropagation()}
                onBlur={(e) => e.stopPropagation()}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={(properties.backgroundColor as string) || "#ffffff"}
                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  if (e.key === "Enter" || e.key === "Escape") {
                    e.preventDefault();
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                onFocus={(e) => e.stopPropagation()}
                onBlur={(e) => e.stopPropagation()}
                className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </SectionHeader>

        {/* Border */}
        <SectionHeader title="Border" section="border">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Width"
                value={(properties.borderWidth as number) ?? 0}
                onChange={handleBorderWidthChange}
                type="number"
                suffix="px"
              />
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Style
                </label>
                <select
                  value={(properties.borderStyle as string) || "solid"}
                  onChange={(e) => handleBorderStyleChange(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    if (e.key === "Escape") {
                      e.preventDefault();
                      (e.target as HTMLSelectElement).blur();
                    }
                  }}
                  onFocus={(e) => e.stopPropagation()}
                  onBlur={(e) => e.stopPropagation()}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={(properties.borderColor as string) || "#000000"}
                onChange={(e) => handleBorderColorChange(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                }}
                onFocus={(e) => e.stopPropagation()}
                onBlur={(e) => e.stopPropagation()}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={(properties.borderColor as string) || "#000000"}
                onChange={(e) => handleBorderColorChange(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  if (e.key === "Enter" || e.key === "Escape") {
                    e.preventDefault();
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                onFocus={(e) => e.stopPropagation()}
                onBlur={(e) => e.stopPropagation()}
                className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#000000"
              />
            </div>
          </div>
        </SectionHeader>

        {/* Shadow */}
        <SectionHeader title="Shadow" section="shadow">
          <div className="space-y-3">
            {properties.boxShadow && properties.boxShadow !== "none" ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="X Offset"
                    value={shadowConfig.x}
                    onChange={(v) => handleShadowChange("x", parseInt(v) || 0)}
                    type="number"
                    suffix="px"
                  />
                  <InputField
                    label="Y Offset"
                    value={shadowConfig.y}
                    onChange={(v) => handleShadowChange("y", parseInt(v) || 0)}
                    type="number"
                    suffix="px"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Blur"
                    value={shadowConfig.blur}
                    onChange={(v) =>
                      handleShadowChange("blur", parseInt(v) || 0)
                    }
                    type="number"
                    suffix="px"
                  />
                  <InputField
                    label="Spread"
                    value={shadowConfig.spread}
                    onChange={(v) =>
                      handleShadowChange("spread", parseInt(v) || 0)
                    }
                    type="number"
                    suffix="px"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={
                      shadowConfig.color.startsWith("#")
                        ? shadowConfig.color
                        : "#000000"
                    }
                    onChange={(e) =>
                      handleShadowChange("color", e.target.value)
                    }
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                    }}
                    onFocus={(e) => e.stopPropagation()}
                    onBlur={(e) => e.stopPropagation()}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={shadowConfig.color}
                    onChange={(e) =>
                      handleShadowChange("color", e.target.value)
                    }
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      if (e.key === "Enter" || e.key === "Escape") {
                        e.preventDefault();
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    onFocus={(e) => e.stopPropagation()}
                    onBlur={(e) => e.stopPropagation()}
                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Color"
                  />
                </div>
                <button
                  onClick={removeShadow}
                  className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove Shadow
                </button>
              </>
            ) : (
              <button
                onClick={() => handleShadowChange("x", 0)}
                className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
              >
                Add Shadow
              </button>
            )}
          </div>
        </SectionHeader>

        {/* Component-specific properties */}
        {selectedComponent.type === "text" && (
          <SectionHeader title="Text" section="style">
            <div className="space-y-3">
              <InputField
                label="Content"
                value={(properties.text as string) || ""}
                onChange={handleTextChange}
                placeholder="텍스트를 입력하세요"
              />
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Font Size
                </label>
                <select
                  value={(properties.fontSize as string) || "14px"}
                  onChange={(e) => handleFontSizeChange(e.target.value)}
                  onKeyDown={(e) => {
                    // 모든 키 이벤트의 전파를 막음
                    e.stopPropagation();

                    // 특정 키에만 기본 동작 방지
                    if (e.key === "Escape") {
                      e.preventDefault();
                      (e.target as HTMLSelectElement).blur();
                    }
                  }}
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
                onChange={handleButtonTextChange}
                placeholder="버튼 텍스트"
              />
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Variant
                </label>
                <select
                  value={(properties.variant as string) || "primary"}
                  onChange={(e) => handleVariantChange(e.target.value)}
                  onKeyDown={(e) => {
                    // 모든 키 이벤트의 전파를 막음
                    e.stopPropagation();

                    // 특정 키에만 기본 동작 방지
                    if (e.key === "Escape") {
                      e.preventDefault();
                      (e.target as HTMLSelectElement).blur();
                    }
                  }}
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
