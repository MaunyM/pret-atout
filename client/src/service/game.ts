import {BggGame, BggSearchResult, BggType, Game} from "../types";

const MAX_GAME = 10;

class DicedString {
    public name: string;
    public dice: number;
}

export const isEqual = (a: Game, b: Game) => a.bggId === b.bggId && (!a.box || !b.box);

// FETCH BGG
const fetchDocument = async (query: string): Promise<Document> => {
    const response: Response = await fetch(query);
    const responseText: string = await response.text();
    return (new (window as any).DOMParser()).parseFromString(responseText, "text/xml");
};

export const fetchSearch = async (query: string): Promise<BggGame[]> => {
    const document: Document = await fetchDocument(`https://www.boardgamegeek.com/xmlapi2/search?query=${query}`);
    return fetchThing(query, Array.from(document.getElementsByTagName('item'))
        .filter((e: Element) => e.getAttribute('id'))
        .map((e: Element) => mapToBggSearchResult(e))
    )
};

export const fetchSearchExact = async (query: string): Promise<BggGame[]> => {
    if (Number.isInteger(+query)) {
        return fetchThingsById(query, [query]);
    }
    const document: Document = await fetchDocument(`https://www.boardgamegeek.com/xmlapi2/search?exact=1&query=${query}`);
    return fetchThing(query, Array.from(document.getElementsByTagName('item'))
        .filter((e: Element) => e.getAttribute('id'))
        .map((e: Element) => mapToBggSearchResult(e))
        .filter((bggResult => bggResult.type === BggType.boardgame || bggResult.type === BggType.boardgameexpansion))
    )
};


export const fetchThing = async (query: string, bggSearchResults: BggSearchResult[]): Promise<BggGame[]> => {
    if (bggSearchResults.length === 0) {
        return [];
    }
    const ids: string[] = Array.from(new Set(bggSearchResults.map((bggSearchResult: BggSearchResult) => bggSearchResult.id)));
    return fetchThingsById(query, ids);
};

export const mapToGame = (bggGame: BggGame): Game => ({
    bggId: bggGame.id,
    maxPlayer: bggGame.maxplayers,
    minPlayer: bggGame.minplayers,
    name: bggGame.name || '',
    thumbnail: bggGame.thumbnail
});

const fetchThingsById = async (query: string, ids: string[]): Promise<BggGame[]> => {
    const document: Document = await fetchDocument(`https://www.boardgamegeek.com/xmlapi2/thing?stats=1&id=${ids.join(',')}`);
    return Array.from(document.getElementsByTagName('item'))
        .map(mapToBggGame(query))
        .sort((a: BggGame, b: BggGame) => b.statistics.ratings.usersrated - a.statistics.ratings.usersrated)
        .slice(0, MAX_GAME)
};

const mapToBggSearchResult = (e: Element): BggSearchResult => {
    const id: string = e.getAttribute('id') || '';
    const yearAttribute: Element = e.getElementsByTagName('yearpublished')[0];
    let yearpublished: number = 0;
    if (yearAttribute) {
        yearpublished = +(yearAttribute.getAttribute('value') || 0);
    }
    return {
        id,
        name: e.getElementsByTagName('name')[0].getAttribute('value'),
        type: BggType[e.getAttribute('type') || BggType.boardgame],
        yearpublished,
    }
};

const mapToBggGame = (query: string) => (e: Element): BggGame => {
    const id: string = e.getAttribute('id') || '';
    const thumbnailAttribute: Element = e.getElementsByTagName('thumbnail')[0];
    let thumbnail: string | undefined;
    if (thumbnailAttribute) {
        thumbnail = thumbnailAttribute.textContent || undefined;
    }

    const primary: string = e.querySelectorAll('name[type="primary"]')[0].getAttribute('value') || '';
    const alternateNamesNode: NodeListOf<Element> = e.querySelectorAll('name[type="alternate"]');

    const alternates: string[] = [primary];
    // tslint:disable-next-line
    for (let i = 0; i < alternateNamesNode.length; i++) {
        const alternate: string = alternateNamesNode[i].getAttribute('value') || '';
        alternates.push(alternate);
    }
    const name = alternates
        .map(mapDice(query))
        .sort((a: DicedString, b: DicedString) => b.dice - a.dice)[0].name;

    const usersratedElement: Element = e.querySelectorAll('usersrated')[0];
    let usersrated: number = 0;
    if (usersratedElement) {
        usersrated = +(usersratedElement.getAttribute('value') || 0);
    }

    const minplayersElement: Element = e.querySelectorAll('minplayers')[0];
    let minplayers: number = 0;
    if (minplayersElement) {
        minplayers = +(minplayersElement.getAttribute('value') || 0);
    }

    const maxplayersElement: Element = e.querySelectorAll('maxplayers')[0];
    let maxplayers: number = 0;
    if (maxplayersElement) {
        maxplayers = +(maxplayersElement.getAttribute('value') || 0);
    }

    return {
        id,
        maxplayers,
        minplayers,
        name,
        statistics: {
            ratings: {
                usersrated
            }
        },
        thumbnail
    }
};

const mapDice = (query: string) => (name: string): DicedString => ({
    dice: diceCoefficient(query, name),
    name
});

const diceCoefficient = (l: string, r: string): number => {
    if (l.length < 2 || r.length < 2) {
        return 0;
    }

    const lBigrams = new Map();
    for (let i = 0; i < l.length - 1; i++) {
        const bigram = l.substr(i, 2);
        const count = lBigrams.has(bigram)
            ? lBigrams.get(bigram) + 1
            : 1;

        lBigrams.set(bigram, count);
    }

    let intersectionSize = 0;
    for (let i = 0; i < r.length - 1; i++) {
        const bigram = r.substr(i, 2);
        const count = lBigrams.has(bigram)
            ? lBigrams.get(bigram)
            : 0;

        if (count > 0) {
            lBigrams.set(bigram, count - 1);
            intersectionSize++;
        }
    }

    return (2.0 * intersectionSize) / (l.length + r.length - 2);
};

