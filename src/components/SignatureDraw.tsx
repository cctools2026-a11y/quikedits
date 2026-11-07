import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { Check, PenLine, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function SignatureDraw({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="start-option" onClick={() => setOpen(true)}>
        <PenLine /> Draw signature
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto border-4 border-foreground p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl tracking-normal">Draw your signature</DialogTitle>
            <DialogDescription>Your signature stays on your device.</DialogDescription>
          </DialogHeader>
          {open && <SignatureEditor onDone={(file) => { setOpen(false); onFiles([file]); }} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function SignatureEditor({ onDone }: { onDone: (file: File) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [empty, setEmpty] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Black ink on white paper is source-image data, not a theme colour.
    const pad = new SignaturePad(canvas, { backgroundColor: "white", penColor: "black", minWidth: 1.2, maxWidth: 3 });
    padRef.current = pad;
    let previousWidth = 0;
    let previousHeight = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height || (rect.width === previousWidth && rect.height === previousHeight)) return;
      const data = pad.toData();
      if (previousWidth && previousHeight) {
        for (const stroke of data) for (const point of stroke.points) {
          point.x *= rect.width / previousWidth;
          point.y *= rect.height / previousHeight;
        }
      }
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      canvas.getContext("2d")?.scale(ratio, ratio);
      pad.clear();
      pad.fromData(data);
      previousWidth = rect.width;
      previousHeight = rect.height;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const update = () => setEmpty(pad.isEmpty());
    pad.addEventListener("endStroke", update);
    return () => { observer.disconnect(); pad.removeEventListener("endStroke", update); pad.off(); padRef.current = null; };
  }, []);

  function undo() {
    const pad = padRef.current;
    if (!pad) return;
    const data = pad.toData();
    data.pop();
    pad.fromData(data);
    setEmpty(pad.isEmpty());
  }

  function save() {
    const canvas = canvasRef.current;
    if (!canvas || !padRef.current || padRef.current.isEmpty()) return;
    setSaving(true);
    setError(null);
    canvas.toBlob((blob) => {
      if (!blob) { setError("Couldn't save your signature. Please try again."); setSaving(false); return; }
      onDone(new File([blob], "signature.png", { type: "image/png" }));
    }, "image/png");
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border-2 border-foreground">
        <canvas ref={canvasRef} aria-label="Signature drawing area" className="block aspect-[5/2] w-full touch-none bg-card" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon" aria-label="Undo last stroke" title="Undo last stroke" disabled={empty || saving} onClick={undo}><Undo2 /></Button>
        <Button variant="outline" size="icon" aria-label="Clear signature" title="Clear signature" disabled={empty || saving} onClick={() => { padRef.current?.clear(); setEmpty(true); }}><Trash2 /></Button>
        <Button disabled={empty || saving} onClick={save} className="ml-auto h-11"><Check />{saving ? "Preparing…" : "Use signature"}</Button>
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </>
  );
}