import { useEffect, useRef, useState } from "react";
import { Camera, SwitchCamera } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/** Webcam / phone camera capture in a dialog. Frames never leave the device. */
export function CameraCapture({ open, onOpenChange, onCapture }: {
  open: boolean; onOpenChange: (o: boolean) => void; onCapture: (file: File) => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [facing, setFacing] = useState<"user" | "environment">("user");

  useEffect(() => {
    if (!open) return;
    let stream: MediaStream | null = null;
    let cancelled = false;
    setError(null);
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1440 } }, audio: false })
      .then((s) => {
        if (cancelled) { s.getTracks().forEach((t) => t.stop()); return; }
        stream = s;
        if (video.current) { video.current.srcObject = s; void video.current.play(); }
      })
      .catch(() => setError("We couldn't open your camera. Check that you've allowed camera access, or upload a photo instead."));
    if (!navigator.mediaDevices) setError("Your browser doesn't support taking photos here. Please upload a photo instead.");
    return () => { cancelled = true; stream?.getTracks().forEach((t) => t.stop()); };
  }, [open, facing]);

  const snap = () => {
    const v = video.current;
    if (!v || !v.videoWidth) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    if (facing === "user") { ctx.translate(c.width, 0); ctx.scale(-1, 1); }
    ctx.drawImage(v, 0, 0);
    c.toBlob((b) => {
      if (!b) return;
      onCapture(new File([b], `camera-${Date.now()}.jpg`, { type: "image/jpeg" }));
      onOpenChange(false);
    }, "image/jpeg", 0.92);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-4 border-foreground">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">{t("Take a photo")}</DialogTitle>
          <DialogDescription>{t("Your photo stays on this device.")}</DialogDescription>
        </DialogHeader>
        {error ? (
          <p role="alert" className="rounded-xl border-2 border-foreground bg-muted p-4 text-sm">{error}</p>
        ) : (
          <video ref={video} playsInline muted className={`aspect-[4/3] w-full rounded-xl border-4 border-foreground bg-muted object-cover ${facing === "user" ? "-scale-x-100" : ""}`} />
        )}
        <div className="flex justify-between gap-3">
          <Button type="button" variant="outline" onClick={() => setFacing((f) => (f === "user" ? "environment" : "user"))}>
            <SwitchCamera /> Switch camera
          </Button>
          <Button type="button" onClick={snap} disabled={!!error}><Camera /> {t("Take photo")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
