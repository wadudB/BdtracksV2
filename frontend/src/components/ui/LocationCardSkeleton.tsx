import { Card, CardContent } from "@/components/ui/card";

export function LocationCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse border rounded-lg">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-lg w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300"></div>
          <div className="flex-grow min-w-0">
            <div className="space-y-2 mb-2">
              <div className="h-3.5 bg-gradient-to-r from-gray-300 to-gray-200 rounded-md w-4/5"></div>
              <div className="h-2.5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-md w-3/5 flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 mr-1"></div>
                <div className="h-2 bg-gray-200 rounded flex-grow"></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-7 bg-gray-100 rounded flex items-center justify-between px-2">
                <div className="h-2.5 bg-gray-200 rounded w-1/2"></div>
                <div className="h-2.5 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="h-7 bg-gray-100 rounded flex items-center justify-between px-2">
                <div className="h-2.5 bg-gray-200 rounded w-2/5"></div>
                <div className="h-2.5 bg-gray-300 rounded w-14"></div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-14 h-10 bg-gradient-to-br from-blue-200 to-blue-100 rounded-lg flex flex-col items-center justify-center">
            <div className="w-8 h-1.5 bg-white/60 rounded-full mb-1"></div>
            <div className="w-6 h-2 bg-white/80 rounded-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 