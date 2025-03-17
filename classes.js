import bracket from './bracket.json' with { type: "json" }

export class Bracket {
  constructor(numOfRounds, teams) {
    this.remainingSeeds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
    this.teams = teams;
    this.numOfRounds = numOfRounds;
    this.winner = null;
    this.rounds = [];

    this.simulate();
  }

  simulate() {
    // console.log('Bracket:simulate::15',{ ...this })
    this.rounds = [];
    let remainingTeams = [ ...this.teams ];

    for (let i = this.numOfRounds - 1; i >= 0 ; i--) {
      // console.log('Bracket:simulate::20',{ i, length: remainingTeams.length })
      console.log(`=============== ROUND ${this.numOfRounds - i} ===============`)
      let round = new Round(i, remainingTeams);
      this.rounds.push(round);
      remainingTeams = round.winners;
    }

    if (remainingTeams.length !== 1) {
      throw new Error(`Ended with ${remainingTeams.length} winners`);
    }
    this.winner = remainingTeams[0]
  }
}

export class Round {
  constructor(roundIndex, teams) {
    this.roundIndex = roundIndex;
    this.teams = teams;
    this.games = bracket[`round${this.roundIndex}`];
    this.winners = [];

    this.setupGames();
    this.setupWinners();
  }

  setupGames() {
    // console.log('Round:setupGames::45',{ ...this })
    this.games = this.games.map(possibleSeeds => {
      let gameSeeds = [];
      this.teams.forEach(team => {
        if (possibleSeeds.includes(team.seed)) gameSeeds.push(team.seed);
      });

      if (gameSeeds.length !== 2) throw new Error('Incorrect Number of Matching Seeds');

      let teams = gameSeeds.map(seed => {
        return this.teams.find(team => team.seed === seed);
      });
      // console.log('Round:setupGames::54',{ gameSeeds, teams })
      return new Game(...teams);
    });
  }

  setupWinners() {
    this.winners = this.games.map(game => {
      // console.log('Round:setupWinners::64',{ game })
      return game.winner;
    });
  }
}

export class Game {
  constructor(team1, team2) {
    // console.log('Game:constructor::66',{ team1, team2 })
    this.team1 = team1;
    this.team2 = team2;
    this.winner = this.simulate();
  }

  simulate() {
    console.log('------------------------------')
    console.log(`${this.team1} vs ${this.team2}`);
    const team1Score = Math.random() / this.team1.seed;
    const team2Score = Math.random() / this.team2.seed;

    if (team1Score === team2Score) return this.simulate();

    const winner = team1Score > team2Score ? this.team1 : this.team2;
    const loser = team1Score > team2Score ? this.team2 : this.team1;
    const upsetString = loser.seed < winner.seed ? ' in an upset!' : '!';
    console.log(`${winner} wins${upsetString}`);
    console.log('------------------------------')
    return winner;
  }
}

export class Team {
  constructor(name, seed, region=null) {
    this.name = name;
    this.seed = seed;
    this.region = region;
  }

  toString() {
    return `${this.seed}. ${this.name}`;
  }
}

export class FinalFour {
  constructor(teams, tournament) {
    this.teams = teams;
    this.tournament = tournament;
    this.winner = this.simulate();
  }

  simulate() {
    let matchups = [];
    if (this.tournament === 'men') {
      matchups = [['south', 'east'], ['west', 'midwest']];
    } else if (this.tournament === 'women') {
      matchups = [['regional1', 'regional2'], ['regional4', 'regional3']];
    } else {
      throw new Error('Invalid tournament!');
    }

    const game1 = new Game(
      this.teams.find(t => t.region === matchups[0][0]),
      this.teams.find(t => t.region === matchups[0][1]),
    );
    const game2 = new Game(
      this.teams.find(t => t.region === matchups[1][0]),
      this.teams.find(t => t.region === matchups[1][1]),
    );
    const championship = new Game(game1.winner, game2.winner);

    return championship.winner;
  }
}