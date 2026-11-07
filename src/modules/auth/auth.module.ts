import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { RolUsuario } from './entities/rol-usuario.entity';
import { Usuario } from './entities/usuario.entity';
import { AuthRepository } from './auth.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports:[
    ConfigModule,
    TypeOrmModule.forFeature([Rol, RolUsuario, Usuario,]),

    PassportModule.register({
      defaultStrategy: 'jwt'
    }),

    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (config: ConfigService)=>({
        secret: config.get('JWT_SECRET', 'miClaveDelJWT'),
        signOptions:{
          expiresIn: '2h',
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy
  ],
  exports:[JwtModule, AuthService]
})
export class AuthModule {}
