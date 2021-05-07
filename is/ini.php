<?php
  /** 
   * Database setting file
   * Author: Vojtěch Čoupek 
   */ 

/* napojeni na testovacim reseni */


include_once "is/lib/libdbSQLite.php";
class OpenDB extends OpenDB_SQLite{}
define("DB_NAPOJENI",'file=is/data/karel.sqlite3,mode=1');


/* napojeni na serverovem reseni */
 
//include_once "lib/libdbMySQL.php";
//class OpenDB extends OpenDB_MySQL{}
//define("DB_NAPOJENI","ser=******;db=*****;uid=******;pwd=********");

?>
