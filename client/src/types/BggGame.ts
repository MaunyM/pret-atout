export class BggGame {
    public id: string;
    public name?: string;
    public thumbnail?: string;
    public maxplayers?:number;
    public minplayers?:number;
    public statistics: {
        ratings: {
            usersrated: number
        }
    };
}