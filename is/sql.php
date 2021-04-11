<?php
/* SQL workbench
 * Petr Coupek 
 * 20.02.2021
 *  
 */ 
 
include_once "lib/lib.php"; /* nove aplikacni mikrojadro */
include_once "lib/std_ini.php";

class Sql {
  
  static function kostra($napojeni,$typ){
    getparm();
    htpr(
     tg('form','method="post" action="?" ',
      tg('div','class="container"',
        tg('div','class="row"',    
         tg('div','class="col-12"',  
           textarea('SQL command: [PHP ver.'.PHP_MAJOR_VERSION.']'.br(),
             'SQL',5,80,getpar('SQL'),'class="form-control"'))).
        tg('div','class="row"',    
         tg('div','class="col-11 text-right"',  
           submit('OK','OK'))))));
    if ($sql=getpar('SQL')){
      //$db=new OpenDB_MySQL($napojeni);
      $db=new OpenDB($napojeni);
      //deb($db);
      if (preg_match('/pragma\s+(.+)$/',$sql,$m)){
        htpr(ht_table('Pragma','',$db->Pragma($m[1])));
      }else{
        $res=$db->SqlFetchArray($sql);
        if ($db->Error==''){
           htpr(ht_table('Výsledek','',$res));
        }else{
           htpr($db->Error);
        }
        
      }    
      $db->Close();
    }
     /* nahrazeni hlavicky podle prihlaseni */
    Microbe::$htptemp=str_replace(
       '#LOGIN#',
       isset($_SESSION['uzivatel']) && $_SESSION['uzivatel']!=''?
       ahref('?LOGOUT=1','Odhlásit '.$_SESSION['prihlasen']):
       ahref('?LOGIN=1','Přihlášení') ,
       Microbe::$htptemp);
    
      
    htpr_all();
  }
  
}


$napojeni="ser=wh20.farma.gigaserver.cz;db=smallm_cz_knih;uid=smallm_cz;pwd=i_p_Rpd9Xu";
//$napojeni="ser=localhost;db=smallm_cz_knih;uid=smallm_cz;pwd=i_p_Rpd9Xu";
$typ_db='MySQL';
include_once "lib/libdbMySQL.php";
class OpenDB extends OpenDB_MySQL{}

/*$napojeni="file=data/karel.sqlite3,mode=1";
$typ_db='SQLite';
include_once "lib/libdbSQLite.php";
class OpenDB extends OpenDB_SQlite{}
*/
Microbe::set('header','SQL nástroj');
Microbe::set('debug',true);
Sql::kostra($napojeni,$typ_db);     

?>