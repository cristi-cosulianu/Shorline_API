export function randomInteger(min: number, max: number) {
    return Math.round(Math.random() * (max - min + 1) + min);
}