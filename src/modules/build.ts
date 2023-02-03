import { createCar, deleteCar, getCars } from './api';
import { Car, ServerResponse } from './interface';
import { BodyContainer } from './ui';
import { InputValues, generateCars } from './utils';

// const PromiseResponse: Array<Car> = (await getCars(page).catch((err) => console.log(new Error(err)))) as Array<Car>;

let page = 1;

async function PromiseResponse(pageNum: number) {
    return (await getCars(pageNum).catch((err) => console.log(new Error(err)))) as Array<ServerResponse>;
}

export default class Build {
    pagination() {
        const NextBtn = document.querySelector('.next_page') as HTMLButtonElement;
        const Prevbtn = document.querySelector('.prev_page') as HTMLButtonElement;
        const PageNum = document.querySelector('.page_num') as HTMLElement;
        PageNum.textContent = `Page#${page}`;
        Prevbtn.addEventListener('click', async () => {
            page -= 1;
            if (page < 1) {
                page = 1;
            } else {
                await this.build_page();
            }
        });
        NextBtn.addEventListener('click', async () => {
            page += 1;
            await this.build_page();
        });
    }

    async build_page() {
        BodyContainer(await PromiseResponse(page));
        const CreateCar = document.querySelector('.create_car') as HTMLButtonElement;
        const GenerateBtn = document.querySelector('.generate_button') as HTMLButtonElement;
        CreateCar.addEventListener('click', async () => {
            const response = await createCar(InputValues());
            if (response !== 'Error') await this.build_page();
        });
        this.pagination();
        GenerateBtn.addEventListener('click', async () => {
            const CarsArray = await generateCars();
            CarsArray.forEach((el: Car) => {
                createCar(el);
            });
            await this.build_page();
        });
        this.removeCar();
    }

    async removeCar() {
        const removeBtn: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.remove_car');
        removeBtn.forEach((el: HTMLButtonElement) => {
            el.addEventListener('click', async () => {
                const getDivId: number = +(el.closest('.race_container') as HTMLElement).id;
                await deleteCar(getDivId);
                await this.build_page();
            });
        });
    }
}
