export interface AlienGeneral {
  name: string;
  species: string;
  homeWorld: string;
  body: string;
}

export interface Alien {
  _id: string;
  general: AlienGeneral;
  abilities: string[];
  series: string;
}

export interface AliensResponse {
  count: number;
  aliens: Alien[];
}

export interface SingleAlienResponse {
  alien: Alien;
  request: {
    type: string;
    url: string;
  };
}
