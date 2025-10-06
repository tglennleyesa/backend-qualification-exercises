export class ExecutionCache<TInputs extends Array<unknown>, TOutput> {
  private cache: Map<string, Promise<TOutput>> = new Map();

  constructor(private readonly handler: (...args: TInputs) => Promise<TOutput>) { }

  async fire(key: string, ...args: TInputs): Promise<TOutput> {
    /**
     * insert your code here
     */

    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }

    const promise = this.handler(...args);

    // concurrent calls with same key will get the same promise
    this.cache.set(key, promise);

    return promise;
  }
}
