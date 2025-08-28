import { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../../context/AppContext";
import { commandBus } from "./commandBus";

/** Хук > подписка на события и обработка сработаных команд/комбинаций */
export const useCommands = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  const handleCommand = useCallback(
    (commandName: string) => {
      console.log(`[GlobalCommandHandler] Получена команда: ${commandName}`);
      switch (commandName) {
        // кмд.откр.доп.меню
        case "dop_menu_on":
          console.log("[useGlobalKeyboardCommands] Открытие доп.меню");
          try {
            // обнов.сост.в LS
            localStorage.setItem("--dopMenu", JSON.stringify(true));
            // уведомл. Header ч/з commandBus о спец.событии (т.к. Header.addEventListener.storage не обнов.доп.меню)
            commandBus.emit("dop_menu_state_change", true);
          } catch (e) {
            console.error(
              "[useGlobalKeyboardCommands] Ошибка при сохранении '--dopMenu' в LS",
              e
            );
          }
          break;

        case "dop_menu_off":
          console.log("[useGlobalKeyboardCommands] Закрытие доп. меню");
          try {
            localStorage.setItem("--dopMenu", JSON.stringify(false));
            commandBus.emit("dop_menu_state_change", false);
          } catch (e) {
            console.error(
              "[useGlobalKeyboardCommands] Ошибка при сохранении '--dopMenu' в LS",
              e
            );
          }
          break;

        case "admin_panel":
          if (user.isAuth && user.roles.some((r) => r.role === "ADMIN")) {
            console.log("[GlobalCommandHandler] Переход на /admin");
            navigate("/admin");
          } else {
            console.log("[GlobalCommandHandler] Команда 'adm' недоступна");
          }
          break;

        case "quick_logout":
          console.log("[GlobalCommandHandler] Быстрый выход");
          user.logout();
          break;

        case "scroll_up":
          window.scrollBy({ top: -100, behavior: "smooth" });
          break;

        case "scroll_down":
          window.scrollBy({ top: 100, behavior: "smooth" });
          break;

        default:
          console.log(
            `[GlobalCommandHandler] Неизвестная команда: ${commandName}`
          );
      }
    },
    [navigate, user.isAuth, user.roles, user.logout]
  );

  /** подписка на кмд. ч/з commandBus при монтировании */
  useEffect(() => {
    console.log("[useGlobalKeyboardCommands] Подписка на команды");
    // подписка на все команды
    const unsubscribe = commandBus.subscribe(handleCommand);
    // очистка usEf и отписка от commandBus при размонтировании
    return () => {
      console.log("[useGlobalKeyboardCommands] Отписка от команд");
      unsubscribe();
    };
  }, [handleCommand]);
};
