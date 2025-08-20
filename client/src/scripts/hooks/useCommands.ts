// hooks/useCommands.ts
import { useCallback, useContext, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { AppContext } from "../../context/AppContext";
import { useCommandListener } from "./useCommandListener";
import { AvailableCommands, CommandConfig } from "@/types/user.types";

interface UseCommandsProps {
  /** сост.видимости доп.меню */
  setIsDopMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Хук > управления командами/комбинациями
 * получает кмд.из user.availableCommands, преобразует в CommandConfig[], вызывает useCommandListener с передачей config > отслеживания, отложенно сохраняет в LS
 */
export const useCommands = ({ setIsDopMenuVisible }: UseCommandsProps) => {
  const { user } = useContext(AppContext);

  /** отложен.сохр.(от частых записей) в LS */
  const debouncedSaveToLS = useMemo(
    () =>
      debounce((value: boolean) => {
        try {
          localStorage.setItem("--dopMenu", JSON.stringify(value));
        } catch (e) {
          console.error("[useCommands] не удалось сохранить 'dopMenu' в LS", e);
        }
      }, 300),
    []
  );

  /** общ.обраб.отработки кмд. - действие */
  const handleCommandTriggered = useCallback(
    (commandName: string) => {
      switch (commandName) {
        case "dop_menu_on":
          setIsDopMenuVisible(true);
          debouncedSaveToLS(true);
          break;
        case "dop_menu_off":
          setIsDopMenuVisible(false);
          debouncedSaveToLS(false);
          break;
        case "quick_logout":
          user.logout();
          break;
        default:
          console.log(`[useCommands] необработанная Команда: ${commandName}`);
      }
    },
    [setIsDopMenuVisible, debouncedSaveToLS]
  );

  /** созд. config с данн.кмд. и cd отработки. Зависит от внутр.данн.user */
  const commandConfigs: CommandConfig[] = useMemo(() => {
    // проверка авторизации и команд
    if (user.isAuth !== true || user.availableCommands.length === 0) {
      console.log("[useCommands] нет Авторизации или Команды");
      return [];
    }

    // преобраз.кмд.в config > useCommandListener
    return user.availableCommands.map((command: AvailableCommands) => {
      const config: CommandConfig = {
        // база
        name: command.name,
        keys: command.keys,
        type: command.type,
        // cb обработчик на имя команды > реакции
        onMatch: () => handleCommandTriggered(command.name),
      };

      return config;
    });
  }, [user, user?.isAuth, user?.availableCommands, handleCommandTriggered]);

  /** инициализация слушателей клавиш с передачей config */
  useCommandListener({ commands: commandConfigs });

  /** очистка отлож.сохр.при размонтир.Комп. */
  useEffect(() => {
    return () => {
      debouncedSaveToLS.cancel();
    };
  }, [debouncedSaveToLS]);

  return null;
};
