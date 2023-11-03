export const LoadingSpinner = () => {
  return (
    <div className="flex h-full flex-1 items-center justify-center p-4">
      <div className="border-gray h-[10vmin] w-[10vmin] animate-spin rounded-full border-8 border-gray-500 border-t-transparent" />
    </div>
  );
};
