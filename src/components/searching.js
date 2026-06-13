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
        return data.filter((row)  => (row, state))
    }
}