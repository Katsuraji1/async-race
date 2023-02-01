import { Car } from './interface';

export function InputValues(currentid: number): Car | string {
    const InputNameBlock = document.querySelector('.create_name_input') as HTMLInputElement;
    const InputColorBlock = document.querySelector('.create_color_input') as HTMLInputElement;
    const InputNameValue = InputNameBlock.value;
    const InputColorValue = InputColorBlock.value;
    if (InputColorValue.length !== 0 && InputNameValue.length !== 0) {
        return {
            name: `${InputNameValue}`,
            color: `${InputColorValue}`,
            id: currentid,
        };
    }
    return 'Error';
}
