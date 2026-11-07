import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { FilesService } from './files.service';
import { seconds, Throttle } from '@nestjs/throttler';

@ApiTags('Archivos')
@ApiTooManyRequestsResponse({ description: 'Límite de solicitudes excedido.' })
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({
    summary: 'Obtener imagen de película',
    description: 'Devuelve el archivo de imagen solicitado.',
  })
  @ApiParam({
    name: 'nombreArchivo',
    type: String,
    example: 'pelicula-550e8400-e29b-41d4-a716-446655440000.jpg',
  })
  @ApiOkResponse({
    description: 'Imagen encontrada.',
    content: {
      'image/jpeg': { schema: { type: 'string', format: 'binary' } },
      'image/png': { schema: { type: 'string', format: 'binary' } },
      'image/webp': { schema: { type: 'string', format: 'binary' } },
    },
  })
  @ApiNotFoundResponse({ description: 'No se encontró la imagen solicitada.' })
  @Throttle({ default: { limit: 30, ttl: seconds(10) } })
  @Get('pelicula/:nombreArchivo')
  mostrarImagenPelicula(
    @Param('nombreArchivo') nombreArchivo: string,
    @Res() response: Response,
  ): void {
    const ruta = this.filesService.obtenerImagenPelicula(nombreArchivo);

    response.sendFile(ruta);
  }
}
