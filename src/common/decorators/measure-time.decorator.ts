import { Logger } from '@nestjs/common';

/**
 * Decorator that measures the execution time of a method and logs it
 */
export function MeasureTime() {
  const logger = new Logger('MeasureTime');

  return function <T extends (...args: any[]) => Promise<unknown>>(
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value;
    if (!originalMethod) {
      return descriptor;
    }

    // Type assertion for the new value
    descriptor.value = async function (
      ...args: Parameters<T>
    ): Promise<ReturnType<T>> {
      const start = performance.now();
      const methodName = propertyKey;

      try {
        // TypeScript knows that originalMethod is of type T
        const result = (await originalMethod.apply(
          this,
          args,
        )) as ReturnType<T>;
        const end = performance.now();
        const executionTime = end - start;

        logger.log(
          `Method ${methodName} executed in ${executionTime.toFixed(2)} ms`,
        );

        return result;
      } catch (error: unknown) {
        const end = performance.now();
        const executionTime = end - start;

        const err = error as Error;
        logger.error(
          `Method ${methodName} failed after ${executionTime.toFixed(2)} ms: ${err.message}`,
        );

        throw error;
      }
    } as T;

    return descriptor;
  };
}
