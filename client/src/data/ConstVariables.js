

/// CREATE CHARACTER
const racesList = ["Elb","Draconid", "Zwerg", "Gnom", "Ork", "Kobold", "Mensch", "Halbling"]
    const races = {
        Elb: {
            descr: "Vor vielen Jahrtausenden kamen die Elben auf die Welt, sie sind sehr langlebig, aber dafür auch weniger fruchtbar als andere Humanoide. Sie sind nach den Drachen eines der ältesten Völker in den Dragonlands. Außerdem sind sie sehr naturverbunden und verstanden sich von Anfang an gut mit den Drachen und lernten von Ihnen die (Druiden-)Magie zu beherrschen. Ihr Ursprung kommt von der Insel Iladrien direkt vor der Ostküste des Kontinents, die dort wachsenden riesigen Laubbäume sind uralt und durchwachsen von Magie, sie sind den Elben das Allerheiligste.",
            ability: {
                name: "Im Wald zuhause",
                descr: "Elben leben im besonderen Einklang mit der Natur, besonders in Wäldern gibt es ihnen Kraft, so dass alle Proben um 1 erleichtert sind."
            }
        },
        Draconid: {
            descr: "Die Draconiden entstanden, so heißt es, durch die Druidenmagie der Elben und Drachen. Diese Magie ermöglicht es sich in bestimmte Formen zu verwandeln, unter anderem auch die Drachenform für Elben und die Elbenform für Drachen, aus dieser magischen Verbindung entstand eine Inkarnation zwischen beiden Formen, die für immer in dieser verweilten, die so genannten Draconiden. Sie sind äußerst selten anzutreffen und bevorzugen meist ein Leben als Einsiedler, diese Abneigung gegenüber größeren Gemeinschaften stammt wahrscheinlich aus ihrer Drachennatur.",
            ability:{
                name: "Drachenhaut",
                descr:"Sie sind immun gegen das ihnen zugehörige Element (zB Feuer, bei besondere Merkmale eintragen) und haben einen natürlichen Rüstungsbonus von  einem W12."
            }
        },
        Zwerg: {
            descr: "Ebenfalls vor Jahrtausenden doch etwas später als die Elben kamen die Zwerge auf die Welt. Sie waren etwas weniger langlebig als die Elben und etwas kleiner, aber dafür sehr robust und sie liebten alle Arten von Stein und Erzen. Dafür gruben sie sich tief in die gewaltigen Bergmassive der Erde. So schufen sie kollosale unterirdische Bauwerke und Werkstätten. Anders als die Elben verstanden sich die Zwerge nicht so gut mit den Drachen und es gab anfangs viel Streit und sogar Krieg untereinander. Dies konnte allerdings mit der Zeit beigelegt werden.",
            ability:{
                name: "Im Fels zuhause",
                descr: "Zwerge haben eine natürliche Verbindung zu dem Fels der Berge, befinden Sie sich unter Tage fühlen Sie sich zu Hause, alle Proben sind um 1 erleichtert."
            }
        },
        Gnom: {
            descr: "Es wird darüber spekuliert, ob die Zwerge die Gnome tief in den Bergen fanden, die noch länger dort lebten oder ob die Gnome kurze Zeit später auf der Welt auftauchten. Sie teilten dieselben Interessen, die Gnome sind jedoch weniger robust, dafür sind sie wegen ihrer geschickten Finger sehr talentiert in der Ingenieurskunst.",
            ability:{
                name: "Geschickte Finger",
                descr:"ihre kleinen geschickten Finger kommen den Gnomen beim Konstruieren und Handwerken zu gute. Alle missglückten Handwerksproben können durch eine GSK- Probe gerettet werden."
            }
        },
        Ork: {
            descr: "Nach den Zwergen und Gnomen kamen die Orks auf die Welt, sie waren zunächst ruhelos und streitsam, ein Nomadenvolk, dass durch die ganze Welt reiste. Mit der Zeit wurden sie ruhiger und gründeten Siedlungen, während andere weiter ein unbeständiges Nomadenleben wählten. Sie sind wie die Elben sehr naturverbunden und dienten oftmals als Vermittler zwischen den Völkern. Mit den Drachen hatten sie nicht viel Kontakt, sondern existierten in gegenseitigem Wohlwollen nebeneinander. Ihr Wissen wurde nur durch Erzählungen weitergegeben.",
            ability:{
                name: "Zornige Kämpfer",
                descr:": Orks können einen wilden Zorn verspüren, wenn sie verwundet werden, der ihnen neue Energie verleiht. Bei erlittenem Schaden wird ein W6 gewürfelt, bei 1 oder 6 wird die Ausdauer wieder vollständig hergestellt."
            }
        },
        Kobold: {
            descr: "Die Kobolde sind ähnlich wie Elben, Halblinge und Orks sehr naturverbunden und sind in etwa zur gleichen Zeit wie die Orks in den Dragonlands aufgetaucht, sie scheinen auch, was den Körperbau angeht mit den Orks verwandt zu sein, obgleich sie um einiges kleiner und flinker sind. Zudem wird den Kobolden ein höchst spezieller Humor und eine Vorliebe für allerlei Streiche und Schabernack nachgesagt. Die meisten von ihnen leben gerne versteckt in den Wäldern in kleineren gemeinsamen Siedlungen, einige jedoch fühlen sich auch in den großen Städten wohl, nicht selten auf Kosten der dort lebenden Einwohner.",
            ability:{
                name: "Glück im Unglück",
                descr:"Ihre geringe Größe und eine gewisse Intuition lassen lassen die Kobolde manchmal besonders beeindruckende Ausweichmanöver durchführen. Jede Ausweichprobe kann einmal wiederholt werden."
            }
        },
        Mensch: {
            descr: "Keiner weiß genau wie lange die Menschen bereits auf der Welt sind. Auf Grund ihrer, im Vergleich zu zum Beispiel den Zwergen oder Elben, etwas kürzeren Lebensspanne, haben sie sehr viel mehr Generationen durchlaufen und die Ursprünge ihrer Existenz gleichen eher Legenden als tatsächlicher Geschichtsschreibung. Offenbar haben sie früher auf einer Insel oder einem anderen Kontinent gelebt, in den Geschichten heißt es diese Heimat wurde durch eine gewaltige Überschwemmung zerstört und sie kamen als Seefahrer in die Dragonlands. Über die Menschen hieß es, dass sie sehr sprunghaft sein können, aber auch, dass sie einen unstillbaren Wissensdurst besitzen. Sie waren es, die gemeinsam mit den Drachen das Wesen der Welt studierten und so als erstes die (Arkan-)Magie erlernten.",
            ability:{
                name: "Handelsgeschick",
                descr:"Menschen haben sich ein starkes Talent für Handel angeeignet, so bekommen sie bessere Preise bei Händlern, für das Feilschen muss anstelle der Redekunst lediglich eine Charismaprobe gewürfelt werden. Dabei können die Punkte von Redekunst trotzdem verwendet werden."
            }
        },
        Halbling: {
            descr: "Wann die Halblinge das erste mal gesichtet wurden wissen weder sie selbst noch irgend ein anderes Volk. Sie bevorzugten es schon immer für sich in friedlicher Abgeschiedenheit zu leben und Geschichtsschreibung sowie die Geschicke der Welt interessieren sie nicht. Sie haben eine innige Liebe zu allem, was wächst und gedeiht entwickelt und verstehen es mit der Natur im Einklang zu leben.",
            ability:{
                name: "Grüner Daumen",
                descr:"Die Halblinge lieben alles, was wächst. Bei Kräuterkunde und Landwirtschaft muss lediglich eine beliebige der drei Proben gewürfelt werden."
            }
        }
    }
    const classList = ["Assassine", "Magier", "Kleriker", "Schildwache", "Waldläufer", "Waffenmeister", "Druide", "Monk"]
    const classDescription = {
        Assassine: "Assassinen sind geschickte Kämpfer (können zwei Einhandwaffen führen) und absolut tödlich aus dem Hinterhalt. Sie können es vermeiden, gesehen zu werden (steigern Heimlichkeitstalente x2) und wissen, wie man auf vielfältige Weise Feinde zu Fall bringt.",
        Magier: "Magier besitzen das magische Talent (zusätzliches Attribut Mana, können einen Zauberstab führen), ohne das es nicht möglich ist Zauber zu wirken. So sind sie in der Lage die arkanen Künste zu erlernen und zu studieren, die bekanntesten Fachgebiete sind die Feuermagie, die Eismagie, die Blitzmagie und die Arkanmagie. Außerdem sind Magier äußerst gebildet (steigern Wissenstalente x2) und gut vertraut mit sozialen Gefügen (steigern Gesellschaftstalente x2).",
        Kleriker:"Kleriker der Kirche des Lichts glauben an das ewige Fortbestehen des Lichts, aus dem sie ihre Kraft ziehen (zusätzliches Attribut Spirituelle Kraft). Mit dieser Kraft schützen sie ihre Mitstreiter und bekämpfen die Dunkelheit. Dabei verbreiten sie ihren Glauben (steigern Gesellschaftstalente x2) und können ihre Verbündeten segnen (diese können dann einmalig einen Wurf wiederholen).",
        Schildwache: "Schildwachen sind dafür ausgebildet worden in schweren Rüstungen zu kämpfen (kein GSK-Malus bei Plattenrüstungen) und viel auszuhalten. Zudem sind sie geschickt im Einsatz ihres Schildes und können dabei sogar noch eine Zweihandwaffe führen. So werden sie für Angreifer zur unüberwindbaren Festung.",
        Waffenmeister: "Waffenmeister sind sehr begabt im Umgang mit allen Arten von Nahkampfwaffen (steigern Nahkampfwaffen x2), ihr Talent geht sogar so weit, dass sie in der Lage sind, zwei Einhandwaffen gleichzeitig zu führen. Sie beherrschen verheerende Nahkampfangriffe und motivieren ihre Mitstreiter",
        Druide: "Druiden besitzen das magische Talent (zusätzliches Attribut Mana, können einen Zauberstab führen), das es ihnen ermöglicht sich in verschiedenste Formen zu verwandeln. Um diese Formen zu erlernen, erfordert es ein tiefes Verständnis für die Natur (steigern Naturtalente x2 und Wissenstalente x2). Verschiedene Formen bieten unterschiedliche Stärken, Druiden sind daher sehr flexibel und können so ihre Feinde auskontern.",
        Monk: "Die Mönche des Shao-Glaubens sind wahre Meister der Selbstbeherrschung (kann missglückte Würfe einmal wiederholen) und können die überall wirkenden entgegengesetzten Kräfte des Universums spüren und nutzen (zusätzliches Attribut Spirituelle Kraft). Sie glauben an das Gleichgewicht in allem, was existiert und können durch ihre Konzentration sowohl Verbündeten helfen als auch erstaunliche Kräfte entfesseln. Ihre Meditation macht sie besonders weise (steigern Gesellschaftsfertigkeiten x2).",
    }


    
    const originList = ["Königreich Welles", "Freies Land Thamor",  "Königreich Beltamor", "Kaiserreich Medorien", "Königreich Algor", "Wikingerreich Thornheim", "Königreich Ethelion"]
    const countries = {
        "Königreich Welles": {
            descr: "Das Königreich Welles erstreckt sich im Osten bis an den Fluss Argon, der die Grenze zum Königreich Beltamor darstellt. Im Norden gibt es Tannenwälder die sich bis an die Hänge der großen ständig von Eis und Schnee bedeckten Berge erstrecken, diese bilden die Nordgrenze von Welles. Diese Gegend im Norden von Welles gilt als verflucht, da hier unerklärliche Dinge geschehen sollen. Der zentral gelegene Wald besteht aus allerlei fantastischen Pflanzenarten und Tieren, dieser Teil wird als verzauberter Wald bezeichnet. Im Süden befindet sich ein Sumpfgebiet, es ist auf Grund der Unwegsamkeit des Geländes nicht ganz klar wo die Südgrenze liegt. An den Sumpf grenzt der Dschungel von Thamor. Im Westen des Landes lag einst eine große Steppe, die sich bis an die Feuerberge erstreckte, doch heute sind große Teile dieser Steppe totes Land, verdorben durch die dunkle Magie der Nekromantie, die sich von nord-westlicher Richtung aus in das Königreich ausbreitet. Am südwestlichen Ende dieser Steppe treffen sich mehrere Flüsse in einem großen See, hier treffen außerdem Sumpfgebiet, verzaubertert Wald, Steppe und die Ausläufer der Feuerberge und der Savanne aufeinander. Es ist ein zentraler Handelsknoten in der Gegend, hier befindet sich Wellles Hauptstadt Zalushne.",
            img:"Welles"
        },
        "Freies Land Thamor": {
            descr: "Thamor ist größtenteils von Menschen bevölkert, hier finden sich jedoch auch Vertreter aller anderen Völker die die Philosophie des Landes teilen. Die größte und einzige richtige Stadt des Landes ist Kul Fan Zan, sonst gibt es noch viele kleinere Siedlungen und Tempel des Gleichgewichts verteilt in dem riesigen Dschungel. Das Land selbst kennt in dem Sinne keine Grenzen befindet sich aber vollständig im Dschungel der wie das Land meist Thamor genannt wird. Im Süden des Landes befindet sich das riesige Delta des Argon, in dem sich riesige ebenfalls von Dschungel bewachsene säulenartige Inseln aus weißem Kalkstein befinden. Sehr weit im Süden auf diesen Inseln gibt es Kannibalen die eine Art Affengott anbeten.",
            img:"Thamor"
        },
        "Königreich Beltamor": {
            descr: "Das Königreich Beltamor befindet sich zentral im Kontinent und wird größtenteils von Menschen bevölkert. Es umfasst die landwirtschaftlich ertragreichen Graslande südlich von Elanon, sowie die etwas härtere Tundra nördlich von Elanon. Im Westen wird das Königreich durch den mächtigen Fluss Argon und im nordwesten durch den Fluss Elsar begrenzt, der in den Argon mündet. Im Süden endet das Königreich an dem Waldrand vom Dschungel bzw. dem Übergang von Grasland in Wüste. Hier im Süden von Beltamor befindet sich das Herzogtum Bellamour. Im Osten befindet sich das Auental am Hang zu den Rockies, es wird größtenteils von Halblingen bevölkert und gehört rein offiziell zum Königreich, wird aber seinem eigenen Einfluss überlassen. Im Norden am Ende der Tundra und im Nordosten grenzt Beltamor an das Königreich der Zwerge Algor.",
            img:"Beltamor"
        },
        "Kaiserreich Medorien": {
            descr: "Das Kaiserreich Medorien wird von vielen mythischen Lebewesen bevölkert, darunter Zentauren, Satyrn, Nymphen und Minotauren. Es gibt zwei große Städte in Medorien, Aratria und Fenabaskus. Der Regierungssitz des Senats ist in Aratria an der Mündung des Flusses Sular, hier gibt es außerdem große Gladiatorenarenen in denen Schaukämpfe für das Volk veranstaltet werden. Fenabaskus ist eine große Handelsstadt an der Küste im westlichen wüstenartigen Teil des Landes, in der man Leute aus aller Welt antreffen kann. Hier hat der Assassinenorden Schwarze Schlange seinen Ursprung. Der Teil östlich vom Sular ist eher mediterran. Im Norden am Übergang zum Grasland grenzt das Königreich Beltamor, im Nordwesten am Waldrand der Redwoods das Königreich der Elfen Ethelion. Westlich endet Medorien am Waldrand des Dschungels.",
            img:"Medorien"
        },
        "Königreich Algor": {
            descr: "Das Königreich Algor wird größtenteils von Zwergen bevölkert, es gibt ebenfalls einen großen Anteil von Gnomen, die größtenteils in der Stadt Dorapar im Tal der heißen Quellen leben. Hier werden die fortschrittlichsten Maschinen und Konstruktionen des Kontinents erfunden und gebaut, die oft mit Hilfe der Dampftechnologie aus den heißen Quellen betrieben werden. Sul Damor ist eine Stadt in einem Vulkan in dem sich riesige Schmieden und tiefe Minen befinden. Von hier aus erstrecken sich Tunnel durch das ganze Zwergengebirge. Östlich grenzt Algor an das Wikingerreich Thornheim und südwestlich an das Königreich Beltamor mit denen sie stets Handel betreiben. Nach Norden gibt es keine klare Grenze nur irgendwann wird das eisige Gebirge sogar den Zwergen zu harsch. Im Westen erstrecken sich Tunnel des Zwergenreichs bis zur Festung der Schneeelfen, hier endet das Königreich Algor.",
            img:"Algor"
        },
        "Wikingerreich Thornheim": {
            descr: "Das Wikingerreich Thornheim hat viele Fjorde im Osten und segelt mit seinen Langbooten über die Meere. Dabei werden nicht selten Plünderungen in weit entfernten Ländern unternommen, was zu Ruhm und Ehre unter den Bewohnern Thornheims führt. Nahezu jeder hier, auch die Frauen, vermag es mit Waffen umzugehen, da aus dem Norden, wo die Eiswüste an das Wikingerreich grenzt, gefährliche Kreaturen in das Land einfallen. Im Süden trennt der Fluss Aera und die spitzen Berge der Tanden Thornheim vom Königreich der Elfen Ethelion. Im Westen befindet sich das Königreich der Zwergen Algor.",
            img:"Thornheim"
        },
        "Königreich Ethelion": {
            descr: "Das Königreich der Elfen hat einen Teil auf dem Festland, der mit riesigen Mammutbäumen bewaldet ist, wegen der rötlichen Rinde werden diese auch Redwoods genannt, diese Rinde bietet einen natürlichen Schutz gegen Feuer. Im Norden grenzt der Wald an das Wikingerreich Thornheim im Süden an das Königreich Medorien. Im Westen wird das Königreich durch die Rockies begrenzt. Vor vielen Jahrhunderten wanderte ein Teil des Elfenvolkes in diese Berge, da sie sich mit dem Rest zerstritten hatten und waren ab da an nicht mehr gesehen. Über den Hafen Redaron auf einer ufernahen kleinen Insel gelangen die Elfen zum anderen Teil ihres Königreichs, der großen Insel Iladrien. Hier befinden sich riesige Laubbäume, ein besonders großes Exemplar an der Westküste der Insel dient den Elfen als Hauptstadt und heißt Iladris. Zentral auf der Insel umgeben von einem kreisrunden Gebirge befindet sich der älteste Baum der Insel, er heißt Solendras und ist den Elfen besonders heilig, hier hat das Druidentum seinen Ursprung.",
            img:"Ethelion"
        },
    }



    /// DASHBOARD
    const germanAttr = {
        vitality: "Vitalität",
        stamina: "Ausdauer",
        mana: "Mana",
        spirit: "Spirituelle Kraft"
    }
    const allAttributes = {
        strength:"Stärke",
        dexterity: "Geschicklichkeit",
        intelligent: "Intelligenz",
        charisma: "Charisma",
        vitality: "Vitalität",
        stamina: "Ausdauer",
        mana: "Mana",
        spirit: "Spirituelle Kraft",
    }

    const diceAbbr = {
        STR: "strength",
        DEX: "dexterity",
        INT: "intelligent",
        VIT: "vitality",
        ST: "stamina",
        CHA: "charisma",
        MANA: "mana",
        SPK: "spirit"
    }

    /// INVENTORY
    const itemNames = {
        category : {
            Waffe: "weapon",
            Rüstung: "armor",
            Ressource: "ressource"
        },
        genus: {
            Brust: "chest",
            Beine: "legs",
            Kopf: "head", 
            Arme: "arms",
            Füße: "feet",
            Hüfte: "hip",
            Schild: "shield",
            Rücken: "back",
            Hals: "neck",
            Finger: "finger",
            /// waffe
            Schwert: "sword",
            Axt: "axe",
            Streitkolben: "mace",
            Dolch: "dagger",
            Wurfwaffe: "throwable",
            Speer: "spear",
            Stab: "staff",
            Zauberstab: "wand",
            Bogen: "bow",
            Armbrust: "crossbow",
            Schusswaffe: "firearm",
            Ausrüstung: "equippable",
            Werkzeug: "tool",
            // ressource
            Holz: "wood",
            Gestein: "mineral",
            Nahrung: "food",
            Pflanzen: "plant",
            Organisch: "organical",
            Sonstige: "other",
        },
        rarity: {
            gewöhnlich: "common",
            magisch: "magical",
            selten: "rare",
            episch: "epic",
            legendär: "legendary",
            einzigartig: "unique"
        },
        gems: [
            {
                name: "Opal",
                rarity: "gewöhnlich",
                value: 0,
            },
            {
                name: "Bernstein",
                rarity: "magisch",
                value: 1,
            },
            {
                name: "Smaragd",
                rarity: "selten",
                value: 2,
            },

            {
                name: "Saphir",
                rarity:"episch",
                value: 3,
            },
            {
                name: "Rubin",
                rarity: "legendär",
                value: 4,
            }

        ]
    }

    // Setbonis
    const boniList = {
        "Anwärterrüstung der Diebesgilde":"Diebesglück: Würfe auf Heimlichkeitsfertigkeiten können einmal wiederholt werden",
        "Rüstung der Diebesgilde":"Diebesglück: Würfe auf Heimlichkeitsfertigkeiten können zweimal wiederholt werden, +Federfall",
        "Meisterrrüstung der Diebesgilde":"Diebesglück: Würfe auf Heimlichkeitsfertigkeiten können dreimal wiederholt werden, +Federfall, +Wasserlauf",
        "Studentenrobe der Magierakademie":"Arkaner Schutz: bei Angriffen mit Elementarschaden, kann eine INT Probe absolviert werden um den Schaden zu halbieren (ebenso Effekte)",
        "Meisterrobe der Magierakademie":"Arkaner Schutz: bei Angriffen mit Elementarschaden, kann eine INT Probe absolviert werden um den Schaden zu negieren (ebenso Effekte)",
        "Großmeisterrobe der Magierakademie":"Arkaner Schutz: Immunität gegen Elemente, bei Angriffen mit Elementarschaden, kann eine INT Probe absolviert werden um den Schaden zu reflektieren (ebenso Effekte)",
        "Akolythengewand der Dämonologie":"Dämonenschutz: 50 TP die vor den eigenen TP angegriffen werden, erneuert sich täglich",
        "Adeptengewand der Dämonologie":"Dämonenschutz: 100 TP die vor den eigenen TP angegriffen werden, erneuert sich täglich",
        "Hexenmeistergewand der Dämonologie":"Dämonenschutz: 200 TP die vor den eigenen TP angegriffen werden, erneuert sich täglich",
        "Anwärter-Rüstung der Kriegergilde":"Des Kriegers Stärke: der Träger kann immer eine der drei Proben durch eine STR-Probe ersetzen",
        "Rüstung der Kriegergilde":"Des Kriegers Zorn: jeder im Kampf getötete Gegner gibt dem Krieger einen W12 Schadenswürfel für den Rest des Kampfes",
        "Ruhm des Kriegers":"Des Kriegers Ruhm: die Attacken des Trägers können nicht mehr pariert werden, + Zorn mit W20 Schadenswürfel",
        "Rekrutenrüstung von Beltamor":"Für den König!: +5 Vorteil auf die Initiative, nach dem Kampf kann 1 W20 TP regeneriert werden",
        "Soldatenrüstung von Beltamor":"Für den König!: +10 Vorteil auf die Initiative, nach dem Kampf können 2 W20 TP regeneriert werden",
        "Ritterrüstung von Beltamor":"Für den König!: +15 Vorteil auf die Initiative, nach dem Kampf können 3 W20 TP regeneriert werden",
        "Rüstung des Abenteurers": "Abenteuerlust: Bei Würfen auf Spurenlesen/Überleben/ Orientieren muss nur eine der drei Proben gewürfelt werden",
        "Rüstung des Unerschrockenen":"Unerschrockenheit: Immunität gegen Furchteffekte, aggressive Kreaturen greifen aus Respekt nicht direkt an",
        "Legende der Abenteurer":"Legende des Drachen: an der Rüstung sind Gleitelemente an Armen und Beinen befestigt, die dem Träger das Gleiten ermöglichen",
        "Wache von Algor":"Standhaft: Bei Umwerfen kann eine STR Probe gewürfelt werden um den Effekt zu verhindern",
        "Gardist von Algor": "Standhaft: Bei Umwerfen oder Betäubung kann eine STR Probe gewürfelt werden um den Effekt zu verhindern",
        "Wächter von Algor":"Standhaft: Immunität gegen Umwerfen oder Betäubung, es kann eine STR Probe gewürfelt werden um den Effekt zu reflektieren",
    }

    /// DIARY 
    const diaryCategories = ["Personen", "Orte", "Wissen", "Erlebtes", "Aktiv", "Abgeschlossen", "Sonstiges"]
export  {races,
     racesList,
    classList,
    classDescription,
    originList,
    countries,
    germanAttr,
    allAttributes,
    diceAbbr,
    itemNames,
    diaryCategories,
    boniList
}