export interface MessageInterface {
    id: bigint;
    ownerUser: bigint;
    destUser: bigint;
    text: string | object;
    createdAt: string;
    updatedAt: string;
}
