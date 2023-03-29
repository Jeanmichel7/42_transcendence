export interface Message {
    id: bigint;
    ownerUser: bigint;
    destUser: bigint;
    data: string;
    createAt: string;
    updateAt: string;
}