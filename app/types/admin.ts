export interface IAdmin {
    id:          string
    name:        string
    email:       string
    image:       string | null
    createdAt:   Date
    lastSeenAt:  Date | null
}

export interface IInvite {
    id: string;
    email: string;
    createdAt: Date;
    token: string;
    used: boolean;
    expires: Date;
    createdBy: string;
}