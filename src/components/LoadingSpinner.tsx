export const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 flex min-h-[20vmin] min-w-[20vmin] items-center justify-center">
      <div className="border-gray h-[10vmin] w-[10vmin] animate-spin rounded-full border-8 border-black/70 border-t-transparent" />
    </div>
  );
};
