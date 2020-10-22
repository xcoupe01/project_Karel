# Projek Karel 3D
### Author - Vojtěch Čoupek
### Bakalářksá práce za podpory VUT FIT Brno a Gymnasium Šlapanice

[![Foo](https://gympl.gslapanice.cz/themes/slapanice/images/gympls.jpg)](https://gympl.gslapanice.cz/)

[![Foo](https://pbs.twimg.com/media/CSPA_wFWUAAUobu.png)](https://www.fit.vut.cz/.cs)


**Last update - 22.10.2020**

**English version below**
___
## Téma projektu
Cílem projektu je implementovat pedagogický nástroj, které by hravým způsobem seznámil žáky druhých stupňů a nišších gymnázií s problematikou programování. Jako předloha je vybrán program `Robot Karel 3D` na systém `DOS`. Původní verze je velice pěkně popsána [této adrese](http://karel.webz.cz/uvodni-strana), kde je i originální verze dostupná a například pomocí emulátoru `DOSBox` spustitelná. Zkráceně aplikace `Robot Karel 3D` umožnuje převzetí kontroly nad robotem v místnosti, a pomocí programů místnost měnit. Tento projekt se tedy soustřeďuje na předělání originálu do moderního prostředí a zapojit moderní prvky, které jsou dnes již běžnou součástí při vyučování. Detailnější popis vylepnšení níže.

## Použité zdroje:
- [ACE code editor](https://ace.c9.io/)
- [Three.js web 3D graphics](https://threejs.org/)
- [Blockly programming](https://developers.google.com/blockly)

## Plán funkcí projektu
- 3D prostředí
    - <span style="color:green"> implementováno pomocí Three.js 
    - <span style="color:green"> implementovány objekty z originálního Karla 
- textový editor kódu
    - <span style="color:green"> implementováno pomocí ACE.js, 
    - <span style="color:green"> implementováno podbarvování textu
    - <span style="color:green"> implementováno automatické zalamování textu
    - v plánu přidání dalších funkcí z knihovny ACE
    - <span style="color:green"> implementováno ukaládání a načítání kódu ze souboru
- blokový editor kódu
    - <span style="color:green"> implementováno pomocí Blockly.js
    - <span style="color:green"> implementovány základní bloky
    - <span style="color:green"> implementováno generování přepisu do nativního jazyka
    - <span style="color:green"> implementováno spouštění a propojení s interpretem
    - <span style="color:green"> implementováno ukládání a načítání bloků ze souboru
    - v plánu možnost definování vlastních bloků
- syntaktická kontrola textu
    - <span style="color:green"> implementována kontrola s tabulkovým zadáváním kontrol
    - <span style="color:green"> implementován přehledný interpret nativního kódu zvládající více chyb v kódu najednou
    - možná s využitím ACE (kde se budou zobrazovat chyby přímo v editoru)
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
    - v plánu mutace do anglického jazyka
- ukládání na google disku
    - v plánu propojení s google účtem
    - v plánu načítat a ukládat z google disku
- kampaň pro začátečníka a seznam příkladů
    - v plánu kampaň s popisem funkcí Karla a základních myšlenek programování
    - v plánu seznam a kontrola příkladů
- vlastní grafické modely pro místnost
    - v plánu vlastní grafické modely pro objekty v místnosti
- přehledné GUI
    - v plánu vlastní lehce modifikovatelné prostředí
    - v plánu různé témata

## Spuštění
Je potřeba spouštět přes lokální server, nejlépe v adresáři projektu spustit server pomocí PHP například přes command `php -S 127.0.0.1:8080` a prozatím je potřeba mít dostupný internet pro stuštění.

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
Blokové programování je syntakticky velmi podobné (ne li stejné) jako textové programování. Bloky jsou schovány pod svými kategoriemi a funkčností přímo korespondují na textovou reprezentaci. Pro spuštění bloku klikněte na tlačítko, u bloku uvozující příkaz. Pokud by bylo zapotřebí spouštět blok v nějakém dalším bloku, využijte blok z nabídky `Funkce`, tedy ze zelené sekce, s popiskem `Funkce` a do textového pole vložte název požadovaného bloku. Podobně funguje i volání uživatelských podmínek, ovšem vyberte podobný blok ze sekce `Podmínky`.

## Popis UI
Jednotlivé prvky se aktivují klíknutím myší do prostotu daného prvku
- Místnost s robotem - ovládání
    - `W` pro krok vpřed 
    - `A` pro otočení vlevo 
    - `D` pro otočení vpravo
    - `O` pro označení nebo odznačení aktuální karlovy pozice
    - `P` pro položení cihly
    - `Z` pro zvednutí cihly 
    - `I` pro odebrání nebo vrácení políčka před Karlem
    - myší a šipkami lze pohybovat kamerou v místnosti. 
- Blokový editor
- Textový editor

Pod těmito prvky se nachází sada tlačítek pro ovládání, každý prvek má své specifické
- Místnost s robotem
    - `stop` - zastavení jakéhokoliv probíhajícího kódu
    - `X value` - "x-ový" rozměr místnosti pro nastavení
    - `Y value` - "y-ový" rozměr místnosti pro nastavení
    - `room` - nastavení rozměrů místnosti na hodnoty z předchozích polí
    - `home camera` - vrátí kameru místnosti do základní pozice (buď po nastartování aplikace a nebo při změně místnosti)
- Blokový editor
    - `Make Blocks` - vytvoří v prostoru blokového programování strukturu blokového programování funkčně stejné jako zadanému kódu v následujícím prostoru pro text
    - `textarea` - slouží pro zadání na přepis z kódu do bloků
- Textový editor
    - `run code` - spuštění kódu v textovém editoru na aktuální pozici kurzoru
    - `run debug` - možnost spuštění s krokováním (po každém kliknutí na tlačítko se provede jeden řádek)

Níže se nachází sekce pro ukládání a načítání (+ developper sekce)
- pomocí selektorů `room`, `blocks` a `code` můžete nastavit, co bude v následujícím vygenerování uložení uloženo
    - `room` - přidá do souboru uložení aktuální stav místnosti
    - `blocks` - přidá do souboru uložení aktuální stav blokového editoru
    - `code` - přidá do souboru uložení aktuálního stavu editoru kódu
- do pole s výchozím popiskem `file_name` můžete zadat jméno následujícího souboru uložení
- tlačítkem `save` vygenerujete a stáhnete soubor, který ukládá aktuální stav
- tlačítko `Vybrat soubor` slouží k vybrání souboru, ze kterého se načte stav aplikace.
- tlačítko `load` načte předem vybraný soubor (pozor, aplikace se neptá a neupozorňuje že bude stav přepisovat a přepíše vše co jí soubor určí přepsat).
- `test` - prozatimní interní testovací tlačítko
- (`textarea` - prozatimní prostor pro generování kódu z blokového programování)

## Upozornění
- Nejedná se o finální produkt a aplikace je pouze v ranné fázi vývoje.
- Grafika obsahuje placeholder objekty, opravdové modely budou doplněny v budoucnu.
- Prozatím je dostupná pouze česká lokalizace aplikace, anglická je podporována ale nelze v aktuálním stavu přepnout.
___

# English Version - Full english descritpion will be added after English language mutation will be implemented properly

## Subject of this project

Subject of this project is to recreate application `Robot Karel 3D` which is used to teach kids to code. Sadly the english version of my project is not ready yet but it will be up soon. 

## How to run 
You need to run local server for Karel to function properly. Easiest way is to run PHP server with command `php -S 127.0.0.1:8080` in the project folder and you need internet connection for it to load properly.

## Disclaimer
- This is not the final version and future functions will be added
- Graphics contains placeholder objects for now, real models will be added in the future.
- English version not supported yet

## Room controls
- `W` to go forward
- `A` to rotate left
- `D` to rotate right
- `O` to mark current Karel's position
- `P` to place brick
- `Z` to pick up brick
- `I` to remove or return block in front of Karel
- mouse to move camera in the room

## Button description
You can find control for each section under it
- Room with robot
    - `stop` - stops ecevution of any code
    - `X value` - x axis dimension setter
    - `Y value` - y axis dimension setter
    - `room` - sets the room dimensions to predefined values (the upper two)
    - `home camera` - sets the camera to basic position
- Blockly editor
    - `textarea` - insert a code to be transported to Blockly code
    - `Make Blocks` - creates blocks described by text form `textarea` above
- Text editor
    - `run code` - runs block of code specifed by cursor
    - `run debug` - runs block of code specified by cursor in debug mode (step by step)

Lower there are options for save and load the state of the application (+ developper section)
- `room`, `blocks` and `code` - you can use these to specify save file
    - `room` - save state of the room
    - `blocks` - save state of Blockly editor
    - `code` - save state of text editor
- `file_name` text input - specify the name of savefile
- `save` generates the save file
- `Vybrat soubor` makes you choose the file to be loaded from
- `load` loads the application by the specified file
- `test` - internal developper button (click to make the next item visible)
- (`textarea` - invisible blockly code represenation)

## Used resources
- [ACE code editor](https://ace.c9.io/)
- [Three.js web 3D graphics](https://threejs.org/)
- [Blockly programming](https://developers.google.com/blockly)

