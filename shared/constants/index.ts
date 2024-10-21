export * from './restapi';
export * from './routes';

export const REGEX_ALPHANUMERIC = '^[a-zA-Z0-9]+$';
export const REGEX_ALPHANUMERIC_AND_SPACES = '^[a-zA-Z0-9 ]+$';
export const REGEX_NUMERIC_SPACE_PLUS_MINUS = '^([0-9+-]\\s?)+$';
export const REGEX_EMAIL = '^[\\d\\w._-]+@[a-z0-9.-]+\\.[a-z]{2,}$';
export const REGEX_PASSWORD = '^(.*)(([A-Z]+.*[0-9]+)|([0-9]+.*[A-Z]+))(.*){8,16}$';
export const REGEX_VIETNAMESE_CHARS = `ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ`;
export const REGEX_VIETNAMESE_CHARS_UPPER = `ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸ`;
export const REGEX_ALPHANUMERIC_VIETNAMESE_CAPITALIZED_WORDS = `^([A-Z${REGEX_VIETNAMESE_CHARS_UPPER}][a-zA-Z${REGEX_VIETNAMESE_CHARS}]*\\s?)+$`;
export const REGEX_NO_NUMBERS_SPECIAL = `^(([A-Z0-9${REGEX_VIETNAMESE_CHARS_UPPER}])[a-zA-z0-9${REGEX_VIETNAMESE_CHARS}.,/]*\\s?)+$`;
export const REGEX_ALPHANUMERIC_VIETNAMESE_WITH_SPACES_AND_UNDERSCORES = `^([A-Z0-9${REGEX_VIETNAMESE_CHARS_UPPER}][a-zA-Z0-9${REGEX_VIETNAMESE_CHARS}_/]*\\s?)+$`;
export const REGEX_ALPHANUMERIC_VIETNAMESE_SPACES_EXCLAMATION = `^[a-zA-Z0-9${REGEX_VIETNAMESE_CHARS}! ]+$`;
export const REGEX_TITLE_CASE_VIETNAMESE_WITH_SPACES = `^([A-Z${REGEX_VIETNAMESE_CHARS}][a-zA-z${REGEX_VIETNAMESE_CHARS}]*\\s?)+$`;
