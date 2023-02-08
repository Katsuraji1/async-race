import {
    controllers,
    createCar,
    createWinner,
    deleteCar,
    deleteWinner,
    DriveMode,
    getCars,
    getTotalCars,
    getWinner,
    StartEngine,
    StopEngine,
    UpdateCarApi,
    UpdateWinner,
} from './api';
import { Car, IData, IRaceResult, ServerResponse } from './interface';
import { BodyContainer, getBlurWinner, switchToWinners } from './ui';
import {
    DataFromUpdateForm,
    InputValues,
    generateCars,
    GetPageSwitchingEl,
    selectCar,
    AddCarButton,
    updateButtons,
    StartStopEngineButtons,
    GetRoadWidth,
    StartAnimation,
    cancelAnimation,
    stopAnimation,
    GetRaceButtons,
    RaceProcess,
    StopPorcess,
    checkStyle,
    deleteBlurWinner,
    WinnersPagintaionBtn,
    sortBtn,
} from './utils';

let page = 1;
let winnersPage = 1;
let CarsRaceArray: Array<ServerResponse> = [];
export const status = ['started', 'stopped', 'drive'];

async function PromiseResponse(pageNum: number) {
    return (await getCars(pageNum).catch((err) => console.log(new Error(err)))) as Array<ServerResponse>;
}

export default class Build {
    async pagination() {
        const { NextBtn, Prevbtn, PageNum } = GetPageSwitchingEl();
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
        CarsRaceArray = await PromiseResponse(page);
        BodyContainer(CarsRaceArray);
        const { CreateCar, GenerateBtn } = AddCarButton();
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
        const TotalCars = document.querySelector('.total-garage-cars') as HTMLElement;
        const totalCount = await getTotalCars();
        TotalCars.textContent = `Garage(${totalCount})`;
        this.removeCar();
        this.updateCar();
        this.StartStopCar();
        this.StartStopRace();
        this.WinnersPagination();
    }

    async removeCar() {
        const removeBtn: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.remove_car');
        removeBtn.forEach((el: HTMLButtonElement) => {
            el.addEventListener('click', async () => {
                const getDivId: number = +(el.closest('.race_container') as HTMLElement).id;
                await deleteCar(getDivId);
                await deleteWinner(getDivId);
                await this.build_page();
            });
        });
    }

    async updateCar() {
        const { UpdateBtn, SelectBtn } = updateButtons();
        let SelectCarId = 0;
        SelectBtn.forEach((el: HTMLButtonElement) => {
            el.addEventListener('click', () => {
                SelectCarId = selectCar(el);
            });
        });
        UpdateBtn.addEventListener('click', async () => {
            await UpdateCarApi(SelectCarId, DataFromUpdateForm());
            this.build_page();
        });
    }

    async StartStopCar() {
        const { startBtn, stopBtn } = StartStopEngineButtons();
        let time: number;
        startBtn.forEach((el: HTMLButtonElement) => {
            el.addEventListener('click', async () => {
                const getIDEl = el.closest('.race_container') as HTMLElement;
                const SvgCar = getIDEl.querySelector('.svg-car') as HTMLElement;
                const ID = +getIDEl.id;
                const { velocity, distance } = await StartEngine(ID);
                time = distance / velocity;
                StartAnimation(time, SvgCar, GetRoadWidth());
                try {
                    await DriveMode(ID);
                } catch {
                    stopAnimation();
                }
            });
        });
        stopBtn.forEach((el: HTMLButtonElement) => {
            el.addEventListener('click', async () => {
                const getIDEl = el.closest('.race_container') as HTMLElement;
                const SvgCar = getIDEl.querySelector('.svg-car') as HTMLElement;
                const ID = +getIDEl.id;
                controllers.forEach((abort: AbortController) => {
                    abort.abort();
                });
                await StopEngine(ID);
                cancelAnimation(SvgCar);
            });
        });
    }

    async StartStopRace() {
        const { RaceBtn, ResetBtn, IDArray } = GetRaceButtons();
        RaceBtn.addEventListener('click', async () => {
            let isShow = false;
            const ResultArray: Array<IRaceResult> = [];
            IDArray.forEach(async (el: HTMLElement) => {
                const Parents = el.closest('.race_container') as HTMLElement;
                const PersonalID = +Parents.id;
                const newData: IData | undefined = await RaceProcess(el, PersonalID);
                if (typeof newData !== 'undefined') {
                    ResultArray.push(newData.Result);
                }
                if (ResultArray.length === 1 && isShow === false) {
                    ResultArray.sort((a, b) => {
                        if (typeof a.time !== 'undefined' && typeof b.time !== 'undefined') {
                            return a.time - b.time;
                        }
                        return 1;
                    });
                    const { response } = await createWinner(ResultArray[0]);
                    if (response.status === 500) {
                        const duplicateWinner = await getWinner(ResultArray[0].id);
                        await UpdateWinner(duplicateWinner.id, {
                            wins: duplicateWinner.wins + 1,
                            time:
                                typeof ResultArray[0].time !== 'undefined' && duplicateWinner.time > ResultArray[0].time
                                    ? duplicateWinner.time
                                    : ResultArray[0].time,
                        });
                    }
                    getBlurWinner(`id:${ResultArray[0].id} result:${ResultArray[0].time}`);
                    setTimeout(() => {
                        deleteBlurWinner();
                    }, 3000);
                    isShow = true;
                }
            });
        });
        ResetBtn.addEventListener('click', async () => {
            IDArray.forEach(async (el: HTMLElement) => {
                const Parents = el.closest('.race_container') as HTMLElement;
                const PersonalID = +Parents.id;
                await StopPorcess(el, PersonalID);
            });
            controllers.forEach((abort: AbortController) => {
                abort.abort();
            });
            setTimeout(() => {
                checkStyle();
            }, 2000);
        });
    }

    async WinnersPagination() {
        const { NextBtn, PrevBtn } = WinnersPagintaionBtn();
        const { sortWinSelector, orderSelector } = sortBtn();
        const CountPage = document.querySelector('.winners-page') as HTMLElement;
        let sortValue = sortWinSelector.value;
        let orderValue = orderSelector.value;
        NextBtn.addEventListener('click', () => {
            sortValue = sortWinSelector.value;
            orderValue = orderSelector.value;
            winnersPage += 1;
            CountPage.textContent = `Page#${winnersPage}`;
            switchToWinners(winnersPage, sortValue, orderValue);
        });
        PrevBtn.addEventListener('click', () => {
            sortValue = sortWinSelector.value;
            orderValue = orderSelector.value;
            winnersPage -= 1;
            if (winnersPage < 1) {
                winnersPage = 1;
            }
            CountPage.textContent = `Page#${winnersPage}`;
            switchToWinners(winnersPage, sortValue, orderValue);
        });
        sortWinSelector.addEventListener('change', () => {
            sortValue = sortWinSelector.value;
            orderValue = orderSelector.value;
            switchToWinners(winnersPage, sortValue, orderValue);
        });
        orderSelector.addEventListener('change', () => {
            sortValue = sortWinSelector.value;
            orderValue = orderSelector.value;
            switchToWinners(winnersPage, sortValue, orderValue);
        });
    }
}
