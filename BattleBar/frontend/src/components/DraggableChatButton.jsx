import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";

const STORAGE_KEY = "battlebar-chat-button-position";
const BUTTON_SIZE = 48;
const EDGE_GAP = 12;
const DRAG_THRESHOLD = 6;

const getDefaultPosition = () => ({
  x: EDGE_GAP,
  y: EDGE_GAP,
});

const clampPosition = ({ x, y }) => {
  if (typeof window === "undefined") {
    return { x, y };
  }

  const maxX = window.innerWidth - BUTTON_SIZE - EDGE_GAP;
  const maxY = window.innerHeight - BUTTON_SIZE - EDGE_GAP;

  return {
    x: Math.min(Math.max(EDGE_GAP, x), Math.max(EDGE_GAP, maxX)),
    y: Math.min(Math.max(EDGE_GAP, y), Math.max(EDGE_GAP, maxY)),
  };
};

const getInitialPosition = () => {
  if (typeof window === "undefined") {
    return getDefaultPosition();
  }

  try {
    const savedPosition = window.localStorage.getItem(STORAGE_KEY);

    if (!savedPosition) {
      return getDefaultPosition();
    }

    return clampPosition(JSON.parse(savedPosition));
  } catch {
    return getDefaultPosition();
  }
};

const DraggableChatButton = ({ onOpen = () => {} }) => {
  const [position, setPosition] = useState(getInitialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({
    isPointerDown: false,
    moved: false,
    pointerId: null,
    startPointer: { x: 0, y: 0 },
    startPosition: getDefaultPosition(),
  });

  useEffect(() => {
    const keepButtonInView = () => {
      setPosition((currentPosition) => {
        const nextPosition = clampPosition(currentPosition);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPosition));
        return nextPosition;
      });
    };

    window.addEventListener("resize", keepButtonInView);

    return () => {
      window.removeEventListener("resize", keepButtonInView);
    };
  }, []);

  const savePosition = (nextPosition) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPosition));
    } catch {
      // Keep dragging usable even if storage is unavailable.
    }
  };

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);

    dragRef.current = {
      isPointerDown: true,
      moved: false,
      pointerId: event.pointerId,
      startPointer: { x: event.clientX, y: event.clientY },
      startPosition: position,
    };
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;

    if (!drag.isPointerDown || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startPointer.x;
    const deltaY = event.clientY - drag.startPointer.y;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance > DRAG_THRESHOLD) {
      drag.moved = true;
      setIsDragging(true);
    }

    if (!drag.moved) {
      return;
    }

    setPosition(
      clampPosition({
        x: drag.startPosition.x + deltaX,
        y: drag.startPosition.y + deltaY,
      }),
    );
  };

  const finishPointerInteraction = (event) => {
    const drag = dragRef.current;

    if (!drag.isPointerDown || drag.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (drag.moved) {
      const deltaX = event.clientX - drag.startPointer.x;
      const deltaY = event.clientY - drag.startPointer.y;
      const finalPosition = clampPosition({
        x: drag.startPosition.x + deltaX,
        y: drag.startPosition.y + deltaY,
      });

      setPosition(finalPosition);
      savePosition(finalPosition);
    } else {
      onOpen(position);
    }

    dragRef.current.isPointerDown = false;
    dragRef.current.pointerId = null;
    setIsDragging(false);
  };

  const handlePointerCancel = (event) => {
    const drag = dragRef.current;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    drag.isPointerDown = false;
    drag.pointerId = null;
    setIsDragging(false);
  };

  return (
    <button
      type="button"
      className={`fixed z-50 grid h-11 w-11 touch-none select-none place-items-center rounded-2xl border border-white/20 bg-slate-950/45 text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-[background-color,box-shadow,transform] hover:bg-white/15 active:scale-95 sm:h-12 sm:w-12 ${
        isDragging ? "scale-105 cursor-grabbing shadow-[0_12px_38px_rgba(34,211,238,0.24)]" : "cursor-grab"
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      aria-label="Open chat"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointerInteraction}
      onPointerCancel={handlePointerCancel}
    >
      <MessageCircle size={21} strokeWidth={2.35} />
    </button>
  );
};

export default DraggableChatButton;
