import { normalTheme } from './normal.js';
import { winterTheme } from './winter.js';
import { halloweenTheme } from './halloween.js';
import { valentinesTheme } from './valentines.js';
import { springTheme } from './spring.js';
import { summerTheme } from './summer.js';
export * from './types.js';
export const themes = {
    normal: normalTheme,
    winter: winterTheme,
    halloween: halloweenTheme,
    valentines: valentinesTheme,
    spring: springTheme,
    summer: summerTheme,
};
export function getTheme(name) {
    return themes[name] ?? normalTheme;
}
export function getSeasonalTheme() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    for (const theme of Object.values(themes)) {
        if (!theme.dateRange)
            continue;
        const { start, end } = theme.dateRange;
        if (start.month <= end.month) {
            if ((month > start.month || (month === start.month && day >= start.day)) &&
                (month < end.month || (month === end.month && day <= end.day))) {
                return theme;
            }
        }
        else {
            if (month > start.month ||
                (month === start.month && day >= start.day) ||
                month < end.month ||
                (month === end.month && day <= end.day)) {
                return theme;
            }
        }
    }
    return normalTheme;
}
export function getAllThemes() {
    return Object.values(themes);
}
