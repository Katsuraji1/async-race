import { Car, IUpdateWinner, IWineer, Start } from './interface';

export const baseURL: string = 'http://127.0.0.1:3000';
export const controllers: AbortController[] = [];

export const path = {
    garage: '/garage',
    engine: '/engine',
    winners: '/winners',
};

export async function getCars<T>(page: number): Promise<T> {
    const limit = 7;
    const data = await fetch(`${baseURL}${path.garage}?_page=${page}&_limit=${limit}`);
    const response = await data.json();
    return response;
}

export async function getTotalCars() {
    const data = await fetch(`${baseURL}${path.garage}?_page=1`);
    const totalCount = data.headers.get('X-Total-Count');
    return totalCount;
}

export async function getWinnersCars() {
    const data = await fetch(`${baseURL}${path.winners}?_page=1`);
    const totalCount = data.headers.get('X-Total-Count');
    return totalCount;
}

export async function createCar(car: Car | string) {
    if (car === 'Error') return 'Error';
    const response = await fetch(`${baseURL}${path.garage}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(car),
    });

    const NewCar = JSON.stringify(response);
    return NewCar;
}

export async function deleteCar(id: number) {
    const response = await fetch(`${baseURL}${path.garage}/${id}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    return data;
}

export async function UpdateCarApi(id: number, data: Car | Error) {
    const response = await fetch(`${baseURL}${path.garage}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const updatedCar = JSON.stringify(response);
    return updatedCar;
}

export async function DriveMode(id: number, time?: number) {
    const controller = new AbortController();
    const { signal } = controller;
    controllers.push(controller);
    const response = await fetch(`${baseURL}${path.engine}?id=${id}&status=drive`, {
        method: 'PATCH',
        signal,
    });
    const data = await response.json();
    const Result = {
        id,
        wins: 1,
        time: typeof time !== 'undefined' ? +(time / 1000).toFixed(2) : time,
    };
    return { data, Result };
}

export async function StartEngine(id: number): Promise<Start> {
    const response = await fetch(`${baseURL}${path.engine}?id=${id}&status=started`, {
        method: 'PATCH',
    });
    const data = await response.json();
    return data;
}

export async function StopEngine(id: number) {
    const response = await fetch(`${baseURL}${path.engine}?id=${id}&status=stopped`, {
        method: 'PATCH',
    });
    const data = await response.json();
    return data;
}

export async function createWinner(winner: IWineer) {
    const response = await fetch(`${baseURL}${path.winners}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(winner),
    });

    const NewWinner = JSON.stringify(response);
    return { NewWinner, response };
}

export async function UpdateWinner(id: number, data: IUpdateWinner) {
    const response = await fetch(`${baseURL}${path.winners}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const updateData = JSON.stringify(response);
    return updateData;
}

export async function getWinner(id: number) {
    const response = await fetch(`${baseURL}${path.winners}/${id}`);
    const data = await response.json();
    return data;
}

export async function deleteWinner(ID: number) {
    const response = await fetch(`${baseURL}${path.winners}/${ID}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    return data;
}

export async function getWinners<T>(page: number, sort: string, order: string): Promise<T> {
    const limit = 10;
    const data = await fetch(`${baseURL}${path.winners}?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`);
    const response = await data.json();
    return response;
}

export async function getCar(id: number) {
    const response = await fetch(`${baseURL}${path.garage}/${id}`);
    const data = await response.json();
    return data;
}
