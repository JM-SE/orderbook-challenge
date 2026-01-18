export function createConnectionGuard() {
  let connectionId = 0;

  const next = () => {
    connectionId += 1;
    return connectionId;
  };

  const isActive = (id: number) => id === connectionId;

  return { next, isActive };
}
