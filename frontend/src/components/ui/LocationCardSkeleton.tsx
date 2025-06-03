import { Card, CardContent } from "@/components/ui/card";

export function LocationCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse border rounded-lg bg-card border-border">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-lg w-12 h-12 bg-muted"></div>
          <div className="flex-grow min-w-0">
            <div className="space-y-2 mb-2">
              <div className="h-3.5 bg-muted rounded-md w-4/5"></div>
              <div className="h-2.5 bg-muted/70 rounded-md w-3/5 flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-muted mr-1"></div>
                <div className="h-2 bg-muted/70 rounded flex-grow"></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-7 bg-muted/50 rounded flex items-center justify-between px-2">
                <div className="h-2.5 bg-muted rounded w-1/2"></div>
                <div className="h-2.5 bg-muted rounded w-16"></div>
              </div>
              <div className="h-7 bg-muted/50 rounded flex items-center justify-between px-2">
                <div className="h-2.5 bg-muted rounded w-2/5"></div>
                <div className="h-2.5 bg-muted rounded w-14"></div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-14 h-10 bg-primary/20 rounded-lg flex flex-col items-center justify-center">
            <div className="w-8 h-1.5 bg-primary/40 rounded-full mb-1"></div>
            <div className="w-6 h-2 bg-primary/50 rounded-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
