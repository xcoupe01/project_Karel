<?php
/** lib_bt.php  - MicroBe core library
 * 
 * Framework library for use Boostrap compnents 
 *  
 * @author Petr Čoupek
 * @package MicroBe
 * @version 1.1
 * @date 11.05.2020 , 30.07.2020, 15.01.2021
 */

/** The function returns HTML tag for date input based on Bootstrap datefield plug-in functionality
 * @param string $label - label before the tag
 * @param string $name - the name of the input tag (name parameter in the form and also the id in the document)
 * @param string $value - initial date in the text input
 * @param string $add - other added parametres in the tag (useful for javascript client-side functionality or styling)
 * @param number $f - form name, in which the tag is placed
 * @return HTML string */
 
function bt_datefield($label,$name,$value,$add='',$f=''){
  $id=$name.'_'.$f; $path='';
  $options='language: "cs",'.
           'clearBtn: true,'.
           'todayBtn: "linked",'.
           'daysOfWeekHighlighted: "0",'.
           'autoclose: true,'.
           'todayHighlight: true';
  
  return tg('script','type="text/javascript"',
          ' $( function() {'.
          '   $( "#'.$id.'" ).datepicker({'.$options.'});'.
          '  } );').
        $label.nbsp(1).
        tg('input','type="text" name="'.$name.'" id="'.$id.'" value="'.$value.'" size="10"');
}

/** The function provides a page splitter / divider into sections based on the bootstrap css library
 * @param array $content - all the parts in form 'head', 'content' - internal HTML code
 * @param string $id - the document id 
 * @return HTML string */

function bt_accordion($content,$id='accordion',$aria_exp=1){
  $t=''; $i=0; 
  foreach ($content as $item){
    $i++;
    $t.="\n".tg('div','class="card"',
         tg('div','class="card-header" id="h'.($i).'"',
           //tg('h5','class="mb-0"',
             tg('button','class="btn btn-primary" data-toggle="collapse" '.
              'data-target="#collapse'.($i).'" aria-expanded="'.
              ($i==$aria_exp?'true':'false').'" aria-controls="collapse'.($i).'"',
              $item['header'].' ')).
         "\n".tg('div','id="collapse'.($i).'" class="collapse'.($i==$aria_exp?' show':'').'" aria-labelledby="h'.$i.
            '" data-parent="#'.$id.'" ',
          tg('div','class="card-body"',$item['content'])));   
  }
  return "\n".tg('div',' id="'.$id.'"',$t)."\n";
}

/** The function returns an input HTML field with the autocomplete functionality based on Autocomplete plugin for Bootstrap 
 * @param string $label - label before the input
 * @param string $pole - the identifier for the input area
 * @param number $size - the size in chars
 * @param number $maxlength - the maximum allowed input size in chars
 * @param string $script - the URL of the script (on server side, in PHP) realizing the asynchronous javascript based response
 * @param string $formname - form name, in which the input tag is placed
 * @param string $value - initial value in the text input
 * @return HTML string */
 
function bt_autocomplete($label,$pole,$size,$maxlength,$script,$formname,$value=''){
  $s=tg('div','class="form-group row"',
      tg('label','for="'.$pole.$formname.'" ',$label).nbsp(1).
      tg('select','class="form-control w-50" name="'.$pole.'" id="'.$pole.$formname.'" '.
    'placeholder="zadejte text..." '.
    'data-noresults-text="Žádný záznam." '.
    'autocomplete="on"',' '));
  $s.=tg('script','type="text/javascript"',
    " $('#".$pole.$formname."').autoComplete(  {
        resolverSettings: { url: '".$script."?', fail:function(){}  },
        resolver: 'ajax',
        minLength: 1
      }
    );
    ");  
  return $s;
}

/** The function provides an Info dialog over HTML screen using Bootstrap Modal dialog. There is OK button to close it.
 * @param string $title - dialog title
 * @param string $body - dialog content 
 * @return HTML string
 */ 
function bt_dialog($title,$body){
 return (tg('script','type="text/javascript"',
  '$(window).on(\'load\',function(){ $(\'#bt_dialog\').modal(\'show\'); });').
  tg('div','class="modal" id="bt_dialog" tabindex="-1" role="dialog"',
   tg('div', 'class="modal-dialog modal-dialog-centered" role="document"',
    tg('div','class="modal-content"',
     tg('div','class="modal-header"',
      tg('h5','class="modal-title"',$title).
       tg('button','type="button" class="close" data-dismiss="modal" aria-label="Close"',
        tg('span','aria-hidden="true"','&times;'))).
     tg('div','class="modal-body"',tg('p','style="word-wrap:break-word;"',$body)).
     tg('div','class="modal-footer"',
      tg('button','type="button" class="btn btn-primary" data-dismiss="modal"','OK')))))
  );
}

/** The function provides an Alert dialog over HTML screen using Bootstrap Modal dialog. There is OK button to close it.
 * @param string $body - dialog content
 * @param string $type - Alert type in the Bootstrap. Default 'alert-success'.
 * @return HTML string
 */ 

function bt_alert($body,$type='alert-success'){
  return tg('div','class="alert '.$type.'" role="alert"',
          $body.
          tg('button','type="button" class="close" data-dismiss="alert" aria-label="Close"',
           tg('span','aria-hidden="true"','&times;')));
} 

/** The function provides a Dialog over HTML screen using Bootstrap Modal dialog. There is OK button to close it.
 * @param string $title - dialog title
 * @param string $body - dialog content
 * @param string commit - commit action for post request
 * @return HTML string
 */
  
function bt_fdialog($title,$body,$commit=''){
 if ($commit==''){
   $commit=tg('input','type="submit" class="btn btn-primary" value="OK" ','noslash');
 } 
 return (tg('script','type="text/javascript"',
  '$(window).on(\'load\',function(){ $(\'#bt_dialog\').modal(\'show\'); });').
  tg('div','class="modal" id="bt_dialog" tabindex="-1" role="dialog"',
   tg('div', 'class="modal-dialog modal-dialog-centered" role="document"',
    tg('div','class="modal-content"',
    tg('form','method="post" action="'.$_SERVER['SCRIPT_NAME'].'"',
     tg('div','class="modal-header"',
      tg('h5','class="modal-title"',$title).
       tg('button','type="button" class="close" data-dismiss="modal" aria-label="Close"',
        tg('span','aria-hidden="true"','&times;'))).
     tg('div','class="modal-body"',tg('p','style="word-wrap:break-word;"',$body)).
     tg('div','class="modal-footer"',
      tg('button','type="button" class="btn btn-secondary" data-dismiss="modal"',
        http_lan_text('Cancel','Storno')).
      $commit ))))));
 }


/** Switch-able tab panels with cards on one page.
 * @param array $sections - list of headers of sections
 * @param array $contents - list of contents for sections
 * @return Bootstrap HTML content
 */ 

function bt_panels($sections,$contents){
 
  $sh='';
  foreach ($sections as $k=>$v){
    /* $link='?item='.getpar('item').'&amp;KLIC_GDO='.getpar('KLIC_GDO').
          '&amp;tt_=d&amp;WHR_='.urlencode(getpar('WHR_')).
          '&amp;CUR_='.getpar('CUR_').'&amp;sekce='.$k.''; */
    if (strlen($contents[$k])<50) continue;    /* pokud jsou obsahy prazdny retezec, nezaradi ani tu danou sekci */   
    $sh.=tg('li','class="nav-item" role="presentation"',"\n".
           tg('a','class="nav-link'.($k==1?' active':'').'" id="tab'.$k.'" data-toggle="tab" href="#ob'.$k.
                '" role="tab" aria-controls="ob'.$k.'" aria-selected="'.($k==1?'true':'false').'"',
                $v));
  }               
  $sh=tg('div','class="card-header"',"\n".
      tg('ul','class="nav nav-tabs card-header-tabs" id="ouska" role="tablist"',$sh));
  
  $so='';
  foreach ($contents as $k=>$v){
   if (strlen($v)<50) continue;     /* pokud jsou obsahy prazdny retezec, nezaradi ani tu danou sekci */
    $so.=tg('div','class="tab-pane fade '.($k==1?'show active':'').'" id="ob'.
              $k.'" role="tabpanel" aria-labelledby="tab'.$k.'"',
              $v)."\n";
  }
  $so=tg('div','class="tab-content" id="ouskaContent"',"\n".$so);     
  return $sh.$so;
}


?>