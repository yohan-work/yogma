import { create } from 'zustand';
import type { ComponentInstance, FlowNode, ProjectState } from '@/types';

interface ProjectStore extends ProjectState {
  // 컴포넌트 관련 액션
  addComponent: (component: Omit<ComponentInstance, 'id'>) => void;
  updateComponent: (id: string, updates: Partial<ComponentInstance>) => void;
  deleteComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  
  // 플로우 관련 액션
  addFlowNode: (node: Omit<FlowNode, 'id'>) => void;
  updateFlowNode: (id: string, updates: Partial<FlowNode>) => void;
  deleteFlowNode: (id: string) => void;
  
  // 모드 전환
  togglePreviewMode: () => void;
  
  // Mock 데이터 관리
  updateMockData: (data: ProjectState['mockData']) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  // 초기 상태
  components: [],
  selectedComponentId: null,
  flowNodes: [],
  mockData: {},
  isPreviewMode: false,

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
      selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
    }));
  },

  selectComponent: (id) => {
    set({ selectedComponentId: id });
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
}));
