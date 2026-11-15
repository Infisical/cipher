export interface FakeDesktopScene {
  pointer?: { x: number; y: number };
  typed?: string;
  host?: string;
}

const palette = {
  wallpaperTop: "#0f2c4c",
  wallpaperBottom: "#2a6a8f",
  window: "#ffffff",
  chrome: "#f0f0f0",
  border: "#c8c8c8",
  text: "#1b1b1b",
  faint: "#8a8a8a",
  row: "#e8eef5",
  taskbar: "#1c1f24",
  taskbarText: "#f2f2f2",
  start: "#3a8ee6"
};

export function drawFakeDesktop(canvas: HTMLCanvasElement | null, scene: FakeDesktopScene = {}) {
  const context = canvas?.getContext("2d");
  if (!canvas || !context) return;
  const { width, height } = canvas;
  const unit = height / 1080;
  const font = (size: number, weight = 400) =>
    weight + " " + Math.round(size * unit) + "px system-ui, sans-serif";

  const wallpaper = context.createLinearGradient(0, 0, width, height);
  wallpaper.addColorStop(0, palette.wallpaperTop);
  wallpaper.addColorStop(1, palette.wallpaperBottom);
  context.fillStyle = wallpaper;
  context.fillRect(0, 0, width, height);

  const window = (x: number, y: number, w: number, h: number, title: string) => {
    context.fillStyle = palette.window;
    context.fillRect(x, y, w, h);
    context.strokeStyle = palette.border;
    context.lineWidth = unit;
    context.strokeRect(x, y, w, h);
    context.fillStyle = palette.chrome;
    context.fillRect(x, y, w, 40 * unit);
    context.fillStyle = palette.text;
    context.font = font(18, 600);
    context.textBaseline = "middle";
    context.fillText(title, x + 16 * unit, y + 20 * unit);
  };

  const managerX = width - 820 * unit;
  window(managerX, 90 * unit, 700 * unit, 560 * unit, "Server Manager");
  ["Roles and features", "Local server", "All servers", "File and storage", "Event log"].forEach(
    (label, index) => {
      const top = 150 * unit + index * 72 * unit;
      context.fillStyle = index === 1 ? palette.row : palette.window;
      context.fillRect(managerX + 16 * unit, top, 668 * unit, 56 * unit);
      context.fillStyle = palette.text;
      context.font = font(18);
      context.fillText(label, managerX + 32 * unit, top + 28 * unit);
      context.fillStyle = palette.faint;
      context.fillText(
        index === 4 ? "3 warnings" : "Online",
        managerX + 540 * unit,
        top + 28 * unit
      );
    }
  );

  window(120 * unit, 160 * unit, 900 * unit, 600 * unit, "Notepad");
  context.fillStyle = palette.text;
  context.font = font(20);
  context.textBaseline = "top";
  const lines = [
    "Connected to " + (scene.host ?? "the remote host"),
    "",
    ...(scene.typed ?? "").split("\n")
  ];
  lines.slice(-20).forEach((line, index) => {
    context.fillText(line, 140 * unit, 220 * unit + index * 28 * unit);
  });

  context.fillStyle = palette.taskbar;
  context.fillRect(0, height - 56 * unit, width, 56 * unit);
  context.fillStyle = palette.start;
  context.fillRect(16 * unit, height - 44 * unit, 32 * unit, 32 * unit);
  context.fillStyle = palette.taskbarText;
  context.font = font(18);
  context.textBaseline = "middle";
  context.textAlign = "right";
  context.fillText("10:42", width - 24 * unit, height - 28 * unit);
  context.textAlign = "left";

  if (scene.pointer) {
    const { x, y } = scene.pointer;
    const size = 24 * unit;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, y + size);
    context.lineTo(x + size * 0.28, y + size * 0.74);
    context.lineTo(x + size * 0.62, y + size * 0.74);
    context.closePath();
    context.fillStyle = "#ffffff";
    context.fill();
    context.strokeStyle = "#000000";
    context.lineWidth = 1.5 * unit;
    context.stroke();
  }
}
