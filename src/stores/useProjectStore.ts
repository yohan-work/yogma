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
    console.log("addComponentsAsGroup 호출됨:", { components, groupName });

    const groupId = `group-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // 컴포넌트들을 생성하고 그룹 ID 할당
    const newComponents: ComponentInstance[] = components.map((component) => ({
      ...component,
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      groupId,
    }));

    console.log("생성된 컴포넌트들:", newComponents);

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

    console.log("생성된 그룹:", newGroup);

    set((state) => ({
      components: [...state.components, ...newComponents],
      groups: [...state.groups, newGroup],
      selectedGroupId: groupId,
      selectedComponentIds: [],
      selectedComponentId: null,
    }));

    console.log("그룹 생성 완료, groupId:", groupId);
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
    console.log("moveGroup 호출됨:", { groupId, deltaX, deltaY });

    set((state) => {
      const group = state.groups.find((g) => g.id === groupId);
      if (!group) {
        console.log("그룹을 찾을 수 없음:", groupId);
        return state;
      }

      console.log("그룹 찾음:", group);

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

      console.log("그룹 이동 완료:", {
        updatedGroup,
        affectedComponents: updatedComponents.filter((c) =>
          group.componentIds.includes(c.id)
        ),
      });

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
