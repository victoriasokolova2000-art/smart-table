import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const comparator = createComparison({
        skipEmptyTargetValues: true,
        rules: [
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
        ]
    });
    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        if (!action || action.name !== 'search') {
        return data; // Если нет действия поиска, возвращаем данные без изменений
        }

        const searchValue = action.value;

        // Применяем компаратор для фильтрации данных по поисковому запросу
        return data.filter(item => comparator(item, searchValue));
    }
}