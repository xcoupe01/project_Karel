## O aplikaci

### Téma projektu
Cílem projektu je implementovat pedagogický nástroj, které by hravým způsobem seznámil žáky druhých stupňů a nišších gymnázií s problematikou programování. Jako předloha je vybrán program `Robot Karel 3D` na systém `DOS`. Původní verze je velice pěkně popsána [této adrese](http://karel.webz.cz/uvodni-strana), kde je i originální verze dostupná a například pomocí emulátoru `DOSBox` spustitelná. Zkráceně aplikace `Robot Karel 3D` umožnuje převzetí kontroly nad robotem v místnosti, a pomocí programů místnost měnit. Tento projekt se tedy soustřeďuje na přetvoření originálu do moderního prostředí a zapojit moderní prvky, které jsou dnes již běžnou součástí při vyučování. Detailnější popis vylepšení níže.

### Použité zdroje:
- [ACE code editor](https://ace.c9.io/)
- [Three.js web 3D graphics](https://threejs.org/)
- [Blockly programming](https://developers.google.com/blockly)
- [Split.js](https://split.js.org/)
- [JQuery](https://jquery.com/)
- [JQuery-UI](https://jqueryui.com/)


### Popis kódového programování
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

### Popis blokového programování
Blokové programování je syntakticky velmi podobné (ne-li stejné) jako textové programování. Bloky jsou schovány pod svými kategoriemi a funkčností přímo korespondují na textovou reprezentaci. Pro spuštění bloku klikněte na tlačítko, u bloku uvozující příkaz (tlačítko run). Pokud by bylo zapotřebí spouštět blok v nějakém dalším bloku, využijte blok z nabídky `Funkce`, tedy ze zelené sekce, s popiskem `Funkce` a do textového pole vložte název požadovaného bloku. Tím se ze jmenovaného bloku stane podprogram aktuálního bloku. Podobně funguje i volání uživatelských podmínek, ovšem vyberte podobný blok ze sekce `Podmínky`.

### Proměnné
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

