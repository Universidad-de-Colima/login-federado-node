import { ApiResponseDto } from '../dto/api-response.dto.js';

/** Regla de negocio: éxito -> HTTP 200, cualquier falla -> HTTP 500. */
export const HTTP_OK = 200;
export const HTTP_FAIL = 500;

export class ResponseAdapter {
  static ok<T>(data: T, message = 'OK'): ApiResponseDto<T | never[]> {
    return { error: false, message, data: data ?? [] };
  }

  static fail(message: string): ApiResponseDto<never[]> {
    return { error: true, message, data: [] };
  }

  static isEnvelope(value: unknown): value is ApiResponseDto {
    return (
      typeof value === 'object' &&
      value !== null &&
      'error' in value &&
      'message' in value &&
      'data' in value
    );
  }
}
