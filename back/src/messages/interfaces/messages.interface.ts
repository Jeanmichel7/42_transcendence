export interface Message {
    // id: bigint;
    ownerUser: bigint;
    destUser: bigint;
    text: string | object;
    // createAt: string;
    // updateAt: string;
}