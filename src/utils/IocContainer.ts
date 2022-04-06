import { container, InjectionToken } from "tsyringe";

export function getAllInstance<T>(serviceName: InjectionToken<T>): T[] {
  return container.resolveAll(serviceName);
}

export function getInstance<T>(serviceName: InjectionToken<T>): T {
  return container.resolve(serviceName);
}
