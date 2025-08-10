// ^ обраб.ошб. Sequelize/PostgreSQL > формат./логг.

interface LoggableError extends Error {
  parent?: {
    name?: string;
    message?: string;
    length?: number;
    severity?: string;
    code?: string;
    detail?: string;
    hint?: string;
    position?: string;
    internalPosition?: string;
    internalQuery?: string;
    where?: string;
    schema?: string;
    table?: string;
    column?: string;
    dataType?: string;
    constraint?: string;
    file?: string;
    line?: string;
    routine?: string;
  };
  sql?: string;
  parameters?: any;
}

/** формат./логг.ошб. Sequelize/PostgreSQL. param - СМС, error */
export function logDatabaseError(prefix: string, error: unknown) {
  // расшир.приведение типа
  const err: LoggableError =
    typeof error === 'object' && error !== null
      ? (error as LoggableError)
      : new Error(String(error));

  console.error(`--- ${prefix} ---`);

  // перед логг.проверка if от undf
  if (err.name) console.error(`\tИмя ошибки: ${err.name}`);
  if (err.message) console.error(`\tСообщение: ${err.message}`);
  if (err.parent) {
    if (err.parent.name) console.error(`\tТип ошибки PG: ${err.parent.name}`);
    if (err.parent.code) console.error(`\tКод PostgreSQL: ${err.parent.code}`);
    if (err.parent.severity)
      console.error(`\tСтрогость: ${err.parent.severity}`);
    if (err.parent.detail) console.error(`\r\nДетали: ${err.parent.detail}`);
    if (err.parent.hint) console.error(`\tПодсказка: ${err.parent.hint}`);
  }
  if (err.sql) {
    // раздел.стр.на масс.с эл.2 по переносу строки
    const sqlLines = err.sql.split('\n');
    // е/и есть вывод.перв.эл.со смещением
    if (sqlLines[0]) console.error(`\tSQL : ${sqlLines[0]}`);
    // взять след.10 стр.(SQL в столбец)
    const nextLines = sqlLines.slice(1, 11);
    // е/и не пусто
    if (nextLines.length > 0) {
      // очистка пробелов, фильтрация пустых стр., склейка ч/з пробел
      const formattedNextLines = nextLines
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join(' ');
      // е/и есть вывод стр.с 2ым смещением
      if (formattedNextLines) console.error(`\t\t${formattedNextLines}`);
    }
  }
}
