// Vienintelis klausimyno šaltinis puslapiui ir Apps Script (deploy.py nukopijuoja šį failą į projektą).
// Trys atskiri klausimynai pagal rolę: vadovas, skyrius, it. Kiekvienas žmogus gauna savo nuorodą ir mato tik savo klausimus.
// Lauko tipai: tekstas (iki 5 000), trumpas (iki 300), skaicius (sveikas), vienas, keli, lentele (eilutės ir stulpeliai),
// darbai (darbų lentelė su valandų skaičiuokle), darbas (vienas iš darbų lentelės), zingsniai (darbo žingsnių lentelė).
// Tekste {DATA} pristatymo data, {TERMINAS} atsakymų terminas, {VADOVAS}, {IMONE}, {VARDAS}, {KONTAKTAS_*}, {DARBAS}.
const KLAUSIMYNAS = {
  versija: 1,
  roles: {
    vadovas: {
      pavadinimas: 'Klausimynas vadovui', antraste: 'Klausimynas<br> vadovui', trukme: 'apie 15 min.', lapas: 'Vadovui',
      pazadas: 'Kad paruoštume konkrečią strategiją, pasiūlymą ir demonstraciją su jūsų pavyzdžiu, norime suprasti jūsų verslą ir procesus giliau, nei spėjome susitikime.',
      ivadas: 'Šį puslapį pildote tik jūs, apie 15 min. Skyriams paruošėme atskirus puslapius: jie matys tik savo klausimus. Užtenka apytikslių skaičių; ko nežinote, praleiskite. Viskas išsisaugo automatiškai, atsakymus matome tik mes.',
      privalomi: 'Privaloma: tik 2 klausimas.'
    },
    skyrius: {
      pavadinimas: 'Klausimynas skyriui', antraste: 'Klausimynas<br> apie jūsų darbus', trukme: 'apie 20 min.', lapas: 'Skyriui',
      pazadas: 'Ieškome pasikartojančių darbų prie kompiuterio, kuriuos galėtų perimti DI darbuotojai, kad jums ir komandai liktų daugiau laiko svarbesniems darbams. DI darbuotojas darbą paruošia, o sprendimą priima ir rezultatą patvirtina žmogus.',
      ivadas: 'Pagal jūsų atsakymus paruošime demonstraciją su jūsų pavyzdžiu, konkrečią strategiją ir pasiūlymą, kuriuos pristatysime {DATA}. Apie 20 min. Užtenka apytikslių skaičių; ko nežinote, praleiskite. Atsakymus matys {VADOVAS} ir krei komanda. Slaptažodžių ir asmens kodų nerašykite.',
      privalomi: 'Privaloma: vardas ir pirmas darbas DI.'
    },
    it: {
      pavadinimas: 'Klausimynas apie sistemas', antraste: 'Klausimynas<br> apie sistemas', trukme: 'apie 10 min.', lapas: 'IT',
      pazadas: '{IMONE} ruošiasi su krei diegti DI darbuotojus. Kad strategijoje iš karto įvertintume jūsų sistemas ir apribojimus, prašome atsakyti į kelis klausimus.',
      ivadas: 'Apie 10 min. Slaptažodžių nerašykite. Ko nežinote, praleiskite. Viskas išsisaugo automatiškai.',
      privalomi: 'Privaloma: tik vardas.'
    }
  },
  klausimai: [
    // A. Vadovui
    {id: 'A1', role: 'vadovas', atsakyta: 'bet',
      pavadinimas: '1. Kurių skyrių ar komandų darbą nagrinėjame?',
      pagalba: 'Rinkitės tuos, kur daugiausia pasikartojančio darbo prie kompiuterio. Geriau, kad pildytų žmogus, kuris darbą daro pats, ne tik jo vadovas. Kiekvienam atsiųsime atskirą nuorodą.',
      laukai: [{raktas: 'skyriai', tipas: 'lentele', antraste: '1 Skyriai', eiluciu: 8, pradzioje: 3,
        stulpeliai: ['Skyrius ar komanda', 'Kas pildys (vardas, pareigos)', 'El. paštas'],
        pavyzdys: ['Pavyzdys: pardavimai', 'Jonas Jonaitis, vadybininkas', 'jonas@imone.lt']}]},
    {id: 'A2', role: 'vadovas', atsakyta: 'bet',
      pavadinimas: '2. Įsivaizduokime, kad susitinkame po metų ir esate labai patenkinti. Kas pasikeitė?',
      laukai: [{raktas: 'metai', tipas: 'tekstas', riba: 5000, privalomas: true, antraste: '2 Po metų',
        pavyzdys: 'Jei galite, skaičiais: užsakymai, apyvarta, žmonės, terminai, klaidos.'}]},
    {id: 'A3', role: 'vadovas', atsakyta: 'bet',
      pavadinimas: '3. Kurie 2-3 darbai ar procesai įmonėje šiandien suvalgo daugiausia laiko arba kainuoja daugiausia pinigų?',
      laukai: [{raktas: 'brangiausi', tipas: 'tekstas', riba: 5000, antraste: '3 Brangiausi procesai',
        pagalba: 'Kas juos daro ir kiek apytiksliai laiko per mėnesį tai užima? Kur dėl jų paskutinį kartą praradote pinigų ar klientą? Kurį vieną sutvarkius pajustumėte skirtumą pirmiausia?'}]},
    {id: 'A4', role: 'vadovas', atsakyta: 'bet',
      pavadinimas: '4. Kur įmonė šiandien neuždirba, nes žmonėms neužtenka laiko?',
      laukai: [{raktas: 'neuzdirba', tipas: 'tekstas', riba: 5000, antraste: '4 Kur neuždirba',
        pavyzdys: 'Pavyzdžiui: nespėjate atsakyti į užklausas, pateikti pasiūlymų, dalyvauti konkursuose, grįžti pas senus klientus.',
        pagalba: 'Kam komanda skirtų atgautą laiką ir kur tai uždirbtų daugiau ar sutaupytų?'}]},
    {id: 'A5', role: 'vadovas', atsakyta: 'bet',
      pavadinimas: '5. Kas dalyvaus strategijos ir pasiūlymo pristatyme {DATA}?',
      pagalba: 'Kvieskite sprendimų priėmėjus ir bent po vieną žmogų iš kiekvieno skyriaus, kuris dirbs su DI darbuotojais. Kvietimą išsiųsime šiais adresais.',
      laukai: [{raktas: 'dalyviai', tipas: 'lentele', antraste: '5 Dalyviai', eiluciu: 10, pradzioje: 3,
        stulpeliai: ['Vardas, pavardė', 'Pareigos', 'El. paštas', 'Pristatyme (taip / ne / gal)'],
        pavyzdys: ['Pavyzdys: Ona Onaitė', 'direktorė', 'ona@imone.lt', 'taip']}]},
    {id: 'A6', role: 'vadovas', atsakyta: 'bet',
      pavadinimas: '6. Jei strategija ir pasiūlymas tiks, kada norėtumėte pradėti?',
      laukai: [
        {raktas: 'pradzia', tipas: 'trumpas', riba: 300, antraste: '6 Kada pradėti', etikete: 'Kada?',
          pavyzdys: 'Pavyzdys: gruodžio pradžioje, po metų uždarymo.'},
        {raktas: 'atsakingi', tipas: 'tekstas', riba: 5000, antraste: '6 Atsakingi už diegimą',
          etikete: 'Kas jūsų pusėje bus atsakingas už diegimą visoje įmonėje ir kas kiekviename skyriuje?'}]},
    {id: 'A7', role: 'vadovas', atsakyta: 'bet',
      pavadinimas: '7. Ko DI neturėtų matyti ir kas duoda prieigas?',
      laukai: [
        {raktas: 'neliesti', tipas: 'tekstas', riba: 5000, antraste: '7 DI neturėtų matyti', etikete: 'Ko DI neturėtų matyti?',
          pavyzdys: 'Pavyzdžiui: atlyginimai, sutartys, klientų asmens duomenys, užsakovo sistemos.'},
        {raktas: 'itKontaktas', tipas: 'trumpas', riba: 300, antraste: '7 IT kontaktas',
          etikete: 'Kas pas jus tvarko el. paštą ir sistemas: savas žmogus ar IT įmonė? Įrašykite vardą ir kontaktą.',
          pagalba: 'Jam paruošime trumpą puslapį apie sistemas (apie 10 min.).'}]},
    {id: 'A8', role: 'vadovas', atsakyta: 'bet',
      pavadinimas: '8. Ar įmonėje kas nors jau naudoja DI (ChatGPT, Copilot, Claude ar kt.)?',
      laukai: [{raktas: 'diImoneje', tipas: 'tekstas', riba: 5000, antraste: '8 DI patirtis',
        pagalba: 'Kam naudoja ir kas pavyko ar nepavyko? Kokių klausimų ar abejonių dėl DI girdite iš komandos? Į juos atsakysime pristatyme.'}]},

    // B. Skyriui
    {id: 'B1', role: 'skyrius', atsakyta: 'pirmas',
      pavadinimas: '1. Jūsų vardas ir pareigos',
      laukai: [
        {raktas: 'vardas', tipas: 'trumpas', riba: 300, privalomas: true, antraste: '1 Vardas ir pareigos', etikete: 'Vardas, pareigos'},
        {raktas: 'zmones', tipas: 'skaicius', riba: 100000, antraste: '1 Žmonių prie kompiuterio', etikete: 'Kiek žmonių skyriuje dirba prie kompiuterio?'}]},
    {id: 'B2', role: 'skyrius', atsakyta: 'darbai',
      pavadinimas: '2. Kurie pasikartojantys darbai prie kompiuterio jūsų skyriuje užima daugiausia laiko? Iki 5.',
      pagalba: 'Rinkitės tuos, kurie užima daugiausia laiko, padėtų uždirbti daugiau, jei būtų atliekami greičiau, arba duotų įmonei daugiausia naudos. Svarbiausias pirmas. Bent vienam darbui įrašykite visus skaičius: kiek kartų per mėnesį darbą atlieka vienas žmogus (jei žinote per savaitę, padauginkite iš 4), kiek minučių trunka vienas kartas nuo pradžios iki galo, kiek žmonių jį daro.',
      pavyzdziai: 'Kad būtų lengviau prisiminti: užklausos, patikslinantys klausimai ir pasiūlymai klientams; sąmatos ir kainų skaičiavimas; sąskaitų suvedimas ir sutikrinimas su užsakymais; ataskaitos iš Excel ar kitų programų; duomenų perkėlimas iš vienos programos į kitą; sutarčių ir dokumentų ruošimas ir tikrinimas; priminimai ir pakartotiniai laiškai; darbuotojų paieška ir dokumentai.',
      laukai: [{raktas: 'darbai', tipas: 'darbai', antraste: '2 Darbai', eiluciu: 5, pradzioje: 3,
        stulpeliai: ['Darbas', 'Kartų per mėn. (vienas žmogus)', 'Min. vienam kartui', 'Kiek žmonių daro', 'Kur klaida brangiausia'],
        pavyzdys: ['Pavyzdys: pasiūlymai klientams', '20', '60', '2', 'neteisinga kaina']}]},
    {id: 'B3', role: 'skyrius', atsakyta: 'pirmas',
      pavadinimas: '3. Kurį vieną darbą iš lentelės DI turėtų perimti pirmą?',
      laukai: [
        {raktas: 'pirmas', tipas: 'darbas', riba: 300, privalomas: true, antraste: '3 Pirmas darbas', etikete: 'Darbo pavadinimas',
          pagalba: 'DI pirmiausia tinka darbas, kuris kartojasi dažnai, užima daugiausia valandų per mėnesį ir kaskart daromas tais pačiais žingsniais. Galutinį pasirinkimą patvirtinsime kartu.'},
        {raktas: 'kodel', tipas: 'tekstas', riba: 5000, antraste: '3 Kodėl', etikete: 'Kodėl būtent jį?',
          pavyzdys: 'Pavyzdys: kartojasi kasdien, žingsniai visada tie patys, čia daugiausia klaidų.'}]},
    {id: 'B4', role: 'skyrius', atsakyta: 'bet',
      pavadinimas: '4. Darbo „{DARBAS}“ grandinė žingsnis po žingsnio',
      pavadinimasBe: '4. Darbo, kurį pasirinkote 3 klausime, grandinė žingsnis po žingsnio',
      pagalba: 'Papasakokite, kaip šis darbas buvo atliktas paskutinį kartą, nuo pradžios iki galo. Iš to statysime demonstraciją ir planą: kurią dalį perima DI darbuotojas, o kur lieka žmogus.',
      laukai: [
        {raktas: 'gPradzia', tipas: 'tekstas', riba: 5000, antraste: '4a Pradžia', grupe: 'a) Pradžia',
          etikete: 'Nuo ko darbas prasideda ir kur tai ateina? Kas tai pamato pirmas?',
          pavyzdys: 'Pavyzdžiui: laiškas, skambutis, žinutė WhatsApp, failas, įrašas sistemoje, data, kai reikia ataskaitos.'},
        {raktas: 'gZingsniai', tipas: 'zingsniai', antraste: '4b Žingsniai', grupe: 'b) Žingsniai', eiluciu: 12, pradzioje: 4,
          etikete: 'Ką darote iš eilės, kokioje programoje ar faile, iš kur imate informaciją ir kiek maždaug minučių tai trunka?',
          pagalba: 'Jei žingsnis skiriasi priklausomai nuo atvejo, įrašykite dažniausią. Laukimą (pvz., kliento atsakymo) irgi įrašykite kaip žingsnį.',
          stulpeliai: ['Ką darote', 'Programa ar failas', 'Iš kur informacija', 'Min.'],
          pavyzdziai: [['Perskaitau užklausą', 'Paštas', 'Kliento laiškas', '3'], ['Išsiunčiu patikslinančius klausimus', 'Paštas', 'Mūsų įprasti klausimai', '10'], ['Laukiu atsakymo (1-3 d.)', '', 'Klientas', ''], ['Suskaičiuoju kainą', 'Excel skaičiuoklė', 'Kainoraštis, tiekėjų kainos', '40'], ['Surašau pasiūlymą', 'Word šablonas', 'Skaičiuoklė', '30'], ['Išsiunčiu PDF', 'Paštas', '', '5']]},
        {raktas: 'gSprendimai', tipas: 'tekstas', riba: 5000, antraste: '4c Sprendimai ir taisyklės', grupe: 'c) Sprendimai ir taisyklės',
          etikete: 'Kur šiame darbe sprendžiate patys ir pagal ką? Ką turi patvirtinti kitas žmogus ir kiek tai paprastai užtrunka?',
          pavyzdys: 'Pavyzdžiui: kaina, nuolaida, terminas, prioritetas, kurį tiekėją rinktis. Nuolaidą virš 10 % tvirtina vadovas, paprastai per dieną.'},
        {raktas: 'gRezultatas', tipas: 'tekstas', riba: 5000, antraste: '4d Rezultatas ir patikra', grupe: 'd) Rezultatas ir patikra',
          etikete: 'Kas gaunasi pabaigoje ir kam perduodama? Kas ir ką patikrina prieš išsiunčiant ar išsaugant?',
          pavyzdys: 'Pavyzdžiui: PDF pasiūlymas klientui, sąskaita, ataskaita vadovui, įrašas sistemoje.'},
        {raktas: 'gTrukme', tipas: 'trumpas', riba: 300, antraste: '4e Trukmė ir laukimas', grupe: 'e) Trukmė ir laukimas',
          etikete: 'Kiek valandų darbo ir kiek dienų kalendoriuje nuo pradžios iki pabaigos? Kur darbas dažniausiai laukia?',
          pavyzdys: 'Pavyzdys: apie 2 val. darbo, 3-5 dienos kalendoriuje; laukia kliento atsakymo ir vadovo patvirtinimo.'},
        {raktas: 'gIsimtys', tipas: 'tekstas', riba: 5000, antraste: '4f Išimtys', grupe: 'f) Išimtys',
          etikete: 'Kas skiriasi nuo karto prie karto? Kokia dalis atvejų nestandartiniai (apytiksliai procentais) ir ką darote tada?'},
        {raktas: 'gKlaidos', tipas: 'tekstas', riba: 5000, antraste: '4g Klaidos ir perdarymai', grupe: 'g) Klaidos ir perdarymai',
          etikete: 'Kur dažniausiai suklystama ar perdaroma? Paskutinis atvejis: kas nutiko ir kiek kainavo laiku ar pinigais?'}]},
    {id: 'B5', role: 'skyrius', atsakyta: 'bet',
      pavadinimas: '5. Pavyzdys demonstracijai (pasirinktinai)',
      laukai: [{raktas: 'pavyzdys', tipas: 'tekstas', riba: 5000, antraste: '5 Pavyzdys demonstracijai',
        pagalba: 'Įklijuokite šio darbo pradžią ir pabaigą: pvz., gautą užklausą ir išsiųstą pasiūlymą. Vardus ir sumas galite pakeisti. Jei turite po ranka, atsiųskite ir tai, kuo naudojatės kelyje (šabloną, kainoraštį, skaičiuoklę) be slaptų skaičių el. paštu {KONTAKTAS_PASTAS}. Jei nespėjate, nieko tokio: demonstraciją paruošime pagal jūsų aprašymą.'}]},
    {id: 'B6', role: 'skyrius', atsakyta: 'bet',
      pavadinimas: '6. Kur dėl šių darbų įmonė praranda pinigus?',
      laukai: [{raktas: 'pinigai', tipas: 'tekstas', riba: 5000, antraste: '6 Prarasti pinigai',
        pagalba: 'Prisiminkite paskutinį atvejį: kas nutiko ir kiek tai kainavo? Ko šiandien nespėjate, nes laiką suvalgo pasikartojantys darbai: atsakyti klientams greičiau, pateikti daugiau pasiūlymų, dalyvauti konkursuose, susisiekti su klientais pakartotinai? Kas būtų kitaip, jei šis darbas užtruktų tris kartus trumpiau?'}]},
    {id: 'B7', role: 'skyrius', atsakyta: 'bet',
      pavadinimas: '7. Programos ir failai, kuriuose gyvena šis darbas',
      laukai: [
        {raktas: 'programos', tipas: 'keli', antraste: '7 Programos', etikete: 'Kokias programas naudojate šiam darbui?',
          pasirinkimai: ['Paštas (Outlook, Gmail)', 'Excel', 'Word', 'Apskaitos programa', 'Klientų programa (CRM)', 'Gamybos, sandėlio ar ERP sistema', 'Užsakovo sistema ar portalas', 'WhatsApp, Viber, Teams', 'Popierius', 'Kita']},
        {raktas: 'programosKurios', tipas: 'trumpas', riba: 300, antraste: '7 Kurios programos', etikete: 'Kurios tiksliai (apskaitos, CRM, ERP, portalas, kita)?',
          pavyzdys: 'Pavyzdys: Rivilė, Pipedrive, užsakovo portalas Ariba.'},
        {raktas: 'failai', tipas: 'keli', antraste: '7 Failai', etikete: 'Kur laikote darbo failus?',
          pasirinkimai: ['Kompiuteryje', 'Įmonės serveryje', 'OneDrive / SharePoint', 'Google Drive', 'Dropbox', 'Kita']},
        {raktas: 'failaiKita', tipas: 'trumpas', riba: 300, antraste: '7 Kita failų vieta', etikete: 'Kita vieta',
          rodomaKai: {raktas: 'failai', reiksme: 'Kita'}}]},
    {id: 'B8', role: 'skyrius', atsakyta: 'bet',
      pavadinimas: '8. Ar skyriuje kas nors jau naudoja DI (ChatGPT, Copilot, Claude ar kt.)?',
      laukai: [{raktas: 'diSkyriuje', tipas: 'tekstas', riba: 5000, antraste: '8 DI patirtis',
        pagalba: 'Kam naudoja ir kas nepavyko? Kokių klausimų ar abejonių dėl DI girdėjote iš komandos? Į juos atsakysime pristatyme.'}]},

    // C. IT arba sistemų žmogui
    {id: 'C1', role: 'it', atsakyta: 'pirmas',
      pavadinimas: '1. Jūsų vardas ir pareigos',
      laukai: [
        {raktas: 'itVardas', tipas: 'trumpas', riba: 300, privalomas: true, antraste: '1 Vardas ir pareigos', etikete: 'Vardas, pareigos'},
        {raktas: 'itKas', tipas: 'vienas', antraste: '1 Darbuotojas ar IT įmonė', etikete: 'Esate:', pasirinkimai: ['Įmonės darbuotojas', 'IT paslaugų įmonė']}]},
    {id: 'C2', role: 'it', atsakyta: 'pirmas',
      pavadinimas: '2. El. paštas ir dokumentai',
      laukai: [
        {raktas: 'pastas', tipas: 'vienas', antraste: '2 Paštas', pasirinkimai: ['Microsoft 365', 'Google Workspace', 'Kita']},
        {raktas: 'pastasKita', tipas: 'trumpas', riba: 300, antraste: '2 Kitas paštas', etikete: 'Kuri?', rodomaKai: {raktas: 'pastas', reiksme: 'Kita'}},
        {raktas: 'pastoAdmin', tipas: 'tekstas', riba: 5000, antraste: '2 Pašto administravimas',
          etikete: 'Kas administruoja? Ar galima leisti DI įrankiams jungtis prie pašto ir kalendoriaus (reikės administratoriaus sutikimo)?'}]},
    {id: 'C3', role: 'it', atsakyta: 'bet',
      pavadinimas: '3. Pagrindinės verslo sistemos',
      pagalba: 'Apskaita, CRM, ERP, sandėlis, gamyba, užsakovų portalai, kita.',
      laukai: [{raktas: 'sistemos', tipas: 'lentele', antraste: '3 Sistemos', eiluciu: 10, pradzioje: 3,
        stulpeliai: ['Sistema', 'Kam naudojama', 'Eksportas į Excel / CSV', 'API ar integracijos', 'Kas administruoja'],
        pavyzdys: ['Pavyzdys: Rivilė', 'apskaita, sąskaitos', 'taip', 'nežinau', 'IT įmonė']}]},
    {id: 'C4', role: 'it', atsakyta: 'bet',
      pavadinimas: '4. Kompiuteriai ir tinklas',
      laukai: [
        {raktas: 'kompiuteriai', tipas: 'keli', antraste: '4 Kompiuteriai', etikete: 'Darbuotojų kompiuteriai', pasirinkimai: ['Windows', 'Mac']},
        {raktas: 'diegimas', tipas: 'vienas', antraste: '4 Programų diegimas', etikete: 'Ar darbuotojai gali patys diegti programas?', pasirinkimai: ['Gali patys', 'Reikia administratoriaus']},
        {raktas: 'apribojimai', tipas: 'keli', antraste: '4 Apribojimai', etikete: 'Apribojimai',
          pasirinkimai: ['VPN', 'Tik vidinis tinklas', 'Draudžiami debesų įrankiai', 'Antivirusas blokuoja diegimus', 'Kita']},
        {raktas: 'apribojimaiKita', tipas: 'tekstas', riba: 5000, antraste: '4 Apribojimai plačiau', etikete: 'Plačiau apie apribojimus'}]},
    {id: 'C5', role: 'it', atsakyta: 'bet',
      pavadinimas: '5. Duomenų taisyklės',
      laukai: [{raktas: 'taisykles', tipas: 'tekstas', riba: 5000, antraste: '5 Duomenų taisyklės',
        pagalba: 'Ko DI negali matyti ar siųsti už įmonės ribų? Ar yra reikalavimų iš užsakovų sutarčių, ISO ar asmens duomenų apsaugos, kuriuos turime žinoti? Kas tvirtina naujų programų ir paslaugų naudojimą įmonėje?'}]},
    {id: 'C6', role: 'it', atsakyta: 'bet',
      pavadinimas: '6. Kas jūsų pusėje padės diegimo metu?',
      laukai: [{raktas: 'itPagalba', tipas: 'trumpas', riba: 300, antraste: '6 Kontaktas diegimui', etikete: 'Vardas, kontaktas, kada pasiekiamas'}]}
  ]
};

// Pagalbinės funkcijos: bendros puslapiui ir Apps Script. Kitų failų funkcijas (jobHours) kviečia tik vykdymo metu.
function klausimynoRole(role) { return KLAUSIMYNAS.roles[role] ? role : 'skyrius'; }
function klausimynoKlausimai(role) {
  role = klausimynoRole(role);
  return KLAUSIMYNAS.klausimai.filter(function (k) { return k.role === role; });
}
function klausimynoLaukai(role) {
  return klausimynoKlausimai(role).reduce(function (visi, k) { return visi.concat(k.laukai); }, []);
}
function klausimynoLaukas(raktas) {
  for (var i = 0; i < KLAUSIMYNAS.klausimai.length; i++) {
    var k = KLAUSIMYNAS.klausimai[i];
    for (var j = 0; j < k.laukai.length; j++) if (k.laukai[j].raktas === raktas) return {klausimas: k, laukas: k.laukai[j]};
  }
  return null;
}
function reiksmeTuscia(reiksme) {
  if (reiksme === undefined || reiksme === null) return true;
  if (Array.isArray(reiksme)) return !reiksme.some(function (r) { return !reiksmeTuscia(r); });
  if (typeof reiksme === 'object') return !Object.keys(reiksme).some(function (k) { return !reiksmeTuscia(reiksme[k]); });
  return String(reiksme).trim() === '';
}
function laukasRodomas(laukas, atsakymai) {
  if (!laukas.rodomaKai) return true;
  var verte = atsakymai[laukas.rodomaKai.raktas];
  return Array.isArray(verte) ? verte.indexOf(laukas.rodomaKai.reiksme) >= 0 : verte === laukas.rodomaKai.reiksme;
}
function eilutesTinka(laukas, eilutes, stulpeliu) {
  return Array.isArray(eilutes) && eilutes.length <= laukas.eiluciu && eilutes.every(function (e) {
    return Array.isArray(e) && e.length === stulpeliu && e.every(function (c) { return typeof c === 'string' && c.length <= 300; });
  });
}
function darbasTinka(d) {
  return d && typeof d === 'object' && ['name', 'count', 'minutes', 'people', 'risk'].every(function (k) { return typeof d[k] === 'string' && d[k].length <= 300; });
}
function reiksmeTinka(laukas, reiksme) {
  if (laukas.tipas === 'tekstas' || laukas.tipas === 'trumpas' || laukas.tipas === 'darbas') return typeof reiksme === 'string' && reiksme.length <= laukas.riba;
  if (laukas.tipas === 'vienas') return reiksme === '' || laukas.pasirinkimai.indexOf(reiksme) >= 0;
  if (laukas.tipas === 'keli') {
    return Array.isArray(reiksme) && reiksme.every(function (v, i) { return laukas.pasirinkimai.indexOf(v) >= 0 && reiksme.indexOf(v) === i; });
  }
  if (laukas.tipas === 'skaicius') return reiksme === '' || (typeof reiksme === 'string' && /^\d{1,6}$/.test(reiksme) && Number(reiksme) <= laukas.riba);
  if (laukas.tipas === 'lentele' || laukas.tipas === 'zingsniai') return eilutesTinka(laukas, reiksme, laukas.stulpeliai.length);
  if (laukas.tipas === 'darbai') return Array.isArray(reiksme) && reiksme.length <= laukas.eiluciu && reiksme.every(darbasTinka);
  return false;
}
function darbuPavadinimai(jobs) {
  var vardai = [];
  (jobs || []).forEach(function (darbas) {
    var vardas = String(darbas.name || '').trim();
    if (vardas && vardai.indexOf(vardas) < 0) vardai.push(vardas);
  });
  return vardai;
}
function klausimasAtsakytas(klausimas, atsakymai) {
  if (klausimas.atsakyta === 'darbai') return (atsakymai.darbai || []).some(function (darbas) { return jobHours(darbas) !== null; });
  var laukai = klausimas.laukai.filter(function (l) { return laukasRodomas(l, atsakymai); });
  var yra = function (l) { return !reiksmeTuscia(atsakymai[l.raktas]); };
  if (klausimas.atsakyta === 'pirmas') return yra(klausimas.laukai[0]);
  if (klausimas.atsakyta === 'visi') return laukai.every(yra);
  return laukai.some(yra);
}
function atsakytuSkaicius(atsakymai, role) {
  var klausimai = klausimynoKlausimai(role);
  return {n: klausimai.filter(function (k) { return klausimasAtsakytas(k, atsakymai); }).length, viso: klausimai.length};
}
function trukstamiLaukai(atsakymai, role) {
  return klausimynoLaukai(role).filter(function (l) { return l.privalomas && reiksmeTuscia(atsakymai[l.raktas]); });
}
// Tik matomi, tinkami ir netušti atsakymai: tai, kas pateikiama ir atsisiunčiama.
function pateikiamiAtsakymai(atsakymai, role) {
  var rezultatas = {};
  klausimynoLaukai(role).forEach(function (l) {
    var verte = atsakymai[l.raktas];
    if (reiksmeTuscia(verte) || !laukasRodomas(l, atsakymai) || !reiksmeTinka(l, verte)) return;
    rezultatas[l.raktas] = JSON.parse(JSON.stringify(verte));
  });
  return rezultatas;
}
// Atsakymai tekstu (atsisiuntimui, Sheet lapui, Pipedrive pastabai). fill: {VIETOS} pakeitimo funkcija.
function klausimoPavadinimas(klausimas, atsakymai, fill) {
  var tekstas = klausimas.pavadinimas;
  if (klausimas.pavadinimasBe) {
    var darbas = String(atsakymai.pirmas || '').trim();
    tekstas = darbas ? klausimas.pavadinimas.replace('{DARBAS}', function () { return darbas; }) : klausimas.pavadinimasBe;
  }
  return fill ? fill(tekstas) : tekstas;
}
function skaiciusTekstu(n) { return String(Math.round(n * 100) / 100).replace('.', ','); }
function laukoTekstas(laukas, verte) {
  if (reiksmeTuscia(verte)) return '';
  if (laukas.tipas === 'darbai') {
    var eil = verte.filter(function (d) { return Object.keys(d).some(function (k) { return d[k].trim(); }); }).map(function (d, i) {
      var val = jobHours(d);
      return (i + 1) + '. ' + (d.name.trim() || '?') + ' · ' + (d.count.trim() || '?') + ' k./mėn. · ' + (d.minutes.trim() || '?') + ' min. · ' + (d.people.trim() || '1') + ' žm.' + (val !== null ? ' · ' + skaiciusTekstu(val) + ' val./mėn.' : '') + (d.risk.trim() ? ' · klaida: ' + d.risk.trim() : '');
    });
    var viso = totalHours(verte);
    return eil.join('\n') + (viso ? '\nIš viso: ' + skaiciusTekstu(viso) + ' val./mėn.' : '');
  }
  if (laukas.tipas === 'lentele' || laukas.tipas === 'zingsniai') {
    return verte.filter(function (e) { return e.some(function (c) { return c.trim(); }); }).map(function (e, i) {
      return (i + 1) + '. ' + e.map(function (c, j) { return laukas.stulpeliai[j] + ': ' + (c.trim() || '-'); }).join(' · ');
    }).join('\n');
  }
  if (Array.isArray(verte)) return verte.join(', ');
  return String(verte).trim();
}
function atsakymaiTekstu(atsakymai, role, fill) {
  var dalys = [];
  klausimynoKlausimai(role).forEach(function (k) {
    dalys.push(klausimoPavadinimas(k, atsakymai, fill));
    var matomi = k.laukai.filter(function (l) { return laukasRodomas(l, atsakymai); });
    var eil = matomi.map(function (l) {
      var t = laukoTekstas(l, atsakymai[l.raktas]);
      if (!t) return '';
      if (l.tipas === 'lentele' || l.tipas === 'zingsniai' || l.tipas === 'darbai') return (l.grupe ? l.grupe + '\n' : '') + t;
      var zyme = l.etikete ? (l.grupe ? l.grupe + ' ' : '') + l.etikete.replace(/[?:]$/, '') + ': ' : '';
      return (zyme && t.indexOf('\n') >= 0 ? zyme + '\n' : zyme) + t;
    }).filter(Boolean);
    dalys.push(eil.length ? eil.join('\n') : 'Neatsakyta');
    dalys.push('');
  });
  return dalys.join('\n');
}
