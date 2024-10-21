import * as dayjs from 'dayjs';
import { ManipulateType } from 'dayjs';
import 'dayjs/locale/vi';
import * as advanced from 'dayjs/plugin/advancedFormat';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as duration from 'dayjs/plugin/duration';
import * as isBetween from 'dayjs/plugin/isBetween';
import * as localeData from 'dayjs/plugin/localeData';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import * as objectSupport from 'dayjs/plugin/objectSupport';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import * as weekday from 'dayjs/plugin/weekday';

import { FormService } from '#shared/services';
import { E_FieldType, I_NormalizeExtra, I_QueryVariables, I_TableState, T_Any } from '#shared/types';

// #region DATETIME
dayjs.extend(weekday);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(advanced);
dayjs.extend(duration);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(objectSupport);
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(relativeTime);
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

export const isDateValid = (str = '', format = '', strict = true) => {
    if (!str) {
        return false;
    }

    const input: T_Any = [];

    input.push(str);

    if (format) {
        input.push(format);
        input.push(strict);
    }

    return dayjs(...input).isValid();
};

export const formatDate = (
    input,
    { format = 'DD/MM/YYYY', locale = 'vi', timezone = 'Asia/Ho_Chi_Minh' }: T_Any = {},
) => {
    if (!input) {
        return '';
    }

    if (locale) {
        dayjs.locale(locale);
    }

    let dateObject = dayjs(input);

    if (timezone) {
        dateObject = dateObject.tz(timezone);
    }

    if (dateObject.isValid()) {
        return dateObject.format(format);
    }

    return input;
};

export const getDuration = (startTime = new Date(), endTime: T_Any, { format }: T_Any) => {
    return dayjs.duration(dayjs(endTime, format).diff(dayjs(startTime)));
};

export const isDateBetween = (date: T_Any, startDate: T_Any, endDate: T_Any) => {
    return dayjs(date).isBetween(dayjs(startDate), dayjs(endDate), null, '[]');
};

export const isTimeBetween = (time: T_Any, startTime: T_Any, endTime: T_Any) => {
    const startDate = new Date(time.getTime());
    startDate.setHours(startTime.split(':')[0]);
    startDate.setMinutes(startTime.split(':')[1]);
    startDate.setSeconds(startTime.split(':')[2]);

    const endDate = new Date(time.getTime());
    endDate.setHours(endTime.split(':')[0]);
    endDate.setMinutes(endTime.split(':')[1]);
    endDate.setSeconds(endTime.split(':')[2]);

    return startDate <= time && endDate >= time;
};

export const fromNow = (input: T_Any) => {
    return dayjs(input).fromNow();
};

/**
 * Adds time to a date and returns a new `dayjs` object
 *
 * @param date - The date to add time to
 * @param amount - The amount of time to add (e.g. 1 for 1 second, 5 for 5 minutes, etc.)
 * @param unit - The unit of time to add (e.g. 'second', 'minute', 'hour', etc.)
 * @returns A new `dayjs` object with the added time
 */
export const addTimeToDate = (date: Date, amount: number, unit: dayjs.OpUnitType): dayjs.Dayjs => {
    return dayjs(date).add(amount, unit as ManipulateType);
};

export const dayJS = dayjs;

export const toPythonDate = (input) => {
    const date = new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const timezoneOffset = -date.getTimezoneOffset();
    const timezoneOffsetHours = Math.floor(Math.abs(timezoneOffset) / 60)
        .toString()
        .padStart(2, '0');
    const timezoneOffsetMinutes = Math.abs(timezoneOffset) % 60;

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezoneOffset >= 0 ? '+' : '-'}${timezoneOffsetHours}:${String(timezoneOffsetMinutes).padStart(2, '0')}`;

    return formattedDate;
};
// #endregion

export const toPascalCase = (str: string): string => {
    return str.replace(/(\w)(\w*)/g, (_, first, rest) => {
        return first.toUpperCase() + rest.toLowerCase();
    });
};

export const getKeyByValue = (object, value) => {
    return Object.keys(object).find((key) => object[key] === value);
};

export const loadScript = (url: string) => {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
};

export const translateData = (data, currentLanguage: string, key?: string) => {
    const foundTranslation = data?.translations?.find((t) => t?.languageCode === currentLanguage);

    if (key) {
        return foundTranslation?.[key] ?? data?.[key] ?? '';
    }

    return foundTranslation ?? data ?? '';
};

export const isFormHasValue = (form) => {
    return !!form && Object.values(form).some((v) => v !== undefined && v !== null && v !== '');
};

export const getFormValue = (form) => {
    return (
        !!form &&
        Object.entries(form).length > 0 &&
        Object.entries(form).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = value;
            }

            return acc;
        }, {})
    );
};

export const getQueryVariables = ({
    variables,
    page = 1,
    pageSize = 10,
}: {
    variables?: I_QueryVariables;
    page?: number;
    pageSize?: number;
}) => {
    const {
        pageIndex: pageIndexVariable,
        pageSize: pageSizeVariable,
        orderRandom,
        orderBy,
        excludeIdList,
        ...rest
    } = variables ?? {};
    const currentPage = pageIndexVariable ? pageIndexVariable + 1 : page;
    const currentPageSize = pageSizeVariable ? pageSizeVariable : pageSize;

    return {
        first: currentPageSize,
        ...getFormValue(rest),
        ...(orderBy ? { orderBy } : {}),
        ...(orderRandom
            ? { orderRandom: true }
            : {
                  after: ((currentPage - 1) * currentPageSize - 1).toString(),
              }),
        ...(excludeIdList ? { excludeIdList } : {}),
    };
};

export const normalizeWithPagination = <D>(data, extra?: I_NormalizeExtra): I_TableState<D> => {
    const currentPage = Math.round(data?.pageInfo?.endCursor / data?.edges?.length);
    const currentPageSize = data?.edges?.length;
    const extraPageIndex = extra?.variables?.pageIndex;
    const extraPageSize = extra?.variables?.pageSize;
    const dataMapped = data?.edges?.map((e) => e?.node)?.filter(Boolean) ?? [];

    return {
        data: dataMapped,
        pagination: {
            ...data.pageInfo,
            ...(data.pageInfo.hasNextPage
                ? {
                      page: currentPage,
                      pageSize: currentPageSize,
                  }
                : {
                      page: extraPageIndex ? extraPageIndex + 1 : 1,
                      pageSize: extraPageSize ? extraPageSize : currentPageSize,
                  }),
            totalCount: data?.totalCount ?? dataMapped.length,
        },
    };
};

export const makeTableCellClamp = (styles, numberOfLines = 3) => {
    return {
        ...styles,
        overflow: 'hidden',
        display: '-webkit-box',
        'word-wrap': 'break-word',
        'text-overflow': 'ellipsis',
        '-webkit-line-clamp': numberOfLines,
        '-webkit-box-orient': 'vertical',
    };
};

export const getFileName = (url: string, extension = false): string => {
    const parts = url.split('/');

    let fileNameWithExtension = parts[parts.length - 1];

    if (!extension) {
        const indexOfDot = fileNameWithExtension.lastIndexOf('.');

        if (indexOfDot !== -1) {
            fileNameWithExtension = fileNameWithExtension.slice(0, indexOfDot);
        }
    }

    return fileNameWithExtension;
};

export const getFileType = (url: string): string => {
    const parts = url.split('/');

    const fileNameWithExtension = parts[parts.length - 1];

    const indexOfDot = fileNameWithExtension.lastIndexOf('.');

    if (indexOfDot !== -1) {
        return fileNameWithExtension.slice(indexOfDot + 1);
    }

    return '';
};

export const fetchFile = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    const blob = await response.blob();

    return blob;
};

export const asyncMap = async <T, U>(
    array: T[],
    callback: (item: T, index: number, array: T[]) => Promise<U>,
): Promise<U[]> => {
    const results: U[] = [];
    for (let i = 0; i < array.length; i++) {
        results.push(await callback(array[i], i, array));
    }
    return results;
};

export const getFile = async (file: string | File): Promise<File> => {
    if (!file) {
        return null;
    }

    if (file instanceof File) {
        return file;
    }

    const fileBlob = await fetchFile(file);

    return new File([fileBlob], file, {
        type: fileBlob.type,
    });
};

export const getFiles = async (urls: string[]): Promise<File[]> => {
    const files = await asyncMap(urls, async (url) => await getFile(url));

    return files;
};

export const getRandomArrayItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const shuffleArray = (arr) => {
    const newArr = arr.slice();

    for (let i = newArr.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }

    return newArr;
};

export const formatMoney = (
    amount,
    { currency = 'VNĐ', decimalCount = 0, decimal = '.', thousands = ',' }: T_Any = {},
) => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? '-' : '';

        const i: T_Any = parseInt((amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))).toString();
        const j = i.length > 3 ? i.length % 3 : 0;

        return (
            negativeSign +
            (j ? i.substr(0, j) + thousands : '') +
            i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
            (decimalCount
                ? decimal +
                  Math.abs(amount - i)
                      .toFixed(decimalCount)
                      .slice(2)
                : '') +
            ` ${currency}`
        );
    } catch {
        throw new Error('Money format is fail!');
    }
};

export const reverseFormatMoney = (moneyString: string | number): number => {
    if (!moneyString) {
        return 0;
    }
    const stringToConvert = moneyString.toString();
    const cleanedString = stringToConvert.replace(/[^\d.-]/g, '');

    return parseFloat(cleanedString) || 0;
};

export const deepUpdate = (oldData, newData) => {
    for (let i = 0; i < newData.length; i++) {
        if (typeof newData[i] === 'object' && newData[i] !== null) {
            if (!oldData[i]) {
                oldData[i] = newData[i];
            } else {
                deepUpdate(oldData[i], newData[i]);
            }
        } else {
            if (oldData[i] !== newData[i]) {
                oldData[i] = newData[i];
            }
        }
    }
};

export const omit = (obj, keys) => {
    return Object.keys(obj).reduce((acc, key) => {
        if (!keys.includes(key)) {
            acc[key] = obj[key];
        }

        return acc;
    }, {});
};

export const initializeDynamicFields = (forms: FormService[]): void => {
    forms.forEach((formService) => {
        formService.config.forEach((config) => {
            if (config.fieldType === E_FieldType.DYNAMIC) {
                const formArray = formService.getDynamicFields(config.name);
                if (formArray && formArray.length === 0) {
                    formService.createDynamicField(config);
                }
            }
        });
    });
};
