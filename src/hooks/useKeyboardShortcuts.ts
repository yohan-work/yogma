import { useEffect } from "react";
import { useProjectStore } from "@/stores/useProjectStore";

export const useKeyboardShortcuts = () => {
  const {
    selectedComponentId,
    components,
    deleteComponent,
    updateComponent,
    addComponent,
  } = useProjectStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 필드에 포커스가 있을 때는 단축키 비활성화
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.contentEditable === "true");

      if (isInputFocused) {
        return; // 입력 필드에 포커스가 있으면 단축키 실행하지 않음
      }

      // Ctrl/Cmd 키 조합
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Delete 키 - 선택된 컴포넌트 삭제
      if (e.key === "Delete" && selectedComponentId) {
        e.preventDefault();
        deleteComponent(selectedComponentId);
        return;
      }

      // Backspace 키 - 선택된 컴포넌트 삭제
      if (e.key === "Backspace" && selectedComponentId) {
        e.preventDefault();
        deleteComponent(selectedComponentId);
        return;
      }

      // Ctrl/Cmd + C - 복사
      if (isCtrlOrCmd && e.key === "c" && selectedComponentId) {
        e.preventDefault();
        const selectedComponent = components.find(
          (c) => c.id === selectedComponentId
        );
        if (selectedComponent) {
          // 로컬 스토리지에 복사된 컴포넌트 저장
          localStorage.setItem(
            "yogma-clipboard",
            JSON.stringify(selectedComponent)
          );
        }
        return;
      }

      // Ctrl/Cmd + V - 붙여넣기
      if (isCtrlOrCmd && e.key === "v") {
        e.preventDefault();
        const clipboardData = localStorage.getItem("yogma-clipboard");
        if (clipboardData) {
          try {
            const copiedComponent = JSON.parse(clipboardData);
            // 새로운 위치에 붙여넣기 (약간 오프셋)
            const newComponent = {
              ...copiedComponent,
              x: copiedComponent.x + 20,
              y: copiedComponent.y + 20,
              visible: true,
              locked: false,
            };
            delete newComponent.id; // ID는 자동 생성되도록
            addComponent(newComponent);
          } catch (error) {
            console.error("붙여넣기 오류:", error);
          }
        }
        return;
      }

      // Ctrl/Cmd + D - 복제
      if (isCtrlOrCmd && e.key === "d" && selectedComponentId) {
        e.preventDefault();
        const selectedComponent = components.find(
          (c) => c.id === selectedComponentId
        );
        if (selectedComponent) {
          const duplicatedComponent = {
            ...selectedComponent,
            x: selectedComponent.x + 20,
            y: selectedComponent.y + 20,
            visible: true,
            locked: false,
          };
          delete (duplicatedComponent as { id?: string }).id; // ID는 자동 생성되도록
          addComponent(duplicatedComponent);
        }
        return;
      }

      // 화살표 키 - 선택된 컴포넌트 이동
      if (
        selectedComponentId &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
        const selectedComponent = components.find(
          (c) => c.id === selectedComponentId
        );
        if (selectedComponent && !selectedComponent.locked) {
          const step = e.shiftKey ? 10 : 1; // Shift 키로 큰 단위 이동
          let newX = selectedComponent.x;
          let newY = selectedComponent.y;

          switch (e.key) {
            case "ArrowUp":
              newY -= step;
              break;
            case "ArrowDown":
              newY += step;
              break;
            case "ArrowLeft":
              newX -= step;
              break;
            case "ArrowRight":
              newX += step;
              break;
          }

          updateComponent(selectedComponentId, { x: newX, y: newY });
        }
        return;
      }

      // Escape 키 - 선택 해제
      if (e.key === "Escape") {
        e.preventDefault();
        useProjectStore.getState().selectComponent(null);
        return;
      }
    };

    // 키보드 이벤트 리스너 등록
    document.addEventListener("keydown", handleKeyDown);

    // 클린업
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedComponentId,
    components,
    deleteComponent,
    updateComponent,
    addComponent,
  ]);
};
