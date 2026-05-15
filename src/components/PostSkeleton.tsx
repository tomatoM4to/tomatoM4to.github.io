import { Skeleton } from "@src/ui/skeleton";
import { Calendar } from "lucide-react";

export default function PostSkeleton() {
  return (
    <div className="w-full max-w-[820px] mx-auto">
      <header className="mb-8 pb-6 border-b">
        {/* Title Skeleton */}
        <Skeleton className="h-8 md:h-10 w-2/3 mb-3" />
        
        {/* Description Skeleton */}
        <Skeleton className="h-5 md:h-6 w-1/2 mb-4" />
        
        {/* Metadata Skeleton */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground/50" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        </div>
      </header>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[85%]" />
        </div>
        
        <div className="pt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[98%]" />
          <Skeleton className="h-4 w-[88%]" />
        </div>

        <div className="pt-4 space-y-2">
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[93%]" />
        </div>
      </div>
    </div>
  );
}
