export type Subscriber = () => void;

export function createEmitter() {
  const subscribers = new Set<Subscriber>();

  const emit = () => {
    subscribers.forEach((listener) => listener());
  };

  const subscribe = (listener: Subscriber) => {
    subscribers.add(listener);
    return () => {
      subscribers.delete(listener);
    };
  };

  return { emit, subscribe };
}
