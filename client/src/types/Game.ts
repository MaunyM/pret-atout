import {Box} from "./Box";

export class Game {
    public handle?: string;
    public name: string;
    public thumbnail?: string;
    public description?: string;
    public bggId?: string;
    public minPlayer?: number;
    public maxPlayer?: number;
    public box?: Box;
}