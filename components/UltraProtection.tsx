"use client"; // Required for hooks in Next.js 13+

import { useEffect, useState } from "react";

const UltraProtection = () => {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  useEffect(() => {
    // 1. Block right-click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // 2. Block keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key === "I") || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.key === "C") || // Ctrl+Shift+C
        (e.ctrlKey && e.key === "U") ||               // Ctrl+U
        (e.ctrlKey && e.key === "S") ||               // Ctrl+S
        (e.ctrlKey && e.key === "P") ||               // Ctrl+P
        (e.ctrlKey && e.key === "A") ||               // Ctrl+A
        e.key === "F12" ||                            // F12
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // 3. Block copy/cut/select
    const handleCopyCut = (e: ClipboardEvent) => e.preventDefault();
    const handleSelect = (e: Event) => e.preventDefault();
    document.addEventListener("copy", handleCopyCut);
    document.addEventListener("cut", handleCopyCut);
    document.addEventListener("selectstart", handleSelect);

    // 4. Block drag
    const handleDrag = (e: DragEvent) => e.preventDefault();
    document.addEventListener("dragstart", handleDrag);

    // 5. Detect DevTools
    let devtools = { open: false };
    const element = new Image();
    Object.defineProperty(element, "id", {
      get: function () {
        devtools.open = true;
        setDevToolsOpen(true);
      },
    });

    const detectDevTools = () => {
      devtools.open = false;
      console.log(element); // triggers getter
      if (!devtools.open) setDevToolsOpen(false);
    };

    const interval = setInterval(detectDevTools, 1000);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopyCut);
      document.removeEventListener("cut", handleCopyCut);
      document.removeEventListener("selectstart", handleSelect);
      document.removeEventListener("dragstart", handleDrag);
      clearInterval(interval);
    };
  }, []);

  return devToolsOpen ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.95)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        fontSize: "2rem",
        textAlign: "center",
        padding: "20px",
      }}
    >
      DevTools detected! Access is restricted.
    </div>
  ) : null;
};

export default UltraProtection;
