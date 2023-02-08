import { getCar, getWinners, getWinnersCars } from './api';
import { IGetWinners, ServerResponse } from './interface';
import { containersBtn, sortBtn } from './utils';

const DOMElements = {
    elements: {
        body: document.querySelector('body') as HTMLBodyElement,
        garage: document.querySelector('.garage_container') as HTMLElement,
        winners: document.querySelector('.winners_container') as HTMLElement,
    },
};

const DivContainer = DOMElements.elements.body.appendChild(document.createElement('div')) as HTMLElement;
DivContainer.classList.add('main_container');

const MainContainer = () => DivContainer.appendChild(document.createElement('main')) as HTMLElement;

const ControlContainer = () => `<header>
<div class="control_container">
    <div class="switch_buttons">
        <button class="garage_btn">TO GARAGE</button>
        <button class="winners_btn">TO WINNERS</button>
    </div>
</div>
</header>`;

const RedactorContainer = () => `<div class="redactor_container">
<div class="create_container">
    <input type="text" class="create_name_input">
    <input type="color" class="create_color_input">
    <button class="create_car">CREATE</button>
</div>
<div class="update_container">
    <input type="text" class="update_name_input">
    <input type="color" class="update_color_input">
    <button class="update_car">UPDATE</button>
</div>
<div class="control_buttons">
    <button class="race_button">RACE</button>
    <button class="reset_button">RESET</button>
    <button class="generate_button">GENERATE CARS</button>
</div>
</div>`;

const TextNav = () => `<h1 class='total-garage-cars'>GARAGE(1)</h1>
<h2 class='page_num' >Page #1</h2>`;

const carRender = (color: string) =>
    `<svg class='svg-car' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="45" height="50" viewBox="0 0 256 256" xml:space="preserve">
<defs>
</defs>
<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: ${color}; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
	<circle cx="70.735" cy="56.775" r="1.955" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
	<circle cx="19.765" cy="56.775" r="1.955" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
	<path d="M 75.479 36.045 l -7.987 -1.22 l -2.35 -2.574 c -5.599 -6.132 -13.571 -9.649 -21.874 -9.649 h -6.245 c -1.357 0 -2.696 0.107 -4.016 0.296 c -0.022 0.004 -0.044 0.006 -0.066 0.01 c -7.799 1.133 -14.802 5.468 -19.285 12.106 C 5.706 37.913 0 45.358 0 52.952 c 0 3.254 2.647 5.9 5.9 5.9 h 3.451 c 0.969 4.866 5.269 8.545 10.416 8.545 s 9.447 -3.679 10.416 -8.545 h 30.139 c 0.969 4.866 5.27 8.545 10.416 8.545 s 9.446 -3.679 10.415 -8.545 H 84.1 c 3.254 0 5.9 -2.646 5.9 -5.9 C 90 44.441 83.894 37.331 75.479 36.045 z M 43.269 26.602 c 7.065 0 13.848 2.949 18.676 8.094 H 39.464 l -3.267 -8.068 c 0.275 -0.009 0.55 -0.026 0.826 -0.026 H 43.269 z M 32.08 27.118 l 3.068 7.578 H 18.972 C 22.429 30.813 27.018 28.169 32.08 27.118 z M 19.767 63.397 c -3.652 0 -6.623 -2.971 -6.623 -6.622 c 0 -3.652 2.971 -6.623 6.623 -6.623 s 6.623 2.971 6.623 6.623 C 26.39 60.427 23.419 63.397 19.767 63.397 z M 70.738 63.397 c -3.652 0 -6.623 -2.971 -6.623 -6.622 c 0 -3.652 2.971 -6.623 6.623 -6.623 c 3.651 0 6.622 2.971 6.622 6.623 C 77.36 60.427 74.39 63.397 70.738 63.397 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
</g>
</svg>`;

const RaceContainer = (response: Array<ServerResponse>) => {
    let resultString: string = '';
    response.forEach((el: ServerResponse) => {
        resultString += `<div class="race_container" id=${el.id}>
        <div class="race_game">
            <div class="car_control">
                <button class="select_car">SELECT</button>
                <button class="remove_car">REMOVE CAR</button>
                <span class="car_name">${el.name}</span>
            </div>
            <div class="road_container">
                <div class="engine_car">
                    <button class="start-engine_btn">A</button>
                    <button class="stop-engine_btn">B</button>
                </div>
                <div class="road">
                    ${carRender(`${el.color}`)}
                    <svg class='finish' width="50" height="50" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
                        <!-- Created with SVG-edit - https://github.com/SVG-Edit/svgedit-->
                        <g class="layer">
                        <title>Layer 1</title>
                        <line fill="white" id="svg_1" stroke="#000000" stroke-width="5" x1="14.5" x2="14.5" y1="11.5" y2="40.500008"/>
                        <rect fill="#ff0000" height="14.999999" id="svg_8" stroke="#000000" stroke-width="5" width="22.999999" x="14.5" y="11.5"/>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
        </div>`;
    });
    return resultString;
};

const PageControl = () => `<div class="page_control">
<button class="prev_page">PREV</button>
<button class="next_page">NEXT</button>
</div>`;

const WinnersText = () => `
<h1 class='winners-total-count'>Winners()</h1>
<h2 class='winners-page'>Page#1</h2>`;

const WinnersTable = () => `<table class="winners_table">
<tr>
    <th>IDr</th>
    <th>Car</th>
    <th>Name</th>
    <th>Wins</th>
    <th>Best Time(seconds)</th>
</tr>
<tbody class='tbody'></tbody>
</table>`;

export const TableLine = (id: number, car: string, name: string, wins: number, time: number) => `
<tr>
    <td>${id}</td>
    <td>${car}</td>
    <td>${name}</td>
    <td>${wins}</td>
    <td>${time}</td>
</tr>`;

const TableButtons = () => `<select class='sort'>
<option>id</option>
<option>wins</option>
<option>time</option>
</select>
<select class='order'>
<option>ASC</option>
<option>DESC</option>
</select>`;

const winnersPagintaion = () => `
<button class='prev-winners'>PREV</button>
<button class='next-winners'>NEXT</button>
`;

export async function switchToWinners(page: number, sort: string, order: string) {
    const { GrarageContainer, WinnersContainer } = containersBtn();
    GrarageContainer.style.display = 'none';
    WinnersContainer.style.display = 'block';
    const winnersArray: Array<IGetWinners> = await getWinners(page, sort, order);
    const table = document.querySelector('.tbody') as HTMLTableElement;
    table.innerHTML = '';
    winnersArray.forEach(async (el: IGetWinners) => {
        const promiseCar = await getCar(el.id);
        const tr = table.appendChild(document.createElement('tr')) as HTMLElement;
        const tdID = tr.appendChild(document.createElement('td')) as HTMLElement;
        const tdCar = tr.appendChild(document.createElement('td')) as HTMLElement;
        const tdName = tr.appendChild(document.createElement('td')) as HTMLElement;
        const tdWins = tr.appendChild(document.createElement('td')) as HTMLElement;
        const tdtime = tr.appendChild(document.createElement('td')) as HTMLElement;
        tdID.textContent = `${el.id}`;
        tdWins.textContent = `${el.wins}`;
        tdtime.textContent = `${el.time}`;
        tdName.textContent = `${promiseCar.name}`;
        tdCar.innerHTML = `${carRender(promiseCar.color)}`;
    });
}

const CreateGarage = (response: Array<ServerResponse>): string => {
    return `${RedactorContainer()}${TextNav()}${RaceContainer(response)}${PageControl()}`;
};

const CreateWinners = (): string => {
    return `${WinnersText()}${WinnersTable()}`;
};

const SwitchWindows = () => {
    const ToWinners = document.querySelector('.winners_btn') as HTMLElement;
    const ToGarage = document.querySelector('.garage_btn') as HTMLElement;
    const { GrarageContainer, WinnersContainer } = containersBtn();
    WinnersContainer.insertAdjacentHTML('afterbegin', TableButtons());
    WinnersContainer.insertAdjacentHTML('beforeend', winnersPagintaion());
    const WinenrsTotalCount = document.querySelector('.winners-total-count') as HTMLElement;
    const { sortWinSelector, orderSelector } = sortBtn();
    ToWinners.addEventListener('click', async () => {
        const sortValue = sortWinSelector.value;
        const orderValue = orderSelector.value;
        switchToWinners(1, sortValue, orderValue);
        WinenrsTotalCount.textContent = `Winners(${await getWinnersCars()})`;
    });
    ToGarage.addEventListener('click', () => {
        GrarageContainer.style.display = 'block';
        WinnersContainer.style.display = 'none';
    });
};

export const BodyContainer = (response: Array<ServerResponse>) => {
    DivContainer.innerHTML = '';
    DivContainer.innerHTML = `${ControlContainer()}`;
    MainContainer().innerHTML = `<div class="garage_container">${CreateGarage(response)}</div>
    <div class='winners_container'>${CreateWinners()}</div>`;
    SwitchWindows();
};

export function getBlurWinner(TextBlur: string) {
    const WinnerDiv = DOMElements.elements.body.appendChild(document.createElement('div') as HTMLDivElement);
    WinnerDiv.classList.add('blur');
    WinnerDiv.textContent = `${TextBlur}`;
}
