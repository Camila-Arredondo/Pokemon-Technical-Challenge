import { Component, OnInit } from '@angular/core';
import { APIService } from '../service/api.service';
import { Pokemon } from '../entity/pokemon';
import { ResultPokemon } from '../entity/resultpokemon';
import { FormControl } from '@angular/forms';
import { PokemonInfo } from '../entity/pokemoninfo';
import { pokemonSelect } from '../entity/pokemonselect';
import { faCoffee, faEye, faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  faEye = faEye;
  faStar = faStar;



  resultPokemonAll: ResultPokemon = {
    count: 0,
    results: []
  }
  resultPokemon: ResultPokemon = {
    count: 0,
    results: []
  }

  pageSize = 10;
  datosTabla: Pokemon[] = [];
  paginaActual = 1;
  filter = new FormControl();
  sortOrderAscending = true;
  pokemonSeleccionado: pokemonSelect = {
    foto: "assets/poke-shadow.png",
    nombre: ".............",
    id: 0,
    weight: 0,
    height: 0,
    base_experience: 0,
  };
  pokemonFavorite: pokemonSelect = {
    foto: "assets/poke-shadow.png",
    nombre: "????????????",
    id: 0,
    weight: 0,
    height: 0,
    base_experience: 0,
  };
  alphabetStats: { [letter: string]: number } = {};
  alphabetLetters: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(private apiService: APIService) {
    
  }

  ngOnInit(): void {
    this.apiService.getPokemons().subscribe((res: ResultPokemon) => {

      this.resultPokemon = {...res};
      this.resultPokemonAll = {...res};
      this.refreshPokemons();
    });
    this.filter.valueChanges.subscribe(() => this.refreshPokemons());

  }


  filterByLetter(letter: string) {
    let filteredPokemons: Pokemon[] = [];
    if (letter === "ALL") {
      filteredPokemons = this.resultPokemonAll.results;
    } else {
      filteredPokemons = this.resultPokemonAll.results.filter((pokemon) => {
        const firstLetter = pokemon.name.charAt(0).toUpperCase();
        return firstLetter === letter;
      });
    }
    this.resultPokemon = {

      results: filteredPokemons,
      count: filteredPokemons.length,
    }
    this.datosTabla = filteredPokemons;
    this.refreshPokemons();

  }

  completeData() {
  }

  sortPokemonByName() {
    this.resultPokemon.results.sort((a, b) => {
      if (this.sortOrderAscending) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    this.sortOrderAscending = !this.sortOrderAscending;
    this.refreshPokemons();
  }

  refreshPokemons() {
    const startIndex = (this.paginaActual - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const filteredPokemons = this.resultPokemonAll.results.filter((pokemon) => {
      const searchTerm = this.filter.value ? this.filter.value.toLowerCase() : '';
      return pokemon.name.toLowerCase().includes(searchTerm);
    });

    this.datosTabla = filteredPokemons.slice(startIndex, endIndex);
    this.alphabetStats = {};
    for (const pokemon of this.resultPokemonAll.results) {
      const firstLetter = pokemon.name.charAt(0).toUpperCase();
      this.alphabetStats[firstLetter] = (this.alphabetStats[firstLetter] || 0) + 1;
    }
    this.resultPokemon.count = filteredPokemons.length;
    this.resultPokemon.results = filteredPokemons;
  }

  VerPokemon(url: string) {
    this.apiService.getPokemonInfo(url).subscribe(pokemon => {
      
      this.pokemonSeleccionado = {
        foto : pokemon.sprites.other['official-artwork'].front_default ?? "assets/poke-shadow.png",
        nombre: pokemon.name,
        id : pokemon.id,
        weight: pokemon.weight,
        height: pokemon.height,
        base_experience: pokemon.base_experience,
      };
    })
  }

  FavoritePokemon(url: string) {
    this.apiService.getPokemonInfo(url).subscribe(pokemon => {      
      this.pokemonFavorite = {
        foto : pokemon.sprites.other['official-artwork'].front_default ?? "assets/poke-shadow.png",
        nombre: pokemon.name,
        id : pokemon.id,
        weight: pokemon.weight,
        height: pokemon.height,
        base_experience: pokemon.base_experience,
      };
    })
  }


  CheckFavorito(select: pokemonSelect, vuelta: Pokemon){
    var idActual =  vuelta.url.replace("pokeapi.co/api/v2/pokemon/", "").replaceAll("/","").replace("https:","")

    return select.id.toString() == idActual;
  }

  UrlFotoPokemon(vuelta: Pokemon){

    var idActual =  vuelta.url.replace("pokeapi.co/api/v2/pokemon/", "").replaceAll("/","").replace("https:","")

    return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/"+idActual+".png";
  }
}
