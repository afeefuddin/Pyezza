export default function Loading() {
  return (
    <div className="p-8 lg:p-16 w-full">
      <div className="space-y-2 mb-8">
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-6 w-96 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="space-y-2 mb-8">
        <div className="h-5 w-full max-w-2xl bg-gray-200 animate-pulse rounded"></div>
        <div className="h-5 w-full max-w-xl bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="h-6 w-72 bg-gray-200 animate-pulse rounded mb-4"></div>
      
      <div className="space-y-2 mb-8">
        <div className="h-5 w-full max-w-lg bg-gray-200 animate-pulse rounded"></div>
        <div className="h-5 w-full max-w-xl bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="border rounded-lg p-6 h-56 bg-gray-50">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
            <div className="h-5 w-full bg-gray-200 animate-pulse rounded mb-6"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-11/12 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-10/12 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <div className="h-12 w-32 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  );
}