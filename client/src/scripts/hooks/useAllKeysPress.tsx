import { useCallback, useEffect, useRef, useState } from "react";

interface Options {
  // масс.клвш. > нажатия
  userKeys: string[];
  // true - строгая послед.и точн.совпад.длины, false - любой порядок
  order?: boolean;
}

/**
 * Хук для отслеживания нажатия комбинации клавиш.
 * @param options объ.с настр.: `userKeys` и `order`
 * @returns true - комбинация успешно нажата, иначе false
 */
function useAllKeysPress({ userKeys, order = true }: Options): boolean {
  // соответствует
  const [matched, setMatched] = useState(false);
  // нажал
  const keysPressedRef = useRef<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // проверка нажатых клавиш с целевой последовательностью
  const checkMatch = useCallback(() => {
    // нажатая/целевая последовательность
    const pressedSequence = keysPressedRef.current;
    const targetSequence = userKeys;
    // РЕЖИМ 1: строгая последовательность и точное совпадение
    if (order) {
      // соответствие комбинаций на длину и позиции клавиш
      return (
        pressedSequence.length === targetSequence.length &&
        pressedSequence.every((key, index) => key === targetSequence[index])
      );
    }
    // РЕЖИМ 2: наличие всех клавиш без учета порядка
    else {
      // false при другой длине
      if (keysPressedRef.current.length !== userKeys.length) return false;

      // return userKeys.every((key) => keysPressedRef.current.includes(key));
      // улучш.проверка ч/з Set
      const targetSet = new Set(targetSequence);
      return pressedSequence.every((key) => targetSet.has(key));
    }
  }, [userKeys, order]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // пропуск событий без опред.ключа или повторяющиеся
      if (!e.key || e.repeat) return;

      // очистка пред.таймаут
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // добав.нажат.клвш(ниж.регистр) в сост.
      // const key = e.key.toLowerCase();
      keysPressedRef.current = [...keysPressedRef.current, e.key.toLowerCase()];

      // проверка совпадения комбинаций
      if (checkMatch()) {
        setMatched(true);
        // сброс с задержкой > реакции Комп.
        timeoutRef.current = setTimeout(() => {
          keysPressedRef.current = [];
          setMatched(false);
        }, 100);
        // return; // не вкл.таймер автоочистки
      }

      // автоочистка сост. ч/з 1.5 сек.бездействия
      timeoutRef.current = setTimeout(() => {
        keysPressedRef.current = [];
      }, 1500);
    };

    // const handleKeyUp = (e: KeyboardEvent) => {
    //   // Не удаляем сразу, чтобы успевать проверять комбинации
    // };

    window.addEventListener("keydown", handleKeyDown);
    // window.addEventListener("keyup", handleKeyUp);

    // fn очистки эффекта
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // window.removeEventListener("keyup", handleKeyUp);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [userKeys, order, checkMatch]);

  return matched;
}

export default useAllKeysPress;
