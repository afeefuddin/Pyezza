export default function Loading() {
  return (
    <div className="p-8 lg:p-16 w-full overflow-y-auto">
      <div className="flex flex-col overflow-y-auto p-4">
        <div className="flex w-full flex-col items-stretch justify-center gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
          <div className="h-60 rounded-md bg-gray-200 animate-pulse" />
          <div className="h-60 rounded-md bg-gray-200 animate-pulse" />
          <div className="h-60 rounded-md bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
