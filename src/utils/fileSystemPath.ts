/** Electron adds a filesystem `path` on File objects from native pickers. */
export function fileSystemPath(file: File): string | null {
  const path = (file as File & { path?: string }).path;
  if (typeof path !== "string" || path.length === 0) return null;
  return path;
}

/** True when `absolutePath` is inside the desktop export folder. */
export function isOutputFolderPath(absolutePath: string): boolean {
  const normalized = absolutePath.replace(/\\/g, "/").toLowerCase();
  return (
    normalized.includes("smash drums editor/output") ||
    normalized.includes("smashdrumseditor/output")
  );
}

export function joinOutputPath(outputDir: string, filename: string): string {
  const sep = outputDir.includes("\\") ? "\\" : "/";
  return `${outputDir.replace(/[/\\]+$/, "")}${sep}${filename}`;
}