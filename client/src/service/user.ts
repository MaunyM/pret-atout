import {AUTH_TOKEN} from "../constants";

export const saveUserData = (token: string) => {
    localStorage.setItem(AUTH_TOKEN, token)
};

export const readUserData = (): string | null => {
    return localStorage.getItem(AUTH_TOKEN);
};

export const removeUserData = (): void => {
    localStorage.removeItem(AUTH_TOKEN);
};