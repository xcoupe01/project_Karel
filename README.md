# Project Karel
### Author - Vojtěch Čoupek

**Last update - 27.9.2020**

___


Je potřeba spouštět přes lokální server, nejlépe v adresáři projektu spustit server pomocí PHP přes command `php -S 127.0.0.1:8080` a prozatím je potřeba mít dostupný internet pro stuštění.
Grafika obsahuje placeholder objekty, opravdové modely budou doplněny v budoucnu.
Programování je v základní míře dostupné v textové podobě, bloková možnost bude doplněna, zvýrazňování syntaxe zatím v základní verzi.
Pro ovládání Karla v místnosti je potřeba kliknout do oblasti místnosti a použít klávesy: 

- `W` pro krok vpřed 
- `A` pro otočení vlevo 
- `D` pro otočení vpravo
- `O` pro označení nebo odznačení aktuální karlovy pozice
- `P` pro položení cihly
- `Z` pro zvednutí cihly 
- myší lze pohybovat kamerou v místnosti. 

Karel může vylézt pouze na políčko s maximálním převýšením jedné cihly. Pro spuštění programu klikněte v editoru do prostoru nějakého příkazu a klikněte na tlačítko `run`. Tlařítko `stop` slouží k zastavení probíhajícího příkazu. Tlačítko `test` je využito pro interní účely a nemá uživatelskou funkci a bude v budoucnu odstaněno. Prozatím je dostupná pouze česká lokalizace aplikace, anglická je podporována ale nelze momentálně přepnout. Momentálně implementovaná verze blokového programování není zatím interpretovatelná, jedná se pouze o prototyp.

**Použité zdroje:**
- ACE code editor
- Three.js web 3D graphics
- Blockly programming

**Plán funkcí projektu**
- 3D prostředí
    - <span style="color:green"> implementováno pomocí Three.js 
    - v plánu další objekty z originálního Karla 
- textový editor kódu
    - <span style="color:green"> implementováno pomocí ACE.js, 
    - <span style="color:green"> implementováno podbarvování textu
    - <span style="color:green"> implementováno automatické zalamování textu
    - v plánu přidání dalších funkcí z knihovny ACE
    - v plánu ukaládání a načítání kódu
- blokový editor kódu
    - <span style="color:green"> implementováno pomocí Blockly.js
    - <span style="color:green"> implementovány základní bloky
    - v plánu spouštění a propojení s interpretem
    - v plánu možnost definování vlastních bloků
- syntaktická kontrola textu
    - <span style="color:green"> implementována v jednoduché podobě
    - v plánu sofistikovanější (možná s využitím ACE)
- jednoduchý debugger
    - v plánu možnost spuštění s krokováním (možná breakpointy s ACE)
- uživatelsky dostupné modifikace místnosti
    - v plánu nastavení rozměrů místnosti
    - v plánu ukládání a načítání místosti
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

___


You need to run local server for Karel to function properly. Easiest way is to run PHP server with command `php -S 127.0.0.1:8080` in the project folder and you need internet connection for it to load properly.
Graphics contains placeholder objects for now, real models will be added in the future.
Programming is accesable in text form, block programing will be added in the future, as well as english syntax highlight.
To control Karel directly, you need to click in the Karel's room and use:

- `W` to go forward
- `A` to rotate left
- `D` to rotate right
- `O` to mark current Karel's position
- `P` to place brick
- `Z` to pick up brick
- mouse to move camera in the room

Karel can climb only one step at a time. To run any program click into any in the text field and press `run` button. Button `stop` stops current execution of program. Button `test` is reserved for internal use and currently have no user function and it will be removed in the future. At the moment you can use only czech version but english is implemented in the code and will be made as an option soon. Current block programing cannot be interpreted by the robot its just a prototype.

**Used resources:**
- ACE code editor
- Three.js web 3D graphics
- Blockly programming


**Road map**

- 3D graphics
- text code editing
- block code editing
- text syntax check
- simple debugger
- user reachable room modification
- numbers and variables adition
- languages adition
- google disk saving
- studiing campain and exercice list
- custom 3D models for room
- custom GUI

