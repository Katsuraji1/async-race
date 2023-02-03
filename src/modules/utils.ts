import { CarBrands, CarModels } from './cars';
import { Car } from './interface';

export function InputValues(): Car | string {
    const InputNameBlock = document.querySelector('.create_name_input') as HTMLInputElement;
    const InputColorBlock = document.querySelector('.create_color_input') as HTMLInputElement;
    const InputNameValue = InputNameBlock.value;
    const InputColorValue = InputColorBlock.value;
    if (InputColorValue.length !== 0 && InputNameValue.length !== 0) {
        return {
            name: `${InputNameValue}`,
            color: `${InputColorValue}`,
        };
    }
    return 'Error';
}

function getRandomIntInclusive(min: number, max: number): number {
    const minNum = Math.ceil(min);
    const maxNum = Math.floor(max);
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
}

function generateColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i += 1) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export async function generateCars() {
    const CarsArray: Array<Car> = [];
    for (let i = 1; i <= 100; i += 1) {
        const brandNum = getRandomIntInclusive(0, CarBrands.length - 1);
        const modelNum = getRandomIntInclusive(0, CarModels.length - 1);
        CarsArray.push({
            name: `${CarBrands[brandNum]} ${CarModels[modelNum]}`,
            color: `${generateColor()}`,
        });
    }
    return CarsArray;
}
