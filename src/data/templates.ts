import type { ComponentInstance } from "@/types";

export interface Template {
  id: string;
  name: string;
  description: string;
  category: "forms" | "dashboard" | "navigation" | "content";
  thumbnail?: string;
  components: Omit<ComponentInstance, "id">[];
  shouldGroup?: boolean; // 템플릿 추가 시 자동으로 그룹화할지 여부
  groupName?: string; // 그룹 이름
}

export const TEMPLATES: Template[] = [
  {
    id: "login-form",
    name: "로그인 폼",
    description: "이메일과 비밀번호 입력이 있는 기본 로그인 폼",
    category: "forms",
    shouldGroup: true,
    groupName: "로그인 폼",
    components: [
      // 제목
      {
        type: "text",
        x: 50,
        y: 30,
        width: 200,
        height: 40,
        properties: {
          text: "로그인",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#1f2937",
          textAlign: "center",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 이메일 라벨
      {
        type: "text",
        x: 50,
        y: 90,
        width: 100,
        height: 20,
        properties: {
          text: "이메일",
          fontSize: "14px",
          fontWeight: "normal",
          color: "#374151",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 이메일 입력
      {
        type: "input",
        x: 50,
        y: 115,
        width: 300,
        height: 40,
        properties: {
          placeholder: "이메일을 입력하세요",
          inputType: "email",
          backgroundColor: "#ffffff",
          borderColor: "#d1d5db",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
          {
            id: "error",
            name: "Error",
            properties: {
              borderColor: "#ef4444",
              backgroundColor: "#fef2f2",
            },
            isDefault: false,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 비밀번호 라벨
      {
        type: "text",
        x: 50,
        y: 175,
        width: 100,
        height: 20,
        properties: {
          text: "비밀번호",
          fontSize: "14px",
          fontWeight: "normal",
          color: "#374151",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 비밀번호 입력
      {
        type: "input",
        x: 50,
        y: 200,
        width: 300,
        height: 40,
        properties: {
          placeholder: "비밀번호를 입력하세요",
          inputType: "password",
          backgroundColor: "#ffffff",
          borderColor: "#d1d5db",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 로그인 버튼
      {
        type: "button",
        x: 50,
        y: 260,
        width: 300,
        height: 45,
        properties: {
          text: "로그인",
          backgroundColor: "#3b82f6",
          textColor: "#ffffff",
          variant: "primary",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
          {
            id: "loading",
            name: "Loading",
            properties: {
              text: "로그인 중...",
              backgroundColor: "#9ca3af",
            },
            isDefault: false,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
    ],
  },
  {
    id: "signup-form",
    name: "회원가입 폼",
    description: "이름, 이메일, 비밀번호 입력이 있는 회원가입 폼",
    category: "forms",
    shouldGroup: true,
    groupName: "회원가입 폼",
    components: [
      // 제목
      {
        type: "text",
        x: 50,
        y: 30,
        width: 200,
        height: 40,
        properties: {
          text: "회원가입",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#1f2937",
          textAlign: "center",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 이름 라벨
      {
        type: "text",
        x: 50,
        y: 90,
        width: 100,
        height: 20,
        properties: {
          text: "이름",
          fontSize: "14px",
          fontWeight: "normal",
          color: "#374151",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 이름 입력
      {
        type: "input",
        x: 50,
        y: 115,
        width: 300,
        height: 40,
        properties: {
          placeholder: "이름을 입력하세요",
          inputType: "text",
          backgroundColor: "#ffffff",
          borderColor: "#d1d5db",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 이메일 라벨
      {
        type: "text",
        x: 50,
        y: 175,
        width: 100,
        height: 20,
        properties: {
          text: "이메일",
          fontSize: "14px",
          fontWeight: "normal",
          color: "#374151",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 이메일 입력
      {
        type: "input",
        x: 50,
        y: 200,
        width: 300,
        height: 40,
        properties: {
          placeholder: "이메일을 입력하세요",
          inputType: "email",
          backgroundColor: "#ffffff",
          borderColor: "#d1d5db",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 비밀번호 라벨
      {
        type: "text",
        x: 50,
        y: 260,
        width: 100,
        height: 20,
        properties: {
          text: "비밀번호",
          fontSize: "14px",
          fontWeight: "normal",
          color: "#374151",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 비밀번호 입력
      {
        type: "input",
        x: 50,
        y: 285,
        width: 300,
        height: 40,
        properties: {
          placeholder: "비밀번호를 입력하세요",
          inputType: "password",
          backgroundColor: "#ffffff",
          borderColor: "#d1d5db",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 회원가입 버튼
      {
        type: "button",
        x: 50,
        y: 345,
        width: 300,
        height: 45,
        properties: {
          text: "회원가입",
          backgroundColor: "#10b981",
          textColor: "#ffffff",
          variant: "primary",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
    ],
  },
  {
    id: "dashboard-card",
    name: "대시보드 카드",
    description: "통계 정보를 보여주는 대시보드 카드",
    category: "dashboard",
    shouldGroup: true,
    groupName: "대시보드 카드",
    components: [
      // 카드 배경
      {
        type: "rectangle",
        x: 50,
        y: 50,
        width: 280,
        height: 160,
        properties: {
          backgroundColor: "#ffffff",
          borderColor: "#e5e7eb",
          borderWidth: 1,
          borderRadius: 8,
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 카드 제목
      {
        type: "text",
        x: 70,
        y: 70,
        width: 150,
        height: 25,
        properties: {
          text: "총 사용자",
          fontSize: "16px",
          fontWeight: "600",
          color: "#374151",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 메인 숫자
      {
        type: "text",
        x: 70,
        y: 105,
        width: 120,
        height: 40,
        properties: {
          text: "12,345",
          fontSize: "32px",
          fontWeight: "bold",
          color: "#1f2937",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 증가율 표시
      {
        type: "text",
        x: 70,
        y: 155,
        width: 100,
        height: 20,
        properties: {
          text: "+12.5%",
          fontSize: "14px",
          fontWeight: "500",
          color: "#10b981",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 기간 표시
      {
        type: "text",
        x: 180,
        y: 155,
        width: 120,
        height: 20,
        properties: {
          text: "지난 달 대비",
          fontSize: "12px",
          fontWeight: "normal",
          color: "#6b7280",
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
      // 아이콘 영역 (원형)
      {
        type: "circle",
        x: 260,
        y: 70,
        width: 50,
        height: 50,
        properties: {
          backgroundColor: "#dbeafe",
          borderColor: "#3b82f6",
          borderWidth: 2,
        },
        states: [
          {
            id: "default",
            name: "Default",
            properties: {},
            isDefault: true,
          },
        ],
        currentState: "default",
        visible: true,
        locked: false,
      },
    ],
  },
];

export const getTemplatesByCategory = (category: Template["category"]) => {
  return TEMPLATES.filter((template) => template.category === category);
};

export const getTemplateById = (id: string) => {
  return TEMPLATES.find((template) => template.id === id);
};
