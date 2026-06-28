import { Skeleton } from "@/components/ui/skeleton";

export default function PrivateLoading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-full max-w-lg" />
      </div>
      <Skeleton className="h-36 rounded-lg" />
      <Skeleton className="h-52 rounded-lg" />
    </div>
  );
}
