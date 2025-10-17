import React from 'react';

interface LogoProps {
  className?: string;
  textColor?: string;
  iconColor?: string;
  showTagline?: boolean;
  variant?: 'full' | 'icon' | 'text';
}

const Logo: React.FC<LogoProps> = ({
  className = '',
  textColor = 'currentColor',
  iconColor = 'currentColor',
  showTagline = true,
  variant = 'full'
}) => {
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 100 120"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill={iconColor}>
          <rect x="10" y="10" width="12" height="100" />
          <rect x="10" y="98" width="50" height="12" />
          <rect x="48" y="58" width="12" height="52" />
          <rect x="10" y="10" width="50" height="12" />
        </g>
      </svg>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`flex flex-col ${className}`}>
        <div className="font-bold text-3xl tracking-wider" style={{ color: textColor }}>
          LINE
        </div>
        {showTagline && (
          <div className="text-xs mt-1" style={{ color: textColor, opacity: 0.8 }}>
            CONSULTING ENGINEERS Co.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <svg
        viewBox="0 0 100 120"
        className="h-12 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill={iconColor}>
          <rect x="10" y="10" width="12" height="100" />
          <rect x="10" y="98" width="50" height="12" />
          <rect x="48" y="58" width="12" height="52" />
          <rect x="10" y="10" width="50" height="12" />
        </g>
      </svg>

      <div className="border-r-2 h-12 mx-2" style={{ borderColor: iconColor, opacity: 0.3 }} />

      <div className="flex flex-col">
        <div className="font-bold text-2xl md:text-3xl tracking-wider leading-none" style={{ color: textColor }}>
          LINE
        </div>
        {showTagline && (
          <>
            <div className="text-[10px] md:text-xs mt-1 leading-tight" style={{ color: textColor, opacity: 0.8 }}>
              CONSULTING ENGINEERS Co.
            </div>
            <div className="text-[9px] md:text-xs leading-tight" style={{ color: textColor, opacity: 0.7, direction: 'rtl' }}>
              شركة الخط الهندسي للإستشارات الهندسية
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Logo;
