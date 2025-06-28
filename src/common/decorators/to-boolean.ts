import { Transform, TransformFnParams } from 'class-transformer';

export function ToBoolean() {
  return Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'string') {
      if (value === 'true') return true;
      if (value === 'false') return false;
    }
    return value;
  });
}
