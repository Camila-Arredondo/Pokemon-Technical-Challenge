import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResultPokemon } from '../entity/resultpokemon';
import { PokemonInfo } from '../entity/pokemoninfo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  paginaActual: number = 0;
  allData: any[] = [
    {
    "name": "arbok",
    "url": "https://pokeapi.co/api/v2/pokemon/24/"
  },
  {
    "name": "pikachu",
    "url": "https://pokeapi.co/api/v2/pokemon/25/"
  },
  {
    "name": "raichu",
    "url": "https://pokeapi.co/api/v2/pokemon/26/"
  },
];
  url: string = "";
  
  
  
  constructor(private http: HttpClient) { 
    //this.url = this.urlApi(this.paginaActual);
  }

  // getPokemon(pagina: number): Observable<ResultPokemon>{
  //   let limite = 15;
  //   let siguiente =  (pagina - 1) * limite;
  //   let url = `https://pokeapi.co/api/v2/pokemon/?offset=${siguiente}&limit=${limite}`;
  //   return this.http.get<ResultPokemon>(url);
  // }

  getPokemons(): Observable<ResultPokemon>{
    let limite = 1000000;
    let siguiente =  0;
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${siguiente}&limit=${limite}`;
    return this.http.get<ResultPokemon>(url);
  }

  getPokemonInfo(url: string){
    return this.http.get<PokemonInfo>(url);
  }
}
export { ResultPokemon };

