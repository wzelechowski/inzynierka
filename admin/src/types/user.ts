import { Role } from "./enums";

export interface UserProfileResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    roles: Role[];
}