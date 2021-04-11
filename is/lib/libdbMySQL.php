<?php
/** Database wrapper for MySQL database
 *  
 *  @author Petr Čoupek
 */ 
     
 /* 03.11.2020 - vytvoreni z puvodniho kodu na webhostingu
 */

//namespace Microbe; /* namespace pro framework, volani globalnich objektu pak zacina \ */

class OpenDB_MySQL {
  var $conn; //pripojeni (dblink)- vysledek po volani mysql_connect (mysql_pconnect)
  var $parse; //dotaz sql - vysledek ociparse
  var $data; //struktura, ve ktere je radek z databaze
  var $stav; // stav po selhani SQL dotazu
  var $p_sloupcu; // pocet sloupcu
  var $com_kontr;  //kontrola zda je zapnuty commit
  var $Error;  //retezec obsahujici chybu SQL. (kod, popis, ofset)..
  var $db_schema;
  
  /** $db = new OpenDB_MySQL($connection_string)
   * 
   * connect to the dabasase, if database does not exist, it will be made a creation attempt 
   * @param string $connect - connection string
   * @return a new database wrapper object, or false when connection was not established
   */

  function __construct($napojeni){
    $this->typedb='MySQL';
    $m=array();
    if (preg_match('/^ser=(.+);db=(.+);uid=(.+);pwd=(.+)$/i',$napojeni,$m)){
      $this->db_schema=$m[2];
      if (PHP_MAJOR_VERSION>5){  
        $this->conn=new mysqli($m[1],$m[3],$m[4],$m[2]);
        if ($this->conn->connect_errno) {
          $this->Error='MySQL connect failed.';
          $this->stav=false;              
          return $this->stav;
        }else{
          @mysqli_query("SET NAMES 'utf8';");
          if (!$dbll) {
            $this->Error='MySQL select database failed.';
            //htpr($this->Error);
            $this->stav=false;              
            return $this->stav;          
          }
          $this->com_kontr=true; //nastav natrue autocomit je implicitne zaply
          $this->stav=true;  #pridano 17.5.2012
          return $this->stav;  //This->conn ?
        }  
      }else{
        $this->conn=@mysql_connect($m[1],$m[3],$m[4],true);
        if (!$this->conn) {
          $this->Error='MySQL connect failed.';
          $this->stav=false;              
          return $this->stav;
        }else{
          $dbll = @mysql_select_db($m[2],$this->conn); // select db
          if (!$dbll) {
            $this->Error='MySQL select database failed.';
            //htpr($this->Error);
            $this->stav=false;              
            return $this->stav;          
          }
          @mysql_query("SET NAMES 'utf8';");
          $this->com_kontr=true; //nastav natrue autocomit je implicitne zaply
          $this->stav=true;  #pridano 17.5.2012
          return $this->stav;  //This->conn ?
        }
      }            
    }else{
      $this->Error='Incorrect connect string.';
      //htpr($this->Error);
      $this->stav=false;              
      return $this->stav; 
    }  
  }

   /** $error = $db->Sql($sql_command)
   * 
   * Provide a SQL command in the target database 
   * @param string $command - and sql command
   * @return boolean, true when an error has occured, false on success
   */
  function Sql($dotaz){
    if (!isset($this->conn)) {
      return -1;
    }
    if (PHP_MAJOR_VERSION>5){
      $this->parse=@mysqli_query($this->conn,$dotaz);
      if(!$this->parse){
        $this->Error=mysqli_error();
        $this->stav=true;
        return $this->stav;
      }
      if (is_bool($this->parse)){
        $this->p_sloupcu=0;
      }else{
        $this->p_sloupcu=mysqli_num_fields($this->parse); 
      }
      $this->stav=false;
      $this->Error='';
      return $this->stav;
    }else{
      $this->parse=@mysql_query($dotaz,$this->conn);       
      if(!$this->parse){
        $this->Error=mysql_error();
        $this->stav=true;
        return $this->stav;
      }
      if (is_bool($this->parse)){
        $this->p_sloupcu=0;
      }else{
        $this->p_sloupcu=mysql_num_fields($this->parse); 
      }
      $this->stav=false;
      $this->Error='';
      return $this->stav;
    }  
  }
  
  /** $result = $db->FetchRow();
   * 
   * Provide fetch of one row of the data from the database table to the local Hash
   * @return boolean, true when next row has been fetched, false at the end of data
   */  
  function FetchRow(){
    if ($this->parse){
      $this->data =PHP_MAJOR_VERSION>5?mysqli_fetch_assoc($this->parse):mysql_fetch_assoc($this->parse);
      return $this->data;
    }else{
      return false;
    };
  }
  
  /** $result = $db->FetchRowA();
   * 
   * Provide fetch of one row of the data from the database table to the local Array
   * @return boolean, true when next row has been fetched, false at the end of data
   */ 
  function FetchRowA(){
    if ($this->parse){
      $this->data = PHP_MAJOR_VERSION>5?mysqli_fetch_array($this->parse):mysql_fetch_array($this->parse);
      return($this->data);
    }else{
      return(false);
    };    
  }

  /** $value = $db->Data('attribute');
   * 
   * This method returns current attribute value
   * @param string $attribute - the name of the attribute (in the view/table), 
   *   automatic case sensitivity detection 
   * @return string with the attribute value
   */  
  function Data($sloupec){
    // prevod z velkych pismen na mala pro MySQL
    if (isset($this->data[$sloupec])){
      return $this->data[$sloupec];
    }else{
      if (isset($this->data[strtolower($sloupec)])){
        return $this->data[strtolower($sloupec)];
      }else{
        return '';
      }
    }
  }
  
  /** $value = $db->DataHash();
   * 
   * This method returns current attribute value
   * @return hash with the current fetched row values
   */
  function DataHash(){
    return($this->data);
  }  
 
  function Error(){
    return($this->Error);
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
    if (preg_match('/^\s*table_info\(\'(.+)\'\)\s*$/',$dotaz,$m)){
      $table_name=strtoupper($m[1]);       
      /* vrat strukturu tabulky $m[1] - generuje se interoperabilni tvar spolecny pro ruzne databaze */
      if (preg_match('/^(\w+)\.(\w+)$/',$table_name,$m)){  
        /* tabulka uvedena jako schema.tabulka */
		    $table_name=strtoupper($m[2]);  
        $dodatek=" and table_schema='$m[1]'";
        $dodatek2=" and all_constraints.owner='$m[1]'"; /* uvodni mezera dulezita */
	    }else{
	      /* tabulka s prostym nazvem */
        $dodatek='';  $dodatek2='';
      }	
      //deb($table_name);
      /* inicializace pole nullable, datalength, colimnid jde od nuly - sjednoceni s ostatnimi DB */ 
	    $this->Sql("SELECT ordinal_position as columnid, column_name, is_nullable as nullable, ".
               "character_maximum_length as data_length, data_type, numeric_precision as data_precision, ".
               "numeric_scale, column_key, column_comment ".
               "FROM INFORMATION_SCHEMA.COLUMNS where upper(table_name)='".$table_name."'".$dodatek." order by ordinal_position asc ");     
      $countkey=0;
      while($this->FetchRow()){
        
        $struktura[$this->Data('COLUMNID')]=array(
          'name'=>$this->Data('COLUMN_NAME'),
          'type'=>$this->Data('DATA_TYPE'),
		      'notnull'=>$this->Data('NULLABLE')=='N'?1:0,
          'default'=>'',  /* dopsat */
          'datalength'=>$this->Data('DATA_LENGTH'),
          'precision'=>$this->Data('DATA_PRECISION'),
          'datename'=>($this->Data('DATA_TYPE')=='date'?
            ("to_char(".$this->db->Data('COLUMN_NAME').",'DD.MM.YYYY HH24:MI:SS') as ".$this->db->Data('COLUMN_NAME')):''),
           'comment'=>$this->Data('COLUM_COMMENT'),
           'pk'=>'');
        if (strtoupper($this->Data('DATA_LENGTH'))=='NULL'){
          $struktura[$this->Data('COLUMNID')]['datalength']=$this->Data('NUMERIC_SCALE');
        }    
        if ($this->Data('COLUMN_KEY')!=''){
          $struktura[$this->Data('COLUMNID')]['pk']=++$countkey;
        }    
        /* vazba cislo sloupce nazev pro nasledne doplneni comment */  
        $prevod[$this->Data('COLUMN_NAME')]=$this->Data('COLUMNID');   		    
	    }
      //deb($struktura);     	      
      return $struktura;
    }
    
    
    if (preg_match('/^\s*catalog\s*$/',$dotaz,$m)){
      /* vraci seznam tabulek - pohledu */
      $this->Sql("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='".$this->db_schema."'");
      $n=0;
      while ($this->FetchRow()) {
        $struktura[$n++]=array(
           'name'=>$this->Data('TABLE_NAME'),
           'type'=>'table');      
      }
      return $struktura;
    }     
    
    $this->stav=false;
    return $this->stav;
  }
  
  /** $db->Close();
   * 
   * It closes the database connection
   */  
  function Close(){
    if ($this -> conn){ // check connection
      if (PHP_MAJOR_VERSION>5){
          @mysqli_close($this->conn);
      }else{
          @mysql_close($this->conn);
      }  
      $this -> conn = false;      
      $this->stav=true;
      $this->Error='';
      return($this->stav);
    }else{
       $this->stav=false;
       $this->Error='Cannot close connection';
       return($this->stav);
    }
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
  
  /** $error = $db->SqlFetchArray($sql_command,$limit=0)
   * 
   * combine Sql and FetchRow method into one step and returns data array
   * @param string $sql_command - and sql command
   * @param number $limit - max. count of resuts , 0= no limit
   * @return array with the data content
   */
  function SqlFetchArray($prikaz,$limit=0){
    /* zjednoduseni nacteni celeho vysledku select primo do pole v PHP s volitelnym limitem */
    $a=array();
    //$a= new SplFixedArray(10000);$i=0;
    if (!$this->Sql($prikaz)){
      while ($this->FetchRow()){
        array_push($a,$this->DataHash());
        //$a[++$i]=$this->DataHash();
        if ($limit && $limit<=count($a)) break;
      }
    }
    return $a;    
  }
  
  /** $error = $db->SqlFetchKeys($sql_command,$key)
   * 
   * combine Sql and FetchRow method into one step and returns data array
   * @param string $sql_command - and sql command
   * @return array with the data content
   */
  function SqlFetchKeys($prikaz,$key){
    /* zjednoduseni nacteni celeho vysledku select primo do pole podle klice */
    $a=array();
    if (!$this->Sql($prikaz)){
      while ($this->FetchRow()){
        if (isset($a[$this->Data($key)])){
          /* tato hodnota klice se opakuje, struktura bude pole */
          if (!isset($a[$this->Data($key)][0]) ){
            /* pole zatim neexistuje, vlozeni jiz zarazeneho prvku do pole */
            $tmp=$a[$this->Data($key)];
            $a[$this->Data($key)]=array();
            array_push($a[$this->Data($key)],$tmp);
          }
          /* pripojeni prvku k poli */
          array_push($a[$this->Data($key)],$this->DataHash());  
        }else{
          $a[$this->Data($key)]=$this->DataHash();
        }  
      }
    }
    return $a;    
  }
} 

?>