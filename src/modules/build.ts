import { createCar, getCars, getId } from './api';
import { Car } from './interface';
import { BodyContainer } from './ui';
import { InputValues } from './utils';

export default class Build {
    async build_page() {
        const page = 1;
        const PromiseResponse: Array<Car> = (await getCars(page).catch((err) =>
            console.log(new Error(err))
        )) as Array<Car>;
        BodyContainer(PromiseResponse);
        // const currentId = PromiseResponse[PromiseResponse.length - 1].id;
        const CreateCar = document.querySelector('.create_car') as HTMLButtonElement;
        CreateCar.addEventListener('click', async () => {
            const response = await createCar(InputValues((await getId()) + 1));
            if (response !== 'Error') await this.build_page();
        });
    }
}
