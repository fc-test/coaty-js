/*! Copyright (c) 2018 Siemens AG. Licensed under the MIT License. */

import { IDbAdapter, IDbAdapterConstructor, IDbAdapterExtension } from "./db-adapter";
import { DbConnectionInfo } from "./db-connection-info";

/**
 * Factory for registering and creating database adapters.
 */
export class DbAdapterFactory {

    // Adapters that have been registered by the application.
    // Properties are unique names of adapters mapped onto adapter constructor functions.
    private static readonly ADAPTERS = {};

    private constructor() {
        /* tslint:disable-next-line:no-empty */
    }

    /**
     * Register database adapter of the given type under the given adapter name.
     *
     * The name of the adapter specified here must be equal to the name of the
     * associated adapter specified in the connection info of the database config.
     *
     * @param name the associated name of the adapter
     * @param adapterType the constructor functions of the adapter
     */
    static registerAdapter(name: string, adapterType: IDbAdapterConstructor) {
        // Note: We must NOT use the `adapterType.name` property as a key here, 
        // because the adapter class may have been scrambled by an obfuscation tool
        // (e.g. uglify) at build time. Thus, the adapter type name would no longer
        // correspond to the name of the (unscrambled) adapter type given in the 
        // connection info of the database config.
        DbAdapterFactory.ADAPTERS[name] = adapterType;
    }

    /**
     * Create an adapter instance from the given connection info.
     * @param connectionInfo an object specifying connection details
     */
    static create(connectionInfo: DbConnectionInfo): IDbAdapter & IDbAdapterExtension {
        const adapter = connectionInfo.adapter;
        const adapterType: IDbAdapterConstructor = DbAdapterFactory.ADAPTERS[adapter];

        if (adapterType !== undefined) {
            return new adapterType(connectionInfo);
        }

        throw new TypeError(`Cannot create DB adapter '${adapter}': adapter is not registered.`);
    }
}
