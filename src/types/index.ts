// 컴포넌트 타입 정의
export interface ComponentType {
  id: string;
  type:
    | "input"
    | "button"
    | "text"
    | "image"
    | "rectangle"
    | "circle"
    | "triangle"
    | "line"
    | "frame";
  name: string;
  icon: string;
}

// 컴포넌트 속성 타입들
export interface BaseComponentProperties {
  [key: string]: string | number | boolean | undefined;
  // 공통 스타일 속성
  opacity?: number;
  overflow?: "visible" | "hidden" | "scroll" | "auto";
  borderRadius?: number;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: "solid" | "dashed" | "dotted" | "none";
  boxShadow?: string;
}

export interface TextProperties extends BaseComponentProperties {
  text?: string;
  fontSize?: string;
  color?: string;
  fontWeight?: string;
}

export interface ButtonProperties extends BaseComponentProperties {
  text?: string;
  variant?: "primary" | "secondary";
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
}

export interface InputProperties extends BaseComponentProperties {
  placeholder?: string;
  inputType?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export interface ImageProperties extends BaseComponentProperties {
  src?: string;
  alt?: string;
}

export type ComponentProperties =
  | TextProperties
  | ButtonProperties
  | InputProperties
  | ImageProperties;

// 캔버스에 배치된 컴포넌트 인스턴스
export interface ComponentInstance {
  id: string;
  type: ComponentType["type"];
  x: number;
  y: number;
  width: number;
  height: number;
  properties: ComponentProperties;
  states: ComponentState[];
  currentState: string;
  visible: boolean;
  locked: boolean;
  groupId?: string; // 그룹 ID (선택적)
}

export interface ComponentGroup {
  id: string;
  name: string;
  componentIds: string[];
  x: number; // 그룹의 기준점
  y: number;
  width: number; // 그룹의 전체 크기
  height: number;
  locked: boolean;
  visible: boolean;
}

// 컴포넌트 상태 정의
export interface ComponentState {
  id: string;
  name: string;
  properties: Partial<ComponentProperties>;
  isDefault?: boolean;
}

// 플로우 노드 정의
export interface FlowNode {
  id: string;
  type: "condition" | "action" | "state-change";
  position: { x: number; y: number };
  data: {
    condition?: string;
    action?: string;
    targetState?: string;
    targetComponent?: string;
  };
  connections: string[];
}

// Mock 데이터 타입
export interface MockData {
  [key: string]: string | number | boolean | MockData[] | MockData;
}

// 도구 타입 정의
export type ToolType =
  | "select"
  | "frame"
  | "rectangle"
  | "circle"
  | "triangle"
  | "line"
  | "pen"
  | "text"
  | "image"
  | "hand";

// 프로젝트 전체 상태
export interface ProjectState {
  components: ComponentInstance[];
  groups: ComponentGroup[];
  selectedComponentId: string | null;
  selectedComponentIds: string[]; // 다중 선택
  selectedGroupId: string | null;
  flowNodes: FlowNode[];
  mockData: MockData;
  isPreviewMode: boolean;
  activeTool: ToolType;
  zoomLevel: number;
}

// 드래그앤드롭 관련
export interface DragItem {
  id: string;
  type: string;
  componentType?: ComponentType["type"];
}
