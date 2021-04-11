<?php
/* Minimalisticky blog - varianta Karel
 * Petr Coupek 
 * 20.02.2021
 * 11.03.2020 
 */ 
 
session_start(); 

ini_set('default_charset','utf-8');
include_once 'is/lib/lib.php';
include_once 'is/lib/lib_bt.php';
include_once "is/lib/std_ini.php";
include_once "is/vendor/Parsedown.php";
/* database wrapper */
include_once "is/ini.php";

/** 
 * Konstanty spolecne pro oba moduly
 */ 
define("TAB_USER",'karel_uziv');
define("TAB_STAVY",'karel_stavy');
define("TAB_PRIKLADY",'karel_priklady');

/** Trida/modul realizujici blog vcetne logovani 
 */
class Blog {
    static $db;
    static $conn = DB_NAPOJENI;
    static $introductionFolder = "is/introductionTexts/";
    static $blogFolder = "is/blog/";
    static $introductionFiles = [
        "CS" => [
            "aboutKarel" => "aboutKarelCS.md",
            "karelControls" => "karelControlsCS.md",
            "karelAboutApp" => "karelAboutAppCS.md"
        ],
        "EN" => [

        ]
    ];

    static function kostra(){
        Microbe::set('header', 'Karel 3D');
        Microbe::set('debug', true);
        getparm();
        
        if(getpar('f') == 'json'){
            /* predavani parametru f s hodnotou json je REST-API */
            if (getpar('__ACCOUNT') != ''){
               /* dotaz na prihlaseni uzivatele pres JSON se dela zcela napred */
              Zdroje::json_response('{"Account": "'.
              ((isset($_SESSION['uzivatel']) && $_SESSION['uzivatel'] != '')?$_SESSION['uzivatel']:'').'"}');
            }elseif (getpar('__LOG') != ''){
               if ($jmeno = self::check_login()){ 
                /* prirazeni neni-li check false*/
                /* dosad uzivatelske jmeno do session */
                $_SESSION['uzivatel'] = $jmeno;
                /* misto linku na prihlaseni bude figurovat jmeno uzivatele */
              } else {
                Zdroje::json_response('{"Err":"Přihlášení se nezdařilo"}');
              }
            
            }else{
              self::$db = new OpenDB(self::$conn);
              Zdroje::json_kostra();
              self::$db->Close();          
            }  
            return 0;
        }
        
        /* zpracovani potvrzeni hesla ve formulari prihlaseni */
        if(getpar('__LOG') != ''){
            if ($jmeno = self::check_login()){ 
                /* prirazeni neni-li check false*/
                /* dosad uzivatelske jmeno do session */
                $_SESSION['uzivatel'] = $jmeno;
                /* misto linku na prihlaseni bude figurovat jmeno uzivatele */
            } else {
                htpr(self::dialog('Přihlášení se nezdařilo'));
            }
        }
        /* zpracovani logout */
        if (getpar('LOGOUT') == '1'){
            self::logout();   
        }   

        /* tyto akce vylucuji soucasne zobrazeni s blogem */  
        if(getpar('__CRE') != ''){
            self::form_create_user();   
        } elseif(getpar('__CUS') != ''){
            self::create_user();
        } elseif(getpar('__KAR') == '1'){
            /* predavani parametru slabel pak signalizuje praci se zaznamy stavu */
            self::$db = new OpenDB(self::$conn);
            Zdroje::kostra();
            self::$db->Close();
        } elseif(isset($_SESSION['uzivatel']) && $_SESSION['uzivatel'] != '' && getpar('__USD') != ''){
            self::create_user_dashboard();
        } else {    
            self::mainPage();
        } 
    
        /* nahrazeni hlavicky podle prihlaseni */
        Microbe::$htptemp = str_replace(
            '#LOGIN#',
            isset($_SESSION['uzivatel']) && $_SESSION['uzivatel'] != '' ?
                tg('a', 'href="javascript:void(0)" class="nav-dropdown" style="text-decoration: none; padding-right: 1rem;"',
                    tg('svg', 'aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-circle" class="svg-inline--fa fa-user-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"',
                        tg('path', 'fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"')
                    ).$_SESSION['uzivatel']
                ).
                tg('div', 'class="nav-dropdown-content" style="right: 0px;"', 
                    tg('a', 'href="?__USD=1"', 'Uložené stavy').
                    tg('a', 'href="?LOGOUT=1"', 'Odhlásit')
                )
                : 
                tg('a', 'href="javascript:void(0)" class="nav-dropdown"',
                    tg('svg', 'aria-hidden="true" focusable="false" data-prefix="far" data-icon="user-circle" class="svg-inline--fa fa-user-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"',
                        tg('path', 'fill="currentColor" d="M248 104c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 144c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm0-240C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-49.7 0-95.1-18.3-130.1-48.4 14.9-23 40.4-38.6 69.6-39.5 20.8 6.4 40.6 9.6 60.5 9.6s39.7-3.1 60.5-9.6c29.2 1 54.7 16.5 69.6 39.5-35 30.1-80.4 48.4-130.1 48.4zm162.7-84.1c-24.4-31.4-62.1-51.9-105.1-51.9-10.2 0-26 9.6-57.6 9.6-31.5 0-47.4-9.6-57.6-9.6-42.9 0-80.6 20.5-105.1 51.9C61.9 339.2 48 299.2 48 256c0-110.3 89.7-200 200-200s200 89.7 200 200c0 43.2-13.9 83.2-37.3 115.9z"')
                    )
                ).
                tg('div', 'class="nav-dropdown-content" style="right: 0px"', 
                    tg('form', 'method="post" action="?" id="loginForm"',
                        tg('a', 'href="javascript:void(0)" style="cursor: default"', 
                            tg('table', 'style="border-spacing:1rem"', 
                                ta('tr',
                                    ta('td',
                                        'Účet'
                                    ).
                                    ta('td',
                                        textfield('', 'LUSER', 20, 20, getpar('LUSER'), ' class="active-dropdown"')
                                    )
                                ).
                                ta('tr',
                                    ta('td',
                                        'Heslo'
                                    ).
                                    ta('td',
                                        tg('input', 'type="password" name="LPASS" class="active-dropdown"', '')
                                    )
                                )
                            )
                        ).
                        tg('a', 'href="javascript:document.getElementById(\'loginButton\').click();"',
                            tg('input', 'type="submit" name="__LOG" id="loginButton" value="Přihlášení" class="submit-dropdown"', 'noslash')
                        )  
                    ).
                    ahref('?__CRE=1', 'Založení účtu', '')        
                ),
            Microbe::$htptemp
        );
        if (getpar('f') != 'json') {
            htpr_all();
        };   
    }

    static function mainPageIntroduction(){
        htpr(
            tg('div', 'id="introduction"',
                tg('div', 'class="button" id="introductionButton" onclick="window.location.href = \'karel.html\'"', 'Programuj!')
            )
        );
    }

    static function karelIntroduction(){
        htpr(
            tg('div', 'id="aboutKarel" class="padded"',
                Parsedown::instance()->text(file_get_contents(self::$introductionFolder.self::$introductionFiles["CS"]["aboutKarel"]))
            )
        );
    }

    static function karelControls(){
        htpr(
            tg('div', 'id="karelControls" class="padded"',
                Parsedown::instance()->text(file_get_contents(self::$introductionFolder.self::$introductionFiles["CS"]["karelControls"]))
            )
        );
    }

    static function karelExercices(){
        $afile='aliases.txt';
        htpr('<div id="karelExercices" class="padded">');
        htpr(ta('h2', 'Příklady'));
        htpr('<section class="container">');
        $exerciceMainDirName = "is/examples";
        $exerciceMainDir = array_diff(scandir($exerciceMainDirName), ['..', '.',$afile]);
        if (is_file($exerciceMainDirName.'/'.$afile)){
          $aliases=file($exerciceMainDirName.'/'.$afile);
          $al=array();
          for($i=0;$i<count($aliases);$i++){
            $aliases[$i]=rtrim($aliases[$i]);            
            if (preg_match("/(.+)\. (.+)/", $aliases[$i],$m)){
              $al[$m[1]]=$m[2];
            }
          }
        }  
        sort($exerciceMainDir);
        foreach($exerciceMainDir as $exercicesDir){
            htpr('<div class="ac">');
            
            htpr(
                tg('input', 'class="ac-input" id="ac-'.$exercicesDir.'" name="ac-'.$exercicesDir.'" type="checkbox"', ''). 
                tg('label', 'class="ac-label" for="ac-'.$exercicesDir.'"', isset($al[$exercicesDir])?$al[$exercicesDir]:$exercicesDir)
            );
            htpr('<article class="ac-text">');
            
            $currentExerciceDir = array_diff(scandir($exerciceMainDirName.'/'.$exercicesDir), ['..', '.', 'intro.md']);
            sort($currentExerciceDir);
            if (is_file($fintro=$exerciceMainDirName.'/'.$exercicesDir.'/intro.md')){
              htpr(ta('p',Parsedown::instance()->text(file_get_contents($fintro))));
            }  
            foreach($currentExerciceDir as $exercice){
            
                if (!preg_match("/.+\.md/",$exercice)) continue;
                $exerciceName = substr($exercice, 0, strlen($exercice) - 3);
                $exerciceFile=file($exerciceMainDirName.'/'.$exercicesDir.'/'.$exercice);
                $header=$exerciceFile[0];
                unset($exerciceFile[0]);
                htpr(
                    tg('div', 'class="ac-sub"',
                        tg('input', 'class="ac-input" id="ac-'.$exerciceName.'" name="ac-'.$exerciceName.'" type="checkbox"', '').
                        tg('label', 'class="ac-label" for="ac-'.$exerciceName.'"', str_replace('#','',$header)).
                        tg('article', 'class="ac-sub-text"',
                            Parsedown::instance()->text(implode($exerciceFile))
                        )
                    )
                );
            }
            htpr('</article>');
            htpr('</div>');
        }
        htpr('</section>');
        htpr('</div>');
    }

    static function karelAboutApp(){
        htpr(
            tg('div', 'id="karelAboutApp" class="padded"',
                Parsedown::instance()->text(file_get_contents(self::$introductionFolder.self::$introductionFiles["CS"]["karelAboutApp"]))
            )
        );
    }

    static function createMainPage(){
        self::mainPageIntroduction();
        self::karelIntroduction();
        self::karelControls();
        self::karelExercices();
        self::karelAboutApp();
        self::createBlog();
    }

    /* zpracovani bud hlavni stranky a nebo konkretniho clanku */
    static function mainPage(){
        global $Zdroje;
        $r = $_REQUEST;
        if(count($r) == 0){
            self::createMainPage();
        } else {
            $k = array_keys($r);
            if(!self::clanek($k[0])){
                self::createMainPage();
            }
        }
    }
  
    static function createBlog(){
        htpr(
            tg('div', 'class="padded" id="blog"', 'noslash').
            tg('h2', 'class="forceH2"', 'Blog')
        );
        $a = scandir('is/clanky');
        $b = array();
        for($i = 0; $i < count($a); $i++){
            if(preg_match("/^(.+)\.md$/", $a[$i], $m)){
                if(is_file('is/clanky/'.$a[$i]) && is_readable('is/clanky/'.$a[$i])){
                    $b[$m[1]] = filectime('is/clanky/'.$a[$i]);
                }
            }    
        }
        /* b obsahuje vsechny pristupne md soubory ve slozce, 
            a casy jejich posledni upravy */
        //print_r($b);
        arsort($b,SORT_NUMERIC);
        //print_r($b);
        foreach($b as $k => $v){
            $f = fopen('is/clanky/'.$k.'.md','r');
            $n = 0;
            $text = '';
            /* nacti jen 5 radku */
            if ($f){
                while(($line = fgets($f)) !== false && $n++ < 5){
                    if($n == 1){
                        /* prvni radek - pridej link do nadpisu */
                        if (preg_match("/^(#+)(.*)$/",rtrim($line),$m)){
                            $line = $m[1].'['.$m[2].']'.'(?'.$k.')'."\n".
                            date("j.n.Y")."\n\n";
                        }
                    }
                    if(rtrim($line) != '') $text .= $line;
                }   
                fclose($f);
                $text .= '[celý text ...](?'.$k.')';
                htpr(Parsedown::instance()->text($text),br(),ta('hr', ''));
            }  
        }
        htpr(
            tg('/div', '', 'noslash')
        );
    }
  
    static function clanek($jm){
        $clanek = 'is/clanky/'.$jm.'.md';
        if(is_readable('is/clanky/'.$jm.'.md')){
            htpr(
                tg('div', 'class="padded" id="blog"', 
                    Parsedown::instance()->text(file_get_contents($clanek))
                )
            );
            return true;
        }
        return false;  
    }
  
    /** overi predane uzivatelske heslo */
    static function check_login(){
        $u = strtoupper(getpar('LUSER'));
        if($u != ''){
            self::$db = new OpenDB(self::$conn);
            /* try local database - sha1 imprints */
            self::$db->Sql(
            "select lpass, jmeno, prijmeni, aktivni from ".TAB_USER." "."where luser='$u'");
            if(self::$db->FetchRow()){   
                $DB=self::$db->DataHash();        
                self::$db->Close();
                if($DB['AKTIVNI'] == 0){
                    htpr(self::dialog('Váš účet není aktivní'));
                    return false;
                }
                if (strcmp(sha1(getpar('LPASS')),$DB['LPASS'])===0){
                    $_SESSION['prihlasen']=$DB['JMENO'].' '.$DB['PRIJMENI'];
                    return $u;
                }
            }
            self::$db->Close();
        }
        return false;  
    }
  
    static function logout(){
        $_SESSION['prihlasen'] = '';
        $_SESSION['uzivatel'] = '';
    }

    /** formular zalozeni uzivatele */
    static function form_create_user(){
        htpr(
            tg('div', 'class="padded"', 
                ta('h2', 'Založení uživatele').
                tg('form', 'method="post" action="?"',
                    tg('table', 'style="margin-right: auto; margin-left: auto"', 
                        ta('tr',
                            ta('td',
                                tg('label', 'for="JMENO"', 'Jméno ')
                            ).
                            ta('td',
                                textfield('', 'JMENO', 20, 40, getpar('JMENO'))
                            )
                        ).
                        ta('tr',
                            ta('td',
                                tg('label', 'for="PRIJMENI"', 'Příjmení')
                            ).
                            ta('td',
                                textfield('', 'PRIJMENI', 20, 20, getpar('PRIJMENI'))
                            )
                        ).
                        ta('tr',
                            ta('td',
                                tg('label', 'for="LUSER" ', 'Jméno účtu')
                            ).
                            ta('td',
                                textfield('', 'LUSER', 20, 20, getpar('LUSER'))
                            )
                        ).
                        ta('tr',
                            ta('td',
                                tg('label', 'for="LPASS"', 'Heslo ')
                            ).
                            ta('td',
                                tg('input', 'type="password" name="LPASS"', '')
                            )
                        ).
                        ta('tr',
                            ta('td',
                                tg('label', 'for="KEMAIL"', 'E-mail')
                            ).
                            ta('td',
                                textfield('', 'KEMAIL', 20, 40, getpar('KEMAIL'))
                            )
                        ).
                        ta('tr',
                            tg('td', 'colspan="2" style="text-align: center; padding: 1rem"',
                            submit('__CUS','Založení účtu','button')
                            )
                        )
                    )
                )
            )
        );
    } 
  
    /** zalozi uzivatele do DB */
    static function create_user(){
        self::$db = new OpenDB(self::$conn);
        if (($s=self::checking_input())!=''){
           htpr(self::dialog($s));
           self::form_create_user();
        }else{
           $prik = "insert into ".TAB_USER.
            " (luser,lpass,jmeno,prijmeni,kemail,aktivni) values (".         
            "'".strtoupper(getpar('LUSER'))."',".
            "'".sha1(getpar('LPASS'))."',".
            "'".getpar('JMENO')."',".
            "'".getpar('PRIJMENI')."',".
            "'".getpar('KEMAIL')."',1)";
           $ch = self::$db->Sql($prik);
           if($ch){
              htpr(self::dialog('Nepodařilo se vytvořit zadaného uživatele'));
              self::form_create_user();
           } else {
              htpr(self::dialog('Uživatel založen'));
              $_SESSION['uzivatel'] = strtoupper(getpar('LUSER'));
              self::mainPage();
           }
          self::$db->Close();     
        }  
    }

    static function checking_input(){
       $s='';
       if (getpar('LUSER')=='') $s.='Je třeba uvést uživatelské jméno. '.br();
       if (strlen(getpar('LPASS'))<5) $s.='Heslo musí mít alespoň pět znaků. '.br();
       if (getpar('JMENO')=='' || getpar('PRIJMENI')=='') $s.='Je třeba uvést jméno a příjmeni. '.br();
       if (!filter_var(getpar('KEMAIL'), FILTER_VALIDATE_EMAIL)) $s.='Neplatný e-mail.'.br();
       return $s;
    }
  
    static function dialog($text, $err=true){  
        return
            tg('div', 'class="Err-dialog" id="dialog"', 
                tg('div', 'class="Err-dialog-content"', 
                    tg('span', 'class="close" id="dialogClose"', '&times;').
                    ta('p', $text)
                )
            );            
    }   
    
    static function create_user_dashboard(){
        htpr('<div class="padded">',
            ta('h2', 'Uložené pozice uživatele '.$_SESSION['uzivatel'])
        );
        if (isset($_SESSION['uzivatel']) && $_SESSION['uzivatel']!=''){
            self::$db = new OpenDB(self::$conn);
            Zdroje::kostra();
            self::$db->Close();       
        }
        htpr('</div>');
    }
} 

/** 
 * Trida realizujici zapis a cteni stavu hry Karel
 */
class Zdroje{
    /** 
     * @param $db link na databazi, kde jsou udaje ulozene (trida OpenDB)
     */ 
    static $db;
  
    /**  
     * Tato metoda se vola pro routovani stavu objektu
     */
    static function kostra(){
        self::$db=Blog::$db;
        
        if(isset($_SESSION['uzivatel']) && $_SESSION['uzivatel'] != ''){  
            if (getpar('__STO') != '' && getpar('slabel') != ''){
                self::put_item(getpar('slabel'),getpar('SSOURCE'),'u');
            } elseif(getpar('__INS') != '' && getpar('slabel') != ''){
                self::put_item(getpar('slabel'),getpar('SSOURCE'),'i');  
            } elseif(getpar('__DEL') != '' && getpar('slabel') != ''){
                self::delete_item(getpar('slabel'));
            } elseif(getpar('__NEW') != ''){
                self::get_item('', true);          
            } elseif(getpar('slabel') != ''){
                self::get_item(getpar('slabel'), false);
            } elseif(getpar('__LIST') != ''){
                self::list_saves();
            } elseif(getpar('__LOG') != '') {
               if ($jmeno = Blog::check_login()){ 
                 /* prirazeni neni-li check false*/
                 /* dosad uzivatelske jmeno do session */
                 $_SESSION['uzivatel'] = $jmeno;
                 /* misto linku na prihlaseni bude figurovat jmeno uzivatele */
                 self::list_saves(); 
               } else {
                  self::json_response('{"Err":"Přihlášení se nepodařilo."}');
               } 
            } else {
                /* jen odkazy na jednotlive funkce */
                self::list_saves();
            }
        }
    } 
  
    static function json_kostra(){
        self::$db=Blog::$db;
        if (getpar('prid')){
            /* dotaz na verejne dostupny priklad */
            self::json_response(self::get_example(getpar('prid')));
            return 0;
        }

        /* ostatni polozky vyzaduji prihlaseni */
        if(isset($_SESSION['uzivatel']) && $_SESSION['uzivatel'] != ''){
            if(getpar('slabel') != '' && getpar('store') == '1'){
                self::json_response(self::put_item(getpar('slabel'), getpar('JSON'), '?', true));
            } elseif(getpar('slabel') != ''){
                self::json_response(self::get_item(getpar('slabel'), false, true));
            } else {
                self::json_response(self::list_saves('json'));
            }
        } else {
            self::json_response('{"Err":"Musíte být přihlášeni."}');    
        } 
    }
  
    static function json_response($text){
        header('Cache-Control: private, must-revalidate, max-age=0');
        header('Content-Encoding: gzip');
        header('Content-Type: application/json;charset=UTF-8'); /* jediny dovoleny format pro CORS*/ 
        echo gzencode($text);
    }
  
    /** 
     * zobrazi seznam ulozenych stavu
     */
    static function list_saves($format = ''){
        $stavy = self::$db->SqlFetchArray(
            "select slabel,strftime('%d.%m.%Y %H:%M',stime,'unixepoch') as TEXTTIME ".
            "from ".TAB_STAVY." ".
            "where luser='".$_SESSION['uzivatel']."' ".
            "order by stime desc");
        //htpr(ht_table('Uložené stavy',array('SLABEL'=>'Jméno','STIME'=>'Datum'),$stavy));
        if($format == 'json'){
            if (PHP_MAJOR_VERSION > 5){
                return json_encode($stavy, JSON_PRETTY_PRINT);
            } else {
                return json_encode($stavy);
            }       
        } else {
            if(count($stavy) > 0){
                for($i = 0; $i < count($stavy); $i++){
                    htpr($stavy[$i]['TEXTTIME'],nbsp(2),ahref('?__KAR=1&amp;slabel='.$stavy[$i]['SLABEL'], $stavy[$i]['SLABEL']), br());   
                }
            } else {
                htpr("Žádné pozice nebyly nalezeny.");
            }
        }    
    }
 
    /** 
     * ulozi stav pod nazvem 
     */ 
    static function put_item($item_label, $ssource, $action, $json=false){
        if($action = '?'){  /* over, zda vlozit novy stav nebo aktualizovat existujici */
            $je = self::$db->SqlFetch("select SLABEL ".
                "from ".TAB_STAVY." ".
                "where luser='".$_SESSION['uzivatel']."' ".
                "and slabel='$item_label'");
            $action = ($je == '') ? 'i' : 'u';            
        } 
        if($json){
        setpar('SSOURCE',file_get_contents('php://input'));
        /* viz https://stackoverflow.com/questions/18866571/receive-json-post-with-php */
        }
        if($action == 'u'){
            $prik = "update ".TAB_STAVY." ".
                "set ssource='".getpar('SSOURCE')."', stime=strftime('%s', 'now') ".
                "where slabel='".getpar('slabel')."' and luser='".$_SESSION['uzivatel']."'"; 
        } else {
            $prik = "insert into ".TAB_STAVY." ".
                "(luser, slabel, stime, ssource ) ".
                "values ('".$_SESSION['uzivatel']."','".getpar('slabel')."',".
                "strftime('%s', 'now'),'".getpar('SSOURCE')."')";
        }
        $res = self::$db->Sql($prik);
        if($res){
            //deb($prik);
            if($json){
                return '{"status": "Nastala chyba "'.self::$db->Error.'"}';     
            } else {
                htpr(Blog::dialog('Nastala chyba '.self::$db->Error));
            }  
        } else {
            if($json){
                return '{"status": "OK '.($action == 'u' ? 'Uloženo ' : 'Vloženo ').'}';
            } else {
                htpr(Blog::dialog($action == 'u' ? 'Uloženo ' : 'Vloženo ', false));
            }  
            $action = 'u';
        }
        if($json){
            return "{}";
        }
        self::get_item($item_label,$action == 'i');
    }
 
    /** 
     * smaze stav pod nazvem
     */
    static function delete_item($item_label){
        // TODO ??
    }
 
    /** 
     * nacte stav pod nazvem ja
     */
    static function get_item($item_label,$new=false,$json=false){
        if(!$new){
            $DB = self::$db->SqlFetchArray(
                "select stime,ssource,slabel ".
                "from ".TAB_STAVY." ".
                "where slabel='$item_label' ".
                "and luser='".$_SESSION['uzivatel']."'");
            $jsoudata = (count($DB) > 0);
        } else {
            /* tato vetev pocita se zobrazein prazdneho formulare */
            $jsoudata = false;
        }     
        if($json){
            if($jsoudata){
                return $DB[0]['SSOURCE'];
            }
            return '{}';
        }
    
        /* zobrazeni formulare */
        htpr('<div class="padded">');
        htpr(ta('h3', $jsoudata?$DB[0]['SLABEL'] : 'Nový stav'.' '),
            tg('form', 'method="post" action="?"',
                tg('div', 'class="container"',
                    ($new ?
                        tg('div', 'class="row"',
                            tg('div', 'class="col-6 text-left" ', 'Označení ').
                            tg('div', 'class="col-6 text-left" ',
                                textfield('', 'slabel', 20, 50, getpar('slabel')
                            )
                        )
                    ) 
                    : 
                    '').
                    tg('div', 'class="row"',
                        tg('div', 'class="col-12 text-left" ', 'Zdrojový kód ')
                    ).
                    tg('div', 'class="row"',    
                        tg('div', 'class="col-12"',   
                            textarea('', 'SSOURCE', 20, 40, $jsoudata?$DB[0]['SSOURCE']:getpar('SSOURCE'),'class="form-control"')
                        )
                    ).
                    tg('div', 'class="row"',     
                        tg('div', 'class="col-10 text-right"',
                            ($jsoudata ? submit('__STO','Uložit','btn btn-primary') : submit('__INS', 'Vložit', 'btn btn-primary')).
                            ($jsoudata ? para('slabel',getpar('slabel')) : '').
                            para('__KAR', '1')          
                        )
                    )
                )
            )
        );     
        htpr('</div>');           
    }
  
    /** 
     * vrati json prikladu pro nacteni do stranky Karla 
     */  
    static function get_example($prid){
        $DB = self::$db->SqlFetch(
            "select ssource ".
            "from ".TAB_PRIKLADY." ".
            "where ".(is_numeric($prid) ? "id=$prid " : "slabel='$prid'"));
        if($DB != ''){
            return $DB;
        }else{
            return '{}';
        }   
    } 
} 


Blog::kostra();
  
?>
