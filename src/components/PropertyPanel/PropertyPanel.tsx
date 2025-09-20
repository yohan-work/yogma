"use client";

import { useProjectStore } from "@/stores/useProjectStore";
import { useCallback, useEffect } from "react";

export const PropertyPanel = () => {
  const { components, selectedComponentId, updateComponent } =
    useProjectStore();

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

  // 입력 필드에서 키보드 이벤트 전파 방지 (강력한 포커스 유지)
  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    // 모든 키 이벤트의 전파를 완전히 차단
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    // 특정 키에만 기본 동작 방지 (Enter, Escape 등)
    if (e.key === "Enter") {
      e.preventDefault();
      // Enter 키 시 blur 처리로 편집 완료
      (e.target as HTMLInputElement | HTMLSelectElement).blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      // Escape 키 시 blur 처리로 편집 취소
      (e.target as HTMLInputElement | HTMLSelectElement).blur();
    }
    // 다른 키들(Backspace, Delete 등)은 기본 동작 허용
  }, []);

  // 포커스 이벤트 핸들러
  const handleInputFocus = useCallback((e: React.FocusEvent) => {
    e.stopPropagation();
  }, []);

  const handleInputBlur = useCallback((e: React.FocusEvent) => {
    e.stopPropagation();
  }, []);

  // 위치 및 크기 업데이트 함수들을 메모이제이션
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

  // 선택된 컴포넌트가 없으면 빈 패널 표시
  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">속성</h2>
        <div className="text-center text-gray-400 mt-8">
          <div className="text-sm">컴포넌트를 선택하면</div>
          <div className="text-sm">속성을 편집할 수 있습니다</div>
        </div>
      </div>
    );
  }

  // 타입 안전한 속성 접근을 위한 헬퍼 함수
  const properties = selectedComponent.properties;

  const renderPropertyInputs = () => {
    const { type } = selectedComponent;

    switch (type) {
      case "text":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                텍스트
              </label>
              <input
                type="text"
                value={(properties.text as string) || ""}
                onChange={(e) => updateProperty("text", e.target.value)}
                onKeyDown={handleInputKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="텍스트를 입력하세요"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                폰트 크기
              </label>
              <select
                value={(properties.fontSize as string) || "14px"}
                onChange={(e) => updateProperty("fontSize", e.target.value)}
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
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                색상
              </label>
              <input
                type="color"
                value={(properties.color as string) || "#374151"}
                onChange={(e) => updateProperty("color", e.target.value)}
                onKeyDown={handleInputKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
          </>
        );

      case "button":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                버튼 텍스트
              </label>
              <input
                type="text"
                value={(properties.text as string) || ""}
                onChange={(e) => updateProperty("text", e.target.value)}
                onKeyDown={handleInputKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="버튼 텍스트"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                스타일
              </label>
              <select
                value={(properties.variant as string) || "primary"}
                onChange={(e) => updateProperty("variant", e.target.value)}
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
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                배경색
              </label>
              <input
                type="color"
                value={(properties.backgroundColor as string) || "#3b82f6"}
                onChange={(e) =>
                  updateProperty("backgroundColor", e.target.value)
                }
                onKeyDown={handleInputKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
          </>
        );

      case "input":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                플레이스홀더
              </label>
              <input
                type="text"
                value={(properties.placeholder as string) || ""}
                onChange={(e) => updateProperty("placeholder", e.target.value)}
                onKeyDown={handleInputKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="플레이스홀더 텍스트"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                입력 타입
              </label>
              <select
                value={(properties.inputType as string) || "text"}
                onChange={(e) => updateProperty("inputType", e.target.value)}
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
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="text">텍스트</option>
                <option value="email">이메일</option>
                <option value="password">비밀번호</option>
                <option value="number">숫자</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                너비
              </label>
              <input
                type="text"
                value={(properties.width as string) || "200px"}
                onChange={(e) => updateProperty("width", e.target.value)}
                onKeyDown={handleInputKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 200px, 100%"
              />
            </div>
          </>
        );

      case "image":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 URL
              </label>
              <input
                type="text"
                value={(properties.src as string) || ""}
                onChange={(e) => updateProperty("src", e.target.value)}
                onKeyDown={handleInputKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대체 텍스트
              </label>
              <input
                type="text"
                value={(properties.alt as string) || ""}
                onChange={(e) => updateProperty("alt", e.target.value)}
                onKeyDown={handleInputKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이미지 설명"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  너비
                </label>
                <input
                  type="text"
                  value={(properties.width as string) || "150px"}
                  onChange={(e) => updateProperty("width", e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="150px"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  높이
                </label>
                <input
                  type="text"
                  value={(properties.height as string) || "100px"}
                  onChange={(e) => updateProperty("height", e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100px"
                />
              </div>
            </div>
          </>
        );

      default:
        return <div className="text-gray-500">속성을 편집할 수 없습니다</div>;
    }
  };

  return (
    <div
      className="w-80 bg-white border-l border-gray-200 p-4 property-panel-container"
      onKeyDown={handlePanelKeyDown}
      onFocus={handlePanelFocus}
      onBlur={handlePanelBlur}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">속성</h2>

      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">선택된 컴포넌트</div>
        <div className="font-medium text-gray-800 capitalize">
          {selectedComponent.type}
        </div>
      </div>

      <div className="space-y-4">{renderPropertyInputs()}</div>

      {/* 위치 및 크기 정보 */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          위치 및 크기
        </h3>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">X</label>
            <input
              type="number"
              value={Math.round(selectedComponent.x)}
              onChange={(e) => handleXChange(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Y</label>
            <input
              type="number"
              value={Math.round(selectedComponent.y)}
              onChange={(e) => handleYChange(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
