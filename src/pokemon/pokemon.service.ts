import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { PaginationDto } from '../common/dto/paginatios.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {

  private default_limit: number;

  constructor( 
    @InjectModel( Pokemon.name ) // decorador para inyectar modelos
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ){
 
    this.default_limit = this.configService.get<number>('default_limit');
    
  }

  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try{
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;

    }catch(error){
      this.handleExceptions( error );
    }
  }


  findAll( paginationDto: PaginationDto) {
    
    const { limit= this.default_limit, offset= 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit( limit )
      .skip( offset )
      .sort({
        no:1
      });
  }

  async findOne(term: string) {
    
    let pokemon: Pokemon;

    if( !isNaN(+term) ){
      pokemon = await this.pokemonModel.findOne( { no: term } )
    }

    if( !pokemon && isValidObjectId( term ) ){
      pokemon = await this.pokemonModel.findById( term );
    }

    if( !pokemon ){
      pokemon = await this.pokemonModel.findOne( { name: term.toLocaleLowerCase().trim() } )
    }

    if( !pokemon ){
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);
    }

    return pokemon;
  }

  async update( term: string, updatePokemonDto: UpdatePokemonDto ) {
    
    const pokemon = await this.findOne( term );

    if( updatePokemonDto.name ){
      
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }    

    try{
      // guarda en BD
      await pokemon.updateOne( updatePokemonDto );

      // esparce las propiedades de pokemon y copia el objeto actualizado(updatePokemonDto) sobre pokemon
      // de esta manera, el metodo devuelve el nuevo objeto actualizado
      return { ...pokemon.toJSON(), ...updatePokemonDto };
      
    }catch(error){
      this.handleExceptions( error );
    }
  }

  async remove(id: string) {

    const { deletedCount } = await this.pokemonModel.deleteOne( {'_id': id } );

    if( deletedCount === 0){
      throw new BadRequestException(`Pokemon with id ${ id } not found`);
    }

    return;
  }

  private handleExceptions( error: any ){

    if( error.code === 11000 ){
      throw new BadRequestException(`Pokemon exist in DB ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Cant update Pokemon -  check server logs`);

  }
}
