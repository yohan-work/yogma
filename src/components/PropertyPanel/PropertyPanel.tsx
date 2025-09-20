"use client";

import { useProjectStore } from "@/stores/useProjectStore";

export const PropertyPanel = () => {
  const { components, selectedComponentId, updateComponent } =
    useProjectStore();

  const selectedComponent = components.find(
    (c) => c.id === selectedComponentId
  );

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

  const updateProperty = (key: string, value: string | number | boolean) => {
    updateComponent(selectedComponent.id, {
      properties: {
        ...selectedComponent.properties,
        [key]: value,
      },
    });
  };

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
    <div className="w-80 bg-white border-l border-gray-200 p-4">
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
              onChange={(e) =>
                updateComponent(selectedComponent.id, {
                  x: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Y</label>
            <input
              type="number"
              value={Math.round(selectedComponent.y)}
              onChange={(e) =>
                updateComponent(selectedComponent.id, {
                  y: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
