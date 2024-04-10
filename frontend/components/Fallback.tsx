type Props<T> = {
  data: T;
  error: unknown;
  children(data: NonNullable<T>): React.ReactNode;
  pending: React.ReactNode;
  fallback?: React.ReactNode;
};

function Fallback<T>({ data, error, children, pending, fallback }: Props<T>) {
  if (error && fallback) return <>{fallback}</>;
  if (!data) return <>{pending}</>;
  return <>{children(data)}</>;
}

export default Fallback;
