export interface Bird {
    nomscientifique: string;
    nomcommun: string;
    statutspeces: SpecieStatus;
    nomscientifiquecomsommer: string;
}

export enum SpecieStatus {
    notEndengered = "Non menacée",
    vulnerable = "Vulnérable",
    minorConcern = "Préoccupation mineure",
}