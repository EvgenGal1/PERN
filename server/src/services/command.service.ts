import { Op } from 'sequelize';

import CommandModel from '../models/CommandModel';
import { RoleLevels } from '../types/role.interface';

interface FormattedCommand {
  name?: string;
  keys: string[];
  type: 'sequence' | 'simultaneous' | 'touchpad';
}

class CommandService {
  /** получ.масс. кмд./комбин. доступных Пользователю по его Роли/Уровню */
  async getAvailableCommands(
    userRoles: RoleLevels[],
  ): Promise<FormattedCommand[]> {
    // е/и нет Ролей, нет и кмд./комбин.
    if (!userRoles || userRoles.length === 0) return [];

    // настр.услов.ч/з ИЛИ где кмд./комбин. <= по Уровню в своёй Роли
    const orConditions = userRoles.map((role) => ({
      requiredRole: role.role,
      requiredLevel: { [Op.lte]: role.level },
    }));

    // req кмд./комбин.из БД
    const commands = await CommandModel.findAll({
      where: { isActive: true, [Op.or]: orConditions },
      attributes: ['name', 'keyCombination'],
    });

    // формат.данн.под Front по типу - "availableCommands": [ { "name": "dov_menu_on", "keys": ["d","o","p","m","n"], "type": "sequence" }, ... ]
    const formattedCommands: FormattedCommand[] = commands.map((cmd) => {
      const combo = cmd.keyCombination as FormattedCommand;
      return { name: cmd.name, keys: combo.keys, type: combo.type };
    });

    return formattedCommands;
  }
}

export default new CommandService();
