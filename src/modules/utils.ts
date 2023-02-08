import { DriveMode, StartEngine, StopEngine } from './api';
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

export function deleteActiveClass() {
    const selectBtn: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.select_car');
    selectBtn.forEach((el: HTMLButtonElement) => {
        const RemoveClass = el.closest('.active');
        if (RemoveClass) {
            RemoveClass.classList.remove('active');
        }
    });
}

export function DataFromUpdateForm(): Car | Error {
    const Path = {
        UpdateInputName: document.querySelector('.update_name_input') as HTMLInputElement,
        UpdateInputColor: document.querySelector('.update_color_input') as HTMLInputElement,
    };
    const InputName = Path.UpdateInputName.value;
    const InputColor = Path.UpdateInputColor.value;
    if (InputName.length === 0 || InputColor.length === 0) {
        return new Error('Input valid data');
    }
    return {
        name: InputName,
        color: InputColor,
    };
}

export function selectCar(el: HTMLButtonElement) {
    const RaceBlock = el.closest('.race_container') as HTMLDivElement;
    if (RaceBlock.classList.contains('active') === true) {
        RaceBlock.classList.remove('active');
    } else if (RaceBlock.classList.contains('active') === false) {
        deleteActiveClass();
        RaceBlock.classList.add('active');
    }
    return +RaceBlock.id;
}

export const GetPageSwitchingEl = () => {
    const NextBtn = document.querySelector('.next_page') as HTMLButtonElement;
    const Prevbtn = document.querySelector('.prev_page') as HTMLButtonElement;
    const PageNum = document.querySelector('.page_num') as HTMLElement;
    return { NextBtn, Prevbtn, PageNum };
};

export const AddCarButton = () => {
    const CreateCar = document.querySelector('.create_car') as HTMLButtonElement;
    const GenerateBtn = document.querySelector('.generate_button') as HTMLButtonElement;
    return { CreateCar, GenerateBtn };
};

export const updateButtons = () => {
    const UpdateBtn = document.querySelector('.update_car') as HTMLDivElement;
    const SelectBtn: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.select_car');
    return { UpdateBtn, SelectBtn };
};

export const StartStopEngineButtons = () => {
    const startBtn = document.querySelectorAll('.start-engine_btn') as NodeListOf<HTMLButtonElement>;
    const stopBtn = document.querySelectorAll('.stop-engine_btn') as NodeListOf<HTMLButtonElement>;
    return { startBtn, stopBtn };
};

let requestId: number;

export function StartAnimation(time: number, car: HTMLElement, roadWidth: number) {
    let startAnimation: number;
    const newCar = car as HTMLElement;
    requestId = requestAnimationFrame(function measure(newTime: number) {
        if (!startAnimation) {
            startAnimation = newTime;
        }
        const progress = (newTime - startAnimation) / time;
        const translate = progress * roadWidth;
        newCar.style.transform = `translateX(${translate}px)`;

        if (progress < 1) {
            requestId = requestAnimationFrame(measure);
        }
    });
}

export function cancelAnimation(car: HTMLElement) {
    cancelAnimationFrame(requestId);
    const newCar = car as HTMLElement;
    newCar.style.transform = 'none';
    return newCar;
}

export function stopAnimation() {
    cancelAnimationFrame(requestId);
}

export function GetRoadWidth() {
    const road = document.querySelector('.road') as HTMLElement;
    let roadWidth = road.clientWidth;
    window.addEventListener('resize', () => {
        roadWidth = road.clientWidth;
    });
    return roadWidth;
}

export const GetRaceButtons = () => {
    const RaceBtn = document.querySelector('.race_button') as HTMLButtonElement;
    const ResetBtn = document.querySelector('.reset_button') as HTMLButtonElement;
    const RaceContainer = document.querySelectorAll('.race_container') as NodeListOf<HTMLDivElement>;
    const IDArray: Array<HTMLElement> = [];
    RaceContainer.forEach((el: HTMLDivElement) => {
        const SvgCar = el.querySelector('.svg-car') as HTMLElement;
        IDArray.push(SvgCar);
    });
    return { RaceBtn, ResetBtn, IDArray };
};

let CarTime: number = 0;

export async function RaceProcess(SvgCar: HTMLElement, ID: number) {
    const { velocity, distance } = await StartEngine(ID);
    CarTime = distance / velocity;
    StartAnimation(CarTime, SvgCar, GetRoadWidth());
    try {
        return await DriveMode(ID, CarTime);
    } catch {
        stopAnimation();
    }
}

export async function StopPorcess(SvgCar: HTMLElement, ID: number) {
    await StopEngine(ID);
    cancelAnimation(SvgCar);
}

export function checkStyle() {
    const cars = document.querySelectorAll('.svg-car') as NodeListOf<HTMLElement>;
    cars.forEach((el: HTMLElement) => {
        const newEl = el as HTMLElement;
        newEl.style.transform = 'none';
    });
}

export function deleteBlurWinner() {
    const blur = document.querySelector('.blur') as HTMLDivElement;
    blur.remove();
}

export function WinnersPagintaionBtn() {
    const NextBtn = document.querySelector('.next-winners') as HTMLButtonElement;
    const PrevBtn = document.querySelector('.prev-winners') as HTMLButtonElement;
    return { NextBtn, PrevBtn };
}

export function containersBtn() {
    const GrarageContainer = document.querySelector('.garage_container') as HTMLElement;
    const WinnersContainer = document.querySelector('.winners_container') as HTMLElement;
    return { GrarageContainer, WinnersContainer };
}

export function sortBtn() {
    const sortWinSelector = document.querySelector('.sort') as HTMLSelectElement;
    const orderSelector = document.querySelector('.order') as HTMLSelectElement;
    return { sortWinSelector, orderSelector };
}
