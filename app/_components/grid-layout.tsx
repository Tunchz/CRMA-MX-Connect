import { cn } from "@/lib/utils";

export default async function GridLayout({
  children,
  columnLayout = "medium",
}: {
  children: React.ReactNode;
  columnLayout?: "xs" | "small" | "medium" | "large" | "xlarge";
}) {
  return (
    <div
      className={cn("grid gap-4", {
        "grid-cols-1": columnLayout === "xs",
        "sm:grid-cols-2 grid-cols-1": columnLayout === "small",
        "md:grid-cols-3 sm:grid-cols-2 grid-cols-1": columnLayout === "medium",
        "lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1": columnLayout === "large",
        "xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1": columnLayout === "xlarge",
      })}
    >
      {children}
    </div>
  );
}
