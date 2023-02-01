import { Car } from './interface';

const baseURL: string = 'http://127.0.0.1:3000';

const path = {
    garage: '/garage',
};

export async function getCars<T>(page?: number): Promise<T> {
    const limit = 7;
    const data = await fetch(`${baseURL}${path.garage}?_page=${page}&_limit=${limit}`);
    const response = await data.json();
    return response;
}

export async function getId(): Promise<number> {
    const data = await fetch(`${baseURL}${path.garage}`);
    const response = await data.json();
    return response[response.length - 1].id;
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
