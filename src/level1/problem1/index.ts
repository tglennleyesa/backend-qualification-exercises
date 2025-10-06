export type Value = string | number | boolean | null | undefined |
  Date | Buffer | Map<unknown, unknown> | Set<unknown> |
  Array<Value> | { [key: string]: Value };

/**
 * Transforms JavaScript scalars and objects into JSON
 * compatible objects.
 */
export function serialize(value: Value): unknown {
  /**
   * insert your code here
   */
  if (!value) {
    return value;
  }

  if (typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return { __t: 'Date', __v: value.getTime() };
  }

  if (typeof Buffer !== 'undefined' && value instanceof Buffer) {
    return { __t: 'Buffer', __v: Array.from(value) };
  }

  if (value instanceof Map) {
    return { __t: 'Map', __v: Array.from(value.entries()).map(([k, v]) => [serialize(k as any), serialize(v as any)]) };
  }

  if (value instanceof Set) {
    return { __t: 'Set', __v: Array.from(value).map(v => serialize(v as any)) };
  }

  if (Array.isArray(value)) {
    return value.map(v => serialize(v));
  }

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value)) {
    result[key] = serialize(val);
  }
  return result;

}

/**
 * Transforms JSON compatible scalars and objects into JavaScript
 * scalar and objects.
 */
export function deserialize<T = unknown>(value: unknown): T {
  /**
   * insert your code here
   */

  if (
    value !== null &&
    typeof value === 'object' &&
    '__t' in value &&
    '__v' in value
  ) {
    const special = value as any;

    switch (special.__t) {
      case 'Date':
        return new Date(special.__v) as T;
      case 'Buffer':
        if (typeof Buffer !== 'undefined') {
          return Buffer.from(special.__v) as T;
        }
        return special as T;
      case 'Map': {
        const entries = special.__v as Array<[unknown, unknown]>;
        return new Map(entries.map(([k, v]) => [deserialize(k), deserialize(v)])) as T;
      }
      case 'Set': {
        const values = special.__v as unknown[];
        return new Set(values.map(v => deserialize(v))) as T;
      }
    }
  }

  if (Array.isArray(value)) {
    return value.map(v => deserialize(v)) as T;
  }

  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = deserialize(val);
    }
    return result as T;
  }

  return value as T;
}
