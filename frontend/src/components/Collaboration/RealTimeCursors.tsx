import React from 'react';

interface Cursor {
  userId: string;
  userName: string;
  x: number;
  y: number;
  color: string;
}

interface RealTimeCursorsProps {
  cursors: Cursor[];
}

export const RealTimeCursors: React.FC<RealTimeCursorsProps> = ({ cursors }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden">
      {cursors.map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute transition-all duration-100 ease-linear"
          style={{
            left: cursor.x,
            top: cursor.y,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: cursor.color }}
          >
            <path
              d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
              fill="currentColor"
              stroke="white"
            />
          </svg>
          <div
            className="ml-4 px-2 py-1 rounded-md text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.userName}
          </div>
        </div>
      ))}
    </div>
  );
};
