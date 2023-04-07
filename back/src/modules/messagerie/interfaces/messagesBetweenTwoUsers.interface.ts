import { UserInterface } from "src/modules/users/interfaces/users.interface";

export interface MessageBtwTwoUserInterface {
    id: bigint;
    text: string | object;
    createdAt: string;
    updatedAt: string;
    firstNameOwner: string;
    lastNameOwner: string;
    // firstNameDest: string;
    // lastNameDest: string;
}
