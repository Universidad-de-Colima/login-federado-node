import { PartialType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto.js';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
