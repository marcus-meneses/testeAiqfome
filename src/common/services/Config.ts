import Dotenv from 'dotenv';
import * as configTypes from '@common/types/configTypes';
 


export class Config {
    private static _instance: Config;
    public data: configTypes.configData;
    
    private constructor() {
       
        if (!process.env.NODE_ENV) {
           
            process.env.NODE_ENV = 'development';
        }
        Dotenv.config({
            path: `.env.${process.env.NODE_ENV}`
        });

        this.data = [];
        for (const [key, value] of Object.entries(process.env)) {
            if (key.startsWith('NODEAPP_')) {
                const configKey = key.replace('NODEAPP_', '');
                this.set(configKey, value);
            }
        }
      
    }
    
    public static get Instance(): Config {
        return this._instance || (this._instance = new this());
    }
    
    set(key: string, value: any): void {
        const index = this.data.findIndex((entry) => entry.key === key);
        if (index !== -1) {
            this.data[index].value = value;
        } else {
            this.data.push({ key, value });
        }
    }

    get(key: string): any {
        const entry = this.data.find((entry) => entry.key === key);
        return entry ? entry.value : null;
    }

}