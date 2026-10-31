import { type Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api-response.dto.js';

/** Documenta en Swagger la respuesta { error, message, data } (200) y el 500. */
export const ApiEnvelope = (model?: Type, isArray = false) => {
  const data = !model
    ? { type: 'array', example: [] }
    : isArray
      ? { type: 'array', items: { $ref: getSchemaPath(model) } }
      : { $ref: getSchemaPath(model) };
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, ...(model ? [model] : [])),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          { properties: { error: { example: false }, data } },
        ],
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Falla: { error: true, message, data: [] }',
      type: ApiResponseDto,
    }),
  );
};
