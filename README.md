# Project Karel
## Repozitář pro projekt Karel - Vojtěch Čoupek

## Repository for project Karel - Author Vojtěch Čoupek

**Last update - 16.9.2020**

Momentální stav - spustitelná alfa verze **implementace není finální**

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

Karel může vylézt pouze na políčko s maximálním převýšením jedné cihly. Pro spuštění programu klikněte v editoru do prostoru nějakého příkazu a klikněte na tlačítko `run`. Tlařítko `stop` slouží k zastavení probíhajícího příkazu. Tlačítko `test` je využito pro interní účely a nemá uživatelskou funkci a bude v budoucnu odstaněno. Prozatím je dostupná pouze česká lokalizace aplikace, anglická je podporována ale nelze momentálně přepnout.

Current state - runable alfa version **implementation is not final**

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

Karel can climb only one step at a time. To run any program click into any in the text field and press `run` button. Button `stop` stops current execution of program. Button `test` is reserved for internal use and currently have no user function and it will be removed in the future. At the moment you can use only czech version but english is implemented in the code and will be made as an option soon. 

