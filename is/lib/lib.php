<?php
/** lib.php  - MicroBe core library
 * 
 \mainpage 
 *  
 * This file contains the framework's core essentials. The abstract class Microbe_core
 * is an abstranct startpoint for client-server functionality. The class Microbe could be
 * used directly or override with the real one. The set of basic global functions define
 * the basic functionality
 *  
 * @author Petr Čoupek
 * @package MicroBe
 * @version 1.1
 * @date 11.06.2020, 30.07.2020 21.09.2020
 * 11.11.2020 - upravy ht_table
 * 21.12.2020 - konsolidace
 * 12.1.2021 - uprava td - bez mezer
 * 14.1.2021 - bez id v input polich
 * 22.1.2021 - uprava ht_table, fce gl
 * 15.02.2021 - core variables, automatic title
 * 11.03.2021 - ht_table inicializace $n
 */

 /* pokud je namespace pro framework, volani globalnich objektu uvnitr pak zacina \ */

ini_set('default_charset','utf-8');
set_time_limit(0);

/** Abstract class with minimal core functionality. */

abstract class Microbe_core{
  static 
    $htpr,
    $htptemp, 
    $title, 
    $header, 
    $hthelp, 
    $errors, 
    $debug;
     /** constructor */
  function __construct(){
    self::$debug=false;
    self::$htptemp='';
    self::$errors='';
    self::$title='Microbe';
  }

  /** see global function ta() */ 
  static function ta($tagname,$content=''){
    if ($content ==''){
      return '<'.$tagname.'/>';
    }
    if ($content=='noslash'){
      return '<'.$tagname.'>';
    }
    return '<'.$tagname.'>'.$content.'</'.$tagname.'>'."\n";
  }

  /** see global function tg() */
  static function tg($tagname,$params='',$content='',$nopack=false){
    if ($params.$content==''){
      return '<'.$tagname.'/>';
    }
    if ($params!='') $params=' '.$params;
    if ($content=='noslash' && !$nopack){
       return '<'.$tagname.$params.'>';
    }
    if ($content=='' && !$nopack){
      return '<'.$tagname.$params.'/>'."\n";
    }else{
      return '<'.$tagname.$params.'>'.$content.'</'.$tagname.'>'."\n";
    }
  }
  
  /** Skeleton method
   * 
   * This method provide main execution lopp / entry point for an PHP script. 
   * Late binding functionality since PHP 5.3 is essential.
   * Skeleton provide controller functionality by calling route method. */ 

  static function skeleton($path='css/microbe.css'){
   self::set('htptemp',
   '<!DOCTYPE html>'."\n".
   self::ta('html',
    self::ta('head',
     self::tg('meta', 'http-equiv="Content-Type" content="text/html;" charset="utf-8"').
     self::ta('title','#TITLE#').
     self::tg('link','rel="stylesheet" media="screen" href="'.$path.'" type="text/css"')).
    self::tg('body','','#BODY#'.'#ERRORS#')));
   self::set('title','Generic Microbe page');
   self::set('header','No header');
   static::route();   /* slovo static zaruci Late static bindings */
  }
  
  /** Route method
   * 
   * This method routes the parametres. It is called from the skeleton.  */

  static public function route(){
    getparm();  /* minimal route is to call getparm() */
  }

  static function putht($htext){
    if (is_array($htext)) $htext=print_r($htext,true);
    self::$htpr.=$htext;
  }

  static function htpr_all(){
   if (self::$title=='') self::$title= self::$header;
   self::$htptemp=preg_replace('/#TITLE#/',self::$title ,self::$htptemp);
   self::$htptemp=preg_replace('/#HEADER#/',self::$header ,self::$htptemp);
   self::$htptemp=preg_replace('/#BODY#/',self::$htpr, self::$htptemp);
   self::$htptemp=preg_replace('/#HELP#/',self::$hthelp, self::$htptemp);
   self::$htptemp=preg_replace('/#___#/','', self::$htptemp);
   if (self::$debug) {
     self::$htptemp=preg_replace('/#ERRORS#/',
      tg('div','class="errors"',
      ' '.str_replace("\n",br(),
      str_replace(' ',nbsp(1),self::$errors),self::$errors)),self::$htptemp);
   }else{
     self::$htptemp=preg_replace('/#ERRORS#/','',self::$htptemp);
   }
   echo self::$htptemp;
  }
  
  static function htpr_replace($r,$s){
    self::$htpr=str_replace($r,$s,self::$htpr);
    //deb($r);deb($s);
    //deb(self::$htptemp);
  }

  static function set($k,$v){
    /* common setter for class variables */
    switch ($k){
      case 'htptemp': self::$htptemp=$v; break;
      case 'title'  : self::$title=$v; break;
      case 'header' : self::$header=$v; break;
      case 'hthelp' : self::$hthelp=$v; break;
      case 'debug'  : self::$debug=$v; break;
    }
  }

  static function getparm(){
    /* fill a hash with all input parameters */
    $DATA=array();
    if (count($_POST)>0 && count($_GET)==0 ){$DATA=$_POST;}
    if (count($_GET)>0 && count($_POST)==0 ){$DATA=$_GET;}
    if (count($_GET)>0 && count($_POST)>0 ){$DATA=array_merge($_GET,$_POST);}
    return $DATA;
  }
}

/** Microbe class
 * 
 * The real Microbe-based server-side application should extend class.
 * Methods skeleton and route are to override.
 */

abstract class Microbe extends Microbe_core{

  static function skeleton($path=''){
  self::set('htptemp','<!DOCTYPE html>'."\n".
   ta('html',
    ta('head',
     ta('title','Microbe').
     tg('meta','http-equiv="content-type" content="text/html; charset=utf-8"').
     tg('meta','name="language" content="cs"').
     tg('meta','name="viewport" content="width=device-width, initial-scale=1.0"').
     tg('meta','name="description" lang="cs" content="Aplikace ČGS"').
     tg('meta','name="keywords" lang="cs" content="MicroBe aplication framework"').
     tg('link','rel="stylesheet" media="screen,print" href="'.$path.'css/microbe.css?a=11" type="text/css" ','noslash').
     tg('link','rel="stylesheet" media="screen" href="'.$path.'css/microbe-jquery-ui.css?a=12" type="text/css" ',' ').
     tg('script','type="text/javascript" src="'.$path.'js/lib.js"',' ').
     //tg('script','type="text/javascript" src="'.$path.'js/calpopup.js?a=15"',' ').
     tg('script','type="text/javascript" src="'.$path.'js/jquery-1.12.4.min.js"',' ') //.
     //tg('script','type="text/javascript" src="'.$path.'js/jquery-ui.min.js"',' ').
     //tg('script','type="text/javascript" src="'.$path.'js/datepicker-cz.js"',' ')
     ).
     ta('body','#BODY#'.ta('hr','noslash')."(C) Česká geologická služba, 2020".
              '#ERRORS#')));

   static::route();   /* slovo static zaruci Late static bindings */
 }

}

/* global functions and global aliases */

/**
  * Global function: Autoload function
  * 
  * The core library lib.php defines and activates this function via spl_autoload_register.
  * The function provides autoload queue .
  * Incorporated parts/classes of the framework system are then instatnly available without using require statement.
  * Currently are suppoerted : Edit_table, View_table, OpenDB* classes and Cm class.
  * @param $class Class 
  * @return none */

function autoload_function($class){
  /* rizeny autoload jednotlivych modulu MicroBe - zakladni knihovny */
  $path=__DIR__; /* $path by mel obsahovat cestu z zakladni knihovne lib, ktera je nactena jeko prvni */
  //echo $path,";";  //puvodne $path='lib';
  $f=array('Edit_table'=>$path.'/tlib.php',
           'View_table'=>$path.'/slib.php',
           'OpenDB_Oracle'=>$path.'/libdbOracle.php',
           'OpenDB_MySQL'=>$path.'/libdbMySQL.php',
           'OpenDB_SQLite'=>$path.'/libdbSQLite.php',
           'OpenDB_ODBC'=>$path.'/libdbODBC.php',
           'Cm'=>$path.'/lib_cm.php'
         );
  foreach ($f as $k=>$v){
    if ($k==$class){
      require($v);  return 1;
    }
  }
  /* ostatni tridy jsou ve slozkach lib (systemove) nebo php (aplikacni) */
  if (file_exists('lib/'.$class.'.php')){
    require('lib/'.$class.'.php'); return 1;
  }
  if (file_exists($path.'/'.$class.'.php')){ /* pokud je path nenulova */
    require($path.'/'.$class.'.php'); return 1;
  }
  if (file_exists('php/'.$class.'.php')){
    require('php/'.$class.'.php'); return 1;
  }
}

spl_autoload_register("autoload_function");

set_error_handler(function($errno, $errstr, $errfile, $errline, $errcontext) {
    /* error was suppressed with the @-operator */
    if (0 === error_reporting()) {
        return false;
    }
    //htpr("$errstr, $errno, $errfile, $errline");
    Microbe::$errors.="$errstr, $errno, $errfile, $errline\n";
});

/* automaticky pokus o nahrani konfiguracniho souboru s globalnimi promennymi
    - lib.php by mel byt inkludovani na globalni urovni, komponenty pak mohou uzivat pole $GLOBALS */
if (file_exists('ini.php')) include_once 'ini.php';

/** The function "prints" the HTML content into a HTML buffer Microbe::$htptemp
  * 
  * Global shortcut for the internal method for creating a HTML output: It stores the conontent of it's parametres into
  * the $htptemp buffer, which is finally send to the standard output using htpr_all function.
  * @param ... one or more strings with a HTML content 
  */

function htpr(){
  for ($i = 0; $i < func_num_args(); $i++){
    Microbe::putht(func_get_arg($i));
  }
}

/** The function finalizes and echoes the script output. It is used only once in the response, typically at the end of the sript.
  * 
  * Global shortcut for the method Microbe::htpr_all(). It replaces all the #XXXX# marks with its real content, 
  * prints the parametres into * the $htptemp buffer, which is finally send to the standard output using "echo" .
  * No params.
  * @return none
  */

function htpr_all(){
  Microbe::htpr_all();
}

/** Replaces the already htpr - "printed" text $r with $s
 * @param $r - text to replace
 * @param $s - replacement
 */ 

function htpr_replace($r,$s){
  Microbe::htpr_replace($r,$s);
}

/** The function returns its parametres as a string
 *  @param ... one or more strings
 *  @return string
 */

function gl(){
  $r='';
  for ($i = 0; $i < func_num_args(); $i++){
    $r.=(string)func_get_arg($i);
  }
  return $r;
}

/** The function fills the global array $DATA with the both $_GET and $_POST parametres
 *  It publishes the $DATA hash as a global.
 *  No params.
 *  @return none
 */

function getparm(){
  global $DATA;
  $DATA=Microbe::getparm();
}

/** Debugging tool in the framework Prints debug information about a PHP variable.
  * 
  * Deb provides debugging messages. When $debug attribute in the controller class is set to true 
  * and the output html template contains '#ERRORS#' label, the result will be visible on the
  * processed page. The Debug ouput contains the exact place in the source code and the content of the variable
  * @param [object] $t any PHP variable to be printed - variable of any type (string, number, array, objects)
  */

function deb($t,$btrace=true){  /* funkce realizujici ladici vypisy */  
  $d=$btrace?debug_backtrace():'';  /* zjisti, odkud byla funkce deb zavolana */
  $s='';
  for ($i=0;isset($d[$i]);$i++){
    $s.=(isset($d[$i]['file'])?$d[$i]['file']:'').':'.
        (isset($d[$i]['function'])?$d[$i]['function']:'').':'.
        //(isset($d[$i]['method'])?$d[$i]['method']:'').':'.
        (isset($d[$i]['line'])?$d[$i]['line']:'').':'.
        "\n";
  }
  if (is_null($t)) {
    Microbe::$errors.=$s.'NULL'."\n";
    return;
  }
  if (is_bool($t)){
    Microbe::$errors.=$s.'[bool]:'.($t?'TRUE':'FALSE')."\n";
    return;
  }
  if (is_float($t)) {
    Microbe::$errors.=$s.'[float]:'.$t."\n";
  }  
  if (is_array($t) || is_object($t)) {
    Microbe::$errors.=$s.print_r($t,true)."\n";
    //return;
  }  
  if (is_string($t) ) {
    //Microbe::$errors.=$s."[string]:'".htmlentities($t,ENT_COMPAT | ENT_HTML401,'utf-8')."'\n";
    Microbe::$errors.=$s."[string]:'".htmlentities($t,ENT_COMPAT,'utf-8')."'\n";
    return; 
  } /* string je pak i skalar*/
  if (is_int($t)) {
    Microbe::$errors.=$s.'[int]:'.$t."\n";
    return;
  } /* int je pak i skalar */  
  if (is_resource($t)) {
    Microbe::$errors.=$s.'[resource]:'.$t."\n";
    return;
  }  
  if (is_scalar($t)) {
    Microbe::$errors.=$s.'[scalar]:'.$t."\n";
  }  
}

/** Sets the time-measure tool
 *  First call in the script starts the clok, the next calls display the time difference since
 *  the first call and optionally some text hwich can identify the call
 * @param text string   string to be printed in the debug area. 
 */ 

function tick($text=''){
  static $t;
  if (!isset($t)) $t=microtime(true);
  Microbe::$errors.=sprintf(" %2.4f s %s",microtime(true)-$t,$text."\n");
}


/* aliasy pro uzitecne globalne pouzitelne funkce */

/** Tag expression function.
   * 
   * The function a string which contains a tag expression. Ihis prevents using tags in source code at all.
   * @param $tagname string the name of the tag
   * @param $content string the internal content of the tag
   * @return string
*/   

function ta($tagname,$content=''){
  return Microbe::ta($tagname,$content);
}

 /** Tag with parameters expression function.
   * 
   * It returns a string which contains a tag expression with parametres. This prevents using tags in source code at all.
   * @param string $tagname  the name of the tag
   * @param string $params   the tag parametres in a string form [name]=[value] space delimited 
   * @param string $content='' the internal content of the tag
   * @param boolean $nopack when is true, the empty content do not simplyfy the tag into non-pair form 
   * @return string
   */ 

function tg($tagname,$params='',$content='',$nopack=false){
  return Microbe::tg($tagname,$params,$content,$nopack);
}

/* dalsi flobalni funkce */

/** The function returns HTML non-breaking spaces. 
 * @param number $count - how many, default=1 
 * @return string */

function nbsp($count=1){
  return str_repeat('&nbsp;',$count);
}

/** The function returns the HTML tag for the page-break.  
 * @param number $count - number of page-braks, default=1 
 * @return string */
 
function br($count=1){
  for($k='';$count--; $k.="<br>\n");
  return $k;
}

/** The function returns the HTML tag for a text input
 * @param string $label - label before the tag
 * @param string $name - the name of the input tag (name parameter in the form and also the id in the document)
 * @param number $size - the size in chars
 * @param number $maxl - the maximum allowed input size in chars
 * @param string $value - initial value in the text input
 * @param string $add - other added parametres in the tag (useful for javascript client-side functionality or styling) 
 * @return string */
 
function textfield($label,$name,$size,$maxl,$value,$add=''){
  if ($label!= '') {$p='&nbsp;';}else{$p='';}
  $value=str_replace('"',"&quot;",$value);
  return $label.$p.tg('input','type="text" name="'.$name.'" size="'.$size.'" '.
   'maxlength="'.$maxl.'" value="'.$value.'" '.$add);
}

/** The function returns the HTML tag for a text input, initial value is taken from a global $DB hash
 * @param string $label - label before the tag
 * @param string $name - the name of the input tag (name parameter in the form and also the id in the document)
 * @param number $size - the size in chars
 * @param number $maxl - the maximum allowed input size in chars
 * @param string $add - other added parametres in the tag (useful for javascript client-side functionality or styling) 
 * @return string */
 
function dbtext($label,$name,$size,$maxl,$add=''){
  global $DB;
  return textfield($label,$name,$size,$maxl,isset($DB[$name])?$DB[$name]:'',$add);
}

/** The function returns the HTML tag for a text area
 * @param string $label - label before the tag
 * @param string $name - the name of the input tag (name parameter in the form and also the id in the document)
 * @param number $rows - the number of rows
 * @param number $cols - the number of columns
 * @param string $value - initial value in the text area
 * @param string $add - other added parametres in the tag (useful for javascript client-side functionality or styling) 
 * @return string */
 
function textarea($label,$name,$rows,$cols,$value,$add=''){
  return $label.tg('textarea', 'name="'.$name.'" rows='.$rows.' cols='.$cols.' '.$add,$value,true);
}

/** The function returns the HTML tag for a text area, initial value is taken from a global $DB hash
 * @param string $label - label before the tag
 * @param string $name - the name of the input tag (name parameter in the form and also the id in the document)
 * @param number $rows - the number of rows
 * @param number $cols - the number of columns
 * @param string $add - other added parametres in the tag (useful for javascript client-side functionality or styling) 
 * @return string */
 
function dbtextarea($label,$name,$rows,$cols,$add=''){
  global $DB;
  return textarea($label,$name,$rows,$cols,
    isset($DB[$name])?(gettype($DB[$name])=="string"?$DB[$name]:$DB[$name]->load()):'',$add);
}

/** The function returns the HTML tag for a check box
 * @param string $label - label before the tag
 * @param string $name - the name of the input tag (name parameter in the form and also the id in the document)
 * @param string $value - the posted value, when the element is checked
 * @param string $add - other added parametres in the tag (useful for javascript client-side functionality or styling) 
 * @return HTML string */
 
function checkbox($label,$name,$value,$add=''){
  $value=str_replace('"',"&quot;",$value);
  $c=($value!='0' && $value!='' && $value!='N')?'checked':'';
  return $label.nbsp().tg('input','type="checkbox" name="'.$name.'" value="'.$value.'" '.$add.' '.$c);
}

/** The function returns the HTML tag for a check box
 * @param string $label - label before the tag
 * @param string $name - the name of the input tag (name parameter in the form and also the id in the document)
 * @param boolean $checked - the posted value, when the element is checked
 * @param string $add - other added parametres in the tag (useful for javascript client-side functionality or styling) 
 * @return HTML string */
 
function check_box($label,$name,$checked,$add=''){
  $c=($checked)?'checked':'';
  return $label.nbsp().tg('input','type="checkbox" name="'.$name.'" value="1" '.$add.' '.$c);
}

/** The function returns the HTML tag for a check box, value to be posted when checked is taken from a global $DB hash
 * @param string $label - label before the input
 * @param string $name - the name of the input tag (name parameter in the form and also the id in the document)
 * @param string $add - other added parametres in the tag (useful for javascript client-side functionality or styling) 
 * @return HTML string */
 
function dbcheckbox($label,$name,$add=''){
  global $DB;
  return checkbox($label,$name,isset($DB[$name])?$DB[$name]:'0',$add);
}

/** The function returns the HTML tag for a drop-down list of items, it can be dynamic from database or static list
 * @param string $label - label before the tag
 * @param string $name - the name of the input tag (name parameter in the form and also the id in the document)
 * @param string $connection - db connection string for dynamic list or empty string for static lists
 * @param string $sele - the word 'static' followed by a list of item=value or SQL command selecting items from DB
 * @param string $def - initial selected value in the list
 * @param string $js - other added parametres in the tag (useful for javascript client-side functionality or styling)
 * @param number $limit - maximal total count of items taken from the database source
 * @return HTML string */
 
function lov($label,$name,$connection,$sele,$def='',$js='',$limit=2000){
 $i=0;
 $klichodnota=array();
 $ret=$label.(($label!='')?'&nbsp;':'')."<select name=\"$name\" $js> ";
 
 /* staticky seznam */
 if (preg_match('/^static\s+(.*)$/',$sele,$m)){
   $pary=preg_split('/,/',$m[1]);
   foreach ($pary as $par){
     $klichodnota=preg_split('/=/',$par);
     $klic=$klichodnota[0];
     if (isset($klichodnota[1])){
       $hodnota=$klichodnota[1];
     }else{
       $hodnota='';
     }
     $klic=str_replace('&eq;','=',$klic);
     $hodnota=str_replace('&eq;','=',$hodnota);
     $hodnota=str_replace('"',"&quot;",$hodnota);
     $ret.="<option ";
     if ($klic==$def) {
       $ret.="selected ";
     }
     $ret.="value=\"$klic\">$hodnota</option>\n";
   }
   $ret=$ret."</select>\n";
   return $ret;
 }
 
 /* dynamicky seznam generovany z databaze */
 if (is_string($connection)) {
   $db=new OpenDB($connection);
 }elseif(is_object($connection)){
   $db=$connection;
 }else{
   $db=null;
 }  
 if ($db){
   $db->Sql($sele);
   $ret.="<option value=\"\">[]\n";  //prazdny radek
   while ($db->FetchRowA() && ($i<=$limit)){
     //print_r ($db->Data); break;
     $klic=$db->Data(0);
     $hodnota=$db->Data(1);
     $ret.="<option ";
     if ($klic==$def) {$ret=$ret."selected ";}
     $ret.="value=\"$klic\">$hodnota</option>\n";
     $i++;
   }
   $ret.="</select>\n";
 }
 if (is_string($connection)) $db->Close();
 return $ret;
}

/** The Function returns the HTML tag for a drop-down list, dynamic or static, initial value is taken from a global $DB hash
 * @param string $label - label before the tag
 * @param string $name - the name of the input tag (name parameter in the form and also the id in the document)
 * @param string $connection - db connection string for dynamic list or empty string for static lists
 * @param string $sele - the word 'static' followed by a list of item=value or SQL command selecting items from DB
 * @param string $js - other added parametres in the tag (useful for javascript client-side functionality or styling)
 * @param number $limit - maximal total count of items taken from the database source
 * @return HTML string */

function dblov($label,$name,$napojeni,$sele,$js='',$limit=1200){
  global $DB;
  return lov($label,$name,$napojeni,$sele,isset($DB[$name])?$DB[$name]:'',$js,$limit);
}

/** The Function returns the HTML tag for a radio box, value to be posted when checked is taken from a global $DB hash
 * @param string $label - label before the input
 * @param string $name - the name of the input tag (name parameter in the form and also the id in the document)
 * @param array  $list -  list of the items
 * @param string $def - default value (ommited)
 * @param string $js - another parametres in the tag
 * @return HTML string */
 
function dbradio($label,$name,$list,$def='',$js=''){
  global $DB;
  return jq_radiogroup($label,$name,$list,$DB[$name],$js);
}

/** The function returns a combo for conditions 
 * @param string $text - parameter text
 * @obsolete
 */ 
 
function parlov($text){
  return lov('',$text,'', rq('LOV'),'like');
}

/** returns HTML sequence useful for one line in the parametric form. Parametric form is used when subset of the data is specified.
 * @param string $label - label before the input query
 * @param string $par - the name of the parameter
 * @param string $pardb - the true name of the parameter in the database
 * @param string $type - type of the parameter - line behavioral. 
 * Possible values are 'E': general , 'S': combobox/list of cathegories, 'T': text, 'TT': text with case sensitivity option,
 * 'D': date,
 * @return HTML string */

function paramline($label,$par,$pardb,$typ="E"){
  $lov_all=lan(
  'static &eq;=&eq;,&lt;=&lt;,&lt;&eq;=&lt;&eq;,&gt;&eq;=&gt;&eq;,&gt;=&gt;,&lt;&gt;=&lt;&gt;,'.
  'like=contains,null=empty,not null=not empty,in=v,not in=not in',
  'static &eq;=&eq;,&lt;=&lt;,&lt;&eq;=&lt;&eq;,&gt;&eq;=&gt;&eq;,&gt;=&gt;,&lt;&gt;=&lt;&gt;,'.
  'like=obsahuje,null=je prázdné,not null=je neprázdné,in=v,not in=není v');
  $lov_number=lan(
  'static &eq;=&eq;,&lt;=&lt;,&lt;&eq;=&lt;&eq;,&gt;&eq;=&gt;&eq;,&gt;=&gt;,&lt;&gt;=&lt;&gt;',
  'static &eq;=&eq;,&lt;=&lt;,&lt;&eq;=&lt;&eq;,&gt;&eq;=&gt;&eq;,&gt;=&gt;,&lt;&gt;=&lt;&gt;');
  $lov_text=lan(
  'static like=contains,begins=begins,ends=ends,&eq;=&eq;',
  'static like=obsahuje,begins=začíná,ends=končí,&eq;=&eq;');
  // vychozi typ pro parametr je vse
  $lov=$lov_all; $default='like'; $add='';
  if ($typ=='E' || $typ==''){ //tj. typ nebyl zvolen
    if (preg_match('/<select /',$pardb)){
      $lov=$lov_number; $default='=';
    }
  }
  if ($typ=='S'){ //tj. typ combobox
    $lov=$lov_number; $default='=';
  }
  if ($typ=='T'){ //tj. typ jen text
    $lov=$lov_text; $default='like';
  }
  if ($typ=='TT'){ //tj. typ jen text
    $lov=$lov_text; $default='like';
    $add=checkbox(lan('Case Sensitivity','Citlivost:'),$par.'_uns',1);
  }
  if ($typ=='D'){ //datumova polozka
    $lov=$lov_number;
    $add='';
  }
  return trtd().$label.tdtd().lov('',$par.'_par','',$lov,$default).tdtd().
     $pardb.$add.trow();
}

/** The Function returns HTML sequence useful for one line in the parametric form in default/hidden format. 
 * Parametric form is used when subset of the data is specified.
 * @param string $label - label before the input query
 * @param string $par - the name of the parameter
 * @param string $pardb - the true name of the parameter in the database
 * @param string $hid_par - the value of the default parameter
 * @return HTML string */
 
function paramline_hidd($label,$par,$pardb,$hid_par){
  return trtd().$label.tdtd().
   tg('input','type="hidden" name="'.$par.'_par'.'" value="'.$hid_par.'"','noslash').tdtd().$pardb.trow();
}

/** The Function returns HTML tag with the hidden input tag  
 * @param string $name - the name of the hidden parameter
 * @parame string $value - the value of the hidden parameter 
 * @return string */
 
function para($name,$value){
  return "\n".tg('input','type="hidden" name="'.$name.'" value="'.$value.'"','noslash')."\n";
}

/** The Function returns HTML form submit button  
 * @param string $name - the name of the tag
 * @param string $value - the visible label on the button
 * @param string $class - the CSS class for special buttons
 * @return HTML string */
 
function submit($name,$value,$class='btn btn-primary'){
  if ($class=='ulozit' || $class=='vlozit' || $class=='smazat') {
    return tg('input','type="submit" title="'.$value.'" name="'.$name.'" value=" " '.'class="'.$class.'"','noslash');
  }elseif ($class=='' && false){
    return bt_submit($name,$value);
  }else{
    return tg('input','type="submit" name="'.$name.'" value="'.$value.'" title="'.$value.'" '.'class="'.
    ($class<>''?$class:'submit').'"','noslash');
  }
}

/** The Function returns a HTML form reset button  
 * @param string $class - the CSS class for special buttons
 * @return HTML string */
 
function subres($class='ui-button ui-widget ui-corner-all'){
  return tg('input type="reset" value="Reset" class="'.$class.'"');
}

/** The Function returns a HTML td tag for contruction HTML tables  
 * @param number $col - number of columns 
 * @param string $add - aditional parametres
 * @return HTML string */
 
function td($col='',$add=''){
  return tg('td',(($col<>'')?(' colspan="'.$col.'"'):'').($add<>''?(' '.$add):''),'noslash');
}

/** The Function returns a HTML sequence between two cells in the table  
 * @param number $col - number of columns for the next cell 
 * @param string $add - aditional parametres
 * @return HTML string */
 
function tdtd($col='',$add=''){
  return '</td>'.td($col,$add);
}

/** The Function returns a HTML sequence for the first cell in a table row  
 * @param number $col - number of columns for the next cell 
 * @param string $add - aditional parametres
 * @return HTML string */
function trtd($col='',$add=''){
  return '<tr>'.td($col,$add);
}

/** The function returns a HTML sequence for the end of the table row  
 * @return HTML string */
 
function trow(){
  return '</td></tr>';
}

/** The function replaces quotation marks for all the $DATA items  
  */
  
function trans(){
  /* pokud data obsahuji jednoduche uvozovky, zmen je na chr(39), aby byl sql dotaz syntakticky spravne*/
  global $DATA;
  foreach ($DATA as $klic=>$pol ){
    if ($klic <>'WHR_'){
      $DATA[$klic]=str_replace("'","&#039;",$DATA[$klic]);
      $DATA[$klic]=str_replace(chr(92),'',$DATA[$klic]);
      /* koment toto ne pro skripty $DATA[$klic]=str_replace('"',"&quot;",$DATA[$klic]);*/
    }
  }
}

/** The signal for the language mutation  
 * @return boolean */
function http_lan(){
  /*je true mimo prime nastaveni anglictiny*/
  global $http_lan;
  return $http_lan=='E';
}

/** The Function prepares HTML squence for the pop-up menu based on the $menu definition object 
 * @param array $menu - the menu definition hash/object  
 * @param number $level - initial level of the menu structure
 * @return HTML string */
 
function popup_menu($menu,$level=0){
  /* vytiskne predanou stromovou strukturu na podoby ul, li, aby byla pouzitelna pro Simple jQuery Dropdowns */
  $s='';
  foreach ($menu as $k=>$v){
    if (empty($menu[$k]['href'])){
      $s.=ta('li', ahref('#',$k)."\n".tg('ul','class="sub_menu"',"\n".popup_menu($menu[$k],$level+1)));
    }else{
      /* terminal leave */
      $s.=ta('li',ahref($menu[$k]['href'],$k));
    }
  }
  return ($level==0?tg('ul','class="dropdown"',nbsp(10).$s):$s);
}

/** The Function returns PHP-array based on DB table select
 * @param string $sel
 * @param object $db - open database object  
 * @return array */
 
function to_array($sel, $db){
  /* prevede obsah databazoveho selectu do pole radku v PHP */
  $a=array();
  if ($db){
    for($db->Sql($sel),$n=1;
       $db->FetchRow();
       $n++){
      $a[$n]=$db->DataHash();  
    }
  }
  return $a;
}

/** The Function returns appropriate natinal text message based on centralized setup (global $lan variable) 
 *  @param $text1  international message
 *  @param $text2  national message
 */ 

function http_lan_text($text1,$text2){
  if (isset($GLOBALS['lan'])){
    $http_plan=$GLOBALS['lan'];
    if ($http_plan == 'E') {return $text1;}
    if ($http_plan == 'C' || $http_plan=='') {return $text2;}
  }else return $text2;  
} 

/** The getter for global script parameters
 * @param $key parameter identifier
 * @return string global $DATA[$key] ( = result of $_GET or $_POST request )
 */ 

function getpar($key){
  global $DATA;
  if (isset($DATA[$key])) return $DATA[$key];  
  return '';
}

/** The setter for global script parameters
 * @param $key parameter identifier (POST or GET method )
 * @param $value
 */ 

function setpar($key,$value){
  global $DATA;
  $DATA[$key]=$value;  
  return 0;
}

/** The getter for all global script parameters
 * @param none
 * @return all GET and PUT parameters on the page.
 */
  
function getpars(){
  global $DATA;
  return $DATA;
}

/** This function returns true value when the input string represents a formally valid e-mail address 
 * @param string $email - the address to be formally validated
 * @return boolean */
 
function is_email($email){
  if (preg_match("/^[\w-\.]+@([\w-]+\\.)+[a-zA-Z]{2,4}$/", $email)){
     return true;
  }else{
     return false;
  }
}

/** This function shortcuts a HTML link/ reference tag. 
 * @param string $link - relative or absolute URL 
 * @param string $text - label text over the link, default '.' 
 * @param string $text - text, default '' 
 * @return HTML string */
 
function ahref($link='?', $text='.', $params=''){
  return tg('a','href="'.$link.'"'.($params==''?'':' ').$params,$text);
}

/** The Function returns a HTML span with context-sensitive help information
 * @param string $text - infromation text 
 * @return HTML string */
 
function helptext($text){
  return tg('span','class="helptext"',tg('img','src="img/info.gif"').ta('span'.$text));
}

/** The Function converts an Array created by database methods to a HTML table format
 * @param string $caption - table caption text
 * @param string $head - table head string, if not empty, only these columns will in the table in given order
 * @param array $content - Array of rows with table data.
 * @param string no data text - optional
 * @return HTML string */

function ht_table($caption,$head,$content,$nodata=''){
  $s=''; 
  if (!is_array($content)) return '';

  $is_head=is_array($head)&&count($head)>0;
  $is_content=(count($content)>0);
  for ($hlav='',$L=$is_head?array_keys($head):($is_content?array_keys($content[0]):array('0'=>nbsp())),$i=0;
       $i<count($L);
       $i++) 
      $hlav.=ta('th',isset($head[$L[$i]])?$head[$L[$i]]:$L[$i]);
  $n=0;           
  foreach ($content as $row){
    $rkapsa='';
    for ($i=0;$i<count($L);$i++){
       $ktisku=$row[$L[$i]];
       if (gettype($ktisku)=="object" && gettype($ktisku)!="NULL")
         $ktisku=$ktisku->load();
       if ($ktisku=='') $ktisku=nbsp(1);  
       $rkapsa.=ta('td',$ktisku);
     }
     $s.=tg('tr',$n%2?' class="sudy"':'',$rkapsa);
     $n++; 
   }
   if (!$is_content){
     $s=ta('tr',tg('td','colspan='.count($L),$nodata.nbsp()));
   }
   $s=tg('table','class="tabe" ',
       ta('caption',$caption).
        ta('thead',
          ta('tr',$hlav))
       .ta('tbody',$s));
   return $s;
}

/** The Function returns all GET parameters as a string to recall the page 
 */
  
function getparm_string(){
  $s='';
  if (count($_GET)>0 ){
    foreach($_GET as $k=>$v){
      $s.=($s==''?'':'&amp;').$k.'='.urlencode($v);
    }
  }
  return $s;
}

function konvdat($s){
  if (preg_match("/^(\d+)\.(\d+)\.(\d+)$/", $s, $m)){
    $day=$m[1];
    $month=$m[2];
    $year=$m[3]; 
    if ($year<100) $year+=2000; 
    return sprintf("%04d-%02d-%02d",$year,$month,$day);
  }
  return $s;  
}

?>