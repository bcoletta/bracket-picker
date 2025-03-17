const args = process.argv.slice(2);
const tournament = args[0];

if (!['men', 'women'].includes(tournament)) throw new Error('Enter a valid tournament (men, women)');

import menRegions from './regions_men.json' with { type: "json" };
import womenRegions from './regions_women.json' with { type: "json" };
import { Bracket, FinalFour, Team } from './classes.js';

const regions = tournament === 'men' ? menRegions : womenRegions;

const regionBrackets = Object.keys(regions).map(key => {
  let teams = regions[key].map((name, i) => new Team(name, i + 1));
  console.log(`=============== ${key.toUpperCase()} REGION ===============`)
  return {
    name: key,
    bracket: new Bracket(4, teams),
  };
})

console.log('=============== FINAL FOUR ===============')
regionBrackets.forEach(region => {
  console.log(`${region.name.toUpperCase()}: ${region.bracket.winner}`)
})

const finalFourSeeds = { south: 1, midwest: 2, west: 3, east: 4 };
const finalFourTeams = regionBrackets.map(region => {
  return new Team(region.bracket.winner.name, region.bracket.winner.seed, region.name);
});
const finalFourBracket = new FinalFour(finalFourTeams, tournament);

console.log(`=============== ${ finalFourBracket.winner.name } is your Champion! ===============`);