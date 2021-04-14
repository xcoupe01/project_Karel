## Ovládání
Na stránce s aplikací [Karla](karel.html) se nachází několik oblastí. 

Horní panel tvoří tmavá lišta stejně jako na této stránce. Vlevo obsahuje **Menu** , přepínač volby jazyka, uprostřed je orámované K a nápis Karel, který odkazuje zpět na tuto dokumentaci. Vlevo je pak nástroj pro s trojicí ovládacích prvků pro běh programu. Krajní prvky provádí spuštění a zastavování běhu Karla, symbol brouka uprostřed slouží pro krokování programu.

Hlavní část je rozdělena do tří oddílů:

 - **Místnost s robotem** - v levém oddílu je nahoře prostorový (3D) náhled na našeho hrdinu a jeho pole, po kterém se pohybuje. Pod tímto náhledem je prostor ovládacími a zobrazovacími prvky - této části aplikace se říká **Rychlý přístup**.
 - **Blokový editor** - prostor v prostřední části pro sestavování příkazů ovládajících robota pomocí vizuálních bloků. 
 - **Textový editor** - prostor pro zápis a ladění programů v jazyce Karel.

Jednotlivá okna se aktivují kliknutím myši do prostoru daného okna. Rozměry oken lze měnit a přizpůsobit si tak vzhled podle potřeby, například některé ze tří oken zcela skrýt. Změny oken se provádí myší pomocí táhel mezi prvky. Lze nastavit výchozí pozici rozložení těchto oken přes hlavní menu a položku `Nastav okna`. Poté se vždy při restartu aplikace nastaví na tyto rozměry a tlačítko v `rychlém přístupu` bude okna resetovat právě do tohoto rozložení.

### Místnost s robotem
Místnost zobrazuje prostorovou scénu s robotem. Po aktivaci oblasti (kliku myší) se v oblasti v levém horním rohu objeví nápis v červeném poli "Ovládáš", který signalizuje, že nyní můžeme robotem přímo posunovat a nebo měnit náhled. 

V režimu "Ovládáš" je možná přímá interakce uživatele s robotem pomocí kláves:
- `W` pro krok vpřed 
- `A` pro otočení vlevo 
- `D` pro otočení vpravo
- `O` pro označení nebo odznačení aktuální karlovy pozice
- `P` pro položení cihly
- `Z` pro zvednutí cihly 
- `I` pro odebrání nebo vrácení políčka před Karlem
    
Pro zařízení s dotykovým ovládáním lze vyvolat ovládání pomocí tlačítka v `Ovládání` na panelu nástrojů `Rychlý přístup`.
    
Pohyb kamerou v místnosti se provádí s využitím myši. Otáčení a posunování se provádí pomocí myši technikou táhni a pusť - stiskneme-li levé tlačítko myši a budeme ho držet, pohybem myší měníme polohu, natočení a pozici, ze které pozorujeme tuto prostorovou scénu. Budeme-li držet současně klávesu Shift, dochází k posunutí scény. Klávesa Ctrl scénou otáčí se středovým bodem v pozici kurzoru myši. Kolečkem na myši dosáhneme zvětšení, resp. zmenšení zobrazení. V panelu pod scénou je tlačítko umožňující návrat do výchozí polohy scény.

V levém horním rohu místnosti se mohou objevovat kontextové bubliny upozorňující na konkrétní stav aplikace. Mohou to být tyto:
- `Počítadlo` - Pokud je spuštěn program, zobrazuje, kolik iterací interpretu bylo třeba pro vykonání programu udělat. Kliknutím se vymaže.
- `Ovládáš` - Pokud je místnost aktivována a je možné robota na přímo ovládat, zobrazí se toto upozornění. Po kliknutí na něj se přímý režim vypne.
- `Běží` - Pokud je prováděn program, zobrazí se toto upozornění. Po kliknutí na něj se provádění příkazu zastaví (podobně jako kliknutím na tlačítko `Stop`).

### Rychlý přístup
Pod scénou s robotem je sada ovládacích prvků **Rychlý přístup**. Jedná se o jednoduchou sadu nástrojů, které usnadňují práci s aplikací a dávají najevo aktuální stav aplikace. Mezi prvky patří:
- `Reset kamery` - Vrátí kameru místnosti na základní pozici.
- `Reset oken` - Vrátí velikosti oken aplikace do výchozího nastavení. 
- `Ovládání` - Zobrazí tlačítka pro přímé ovládání robota.
- `Test` - Interní testovací tlačítko.
- `Posuvník rychlosti` - Nastavuje rychlost interpretu jazyka, na pravé straně lze nastavit i přímo číselně. Číslo reprezentuje procento maximální rychlosti robota. Lze nastavit i v programu pomocí příkazů `rychle` a `pomalu`.
- `Konzole` - Zde robot vypisuje hlášení o svém aktuálním stavu, nejčastěji chybová hlášení.
- `Proměnné` - Zde robot vypisuje všechny definované proměnné a jejich hodnoty.
 
### Blokový editor
Pomocí vizuálních bloků se sestavují příkazy robota Karla. Základem je definování příkazů a podmínek. Nový příkaz je hnědý blok, který vytáhneme ze sekce `Základ` do volné plochy - to se provádí pomocí myši metodou táhni a pusť. Příkaz musíme pojmenovat a do jeho těla můžeme umístit konstrukce složené z elementárních příkazů, bloků řízení toku, podmínek a matematických operací s proměnnými. Bloky se umísťují do sebe. Přesný popis práce s bloky je patrný z příkladů. Volnou plochu s bloky lze zvětšovat a zmenšovat pomocí kolečka myši. Bloky mají své kontextové menu, které se vyvolá pravým tlačítkem myši. Je možné k bloku přidat textový komentář, blok lze sbalit, takže je viditelný jen jeho název, lze ho duplikovat, deaktivovat nebo smazat. Smazání bloku lze též provést jeho předtažením do koše.

Pokud vytvoříme v prostoru s bloky hotové příkazy, ty jsou automaticky transformovány do programového kódu. Tento kód je přítomen v pravé části s textovým editorem, po kliknutí na prvek v listě popsaný jako "Bloky".

Tlačítko terče slouží k vystředění blokové pracovní plochy. Pod těmito tlačítky se nachází ikona koše, která zpřístupňuje smazané struktury. Struktury se mažou uchopením a buďto přetažením do toolboxu a nebo právě na tuto ikonu koše.

**Při načtení hotového příkladu je blok sbalený. Abychom si ho prohlédli, je třeba levým tlačítkem myši vyvolat kontextové menu a blok rozbalit.**

### Textový editor
Prostor umožňuje vytvářet, editovat a ladit textové programy v jazyku Karel. Záložka `Kód` slouží k přímému zápisu a editaci programů, záložka `Bloky` je textová reprezentace blokového editoru, kterou není možné editovat. Editor ukazuje číslování řádků, má barevně zvýrazněnou syntaxi příkazů jazyka Karel a při psaní napovídá možné varianty (možnost tzv. autokompletace). Jednotlivé příkazy lze sbalit a rozbalit, podobně jako v prostoru s vizuálními bloky.

#### Detekce syntaktických chyb
V editoru je integrována i schopnost syntaktické analýzy psaného textu a zobrazení syntaktických chyb. Při pokusu o spuštění syntakticky nesprávného kódu zobrazuje místa nalezených chyb na řádcích červeným křížkem a po najetí myši zobrazuje podrobnější důvod chybné situace.

Textový editor je propojen s ovládacími prvky na horní liště nad ním. **Po kliknutím na tlačítko `Spusť` se začne vykonávat příkaz, na kterém je umístěn kurzor**.

#### Krokování programu a body zastavení (breakpointy)
Režim krokování se spouští pomocí tlačítka `Krokuj` na které je nakreslen brouk. V režimu krokování se vykoná pouze jeden krok programu při každém stisknutí tlačítka krokuj. Zastavený program pokračuje stiskem tlačítka `Krokuj`. Pokud je program krokován, v místnosti s robotem je zobrazeno označení `Běží`. Při tomto stavu nelze provádět úpravy kódu v editoru a také nelze aktivovat spuštění dalšího příkazu. 

Pokud jsou v editoru nastavené breakpointy, vykonávání je zastaveno po stisku tlačítka `Krokuj` pouze na nich. Body zastavení (breakpointy) se vytvářejí kliknutím na číslo příslušného řádku mimo číslo řádku. Jsou označeny oranžovým rámečkem.
 
#### Záložky editoru a menu editoru
Textový editor má na své horní hraně dvě záložky:
- `Kód` - textový editor aplikace, kde lze Karlovi psát vlastní kód.
- `Bloky` - textová reprezentace blokového editoru, nelze do ní psát, ale disponuje všemi ostatními funkcemi regulérního editoru. 
- `Další možnosti` - Na konci seznamu jsou tři tečky nad sebou, na které když uživatel najede, zpřístupní se následující možnosti:
        - `Vytvoř bloky` - Z označeného kódu v textovém editoru vytvoří blokové schéma v blokovém editoru.
        - `Vymaž Breakpointy` - Vymaže všechny breakpointy v aktuálně zobrazeném editoru.
        - `Napovídání slov` - Lze vypnout nebo zapnout živé napovídání slov.
        - `Automatické odsazování` - Lze vypnout nebo zapnout automatické odsazování kódu.
        - `Ukazuj pozici` - Lze vypnout nebo zapnout pohyb kurzoru při interpretaci.