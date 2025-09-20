"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  showText?: boolean;
}

export const Logo = ({ 
  size = "md", 
  variant = "dark", 
  showText = true 
}: LogoProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl"
  };

  const iconColor = variant === "dark" ? "#202124" : "#ffffff";
  const textColor = variant === "dark" 
    ? "text-primary-900" 
    : "text-neutral-0";

  return (
    <div className="flex items-center gap-2">
      {/* 로고 아이콘 */}
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Y 모양의 기하학적 패턴 */}
          <g>
            {/* 중앙 코어 */}
            <circle 
              cx="16" 
              cy="16" 
              r="2" 
              fill={iconColor}
            />
            
            {/* 8개의 방사형 라인 (별 모양) */}
            <g stroke={iconColor} strokeWidth="2.5" strokeLinecap="round">
              {/* 상단 */}
              <line x1="16" y1="4" x2="16" y2="11" />
              {/* 우상단 */}
              <line x1="24.5" y1="7.5" x2="19.5" y2="12.5" />
              {/* 우측 */}
              <line x1="28" y1="16" x2="21" y2="16" />
              {/* 우하단 */}
              <line x1="24.5" y1="24.5" x2="19.5" y2="19.5" />
              {/* 하단 */}
              <line x1="16" y1="28" x2="16" y2="21" />
              {/* 좌하단 */}
              <line x1="7.5" y1="24.5" x2="12.5" y2="19.5" />
              {/* 좌측 */}
              <line x1="4" y1="16" x2="11" y2="16" />
              {/* 좌상단 */}
              <line x1="7.5" y1="7.5" x2="12.5" y2="12.5" />
            </g>
          </g>
        </svg>
      </div>

      {/* 로고 텍스트 */}
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]} ${textColor} tracking-tight`}>
          Yogma
        </span>
      )}
    </div>
  );
};
