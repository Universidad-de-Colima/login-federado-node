import { ApiProperty } from '@nestjs/swagger';

/** Envoltorio normalizado de todas las respuestas de la API. */
export class ApiResponseDto<T = unknown> {
  @ApiProperty({ description: 'true si la operación falló' })
  error: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ description: 'Resultado; [] si no hay datos o hubo error' })
  data: T | never[];
}
