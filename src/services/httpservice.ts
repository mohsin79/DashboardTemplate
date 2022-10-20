import axios, { Method, AxiosRequestConfig } from "axios";
import { version } from '../../package.json';
import config from "../config/config";
import { token } from "./webstorage";
// const BaseURL = 'http://localhost:5000';

export const BaseURL = import.meta.env.MODE === 'development' ? 'https://localhost:7284/api' : `${config.BaseUrl}/api`;
export const BaseURLCommon = import.meta.env.MODE === 'development' ? 'http://10.0.12.96:8003/CommonData' : `${config.BaseUrl}/api`;
type UrlType = `/${string}`;

export const ApiRequestAsync = async (method: Method, url: UrlType, data: Array<any> | Object) => {
    const config: AxiosRequestConfig = {
        baseURL: BaseURL, url, method, headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token()}`
        }
    };
    try {
        switch (method) {
            case 'POST':
                config.data = data;
                break;
            case 'GET':
                config.params = data;
                break;
            default:
                config.params = data;
                break;
        }
        return await axios(config);
    } catch (error) {
        throw error
    }

}

export const ApiAnonymousAsync = async (method: Method, url: UrlType, data: Array<any> | Object) => {
    const config: AxiosRequestConfig = {
        baseURL: BaseURL, url, method, headers: {
            'Content-Type': 'application/json',
        },
    };
    try {
        switch (method) {
            case 'POST':
                config.data = data;
                break;
            case 'GET':
                config.params = data;
                break;
            default:
                config.params = data;
                break;
        }
        return await axios(config);
    } catch (error) {
        throw error
    }

}


export const AuthRequestAsync = async (clientId: string, clientSecret: string) => {

    try {
        return await axios.post(`${config.BaseUrl}/api/connect/token`, {}, {
            headers: {
                'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    } catch (error) {
        throw error
    }

}

export const ApiGetCommonDataAsync = async (method: Method, url: UrlType) => {
    const config: AxiosRequestConfig = {
        baseURL: BaseURLCommon, url, method, headers: {
            'Content-Type': 'application/json',
        },
    };
    try {
        // switch (method) {
        //     case 'POST':
        //         config.data = data;
        //         break;
        //     case 'GET':
        //         config.params = data;
        //         break;
        //     default:
        //         config.params = data;
        //         break;
        // }
        // config.params = "GET";
        return await axios(config);
    } catch (error) {
        throw error
    }

}
