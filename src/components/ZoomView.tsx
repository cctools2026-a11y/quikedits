import { createContext, useContext, useState, type ReactNode } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Minus, Plus, RotateCcw } from "lucide-react";

const ZoomedCtx = createContext(false);
/** True while the surrounding ZoomView is zoomed in (so inner drags can step aside for panning). */
export const useZoomed = () => useContext(ZoomedCtx);

/** Pinch / wheel / double-tap zoom and drag-to-pan for a finished image preview. */
export function ZoomView({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [zoomed, setZoomed] = useState(false);
  const btn = "flex h-9 w-9 items-center justify-center rounded-full border-2 border-foreground bg-background text-foreground shadow-sm active:scale-95";
  return (
    <ZoomedCtx.Provider value={zoomed}>
      <TransformWrapper
        minScale={1}
        maxScale={6}
        doubleClick={{ mode: zoomed ? "reset" : "zoomIn", step: 1.2 }}
        wheel={{ activationKeys: ["Control", "Meta"], step: 0.15 }}
        panning={{ disabled: !zoomed, excluded: ["no-pan"] }}
        pinch={{ step: 5 }}
        onTransform={(_, s) => setZoomed(s.scale > 1.01)}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <div className={`relative ${className}`}>
            <TransformComponent wrapperClass="!w-full overflow-hidden rounded-2xl" wrapperStyle={{ touchAction: zoomed ? "none" : "pan-y" }} contentClass="!w-full">
              {children}
            </TransformComponent>
            <div className="absolute bottom-3 right-3 z-10 flex gap-1.5">
              <button type="button" aria-label="Zoom out" className={btn} onClick={() => zoomOut()}><Minus className="h-4 w-4" /></button>
              <button type="button" aria-label="Zoom in" className={btn} onClick={() => zoomIn()}><Plus className="h-4 w-4" /></button>
              {zoomed && <button type="button" aria-label="Reset zoom" className={btn} onClick={() => resetTransform()}><RotateCcw className="h-4 w-4" /></button>}
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">Pinch or double-tap to zoom in, drag to look around.</p>
          </div>
        )}
      </TransformWrapper>
    </ZoomedCtx.Provider>
  );
}
