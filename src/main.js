import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

// @todo: подключение
import {initSearching} from "./components/searching.js";
import {initFiltering} from "./components/filtering.js";
import {initSorting} from "./components/sorting.js";
import {initPagination} from "./components/pagination.js";
import {initTable} from "./components/table.js";

// Исходные данные используемые в render()
const api = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);    // приведём количество страниц к числу
    const page = parseInt(state.page ?? 1);                // номер страницы по умолчанию 1 и тоже число
    const totalFrom = state.totalFrom ? parseFloat(state.totalFrom) : undefined;
    const totalTo = state.totalTo ? parseFloat(state.totalTo) : undefined;
    const total = [totalFrom, totalTo];
    return {                                            // расширьте существующий return вот так
        ...state,
        rowsPerPage,
        page,
        total,
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState(); // состояние полей из таблицы
     let query = {
        page: state.page,
        limit: state.rowsPerPage,
        search: state.search || '',
        sellerId: state.seller || undefined,
        customerId: state.customer || undefined,
        totalRange: state.total
    }; // копируем для последующего изменения

    const { total, items } = await api.getRecords(query);

    console.log(`Получено записей: ${items.length} из ${total}`);
    // @todo: использование
    result = applySearching(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);

    sampleTable.render(result)
}

async function initApp() {
    indexes = await api.getIndexes();

    const sampleTable = initTable({
        tableTemplate: 'table',
        rowTemplate: 'row',
        before: ['search', 'header', 'filter'],
        after: ['pagination']
    }, render);

    const appRoot = document.querySelector('#app');
    if (appRoot) {
        appRoot.appendChild(sampleTable.container);
    } else {
        console.error('#app не найден в DOM');
        return;
    }

    // @todo: инициализация
    const applySearching = initSearching('search');

    const applySorting = initSorting([        // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
        sampleTable.header.elements.sortByDate,
        sampleTable.header.elements.sortByTotal
    ]);

    const applyFiltering = initFiltering(sampleTable.filter.elements, {    // передаём элементы фильтра
        searchBySeller: indexes.sellers                                    // для элемента с именем searchBySeller устанавливаем массив продавцов
    });

    const applyPagination = initPagination(
        sampleTable.pagination.elements,             // передаём сюда элементы пагинации, найденные в шаблоне
        (el, page, isCurrent) => {                    // и колбэк, чтобы заполнять кнопки страниц данными
            const input = el.querySelector('input');
            const label = el.querySelector('span');
            input.value = page;
            input.checked = isCurrent;
            label.textContent = page;
            return el;
        }
    );
    await render();
}

initApp().catch(err => {
    console.error("Ошибка инициализации приложения:", err);
});
