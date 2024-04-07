const asyncHandler = require("express-async-handler");
const Talent = require("../models/talentModel");
const User = require("../models/userModel");
const UserTalents = require("../models/userTalentsModel")
const mongoose = require("mongoose");


const getTalent = asyncHandler(async (req, res) => {
  const talents = await Talent.find();
  res.status(200).json(talents);
});

const getPlayerTalent = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "talents.talent",
    model: "Talent",
    select: "_id category name dice",
  });
  console.log(user.talent);
  const talents = user?.talents;
  res.status(200).json(talents);
});

const setTalent = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    res.status(400);
    throw new Error("Falsch! Das Feld darf nicht leer sein");
  }

  const talent = await Talent.create({
    category: req.body.category,
    name: req.body.name,
    dice: req.body.dice,
  });
  res.status(200).json(talent);
});
// @desc Get kind and user class bonuses for talent page
// @route GET /talents/userboni
// @access Private
const getUserBonus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "userclass",
    select: "name advantages",
    model: "Userclass",
  })
  const general = user?.general;
  const userclassAdvantage = user.userclass.advantages
  const userclassName = user.userclass.name
  if (!user || !general || !userclassName || !userclassAdvantage) {
    res.status(400).json({ message: "User oder Info nicht gefunden" });
  }
  const userKind = general?.kind
  const races = {
    Elb: {
      descr:
        "Vor vielen Jahrtausenden kamen die Elben auf die Welt, sie sind sehr langlebig, aber dafür auch weniger fruchtbar als andere Humanoide. Sie sind nach den Drachen eines der ältesten Völker in den Dragonlands. Außerdem sind sie sehr naturverbunden und verstanden sich von Anfang an gut mit den Drachen und lernten von Ihnen die (Druiden-)Magie zu beherrschen. Ihr Ursprung kommt von der Insel Iladrien direkt vor der Ostküste des Kontinents, die dort wachsenden riesigen Laubbäume sind uralt und durchwachsen von Magie, sie sind den Elben das Allerheiligste.",
      ability: {
        name: "Im Wald zuhause",
        descr:
          "Elben leben im besonderen Einklang mit der Natur, besonders in Wäldern gibt es ihnen Kraft, so dass alle Proben um 1 erleichtert sind.",
      },
    },
    Draconid: {
      descr:
        "Die Draconiden entstanden, so heißt es, durch die Druidenmagie der Elben und Drachen. Diese Magie ermöglicht es sich in bestimmte Formen zu verwandeln, unter anderem auch die Drachenform für Elben und die Elbenform für Drachen, aus dieser magischen Verbindung entstand eine Inkarnation zwischen beiden Formen, die für immer in dieser verweilten, die so genannten Draconiden. Sie sind äußerst selten anzutreffen und bevorzugen meist ein Leben als Einsiedler, diese Abneigung gegenüber größeren Gemeinschaften stammt wahrscheinlich aus ihrer Drachennatur.",
      ability: {
        name: "Drachenhaut",
        descr:
          "Sie sind immun gegen das ihnen zugehörige Element (zB Feuer, bei besondere Merkmale eintragen) und haben einen natürlichen Rüstungsbonus von  einem W12.",
      },
    },
    Zwerg: {
      descr:
        "Ebenfalls vor Jahrtausenden doch etwas später als die Elben kamen die Zwerge auf die Welt. Sie waren etwas weniger langlebig als die Elben und etwas kleiner, aber dafür sehr robust und sie liebten alle Arten von Stein und Erzen. Dafür gruben sie sich tief in die gewaltigen Bergmassive der Erde. So schufen sie kollosale unterirdische Bauwerke und Werkstätten. Anders als die Elben verstanden sich die Zwerge nicht so gut mit den Drachen und es gab anfangs viel Streit und sogar Krieg untereinander. Dies konnte allerdings mit der Zeit beigelegt werden.",
      ability: {
        name: "Im Fels zuhause",
        descr:
          "Zwerge haben eine natürliche Verbindung zu dem Fels der Berge, befinden Sie sich unter Tage fühlen Sie sich zu Hause, alle Proben sind um 1 erleichtert.",
      },
    },
    Gnom: {
      descr:
        "Es wird darüber spekuliert, ob die Zwerge die Gnome tief in den Bergen fanden, die noch länger dort lebten oder ob die Gnome kurze Zeit später auf der Welt auftauchten. Sie teilten dieselben Interessen, die Gnome sind jedoch weniger robust, dafür sind sie wegen ihrer geschickten Finger sehr talentiert in der Ingenieurskunst.",
      ability: {
        name: "Geschickte Finger",
        descr:
          "ihre kleinen geschickten Finger kommen den Gnomen beim Konstruieren und Handwerken zu gute. Alle missglückten Handwerksproben können durch eine GSK- Probe gerettet werden.",
      },
    },
    Ork: {
      descr:
        "Nach den Zwergen und Gnomen kamen die Orks auf die Welt, sie waren zunächst ruhelos und streitsam, ein Nomadenvolk, dass durch die ganze Welt reiste. Mit der Zeit wurden sie ruhiger und gründeten Siedlungen, während andere weiter ein unbeständiges Nomadenleben wählten. Sie sind wie die Elben sehr naturverbunden und dienten oftmals als Vermittler zwischen den Völkern. Mit den Drachen hatten sie nicht viel Kontakt, sondern existierten in gegenseitigem Wohlwollen nebeneinander. Ihr Wissen wurde nur durch Erzählungen weitergegeben.",
      ability: {
        name: "Zornige Kämpfer",
        descr:
          ": Orks können einen wilden Zorn verspüren, wenn sie verwundet werden, der ihnen neue Energie verleiht. Bei erlittenem Schaden wird ein W6 gewürfelt, bei 1 oder 6 wird die Ausdauer wieder vollständig hergestellt.",
      },
    },
    Kobold: {
      descr:
        "Die Kobolde sind ähnlich wie Elben, Halblinge und Orks sehr naturverbunden und sind in etwa zur gleichen Zeit wie die Orks in den Dragonlands aufgetaucht, sie scheinen auch, was den Körperbau angeht mit den Orks verwandt zu sein, obgleich sie um einiges kleiner und flinker sind. Zudem wird den Kobolden ein höchst spezieller Humor und eine Vorliebe für allerlei Streiche und Schabernack nachgesagt. Die meisten von ihnen leben gerne versteckt in den Wäldern in kleineren gemeinsamen Siedlungen, einige jedoch fühlen sich auch in den großen Städten wohl, nicht selten auf Kosten der dort lebenden Einwohner.",
      ability: {
        name: "Glück im Unglück",
        descr:
          "Ihre geringe Größe und eine gewisse Intuition lassen lassen die Kobolde manchmal besonders beeindruckende Ausweichmanöver durchführen. Jede Ausweichprobe kann einmal wiederholt werden.",
      },
    },
    Mensch: {
      descr:
        "Keiner weiß genau wie lange die Menschen bereits auf der Welt sind. Auf Grund ihrer, im Vergleich zu zum Beispiel den Zwergen oder Elben, etwas kürzeren Lebensspanne, haben sie sehr viel mehr Generationen durchlaufen und die Ursprünge ihrer Existenz gleichen eher Legenden als tatsächlicher Geschichtsschreibung. Offenbar haben sie früher auf einer Insel oder einem anderen Kontinent gelebt, in den Geschichten heißt es diese Heimat wurde durch eine gewaltige Überschwemmung zerstört und sie kamen als Seefahrer in die Dragonlands. Über die Menschen hieß es, dass sie sehr sprunghaft sein können, aber auch, dass sie einen unstillbaren Wissensdurst besitzen. Sie waren es, die gemeinsam mit den Drachen das Wesen der Welt studierten und so als erstes die (Arkan-)Magie erlernten.",
      ability: {
        name: "Handelsgeschick",
        descr:
          "Menschen haben sich ein starkes Talent für Handel angeeignet, so bekommen sie bessere Preise bei Händlern, für das Feilschen muss anstelle der Redekunst lediglich eine Charismaprobe gewürfelt werden. Dabei können die Punkte von Redekunst trotzdem verwendet werden.",
      },
    },
    Halbling: {
      descr:
        "Wann die Halblinge das erste mal gesichtet wurden wissen weder sie selbst noch irgend ein anderes Volk. Sie bevorzugten es schon immer für sich in friedlicher Abgeschiedenheit zu leben und Geschichtsschreibung sowie die Geschicke der Welt interessieren sie nicht. Sie haben eine innige Liebe zu allem, was wächst und gedeiht entwickelt und verstehen es mit der Natur im Einklang zu leben.",
      ability: {
        name: "Grüner Daumen",
        descr:
          "Die Halblinge lieben alles, was wächst. Bei Kräuterkunde und Landwirtschaft muss lediglich eine beliebige der drei Proben gewürfelt werden.",
      },
    },
  };
  const kindAdvantage = races[userKind]?.ability.descr
  const kindAdvantageName = races[userKind]?.ability.name
  res.status(200).json({userclassName: userclassName, userclassAdvantage: userclassAdvantage, kindAdvantageName: kindAdvantageName,kindName: userKind, kindAdvantage: kindAdvantage})
});
const updateTalent = asyncHandler(async (req, res) => {
  const talent = await Talent.findById(req.params.id);
  if (!talent) {
    res.status(400);
    throw new Error("Der Talent wurde nicht gefunden");
  }
  if (!req.user) {
    res.status(401);
  }
  // Logged in user matches talent user
  if (talent.user.toString() !== req.user.id) {
    res.status(401);
  }
  const toUpdate = await Talent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!toUpdate) {
    res.status(400);
  }
  res.status(200).json(toUpdate);
});

const deleteTalent = asyncHandler(async (req, res) => {
  const talent = await Talent.findById(req.params.id);
  if (!talent) {
    res.status(400);
    throw new Error("Der Talent wurde nicht gefunden");
  }

  await talent.remove();
  res.status(200).json({ id: req.params.id });
});

/** Player talents */
const addUserTalent = asyncHandler(async (req, res) => {
  console.log(req.body.point, req.body.name);
  if (!req.body.point || !req.body.name) {
    res.status(400);
    throw new Error("Bitte überprüfe deine Eingabe!");
  }
  const talent = await Talent.findOne({ name: req.body.name });
  if (!talent) {
    res.status(400);
    throw new Error("Talent nicht gefunden...");
  }
  console.log("Neues talent:", req.body.name);
  const utalent = await UserTalents.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId() },
    {
      talent: talent._id,
      points: req.body.point,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      populate: {
        path: "talent",
        model: "Talent",
        select: "_id category name dice",
      },
    }
  );
  console.log(utalent);
  if (!utalent) {
    res.status(400);
    throw new Error("Talent konnte nicht erstellt werden...");
  }
  const created = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { talents: utalent } },
    { new: true }
  );
  if (!created) {
    res.status(400);
    throw new Error("Talent konnte nicht erstellt werden...");
  }
  console.log("Talent wurde erstellt und hinzgefügt");
  res.status(200).json(utalent);
});

const putUserTalent = asyncHandler(async (req, res) => {
  console.log(req.body.point, req.body.id);
  if (!req.body.point || !req.body.id) {
    res.status(400);
    throw new Error("Bitte überprüfe deine Eingabe!");
  }
  //const talent = await Talent.findById(req.body.id)
  const talent = await UserTalents.findByIdAndUpdate(
    req.body.id,
    { points: req.body.point },
    { new: true }
  ).populate({
    path: "talent",
    model: "Talent",
    select: "_id category name dice",
  });
  const user = await User.findById(req.user.id);
  console.log(talent);
  if (!talent) {
    res.status(500);
    throw new Error("Talent nicht gefunden...");
  }
  const updated = await User.findOneAndUpdate(
    {
      user: req.user.id,
      //'talents.talent': talent._id
      "talents._id": talent._id,
    },
    {
      $set: {
        "talents.$": talent,
      },
    },
    { new: true }
  ).populate({
    path: "talents.talent",
    model: "Talent",
    select: "_id category name dice",
  });
  if (!updated) {
    res
      .status(400)
      .json({ message: "Es war unmöglich, diesen Talent zu updaten" });
  }
  res.status(200).json(talent);
});

// @desc Remove a talent from users inventory
// @route DELETE /player/talents/:id
// @access Private
const removeUserTalent = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400);
    throw new Error("Bitte überprüfe deine Eingabe!");
  }
  const talent = await UserTalents.findById(req.params.id);
  console.log(talent);
  await talent.remove();
  const u = await User.findById(req.user.id);
  const removed = await User.findByIdAndUpdate(
    {
      _id: u._id,
      "talents._id": req.params.id,
    },
    {
      $pull: {
        talents: { _id: req.params.id },
      },
    },
    { new: true }
  );

  if (!removed) {
    res.status(400).json({ message: "Das Löschen hat nicht geklappt!" });
    throw new Error("Talent konnte nicht erstellt werden...");
  }
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getTalent,
  getPlayerTalent,
  getUserBonus,
  setTalent,
  updateTalent,
  deleteTalent,
  addUserTalent,
  removeUserTalent,
  putUserTalent,
};
