/* ------------------------------------------------------------------
   Модалка: QR-код реквизита (только QR, без поля ввода)
------------------------------------------------------------------ */
"use client";

import React from "react";
import { QRCode } from "react-qrcode-logo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  requisiteId: string | null;
}

export default function RequisiteQRModal({
  open,
  onOpenChange,
  requisiteId,
}: Props) {
  const { theme } = useTheme();
  const qrColor = theme === "dark" ? "#FFFFFF" : "currentColor";

  if (!requisiteId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            QR-код реквизита
          </DialogTitle>
        </DialogHeader>

        {/* сам QR */}
        <div className="flex justify-center my-6">
          <QRCode
            value={requisiteId}
            size={200}
            qrStyle="dots"
            eyeRadius={8}
            bgColor="transparent"
            fgColor={qrColor}
            className="rounded-xl"
          />
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
