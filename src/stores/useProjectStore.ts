import { create } from "zustand";
import type {
  ComponentInstance,
  ComponentGroup,
  FlowNode,
  ProjectState,
  ToolType,
} from "@/types";

interface ProjectStore extends ProjectState {
  // 컴포넌트 관련 액션
  addComponent: (component: Omit<ComponentInstance, "id">) => void;
  addComponents: (
    components: Omit<ComponentInstance, "id">[],
    groupId?: string
  ) => void;
  addComponentsAsGroup: (
    components: Omit<ComponentInstance, "id">[],
    groupName?: string
  ) => string;
  updateComponent: (id: string, updates: Partial<ComponentInstance>) => void;
  deleteComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;

  // 다중 선택 관련 액션
  selectMultipleComponents: (ids: string[]) => void;
  addToSelection: (id: string) => void;
  removeFromSelection: (id: string) => void;
  clearSelection: () => void;

  // 그룹 관련 액션
  createGroup: (componentIds: string[], name?: string) => string;
  updateGroup: (id: string, updates: Partial<ComponentGroup>) => void;
  deleteGroup: (id: string) => void;
  selectGroup: (id: string | null) => void;
  ungroupComponents: (groupId: string) => void;
  moveGroup: (groupId: string, deltaX: number, deltaY: number) => void;
  resizeGroup: (groupId: string, newWidth: number, newHeight: number) => void;

  // 플로우 관련 액션
  addFlowNode: (node: Omit<FlowNode, "id">) => void;
  updateFlowNode: (id: string, updates: Partial<FlowNode>) => void;
  deleteFlowNode: (id: string) => void;

  // 모드 전환
  togglePreviewMode: () => void;

  // Mock 데이터 관리
  updateMockData: (data: ProjectState["mockData"]) => void;

  // 도구 관리
  setActiveTool: (tool: ToolType) => void;

  // 줌 관리
  setZoomLevel: (level: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  // 초기 상태
  components: [],
  groups: [],
  selectedComponentId: null,
  selectedComponentIds: [],
  selectedGroupId: null,
  flowNodes: [],
  mockData: {},
  isPreviewMode: false,
  activeTool: "select",
  zoomLevel: 100,

  // 컴포넌트 관련 액션
  addComponent: (component) => {
    const newComponent: ComponentInstance = {
      ...component,
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    set((state) => ({
      components: [...state.components, newComponent],
    }));
  },

  addComponents: (components, groupId) => {
    const newComponents: ComponentInstance[] = components.map((component) => ({
      ...component,
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      groupId,
    }));

    set((state) => ({
      components: [...state.components, ...newComponents],
    }));
  },

  addComponentsAsGroup: (components, groupName) => {
    const groupId = `group-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // 컴포넌트들을 생성하고 그룹 ID 할당
    const newComponents: ComponentInstance[] = components.map((component) => ({
      ...component,
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      groupId,
    }));

    // 그룹 경계 계산
    const minX = Math.min(...newComponents.map((c) => c.x));
    const minY = Math.min(...newComponents.map((c) => c.y));
    const maxX = Math.max(...newComponents.map((c) => c.x + c.width));
    const maxY = Math.max(...newComponents.map((c) => c.y + c.height));

    const newGroup: ComponentGroup = {
      id: groupId,
      name: groupName || "템플릿 그룹",
      componentIds: newComponents.map((c) => c.id),
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      locked: false,
      visible: true,
    };

    set((state) => ({
      components: [...state.components, ...newComponents],
      groups: [...state.groups, newGroup],
      selectedGroupId: groupId,
      selectedComponentIds: [],
      selectedComponentId: null,
    }));

    return groupId;
  },

  updateComponent: (id, updates) => {
    set((state) => ({
      components: state.components.map((comp) =>
        comp.id === id ? { ...comp, ...updates } : comp
      ),
    }));
  },

  deleteComponent: (id) => {
    set((state) => ({
      components: state.components.filter((comp) => comp.id !== id),
      selectedComponentId:
        state.selectedComponentId === id ? null : state.selectedComponentId,
    }));
  },

  selectComponent: (id) => {
    set({
      selectedComponentId: id,
      selectedComponentIds: id ? [id] : [],
      selectedGroupId: null,
    });
  },

  // 다중 선택 관련 액션
  selectMultipleComponents: (ids) => {
    set({
      selectedComponentIds: ids,
      selectedComponentId: ids.length === 1 ? ids[0] : null,
      selectedGroupId: null,
    });
  },

  addToSelection: (id) => {
    set((state) => {
      const newSelection = [...state.selectedComponentIds];
      if (!newSelection.includes(id)) {
        newSelection.push(id);
      }
      return {
        selectedComponentIds: newSelection,
        selectedComponentId: newSelection.length === 1 ? newSelection[0] : null,
        selectedGroupId: null,
      };
    });
  },

  removeFromSelection: (id) => {
    set((state) => {
      const newSelection = state.selectedComponentIds.filter(
        (componentId) => componentId !== id
      );
      return {
        selectedComponentIds: newSelection,
        selectedComponentId: newSelection.length === 1 ? newSelection[0] : null,
      };
    });
  },

  clearSelection: () => {
    set({
      selectedComponentIds: [],
      selectedComponentId: null,
      selectedGroupId: null,
    });
  },

  // 그룹 관련 액션
  createGroup: (componentIds, name) => {
    const groupId = `group-${Date.now()}`;

    set((state) => {
      // 선택된 컴포넌트들의 경계 계산
      const selectedComponents = state.components.filter((c) =>
        componentIds.includes(c.id)
      );
      if (selectedComponents.length === 0) return state;

      const minX = Math.min(...selectedComponents.map((c) => c.x));
      const minY = Math.min(...selectedComponents.map((c) => c.y));
      const maxX = Math.max(...selectedComponents.map((c) => c.x + c.width));
      const maxY = Math.max(...selectedComponents.map((c) => c.y + c.height));

      const newGroup: ComponentGroup = {
        id: groupId,
        name: name || `그룹 ${state.groups.length + 1}`,
        componentIds,
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        locked: false,
        visible: true,
      };

      // 컴포넌트들에 그룹 ID 할당
      const updatedComponents = state.components.map((component) =>
        componentIds.includes(component.id)
          ? { ...component, groupId }
          : component
      );

      return {
        ...state,
        groups: [...state.groups, newGroup],
        components: updatedComponents,
        selectedGroupId: groupId,
        selectedComponentIds: [],
        selectedComponentId: null,
      };
    });

    return groupId;
  },

  updateGroup: (id, updates) => {
    set((state) => ({
      ...state,
      groups: state.groups.map((group) =>
        group.id === id ? { ...group, ...updates } : group
      ),
    }));
  },

  deleteGroup: (id) => {
    set((state) => {
      const group = state.groups.find((g) => g.id === id);
      if (!group) return state;

      // 그룹에 속한 컴포넌트들의 groupId 제거
      const updatedComponents = state.components.map((component) =>
        group.componentIds.includes(component.id)
          ? { ...component, groupId: undefined }
          : component
      );

      return {
        ...state,
        groups: state.groups.filter((g) => g.id !== id),
        components: updatedComponents,
        selectedGroupId:
          state.selectedGroupId === id ? null : state.selectedGroupId,
      };
    });
  },

  selectGroup: (id) => {
    set({
      selectedGroupId: id,
      selectedComponentId: null,
      selectedComponentIds: [],
    });
  },

  ungroupComponents: (groupId) => {
    set((state) => {
      const group = state.groups.find((g) => g.id === groupId);
      if (!group) return state;

      // 컴포넌트들의 groupId 제거
      const updatedComponents = state.components.map((component) =>
        group.componentIds.includes(component.id)
          ? { ...component, groupId: undefined }
          : component
      );

      return {
        ...state,
        groups: state.groups.filter((g) => g.id !== groupId),
        components: updatedComponents,
        selectedGroupId: null,
        selectedComponentIds: group.componentIds,
        selectedComponentId:
          group.componentIds.length === 1 ? group.componentIds[0] : null,
      };
    });
  },

  moveGroup: (groupId, deltaX, deltaY) => {
    set((state) => {
      const group = state.groups.find((g) => g.id === groupId);
      if (!group) return state;

      // 그룹 위치 업데이트
      const updatedGroup = {
        ...group,
        x: group.x + deltaX,
        y: group.y + deltaY,
      };

      // 그룹에 속한 모든 컴포넌트들의 위치 업데이트
      const updatedComponents = state.components.map((component) =>
        group.componentIds.includes(component.id)
          ? { ...component, x: component.x + deltaX, y: component.y + deltaY }
          : component
      );

      return {
        ...state,
        groups: state.groups.map((g) => (g.id === groupId ? updatedGroup : g)),
        components: updatedComponents,
      };
    });
  },

  resizeGroup: (groupId, newWidth, newHeight) => {
    set((state) => {
      const group = state.groups.find((g) => g.id === groupId);
      if (!group) return state;

      // 최소 크기 제한
      const minSize = 50;
      newWidth = Math.max(minSize, newWidth);
      newHeight = Math.max(minSize, newHeight);

      // 원래 크기 대비 비율 계산
      const scaleX = newWidth / group.width;
      const scaleY = newHeight / group.height;

      // 그룹에 속한 모든 컴포넌트들의 위치와 크기를 비율에 맞게 조정
      const updatedComponents = state.components.map((component) => {
        if (!group.componentIds.includes(component.id)) {
          return component;
        }

        // 그룹 기준점에서의 상대 위치 계산
        const relativeX = component.x - group.x;
        const relativeY = component.y - group.y;

        // 새로운 위치 계산 (비율 적용)
        const newX = group.x + relativeX * scaleX;
        const newY = group.y + relativeY * scaleY;

        // 새로운 크기 계산 (비율 적용)
        const newComponentWidth = component.width * scaleX;
        const newComponentHeight = component.height * scaleY;

        // 속성 중 픽셀 단위 값들을 비율에 맞게 조정
        const scaleProperty = (value: unknown, scale: number): unknown => {
          if (typeof value === "string" && value.endsWith("px")) {
            const numValue = parseFloat(value);
            return `${Math.round(numValue * scale)}px`;
          }
          if (typeof value === "number") {
            return Math.round(value * scale);
          }
          return value;
        };

        const scaledProperties = { ...component.properties };

        // fontSize 조정 (평균 비율 사용)
        if (scaledProperties.fontSize) {
          const avgScale = (scaleX + scaleY) / 2;
          scaledProperties.fontSize = scaleProperty(
            scaledProperties.fontSize,
            avgScale
          ) as string;
        }

        // borderRadius 조정
        if (scaledProperties.borderRadius !== undefined) {
          const avgScale = (scaleX + scaleY) / 2;
          scaledProperties.borderRadius = scaleProperty(
            scaledProperties.borderRadius,
            avgScale
          ) as number;
        }

        // borderWidth 조정
        if (scaledProperties.borderWidth !== undefined) {
          const avgScale = (scaleX + scaleY) / 2;
          scaledProperties.borderWidth = scaleProperty(
            scaledProperties.borderWidth,
            avgScale
          ) as number;
        }

        // strokeWidth 조정 (line 컴포넌트용)
        if (scaledProperties.strokeWidth !== undefined) {
          scaledProperties.strokeWidth = scaleProperty(
            scaledProperties.strokeWidth,
            scaleY
          ) as number;
        }

        return {
          ...component,
          x: newX,
          y: newY,
          width: newComponentWidth,
          height: newComponentHeight,
          properties: scaledProperties,
        };
      });

      // 그룹 크기 업데이트
      const updatedGroup = {
        ...group,
        width: newWidth,
        height: newHeight,
      };

      return {
        ...state,
        groups: state.groups.map((g) => (g.id === groupId ? updatedGroup : g)),
        components: updatedComponents,
      };
    });
  },

  // 플로우 관련 액션
  addFlowNode: (node) => {
    const newNode: FlowNode = {
      ...node,
      id: `flow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    set((state) => ({
      flowNodes: [...state.flowNodes, newNode],
    }));
  },

  updateFlowNode: (id, updates) => {
    set((state) => ({
      flowNodes: state.flowNodes.map((node) =>
        node.id === id ? { ...node, ...updates } : node
      ),
    }));
  },

  deleteFlowNode: (id) => {
    set((state) => ({
      flowNodes: state.flowNodes.filter((node) => node.id !== id),
    }));
  },

  // 모드 전환
  togglePreviewMode: () => {
    set((state) => ({
      isPreviewMode: !state.isPreviewMode,
    }));
  },

  // Mock 데이터 관리
  updateMockData: (data) => {
    set({ mockData: data });
  },

  // 도구 관리
  setActiveTool: (tool) => {
    set({ activeTool: tool });
  },

  // 줌 관리
  setZoomLevel: (level) => {
    set({ zoomLevel: Math.max(10, Math.min(500, level)) });
  },

  zoomIn: () => {
    set((state) => ({
      zoomLevel: Math.min(500, state.zoomLevel + 10),
    }));
  },

  zoomOut: () => {
    set((state) => ({
      zoomLevel: Math.max(10, state.zoomLevel - 10),
    }));
  },
}));
