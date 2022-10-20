export const Stoage_KEY = "userInfo";
const storage = window.localStorage;

interface IUserStorage {
    email: string | undefined,
    role: string,
    applicationType?: string,
    token?: string,
    [key: string]: any
}

const setItem = (key: string, value: any) => {
    storage.setItem(key, JSON.stringify(value));
}

const getItem = <T>(key: string) => {
    return JSON.parse(storage.getItem(key) || '{}') as T;
}

export const AddUserProps = (key:keyof IUserStorage, values: any) => {
    try {
        const user = JSON.parse(storage.getItem(Stoage_KEY) || '{}') as IUserStorage;
        user[key] = values;
        JSON.stringify(user);
        setUser(user);
    } catch (error) {

    }
}

export const setUser = (values: IUserStorage) => {
    setItem(Stoage_KEY, values);
}

export const UserEmail = () => {
    return getItem<IUserStorage>(Stoage_KEY).email;
}

export const UserRole = () => {
    return getItem<IUserStorage>(Stoage_KEY).role;
}

export const UserFormType = () => {
    return getItem<IUserStorage>(Stoage_KEY).applicationType;
}

export const token = () => {
    return getItem<IUserStorage>(Stoage_KEY).token;
}