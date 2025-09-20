"use client";

import { Plus, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface Page {
  id: string;
  name: string;
  isActive: boolean;
}

export const PagesPanel = () => {
  const [pages, setPages] = useState<Page[]>([
    { id: "page-1", name: "Page", isActive: false },
    { id: "page-2", name: "Page 2", isActive: true },
  ]);

  const addPage = () => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      name: `Page ${pages.length + 1}`,
      isActive: false,
    };
    setPages([...pages, newPage]);
  };

  const selectPage = (pageId: string) => {
    setPages(
      pages.map((page) => ({
        ...page,
        isActive: page.id === pageId,
      }))
    );
  };

  return (
    <div className="w-full bg-white">
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Pages</h3>
        <button
          onClick={addPage}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="새 페이지 추가"
        >
          <Plus size={14} className="text-gray-600" />
        </button>
      </div>

      <div className="p-2 space-y-1">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors group ${
              page.isActive
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-50 text-gray-700"
            }`}
            onClick={() => selectPage(page.id)}
          >
            {/* 페이지 썸네일 */}
            <div
              className={`w-4 h-4 rounded-sm border-2 ${
                page.isActive
                  ? "border-white bg-white/20"
                  : "border-gray-300 bg-gray-100"
              }`}
            ></div>

            {/* 페이지 이름 */}
            <span className="flex-1 text-sm truncate">{page.name}</span>

            {/* 더보기 버튼 */}
            <button
              className={`p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                page.isActive ? "hover:bg-white/20" : ""
              }`}
            >
              <MoreHorizontal size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
