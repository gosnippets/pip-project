export interface ISoftware {
    id: number,
    name: string,
    version: string,
    active: boolean
}

export interface IPreApproved {
    id: number;
    name: string;
}

export interface INonPreApproved {
    descriptionSoftware: string;
    softwareType: string;
    licenseProvider: string;
}