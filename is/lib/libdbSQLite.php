<?php
/**  Database wrapper for SQLite 3 database in Microbe
 *  
 *  @author Petr Čoupek
 */  
 
 /*  29.10.2014 , 12.5.2015, 31.03.2016, 13.4.2016
 *  10.12.2018 - odchyt chyby, pokud je SQL spatne , upravy
 *  17.1.2019
 *  25.1.2019 - zavedeni metody pragma
 *  26.2.2019 metody SqlFetch, SqlArrayFetch
 *  23.04.2020
 *  17.07.2020 - oprava
 */
 
class OpenDB_SQLite {
  var $conn;       /* pripojeni - vysledek po volani objektu SQLite3 */
  var $parse;      /* dotaz sql - SQLite3 objekt, ktery (zpravidla) obsahuje vysledek dotazu */
  var $data;       /* struktura, ve ktere je radek z databaze */
  var $stav;       /* stav po selhani SQL dotazu */
  var $p_sloupcu;  /* pocet sloupcu */
  var $com_kontr;  /* kontrola zda je zapnuty commit */
  var $Error;      /* retezec obsahujici chybu SQL. (kod, popis, ofset).. */
  var $typedb;
  
  /** $db= new OpenDB_SQLite($connection_string)
   * 
   * connect to the dabasase, if database does not exist, it will be made a creation attempt 
   * @param string $connect - connection string
   * @return a new database wrapper object, or false when connection was not established
   */
  function __construct($connect){
    /* konstruktor, ktery vytvori pripojeni do DB a nebo da chybu - tu tiskne htpr */
    $this->typedb='sqlite';
    $m=array();
    if (preg_match('/^file=(.+)\,mode=(.+)$/i',$connect,$m)){
      if ($m[2]==1){
        if (is_file($m[1])){
          $this->conn=new \SQLite3($m[1],SQLITE3_OPEN_READWRITE);
        }else{
          /* v pripade neexistence souboru s databazi dojde k zalozeni prazdne DB */
          //echo "create $m[1] from scratch..\n";
          $this->conn=new \SQLite3($m[1],SQLITE3_OPEN_READWRITE | SQLITE3_OPEN_CREATE);
        }  
      }else{
        $this->conn=new \SQLite3($m[1],SQLITE3_OPEN_READONLY);
      }  
      $this->com_kontr=true; /* nastav natrue autocomit je implicitne zaply */
      if (!$this->conn){
        $this->Error='SQLite connect failed:'.$sqliteerror;
        htpr($this->Error);
        $this->stav=false;              
        return $this->stav;              
      }else{
        $this->stav=true;
        $this->Error='';
        //$this->conn->enableExceptions(true);
        $this->conn->enableExceptions(false);
        return $this->stav; 
      }
    }else{
      $this->Error='Incorrect connect string.';
      htpr($this->Error);
      $this->stav=false;              
      return $this->stav; 
    }  
  }

  /** $error = $db->Sql($sql_command)
   * 
   * Provide 
   * @param string $command - and sql command
   * @return boolean, true when an error has occured, false on success
   */
  public function Sql($dotaz){
    $errorCode=0;
    $errorReportingLevel = error_reporting(); /* poznamena uroven vypisovani chyb*/
    //error_reporting(0);                       /* nevypisuje chyby */
    if (preg_match('/^\s*insert into /',$dotaz) || preg_match('/^\s*update /',$dotaz) || 
      preg_match('/^\s*delete /',$dotaz) || strtoupper($dotaz)=='BEGIN' || strtoupper($dotaz)=='COMMIT' ){
        $this->parse=@$this->conn->exec($dotaz); /* parse je bool */
        $errorCode = $this->conn->lastErrorCode();
    }else{
        $this->parse=@$this->conn->query($dotaz);  /* parse je objekt - true */
        $errorCode = $this->conn->lastErrorCode();
    }  
      /*try{
         $this->parse=$this->conn->query($dotaz);
      } catch (Exception $e){
         $this->stav=true;
         $this->Error=$e->getMessage();
         return $this->stav;
      }*/
    error_reporting($errorReportingLevel); /* vraci uroven vypisovani chyb */
     
    if(!$this->parse || $errorCode>0){
      //$em=array("[$dotaz]",$this->conn->lastErrorCode());
      $this->Error=$this->conn->lastErrorCode()!=0?
       ($this->conn->lastErrorCode().": ".$this->conn->lastErrorMsg()):'příkaz SQL nebyl zpracován';        
      $this->stav=true;
      return $this->stav;
    }else{
      /* probehlo bez problemu */
      //$this->p_sloupcu=count($this->parse); 
      $this->stav=false;
      $this->Error='';
      return $this->stav;
    }
  }
  
  /** $error = $db->Pragma("table_info('TABLE_NAME'");
   * 
   * Provide special non- standartized task with the database - supported is table_info pragma 
   * @param string $command - table info pragma
   * @return boolean, true when an error has occured, false on success
   */
  function Pragma($dotaz){
    /* metoda vraci strukturu s udaji - napr. struktura tabulky a nebo false v pripade chyby*/
    /* duvodem teto metody je sjednoceni pristupu k datovemu katalogu napric databazemi */
     $m=array(); $struktura=array();
     if (preg_match('/^\s*table_info\(\'(\w+)\'\)\s*$/',$dotaz,$m)){
       $table_name=$m[1];
       /* vrat strukturu tabulky $m[1]*/
       if (!($this->parse=$this->conn->query("pragma table_info('$table_name')"))) return false;
       while($this->data=$this->parse->fetchArray(SQLITE3_ASSOC)){
          $struktura[$this->data['cid']]=array( /* pole indexovane podle hodnoty cid 0,1,..*/
           'name'=>$this->data['name'],
           'comment'=>$this->data['name'],
           'type'=>$this->data['type'],
           'notnull'=>$this->data['notnull'],
           'default'=>$this->data['dflt_value'],
           'pk'=>$this->data['pk'],
           'datename'=>$this->data['name'] /* SQLITe nema datetime typ - 
              jinak vhodny datovy format atributu name pro select -dopln v pripade typu datetime]" */
           );
       }
       return ($struktura); 
     }
     if (preg_match('/^\s*catalog\s*$/',$dotaz,$m)){
       /* vraci seznam tabulek - pohledu */
       if (!($this->parse=$this->conn->query("select * from sqlite_master order by name asc"))) return false;
       $n=0;
       while($this->data=$this->parse->fetchArray(SQLITE3_ASSOC)){
         $struktura[$n++]=array(
           'name'=>$this->data['name'],
           'type'=>$this->data['type']           
         );       
       }
       return ($struktura);
     }
     $this->stav=false;
     return($this->stav);
  }  
 
  /** $result = $db->FetchRow();
   * 
   * Provide fetch of one row of the data from the database table to the local Hash
   * @return boolean, true when next row has been fetched, false at the end of data
   */  
  function FetchRow(){
    /* pritahovani vet - asoc pole - nepracuje v pripade chyby prikazu insert */
    if (is_object($this->parse)) {
      try{
        if($this->data=$this->parse->fetchArray(SQLITE3_ASSOC)){
          /* podminka if neni splnena na konci datasetu - this data se naplni vzdy */
          //print_r($this->data);
          return true;
        }else{
          return false;
        }
      }catch (Exception $e){
        $this->Error=$e->getMessage();
        return false;
      }
    }
    return false;    
  }
  
  /** $result = $db->FetchRowA();
   * 
   * Provide fetch of one row of the data from the database table to the local Array
   * @return boolean, true when next row has been fetched, false at the end of data
   */ 
  function FetchRowA(){
    /* pritahovani dat - jako pole */
    if ($this->parse) try{
      if($this->data=$this->parse->fetchArray(SQLITE3_NUM)){
        return($this->data);
      }else{
        return false;
      }
    }catch (Exception $e){
      $this->Error=$e->getMessage();
      return false;
    }
    return false;     
  }
  
  /** $error = $db->SqlFetch($sql_command)
   * 
   * combine Sql and FetchRow method into one step and returns data hash 
   * @param string $command - and sql command
   * @return hash with the data content
   */
  function SqlFetch($prikaz){
    /* zjednoduseni nacteni hodnoty z db primo do promenne */
    if (!$this->Sql($prikaz) && $this->FetchRowA()) {
      return (string)($this->data[0]);
    }else{
      return '';
    }  
  }
  
  /** $error = $db->SqlFetchArray($sql_command)
   * 
   * combine Sql and FetchRow method into one step and returns data array
   * @param string $command - and sql command
   * @return array with the data content
   */
  function SqlFetchArray($prikaz,$limit=0){
    /* zjednoduseni nacteni celeho vysledku select primo do pole v PHP s volitelnym limitem */
    $a=array();
    if (!$this->Sql($prikaz)){
      while ($this->FetchRow()){
        array_push($a,$this->DataHash());
        if ($limit && $limit<=count($a)) break;
      }
    }
    return $a;    
  }
    
  /** $value = $db->Data('attribute');
   * 
   * This method returns current attribute value
   * @param string $attribute - the name of the attribute (in the view/table), 
   *   automatic case sensitivity detection 
   * @return string with the attribute value
   */
  function Data($sloupec){
    /* vraceni dat resi case sensitivitu */
    if (isset($this->data[$sloupec])) {
      return $this->data[$sloupec];
    }elseif (isset($this->data[strtoupper($sloupec)])){
      return $this->data[strtoupper($sloupec)];
    }elseif (isset($this->data[strtolower($sloupec)])){
      return $this->data[strtolower($sloupec)];
    }else{
      return '';
    }
  }
  
  /** $value = $db->DataHash();
   * 
   * This method returns current attribute value
   * @return hash with the current fetched row values
   */
  function DataHash(){
    return (array)$this->data;
  }  
 
  /** $db->Close();
   * 
   * Closes the database connection
   */  
  function Close(){
    if ($this->conn) {$this->conn->close();}
  }
}
 
?>
