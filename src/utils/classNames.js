/**
 * Функция для удобной конкатенации классов
 * @param {string} cls - Сам класс
 * @param {Object.<string, (boolean|string)>} mods - Его дополнения вида Record<string, boolean | string>
 * @param {string[]} additional - Массив дополнительных классов
 * @returns {string} - То что пойдет в className
 */
const classNames = ({cls, mods= {}, additional = []})  => {
    return [
        cls,
        ...additional,
        ...Object.keys(mods).filter(className => mods[className])
    ].join(' ')
}

export default classNames;