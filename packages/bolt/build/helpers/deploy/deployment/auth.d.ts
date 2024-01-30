import Store from "../../../libraries/store";
export declare const auth: (doAuth: boolean, store: Store) => Promise<{
    user: any;
    projects: any;
} | undefined>;
