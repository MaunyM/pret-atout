import {Ludo} from "../types";

export const isOwner = (ludo: Ludo) => ludo.edge && ludo.edge === "OWNER";