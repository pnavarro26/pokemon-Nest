import { Injectable } from '@nestjs/common';

import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {  

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ){}

  async executeSeed() {
    
    await this.pokemonModel.deleteMany({}); // delete * from pokemon

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    // Opcion 1. Inserción registros con promesas, crea los 650 insert
    // const insertpromisesArray = [];

    // data.results.forEach(/*async*/({ name, url }) => {
    //   const segments = url.split('/');
    //   const no:number= +segments[ segments.length -2 ];

    //   // inserta registro a registro, es lento
    //   //const pokemon = await this.pokemonModel.create( {name,no} );

    //   insertpromisesArray.push(
    //     this.pokemonModel.create( {name,no} )
    //   );

    //   //console.log({name,no});
    // });

    // // resuelte todas las promesas del arreglo : hacer los insert de manera simultanea
    // await Promise.all( insertpromisesArray );

    // Opcion 2. Inserción multiple registros 
    const pokmonToInsert: { name: string, no: number}[] = [];

    data.results.forEach(/*async*/({ name, url }) => {
      const segments = url.split('/');
      const no:number= +segments[ segments.length -2 ];

       pokmonToInsert.push( {name,no} ); // [ { name: bulbasur,no:1}, {}]

    });

    await this.pokemonModel.insertMany( pokmonToInsert );
    return 'Seed Executed';
  }

}
