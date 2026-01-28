export interface DecodedToken {
    sub: string;
    exp: number;
    realm_access?: {
        roles: string[];
    };
    resource_access?: {
        [key: string]: {
            roles: string[];
        };
    };
}