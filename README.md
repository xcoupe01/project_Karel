# Projekt Karel 3D
### Autor - Vojtěch Čoupek
### Bakalářská práce za podpory VUT FIT Brno a Gymnasium Šlapanice

[![Foo](https://gympl.gslapanice.cz/themes/slapanice/images/gympls.jpg)](https://gympl.gslapanice.cz/)

[![Foo](https://pbs.twimg.com/media/CSPA_wFWUAAUobu.png)](https://www.fit.vut.cz/.cs)

Projekt je dostupný na http://smallm.cz/karel2/ !!


**Last update - 16.3.2021**

**English version below**
___
## Téma projektu
Cílem projektu je implementovat pedagogický nástroj, které by hravým způsobem seznámil žáky druhých stupňů a nišších gymnázií s problematikou programování. Jako předloha je vybrán program `Robot Karel 3D` na systém `DOS`. Původní verze je velice pěkně popsána [této adrese](http://karel.webz.cz/uvodni-strana), kde je i originální verze dostupná a například pomocí emulátoru `DOSBox` spustitelná. Zkráceně aplikace `Robot Karel 3D` umožnuje převzetí kontroly nad robotem v místnosti, a pomocí programů místnost měnit. Tento projekt se tedy soustřeďuje na předělání originálu do moderního prostředí a zapojit moderní prvky, které jsou dnes již běžnou součástí při vyučování. Detailnější popis vylepnšení níže.

## Použité zdroje:
- [ACE code editor](https://ace.c9.io/)
- [Three.js web 3D graphics](https://threejs.org/)
- [Blockly programming](https://developers.google.com/blockly)
- [Split.js](https://split.js.org/)
- [JQuery](https://jquery.com/)
- [JQuery-UI](https://jqueryui.com/)

## Plán funkcí projektu
- 3D prostředí
    - <span style="color:green"> implementováno pomocí Three.js 
    - <span style="color:green"> implementovány objekty z originálního Karla 
- textový editor kódu
    - <span style="color:green"> implementováno pomocí ACE.js   
    - <span style="color:green"> implementováno podbarvování textu 
    - <span style="color:green"> implementováno automatické zalamování textu 
    - <span style="color:green"> implementováno ukaládání a načítání kódu ze souboru 
    - <span style="color:green"> opraveny funkce z knihovny ACE 
- blokový editor kódu
    - <span style="color:green"> implementováno pomocí Blockly.js 
    - <span style="color:green"> implementovány základní bloky 
    - <span style="color:green"> implementováno generování přepisu do nativního jazyka 
    - <span style="color:green"> implementováno spouštění a propojení s interpretem 
    - <span style="color:green"> implementováno ukládání a načítání bloků ze souboru 
    - v plánu možnost definování vlastních bloků 
- syntaktická kontrola textu
    - <span style="color:green"> implementována kontrola pomocí LL1 tabulky a vnitřní tokenové struktury 
    - <span style="color:green"> implementován přehledný interpret vnitřní tokenové struktury zvládající více chyb v kódu najednou 
    - <span style="color:green"> kontrola zobrazuje chyby v ACE 
    - <span style="color:green"> implementována možnost spuštění s krokováním 
    - <span style="color:green"> jednoduchý debugger (možná breakpointy s ACE) 
- uživatelsky dostupné modifikace místnosti
    - <span style="color:green"> implementováno nastavení rozměrů místnosti 
    - <span style="color:green"> implementováno ukládání a načítání místosti ze souboru 
- mutace jazyka Karel
    - mutace programovacího jazyka karel do podoby C lang
    - mutace programovacího jazyka karel do podoby Python
- přidání čísel a proměnných do programu
    - <span style="color:green"> navrženy proměnné v jazyku 
    - <span style="color:green"> implementovány jednoduché operace s čísly 
    - <span style="color:green"> implementovány lokální a globální proměnné v jazyku 
    - <span style="color:green"> implementován jednoduchá přehled dostupných promenných 
- jazykové mutace
    - <span style="color:green"> implementováno pomocí js lang file 
    - <span style="color:green"> v plánu mutace do anglického jazyka 
    - <span style="color:green"> implementováno překládání kódu do cizího jazyka
- ukládání na google disku
    - v plánu propojení s google účtem
    - v plánu načítat a ukládat z google disku
- kampaň pro začátečníka a seznam příkladů
    - v plánu kampaň s popisem funkcí Karla a základních myšlenek programování
    - v plánu seznam a kontrola příkladů
- vlastní grafické modely pro místnost
    - <span style="color:green"> implementován vlastní model pro robota Karla 
    - v plánu vlastní grafické modely pro objekty v místnosti
- přehledné GUI
    - <span style="color:green"> implementovaná možnost změny velikosti oken - split.js 
    - <span style="color:green"> implementována druhá verze uživatelského prostředí 
    - <span style="color:green"> implementováno modifikovatelné prostředí 
    - <span style="color:red"> v plánu různá témata - nejde, není podporováno blockly

## Spuštění
Je potřeba spouštět přes lokální server, nejlépe v adresáři projektu spustit server pomocí PHP například přes command `php -S 127.0.0.1:8080` a prozatím je potřeba mít dostupný internet pro stuštění. Je možno spouštět buď `index.html`, který poskytuje kompletně funkční aplikaci, nebo `index.php`, kde se do aplikace navíc automaticky donačtou jednoduché testovací příkazy z `saves/initial_test_save.txt`.

## Popis kódového programování
Kód pište do nejpravějšího ze tří zobrazených oken - `Editor kódu`. Dostupné kódové programování obsahuje všechny originální příkazy z aplikace `Robot Karel 3D`, jmenovitě to jsou příkazy:
- `krok` - robot udělá krok vpřed
- `vpravo` - robot se otočí doprava
- `vlevo` - robot se otočí doleva
- `poloz` - robot položí cihlu
- `zvedni` - robot zvedne cihlu
- `oznac` - robot označí pole
- `odznac` - robot odznačí pole
- `rychle` - Zvýší rychlost robota o 10 ms - posune s posuvníkem rychlosti
- `pomalu` - Sníží rychlost robota o 10 ms - posune s posuvníkem rychlosti
- `pip` - robot přehraje upozornění

Karel může vylézt pouze na políčko s maximálním převýšením jedné cihly.Tyto příkazy lze různě podle potřeby skládat zasebe jako v každém jiném programovacím jazyku, je ale potřeba, **aby na každém řádku byl pouze jeden příkaz**. Příkazy lze vkládat i do strukrur jako jsou:
- `udelej` - struktura, která vykoná daný kód N krát. 
    ```
    udelej [N] krat
        [prikazy]
    *udelej
    ```
- `dokud` - struktura, která vykonává kód dokud platí podmínka.
    ```
    dokud [je/neni] [podminka]
        [prikazy]
    *dokud
    ```
- `kdyz` - struktura, která vykoná část kódu pokud podmínka platí, případně jinou část pokud neplatí. Část jinak je nepovinná.
    ```
    kdyz [je/neni] [podminka]
    tak
        [prikazy]
    jinak
        [prikazy]
    *kdyz
    ```
Dále je zapotřebí tvořit vlastní bolky kódu ohraničené těmito způsoby:
- vytvoření příkazu - je možno vytvořit vlastní příkaz, kterému je nutno přidělit vlastní název nekolidující s jinýmy příkazy (jak vestavěnými tak uživatelsky vytvořenými). Příkaz je pak možné volat v dalších příkazech. 
    ```
    prikaz [nazev]
        [prikazy]
    konec  
    ```
- vytvoření podmínky - je možnost vytvořit vlastní podmínku. Je opět nutno přidělit vlastní název, aby byla později volatelná. Očekává se, že bude obsahovat příkazy `pravda` nebo `nepravda` ve svém kódu.
    ```
    podminka [nazev]
        [prikazy]
        kdyz [je/neni] [podminka]
        tak
            pravda
        jinak
            nepravda
        *kdyz
    konec
    ```
Pokud je při interpretaci jazyka nalezen nějaký problém, aplikace o tom informuje do konzole prohlížeče.

## Popis blokového programování
Blokové programování je syntakticky velmi podobné (ne-li stejné) jako textové programování. Bloky jsou schovány pod svými kategoriemi a funkčností přímo korespondují na textovou reprezentaci. Pro spuštění bloku klikněte na tlačítko, u bloku uvozující příkaz (tlačítko run). Pokud by bylo zapotřebí spouštět blok v nějakém dalším bloku, využijte blok z nabídky `Funkce`, tedy ze zelené sekce, s popiskem `Funkce` a do textového pole vložte název požadovaného bloku. Tím se ze jmenovaného bloku stane podprogram aktuálního bloku. Podobně funguje i volání uživatelských podmínek, ovšem vyberte podobný blok ze sekce `Podmínky`. 

## Popis UI
Jednotlivé prvky se aktivují klíknutím myší do prostotu daného prvku. Aplikace umožňuje horizontálně přizpůsobovat, kolik který prvek na ploše zabírá pomocí táhel mezi prvky.

- **Místnost s robotem**

    Slouží pro přímou interkaci užvivatele s robotem pomocí následujících kláves:
    - `W` pro krok vpřed 
    - `A` pro otočení vlevo 
    - `D` pro otočení vpravo
    - `O` pro označení nebo odznačení aktuální karlovy pozice
    - `P` pro položení cihly
    - `Z` pro zvednutí cihly 
    - `I` pro odebrání nebo vrácení políčka před Karlem
    - myší a šipkami lze pohybovat kamerou v místnosti. 

    V levém horním rohu místnosti se mohou objevovat kontextové bubliny upozorňující na konkrétní stav aplikace. Mohou to být tyto:
        - `Počítadlo` - Pokud je spuštěn program, zobrazuje, kolik iterací interpretu bylo třeba pro vykonání programu udělat. Kliknutím se vymaže
        - `Ovládáš` - Pokud je místnost aktivována a je možné robota napřímo ovládat, zobrazí se toto upozornění. Po kluknutí na něj se přímý režim vypne.
        - `Běží` - Pokud je prováděn program, zobrazí se toto upozornění. Po kliknutí na něj se provádění příkazu zastaví (podobně jako klinutím na tlačítko `stop`).

- **Blokový editor**

    Slouží k vytváření kódu pomocí blokového přístupu programování. Pohyb po ploše je možná pomocí myši, včetně přibližování a oddalování, které je dále dostupné pomocí tlačítek v pravém spodním rohu. Tlačítko terče slouží k vystředění blokové pracovní plochy. Pod těmito tlačítky se nachází ikona koše, která zpřístupňuje smazané struktury. Struktury se mažou uchopením a buďto přetažením do toolboxu a nebo právě na tuto ikonu koše.

- **Textový editor**

    Umožnujě programování robota textovou formou v nativním jazyce Karel. Disponuje jednoduchým autocompletem, který pomáhá při programování a obarvuje syntax jazyka. Spustit kód je možné nakliknutím do prostoru programu, který uživatel chce spustit a kliknutím na tlačítko `Spusť`. Dostupný je také režim krokování, který se spouští podobým způsobem, akorát pomocí tlačítka `Krokuj`. V režimu krokování se vykoná pouze jeden krok programu při každém stisknutí tlačítka krokuj, pokud jsou ale v editoru nastavené breakpointy, vykonávání je zastaveno pouze na nich. Textový editor má na své horní hraně dvě záložky:
        - `Kód` - textový editor aplikace, kde lze Karlovi psát vlastní kód.
        - `Bloky` - textová reprezentace blokového editoru, nelze do ní psát, ale disponuje všemi ostatními funkcemi regulérního editoru. 


V horním panelu jsou dostupná následující nástroje aplikace:
- **Menu**

    Hlavní menu aplikace, obsahuje následující položky:
    - `Změň místnost` - Umožňuje pomocí dialogu změnit rozměry místnosti.
    - `Vytvoř bloky` - Z označeného kódu v textovém editoru vytvoří blokové schéma v blokovém editoru.
    - `Ulož` - Umožnujě uložit stav aplikace pomocí dialogu.
    - `Načti` - Umožňuje načíst stav aplikace pomocí dialogu.
    - `Nastav okna` - Nastaví výchozí velikosti oken aplikace.
- **Jazyky** - umoňuje změnu jazyků z nabídky.
- **Spusť** - spustí vybraný program v textovém editoru v běžném režimu.
- **Krokuj** - spustí vybraný program v textovém editoru v krokovacím režimu.
- **Zastav** - zastaví jakýkoliv probíhající program.

- **Rychlý přístup**
    - Rychlý přístup je dostupný pod místností s robotem, jedná se o jednoduchou sadu nástrojů, které usnadňují práci s aplikací a jednoznačně a rychle dávají najevo aktuální stav aplikace. Mezi prvky patří:
        - `Reset kamery` - Vrátí kameru místosti na základní pozici.
        - `Reset oken` - Vrátí velikosti oken aplikace do výchozího nastavení. 
        - `Ovládání` - Zobrazí tlačítka pro přímé ovládání robota.
        - `Test` - Interní testovací tlačítko.
        - `Posuvník rychlosti` - Nastavuje rychlost interpretu jazyka, na pravé straně lze nastavit i přímo číselně. Číslo reprezentuje procento maximální rychlosti robota. Lze nastavit i v programu pomocí příkazů `rychle` a `pomalu`.
        - `Konzole` - Zde robot vypisuje hlášení o svém aktuálním stavu, nejčastěji chybová hlášení.
        - `Proměnné` - Zde robot vypisuje všechny definované proměnné a jejich hodnoty.

    - Po kliknutí na tlačítko `Ovládání` se na vrcholu tohoto okna zobrazí tlačítka pro přímé ovládání robota potřebná napříkald pro dotyková zařízení. Tyto tlačítka jsou z leva do prava následující:
        - `Vlevo` pro otočení vlevo 
        - `Krok` pro krok vpřed
        - `Vpravo` pro otočení vpravo
        - `Polož` pro položení cihly
        - `Zvedni` pro zvednutí cihly 
        - `Označ/odznač` pro označení nebo odznačení aktuální karlovy pozice
        - `Odeber blok` pro odebrání nebo vrácení políčka před Karlem

## Proměnné
Tento projekt si dává za cíl originální jazyk rozšířit. Tohoto cíle je dosaženo pomocí obohacení jazyka o proměnné.
Do proměnných lze ukládat celočíselné kladné i záporné hodnoty definované matematickými výrazy s použitím celočíselných kladných hodnot a hodnot z proměnných. V rovnicích lze využívat tyto operátory:

- `+` - sčítání
- `-` - odečítání
- `*` - násobení 
- `/` - celočíselné dělení
- `%` - zbytek po dělení
- `>` - větší než
- `>=` - větší nebo rovno něž
- `<` - menší než
- `<=` - menší nebo rono než
- `==` - rovno
- `!=` - není rovno

Karel rozumí i uzávorkování výrazů pomocí jednoduchých závorek `(` a `)`.
- příklad validní konstrukce : `8 * (4 - promenna2)`

Hodnoty těchto výrazů lze poté ukládat do definovaných proměnných. Karel nabízí proměnné dvojího typu - globální a lokální. Globální proměnné je třeba poprvé definovat na úrovni definice příkazů a podmínek následujícím syntaxem:

```
globalni promenna mojePromenna = 2
```

Následně je možné do ní jakkolv stejným syntaxem zapisovat. Druhé klíčové slovo `promenna` je zde nepovinné, avšak díky němu je zakázáno definovat proměnné s tímto názvem (názvy se nesmí shodovat s klíčovými slovy jazyka, ani s názvem jakéhokoliv příkazu, či podmínky). Dále lze podobně v příkazech či podmínkách definovat lokální proměnná:

```
lokalni promena mojeLokProm = 4
```

Opět je klíčové slovo `promenna` nepovinné a název proměnné se nesmí shodovat s žádným názvem příkazu, podmínky nebo nyní i globální proměnné. Proměnné lze použít například při hledání středu místnosti následujícím způsobem:

```
# pomocí globálních proměnných

globalni promena1 = 1

prikaz pulka_glob
    globalni promena1 = 0
    dokud neni zed
        krok
        globalni promena1 = promena1 + 1
    *dokud
    vlevo
    vlevo
    globalni promena1 = promena1 / 2
    udelej promena1 krat
        krok
    *udelej
konec

# pomocí lokálních proměnných

prikaz pulka_lok
    lokalni pocitadlo = 0
    dokud neni zed
        krok
        lokalni pocitadlo = pocitadlo + 1
    *dokud
    vlevo
    vlevo
    lokalni pocitadlo = pocitadlo / 2
    udelej pocitadlo krat
        krok
    *udelej
konec
```
## Režim debugování
Pokud nechceme spouštět celý program v Karlovi najednou, ale chceme program krokovat, využijeme tlačítko "brouka", které interpret spustí v debugovacím režimu. Nyní Karel bude porvádět jeden příkaz na jedno kliknutí debug tlařítka. Pokud je kód příliš dlouhý a nechce se nám proklikávat až do potřebého bodu, je možné do míst vložit breakpoint kliknutím na číslo řádku na levé straně editoru. Poté debugovací rozhraní provede interpretaci do tohoto bodu, zde se zastaví a čeká na opětovné zmáčknutí debug tlačítka pro další postup.
## Upozornění
- Nejedná se o finální produkt a aplikace je pouze v ranné fázi vývoje.
- Grafika obsahuje placeholder objekty, opravdové modely budou doplněny v budoucnu.
___

# English Version - Full english descritpion will be added after English language mutation will be implemented properly

## Subject of this project

Subject of this project is to recreate application `Robot Karel 3D` which is used to teach kids how to code. Its based on Czechoslovakian project on MS-DOS. 

## How to run 
You need to run local server for Karel to function properly. Easiest way is to run PHP server with command `php -S 127.0.0.1:8080` in the project folder and you need internet connection for it to load properly. There are two versions. One is avalible in `index.html` which is the base application. There is also `index.php` version which loads some basic examples how the robot can operate in the text code editor.

## Disclaimer
- This is not the final version and future functions will be added
- Graphics contains placeholder objects for now, real models will be added in the future.

## Used resources
- [ACE code editor](https://ace.c9.io/)
- [Three.js web 3D graphics](https://threejs.org/)
- [Blockly programming](https://developers.google.com/blockly)
- [Split.js](https://split.js.org/)
- [JQuery](https://jquery.com/)
- [JQuery-UI](https://jqueryui.com/)

