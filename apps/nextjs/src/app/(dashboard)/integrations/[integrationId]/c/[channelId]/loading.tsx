export default function Loading() {
  return (
    <div className="p-8 lg:p-16 w-full overflow-y-auto">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="ml-auto h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Days of the week section */}
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="space-y-2 flex-1">
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex flex-wrap gap-2 mt-4">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-20 bg-gray-200 animate-pulse rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Time of the day section */}
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="space-y-2 flex-1">
            <div className="h-6 w-36 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex gap-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-16 bg-gray-200 animate-pulse rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Timezone section */}
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="space-y-2 flex-1">
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-12 w-96 mt-4 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
}
