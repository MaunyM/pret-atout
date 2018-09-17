import {BggType} from "./BggType";

export class BggSearchResult {
    public id: string;
    public type?: BggType | null;
    public name?: string | null;
    public yearpublished?: number | null;
}