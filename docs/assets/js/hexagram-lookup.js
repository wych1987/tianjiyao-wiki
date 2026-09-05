(function () {
  const HEXAGRAM_DATA = {
    "乾_乾": { num: 1, name: "乾卦", subtitle: "乾為天", slug: "01-Qian", symbol: "䷀", desc: "元亨利贞。刚健笃实，自强不息，盛极当防亏。" },
    "坤_坤": { num: 2, name: "坤卦", subtitle: "坤為地", slug: "02-Kun", symbol: "䷁", desc: "厚德载物，柔顺包容，静守待机，宜寻合作。" },
    "坎_震": { num: 3, name: "屯卦", subtitle: "水雷屯", slug: "03-Zhun", symbol: "䷂", desc: "万事起头难，萌芽蓄力，初生维艰，宜守正不宜轻举妄动。" },
    "艮_坎": { num: 4, name: "蒙卦", subtitle: "山水蒙", slug: "04-Meng", symbol: "䷃", desc: "启蒙解惑，虚心求教，明辨方向，切忌盲目涉险。" },
    "坎_乾": { num: 5, name: "需卦", subtitle: "水天需", slug: "05-Xu", symbol: "䷄", desc: "守候时机，沉着蓄势，饮食宴乐，静候风云际会。" },
    "乾_坎": { num: 6, name: "讼卦", subtitle: "天水讼", slug: "06-Song", symbol: "䷅", desc: "事有争执，适可而止，止争息讼，求同存异为上。" },
    "坤_坎": { num: 7, name: "师卦", subtitle: "地水师", slug: "07-Shi", symbol: "䷆", desc: "行军用师，纪律严明，众志成城，守正方得安宁。" },
    "坎_坤": { num: 8, name: "比卦", subtitle: "水地比", slug: "08-Bi", symbol: "䷇", desc: "亲附相依，诚信合作，择善而从，速决勿失时机。" },
    "巽_乾": { num: 9, name: "小畜卦", subtitle: "風天小畜", slug: "09-Xiao-Xu", symbol: "䷈", desc: "密云不雨，微小蓄积，量力而行，厚积而后薄发。" },
    "乾_兑": { num: 10, name: "履卦", subtitle: "天澤履", slug: "10-Lv", symbol: "䷉", desc: "履虎尾而不咥人，谨言慎行，循礼而动，化险为夷。" },
    "坤_乾": { num: 11, name: "泰卦", subtitle: "地天泰", slug: "11-Tai", symbol: "䷊", desc: "三阳开泰，天地交泰，上下同心，诸事顺遂吉祥。" },
    "乾_坤": { num: 12, name: "否卦", subtitle: "天地否", slug: "12-Pi", symbol: "䷋", desc: "闭塞不通，上下不交，韬光养晦，静待否极泰来。" },
    "乾_离": { num: 13, name: "同人卦", subtitle: "天火同人", slug: "13-Tong-Ren", symbol: "䷌", desc: "同心同德，广泛结盟，大公无私，破除狭隘成见。" },
    "离_乾": { num: 14, name: "大有卦", subtitle: "火天大有", slug: "14-Da-You", symbol: "䷍", desc: "日丽中天，富足丰盈，顺天应人，遏恶扬善守正。" },
    "坤_艮": { num: 15, name: "谦卦", subtitle: "地山谦", slug: "15-Qian", symbol: "䷎", desc: "谦谦君子，内高外卑，谦冲受益，无往而不利。" },
    "震_坤": { num: 16, name: "豫卦", subtitle: "雷地豫", slug: "16-Yu", symbol: "䷏", desc: "和乐振奋，顺时而动，居安思危，防乐极生悲。" },
    "兑_震": { num: 17, name: "随卦", subtitle: "澤雷隨", slug: "17-Sui", symbol: "䷐", desc: "随机应变，择善相从，顺应潮流，不固执己见。" },
    "艮_巽": { num: 18, name: "蛊卦", subtitle: "山風蠱", slug: "18-Gu", symbol: "䷑", desc: "革除旧弊，拨乱反正，振作图新，挽狂澜于既倒。" },
    "坤_兑": { num: 19, name: "临卦", subtitle: "地澤臨", slug: "19-Lin", symbol: "䷒", desc: "亲临督导，渐次转盛，积极进取，防盛极而衰。" },
    "巽_坤": { num: 20, name: "观卦", subtitle: "風地觀", slug: "20-Guan", symbol: "䷓", desc: "瞻仰省察，风行地上，端正言行，以德化人。" },
    "离_震": { num: 21, name: "噬嗑卦", subtitle: "火雷噬嗑", slug: "21-Shi-He", symbol: "䷔", desc: "咬合去梗，明罚敕法，排除阻碍，雷厉风行。" },
    "艮_离": { num: 22, name: "贲卦", subtitle: "山火賁", slug: "22-Bi", symbol: "䷕", desc: "文饰修饰，返璞归真，适度点缀，不失本真之美。" },
    "艮_坤": { num: 23, name: "剥卦", subtitle: "山地剝", slug: "23-Bo", symbol: "䷖", desc: "阴长阳消，山附于地，顺势而止，防范小人暗耗。" },
    "坤_震": { num: 24, name: "复卦", subtitle: "地雷復", slug: "24-Fu", symbol: "䷗", desc: "一阳来复，冬去春来，生机初萌，循序渐进为宜。" },
    "乾_震": { num: 25, name: "无妄卦", subtitle: "天雷無妄", slug: "25-Wu-Wang", symbol: "䷘", desc: "真实纯正，不存妄念，顺应天道，行所当行。" },
    "艮_乾": { num: 26, name: "大畜卦", subtitle: "山天大畜", slug: "26-Da-Xu", symbol: "䷙", desc: "大有积蓄，止健蓄德，日新其德，待时大展身手。" },
    "艮_震": { num: 27, name: "颐卦", subtitle: "山雷頤", slug: "27-Yi", symbol: "䷚", desc: "颐养身心，慎言节食，自食其力，养正以得吉祥。" },
    "兑_巽": { num: 28, name: "大过卦", subtitle: "澤風大過", slug: "28-Da-Guo", symbol: "䷛", desc: "栋桡非常，负重前行，刚毅自立，非常之时用非常之策。" },
    "坎_坎": { num: 29, name: "坎卦", subtitle: "坎為水", slug: "29-Kan", symbol: "䷜", desc: "险象重重，心存信念，常思危难，行险而不失其信。" },
    "离_离": { num: 30, name: "离卦", subtitle: "離為火", slug: "30-Li", symbol: "䷝", desc: "明照四方，柔顺附丽，择善依附，坚守中正光明。" },
    "兑_艮": { num: 31, name: "咸卦", subtitle: "澤山鹹", slug: "31-Xian", symbol: "䷞", desc: "心灵感应，少男少女，相互吸引，顺畅融洽。" },
    "震_巽": { num: 32, name: "恒卦", subtitle: "雷風恆", slug: "32-Heng", symbol: "䷟", desc: "持之以恒，终始如一，久于其道，立不易方。" },
    "乾_艮": { num: 33, name: "遁卦", subtitle: "天山遯", slug: "33-Dun", symbol: "䷠", desc: "见机退避，收敛锋芒，明哲保身，蓄力避祸。" },
    "震_乾": { num: 34, name: "大壮卦", subtitle: "雷天大壯", slug: "34-Da-Zhuang", symbol: "䷡", desc: "声势壮大，雷鸣天上，戒骄戒躁，非礼勿履。" },
    "离_坤": { num: 35, name: "晋卦", subtitle: "火地晉", slug: "35-Jin", symbol: "䷢", desc: "旭日东升，步步高升，顺应时势，大显身手。" },
    "坤_离": { num: 36, name: "明夷卦", subtitle: "地火明夷", slug: "36-Ming-Yi", symbol: "䷣", desc: "明入地中，光明受损，晦明韬迹，内明而外柔顺。" },
    "巽_离": { num: 37, name: "家人卦", subtitle: "風火家人", slug: "37-Jia-Ren", symbol: "䷤", desc: "修身齐家，各安其位，内外分明，家庭和睦之象。" },
    "离_兑": { num: 38, name: "睽卦", subtitle: "火澤睽", slug: "38-Kui", symbol: "䷥", desc: "乖离相违，求同存异，化解分歧，小事亨通。" },
    "坎_艮": { num: 39, name: "蹇卦", subtitle: "水山蹇", slug: "39-Jian", symbol: "䷦", desc: "山高水险，前进困难，反求诸己，退思补过。" },
    "震_坎": { num: 40, name: "解卦", subtitle: "雷水解", slug: "40-Xie", symbol: "䷧", desc: "解除险难，雨过天晴，赦过宥罪，宜宽不宜急。" },
    "艮_兑": { num: 41, name: "损卦", subtitle: "山澤損", slug: "41-Sun", symbol: "䷨", desc: "减损抑奢，损下益上，塞忿窒欲，由损得益。" },
    "巽_震": { num: 42, name: "益卦", subtitle: "風雷益", slug: "42-Yi", symbol: "䷩", desc: "损上益下，与民同利，见善则迁，有过则改。" },
    "兑_乾": { num: 43, name: "夬卦", subtitle: "澤天夬", slug: "43-Guai", symbol: "䷪", desc: "决断清除，破旧立新，居安思危，防反扑之虞。" },
    "乾_巽": { num: 44, name: "姤卦", subtitle: "天風姤", slug: "44-Gou", symbol: "䷫", desc: "不期而遇，风行天下，戒备防微，防患于未然。" },
    "兑_坤": { num: 45, name: "萃卦", subtitle: "澤地萃", slug: "45-Cui", symbol: "䷬", desc: "聚众荟萃，人心汇聚，修明政令，防范隐患。" },
    "坤_巽": { num: 46, name: "升卦", subtitle: "地風升", slug: "46-Sheng", symbol: "䷭", desc: "柔顺上进，积小成大，步步高升，行所顺也。" },
    "兑_坎": { num: 47, name: "困卦", subtitle: "澤水困", slug: "47-Kun", symbol: "䷮", desc: "穷困坚守，泽无水涸，意志不沉，致命遂志。" },
    "坎_巽": { num: 48, name: "井卦", subtitle: "水風井", slug: "48-Jing", symbol: "䷯", desc: "汲井济人，守正不变，惠泽大众，源远流长。" },
    "兑_离": { num: 49, name: "革卦", subtitle: "澤火革", slug: "49-Ge", symbol: "䷰", desc: "顺天应人，去旧生新，变革更新，顺应时势。" },
    "离_巽": { num: 50, name: "鼎卦", subtitle: "火風鼎", slug: "50-Ding", symbol: "䷱", desc: "定邦立业，稳重端方，去故取新，贤人辅弼。" },
    "震_震": { num: 51, name: "震卦", subtitle: "震為雷", slug: "51-Zhen", symbol: "䷲", desc: "雷鸣惊怖，临危不惧，修省自身，反得安泰。" },
    "艮_艮": { num: 52, name: "艮卦", subtitle: "艮為山", slug: "52-Gen", symbol: "䷳", desc: "止其所止，安守本分，知进知退，动静不失其时。" },
    "巽_艮": { num: 53, name: "渐卦", subtitle: "風山漸", slug: "53-Jian", symbol: "䷴", desc: "循序渐进，进以礼义，积微成著，行止合宜。" },
    "震_兑": { num: 54, name: "归妹卦", subtitle: "雷澤歸妹", slug: "54-Gui-Mei", symbol: "䷵", desc: "以悦而动，轻举妄动，需防有始无终，慎察后果。" },
    "震_离": { num: 55, name: "丰卦", subtitle: "雷火豐", slug: "55-Feng", symbol: "䷶", desc: "丰盛博大，雷电交作，宜日中见光，居盛思衰。" },
    "离_艮": { num: 56, name: "旅卦", subtitle: "火山旅", slug: "56-Lv", symbol: "䷷", desc: "异地作客，处境多变，谨慎安分，柔顺处世。" },
    "巽_巽": { num: 57, name: "巽卦", subtitle: "巽為風", slug: "57-Xun", symbol: "䷸", desc: "谦逊顺随，申命行事，随风潜入，渗透力强。" },
    "兑_兑": { num: 58, name: "兑卦", subtitle: "兌為澤", slug: "58-Dui", symbol: "䷹", desc: "欣悦和顺，朋友讲习，以和待人，忌口舌是非。" },
    "巽_坎": { num: 59, name: "涣卦", subtitle: "風水渙", slug: "59-Huan", symbol: "䷺", desc: "涣散化解，乘木有功，打破隔阂，重聚人心。" },
    "坎_兑": { num: 60, name: "节卦", subtitle: "水澤節", slug: "60-Jie", symbol: "䷻", desc: "节制有度，适可而止，安守节义，过节则苦。" },
    "巽_兑": { num: 61, name: "中孚卦", subtitle: "風澤中孚", slug: "61-Zhong-Fu", symbol: "䷼", desc: "至诚感通，信及豚鱼，心怀坦荡，化解疑难。" },
    "震_艮": { num: 62, name: "小过卦", subtitle: "雷山小過", slug: "62-Xiao-Guo", symbol: "䷽", desc: "小有过越，不宜大事，宜下不宜上，敬慎自守。" },
    "坎_离": { num: 63, name: "既济卦", subtitle: "水火既濟", slug: "63-Ji-Ji", symbol: "䷾", desc: "事已功成，初吉终乱，防微杜渐，防盛极而衰。" },
    "离_坎": { num: 64, name: "未济卦", subtitle: "火水未濟", slug: "64-Wei-Ji", symbol: "䷿", desc: "事未完结，生生不息，重整旗鼓，前程仍有可期。" }
  };

  function initTrigramWidgets() {
    const widgets = document.querySelectorAll(".trigram-calc-widget");
    widgets.forEach(function (widget) {
      const upSelect = widget.querySelector(".trigram-up-select");
      const downSelect = widget.querySelector(".trigram-down-select");
      const symbolEl = widget.querySelector(".trigram-symbol");
      const titleEl = widget.querySelector(".trigram-title");
      const descEl = widget.querySelector(".trigram-desc");
      const detailLink = widget.querySelector(".trigram-detail-link");

      if (!upSelect || !downSelect || !symbolEl || !titleEl || !descEl || !detailLink) return;

      function update() {
        const up = upSelect.value;
        const down = downSelect.value;
        const key = up + "_" + down;
        const item = HEXAGRAM_DATA[key];
        if (!item) return;

        symbolEl.textContent = item.symbol;
        const numStr = item.num < 10 ? "0" + item.num : "" + item.num;
        titleEl.textContent = "第" + numStr + "卦 " + item.name + "（" + item.subtitle + "）";
        descEl.textContent = item.desc;
        detailLink.href = "https://tianjiyao.com/zh/64-gua/" + item.slug;
      }

      upSelect.addEventListener("change", update);
      downSelect.addEventListener("change", update);
      update();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTrigramWidgets);
  } else {
    initTrigramWidgets();
  }
})();
