// подкл.`общий фонд` из pg
const Pool = require("pg").Pool;
// созд.объ.кл.Pool для запросов к БД, куда передаём объ. для настр.
const pool = new Pool({
  // польз.подкл.к БД,пароль от СУБД,host,port по умолч при устан 5432,назв.БД
});

module.exports = pool;
