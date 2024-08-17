import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';


@Module({
  imports: [

    // configuración de variables de entorno
    // le indica a Nest que tome las variable del archivo .env
    ConfigModule.forRoot({
      load: [ EnvConfiguration ],
      validationSchema: JoiValidationSchema
    }),
    
    ServeStaticModule.forRoot({ 
      rootPath: join(__dirname,'..','public'), 
      }),
    
    // referencia a la BD
    MongooseModule.forRoot( process.env.MONGODB ),  

    PokemonModule, 
    CommonModule, 
    SeedModule 
  ],

})
export class AppModule {


  // constructor(){
  //   console.log(process.env);
  // }
}
