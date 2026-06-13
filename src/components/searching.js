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
      // Если нет действия поиска, проверяем состояние поиска в state
      const searchValue = state[searchField] || '';
      if (!searchValue) return data; // Если строка поиска пустая, возвращаем все данные
      return data.filter(row => comparator(row, searchValue));
    }

    // Обрабатываем действие поиска
    const searchValue = action.value;
    if (!searchValue) return data; // Пропускаем фильтрацию, если строка поиска пустая

    return data.filter(row => comparator(row, searchValue));
  };
}