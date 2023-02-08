export interface Car {
    name: string;
    color: string;
}

export interface ServerResponse {
    name: string;
    color: string;
    id: number;
}

export interface EngineParam {
    id: number;
    status: string;
}
export interface Start {
    velocity: number;
    distance: number;
}
export interface DriveResult {
    succues: boolean;
}

export interface IRaceResult {
    id: number;
    wins: number;
    time: number | undefined;
}
export interface IData {
    data: {
        succues: boolean | undefined;
    };
    Result: {
        id: number;
        wins: number;
        time: number | undefined;
    };
}

export interface IWineer {
    id: number;
    wins: number;
    time: number | undefined;
}

export interface IUpdateWinner {
    wins: number;
    time: number | undefined;
}

export interface IGetWinners {
    id: number;
    wins: number;
    time: number;
}
