## Projekt Karel 3D
### Author - Vojtěch Čoupek
### Bakalářská práce za podpory VUT FIT Brno a Gymnasium Šlapanice

[![Foo](https://gympl.gslapanice.cz/themes/slapanice/images/gympls.jpg)](https://gympl.gslapanice.cz/)

[![Foo](https://pbs.twimg.com/media/CSPA_wFWUAAUobu.png)](https://www.fit.vut.cz/.cs)

Projekt je dostupný na http://smallm.cz/karel2/ !!


**Last update - 17.2.2021**

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
    - <span style="color:green"> implementováno pomocí ACE.js, 
    - <span style="color:green"> implementováno podbarvování textu
    - <span style="color:green"> implementováno automatické zalamování textu
    - oprava funkcí z knihovny ACE
    - <span style="color:green"> implementováno ukaládání a načítání kódu ze souboru
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
    - jednoduchý debugger (možná breakpointy s ACE)
- uživatelsky dostupné modifikace místnosti
    - <span style="color:green"> implementováno nastavení rozměrů místnosti
    - <span style="color:green"> implementováno ukládání a načítání místosti ze souboru
- mutace jazyka Karel
    - mutace programovacího jazyka karel do podoby C lang
    - mutace programovacího jazyka karel do podoby Python
- přidání čísel a proměnných do programu
    - v plánu navržení proměnných v jazyku
    - v plánu jednoduché operace s čísly
- jazykové mutace
    - <span style="color:green"> implementováno pomocí js lang file
    - <span style="color:green"> v plánu mutace do anglického jazyka
    - možná překládání kódu do cizího jazyka
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
    - <span style="color:green"> implementována první verze uživatelského prostředí
    - v plánu vlastní lehce modifikovatelné prostředí
    - v plánu různá témata

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
- `rychle` - robot se přepne do rychlého režimu
- `pomalu` - robot se přepne do pomalého režimu
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
- **Blokový editor**

    Slouží k vytváření kódu pomocí blokového přístupu programování. Pohyb po ploše je možná pomocí myši, včetně přibližování a oddalování, které je dále dostupné pomocí tlačítek v pravém spodním rohu. Tlačítko terče slouží k vystředění blokové pracovní plochy. Pod těmito tlačítky se nachází ikona koše, která zpřístupňuje smazané struktury. Struktury se mažou uchopením a buďto přetažením do toolboxu a nebo právě na tuto ikonu koše.
- **Textový editor**

    Umožnujě programování robota textovou formou v nativním jazyce Karel. Disponuje jednoduchým autocompletem, který pomáhá při programování a obarvuje syntax jazyka. Spustit kód je možné nakliknutím do prostoru programu, který uživatel chce spustit a kliknutím na tlačítko `Spusť`. Dostupný je také režim krokování, který se spouští podobým způsobem, akorát pomocí tlačítka `Krokuj`. V režimu krokování se vykoná pouze jeden krok programu při každém stisknutí tlačítka krokuj.


V horním panelu jsou dostupná následující nástroje aplikace:
- **Menu**

    Hlavní menu aplikace, obsahuje následující položky:
    - `Změň místnost` - Umožňuje pomocí dialogu změnit rozměry místnosti.
    - `Vytvoř bloky` - Z označeného kódu v textovém editoru vytvoří blokové schéma v blokovém editoru.
    - `Ulož` - Umožnujě uložit stav aplikace pomocí dialogu.
    - `Načti` - Umožňuje načíst stav aplikace pomocí dialogu.
- **Jazyky** - umoňuje změnu jazyků z nabídky.
- **Spusť** - spustí vybraný program v textovém editoru v běžném režimu.
- **Krokuj** - spustí vybraný program v textovém editoru v krokovacím režimu.
- **Zastav** - zastaví jakýkoliv probíhající program.

- **Rychlý přístup**
    - Rychlý přístup je dostupný pod místností s robotem, jedná se o jednoduchou sadu nástrojů, které usnadňují práci s aplikací a jednoznačně a rychle dávaí najevo aktuální stav aplikace. Mezi prvky patří:
        - `Počítadlo` - během běhu programu počítá, kolik musel interpret provést iterací, kliknutím lze vynulovat.
        - `Idikátor běhu` - Je červený pokud je Karel v běhu, jinak je tmavě modrý
        - `Idikátor ovládání` - Indikuje, zdali je uživatel v módu přímého ovlbádání robota v místnosti. Kliknutím lze tento mód aktivivat (případně kliknutím do místnosti).
        - `Reset kamery` - Vrátí kameru na původní pozici.
        - `Změna textového editoru` - Přepne editor ze zápisu programů na reprezentaci blokového editoru, nebo naopak.
        - `Test` - Interní testovací tlačítko.

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

## UI description
- **Room**
    - Visualizes the robot in his room, you can directly control him by clicking in the room and using folowing controls.
    - controls:
        - `W` to go forward
        - `A` to rotate left
        - `D` to rotate right
        - `O` to mark current Karel's position
        - `P` to place brick
        - `Z` to pick up brick
        - `I` to remove or return block in front of Karel
        - mouse to move camera in the room
- **Blockly editor**
    - Used to program robot by blocks.
- **Text code editor**
    - Used to program robot by code.
## Nav bar description
You can find control for each section under it
- **Menu**
    - `Change room` - 
    - `Home camera` - resets the camera
    - `Make Blocks` - creates blocks described by text form the selected text in the text editor
    - `Save` - opens dialog to generate save file
    - `Load` - opens dialog to load application by the specified file
    - `Test` - internal developper button
- **Languages**
    - insert a code to be transported to Blockly code
- **Run**
    - runs block of code specifed by cursor
- **Debug**
    - runs block of code specified by cursor in debug mode (step by step)   
- **Stop**
    - stops ecevution of any code
## Used resources
- [ACE code editor](https://ace.c9.io/)
- [Three.js web 3D graphics](https://threejs.org/)
- [Blockly programming](https://developers.google.com/blockly)
- [Split.js](https://split.js.org/)
- [JQuery](https://jquery.com/)
- [JQuery-UI](https://jqueryui.com/)


