import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);
export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)
    .forEach((elementName) => {
      const selectElement = elements[elementName];
      if (selectElement) {
        // Очищаем существующие опции (на случай переинициализации)
        selectElement.innerHTML = '';
//
        // Добавляем опцию «Все» для возможности сброса фильтра
        const allOption = document.createElement('option');
        allOption.value = '';
        allOption.textContent = 'Все';
        selectElement.appendChild(allOption);

        // Добавляем опции из indexes
        Object.values(indexes[elementName])
          .map(name => {
            const elem = document.createElement('option');
            elem.textContent = name;
            elem.value = name;
            return elem;
          })
          .forEach(option => selectElement.appendChild(option));
      }
    });
    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        
        if (action && action.name === 'clear') {
            const input = document.parentElement.querySelector('input');
            if (input) {
                input.value = '';
            }
            const field = action.dataset.field;
            if (field) {
                state[field] = '';
            }
        }
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}