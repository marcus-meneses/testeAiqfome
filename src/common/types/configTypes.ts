import * as databaseTypes from '@common/types/databaseTypes';
import * as loggerTypes from '@common/types/loggerTypes';

type configEntry ={key: string, value: any}

type configData = configEntry[]

export {
    configEntry,
    configData,
}