/* eslint-disable no-unused-vars */

export interface API {
    signTransaction: (actions: any) => Promise<any>;
    getTableRows: (options: any) => Promise<any>;
    getAccount: (account: string) => Promise<any>;
}
