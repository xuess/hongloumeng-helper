// 红楼梦 (Dream of the Red Chamber) — Interactive Helper App Data

const CHARACTERS = {
  jia_baoyu: {
    id: "jia_baoyu",
    name: "贾宝玉",
    pinyin: "Jiǎ Bǎoyù",
    family: "jia_rong",
    role: "主角，荣国府二房嫡子",
    description: "生于口衔玉而来，是贾政与王夫人之子。聪明灵秀，多情重义，厌恶仕途，爱与女儿为伴。",
    chapters: [1, 2, 3, 5, 8, 17, 19, 23, 26, 33, 36, 57, 96, 98, 116, 119, 120],
    events: ["衔玉而生", "梦游太虚幻境", "怡红院结社", "宝黛共读西厢记", "挨打事件", "黛玉葬花共感", "晴雯撕扇", "抄检大观园", "黛玉之死", "出家"],
    fate: "最终看破红尘，出家为僧",
    relations: [
      { name: "林黛玉", id: "lin_daiyu", label: "青梅竹马/挚爱" },
      { name: "薛宝钗", id: "xue_baochai", label: "最终妻子" },
      { name: "贾政", id: "jia_zheng", label: "父亲" },
      { name: "王夫人", id: "wang_furen", label: "母亲" },
      { name: "贾母", id: "jia_mu", label: "祖母" },
      { name: "史湘云", id: "shi_xiangyun", label: "表妹" },
      { name: "袭人", id: "xiren", label: "贴身丫鬟" },
      { name: "晴雯", id: "qingwen", label: "丫鬟" },
      { name: "元春", id: "yuanchun", label: "姐姐" }
    ]
  },

  lin_daiyu: {
    id: "lin_daiyu",
    name: "林黛玉",
    pinyin: "Lín Dàiyù",
    family: "lin",
    role: "主角，贾母外孙女",
    description: "前世为绛珠仙草，以泪还债。才华横溢，诗才第一，体弱多病，性情敏感。",
    chapters: [3, 5, 8, 18, 23, 26, 27, 28, 34, 35, 37, 45, 48, 57, 82, 89, 97, 98],
    events: ["进贾府", "梦游太虚幻境", "葬花", "写葬花吟", "共读西厢记", "魁夺菊花诗", "秋窗风雨夕", "题帕三绝", "焚稿断痴情", "含恨而逝"],
    fate: "在宝玉大婚之夜含恨而逝，泪尽而亡",
    relations: [
      { name: "贾宝玉", id: "jia_baoyu", label: "挚爱" },
      { name: "贾母", id: "jia_mu", label: "外祖母" },
      { name: "薛宝钗", id: "xue_baochai", label: "竞争/友谊" },
      { name: "紫鹃", id: "zijuan", label: "贴身丫鬟" },
      { name: "史湘云", id: "shi_xiangyun", label: "诗社伙伴" },
      { name: "香菱", id: "xiangling", label: "诗歌学生" }
    ]
  },

  xue_baochai: {
    id: "xue_baochai",
    name: "薛宝钗",
    pinyin: "Xuē Bǎochāi",
    family: "xue",
    role: "主角，薛家大小姐",
    description: "端庄贤淑，博学多才，处世圆融，行为豁达。戴有金锁，与宝玉的玉相配，有'金玉良缘'之说。",
    chapters: [4, 5, 8, 18, 22, 27, 37, 40, 45, 56, 62, 96, 97, 119, 120],
    events: ["进京待选", "滴翠亭扑蝶", "情真意切讽谏宝玉", "与宝玉成婚", "独守空房"],
    fate: "与宝玉成婚，但宝玉出家，独守空房，终成怨妇",
    relations: [
      { name: "贾宝玉", id: "jia_baoyu", label: "丈夫" },
      { name: "薛蟠", id: "xue_pan", label: "兄长" },
      { name: "薛姨妈", id: "xue_yima", label: "母亲" },
      { name: "林黛玉", id: "lin_daiyu", label: "竞争/友谊" },
      { name: "香菱", id: "xiangling", label: "情同姐妹" }
    ]
  },

  wang_xifeng: {
    id: "wang_xifeng",
    name: "王熙凤",
    pinyin: "Wáng Xīfèng",
    family: "wang",
    role: "荣国府管家，贾琏之妻",
    description: "精明能干，泼辣大胆，善于理家，但也心狠手辣，弄权夺利。",
    chapters: [3, 6, 11, 12, 13, 15, 16, 25, 44, 55, 65, 74, 80, 106, 107, 110],
    events: ["协理宁国府", "弄权铁槛寺", "毒设相思局", "查抄大观园", "病重交权", "最终落难"],
    fate: "机关算尽太聪明，反算了卿卿性命。获罪休弃，贫病而死",
    relations: [
      { name: "贾母", id: "jia_mu", label: "婆婆辈长辈" },
      { name: "贾琏", id: "jia_lian", label: "丈夫" },
      { name: "王夫人", id: "wang_furen", label: "姑母" },
      { name: "平儿", id: "pinger", label: "丫鬟/通房" },
      { name: "尤二姐", id: "you_erjie", label: "情敌" },
      { name: "秦可卿", id: "qin_keqing", label: "堂妯娌" }
    ]
  },

  jia_mu: {
    id: "jia_mu",
    name: "贾母",
    pinyin: "Jiǎ Mǔ",
    family: "jia_rong",
    role: "荣国府最高长辈，史太君",
    description: "贾家最高权威，慈祥而睿智。溺爱宝玉，疼爱黛玉。",
    chapters: [3, 6, 18, 22, 29, 35, 40, 54, 71, 75, 110, 111],
    events: ["接待刘姥姥", "大观园游赏", "元宵夜宴", "贾母过寿", "抱病而亡"],
    fate: "在家族衰落前离世，未见最惨烈的结局",
    relations: [
      { name: "贾政", id: "jia_zheng", label: "儿子" },
      { name: "贾赦", id: "jia_she", label: "儿子" },
      { name: "贾宝玉", id: "jia_baoyu", label: "孙子/最宠爱" },
      { name: "林黛玉", id: "lin_daiyu", label: "外孙女" },
      { name: "王夫人", id: "wang_furen", label: "儿媳" },
      { name: "王熙凤", id: "wang_xifeng", label: "孙媳" },
      { name: "史湘云", id: "shi_xiangyun", label: "外孙女/娘家侄孙女" }
    ]
  },

  jia_zheng: {
    id: "jia_zheng",
    name: "贾政",
    pinyin: "Jiǎ Zhèng",
    family: "jia_rong",
    role: "荣国府二老爷，宝玉之父",
    description: "刻板严肃，信奉儒家正统，对宝玉寄以厚望，要求其走仕途之路。",
    chapters: [2, 17, 23, 33, 78, 107, 120],
    events: ["大观园题额", "责打宝玉", "目睹家族衰亡"],
    fate: "目睹家族衰落，宝玉出家，含悲而终",
    relations: [
      { name: "贾母", id: "jia_mu", label: "母亲" },
      { name: "王夫人", id: "wang_furen", label: "妻子" },
      { name: "贾宝玉", id: "jia_baoyu", label: "儿子" },
      { name: "元春", id: "yuanchun", label: "女儿" },
      { name: "探春", id: "tanchun", label: "女儿" },
      { name: "贾赦", id: "jia_she", label: "兄长" }
    ]
  },

  wang_furen: {
    id: "wang_furen",
    name: "王夫人",
    pinyin: "Wáng Fūren",
    family: "wang",
    role: "荣国府二太太，宝玉之母",
    description: "表面虔诚信佛，实则心机深沉。对宝玉宠爱，却对周围人苛刻。",
    chapters: [3, 25, 33, 74, 77, 96],
    events: ["驱逐金钏儿", "决意驱逐晴雯", "操控宝玉婚事", "调包计"],
    fate: "家族衰败后孤独终老",
    relations: [
      { name: "贾政", id: "jia_zheng", label: "丈夫" },
      { name: "贾宝玉", id: "jia_baoyu", label: "儿子" },
      { name: "贾母", id: "jia_mu", label: "婆母" },
      { name: "王熙凤", id: "wang_xifeng", label: "侄女" },
      { name: "薛姨妈", id: "xue_yima", label: "妹妹" }
    ]
  },

  jia_she: {
    id: "jia_she",
    name: "贾赦",
    pinyin: "Jiǎ Shè",
    family: "jia_rong",
    role: "荣国府大老爷，贾母长子",
    description: "荒淫无道，贪财好色，是贾家败落的根源之一。",
    chapters: [2, 46, 73, 106],
    events: ["强索鸳鸯", "获罪被抄"],
    fate: "获罪流放",
    relations: [
      { name: "贾母", id: "jia_mu", label: "母亲" },
      { name: "邢夫人", id: "xing_furen", label: "妻子" },
      { name: "贾琏", id: "jia_lian", label: "儿子" },
      { name: "迎春", id: "yingchun", label: "女儿" },
      { name: "贾政", id: "jia_zheng", label: "弟弟" }
    ]
  },

  jia_lian: {
    id: "jia_lian",
    name: "贾琏",
    pinyin: "Jiǎ Lián",
    family: "jia_rong",
    role: "荣国府大房，王熙凤之夫",
    description: "风流好色，在外偷腥，与尤二姐私通，但能力平庸。",
    chapters: [6, 15, 44, 65, 69, 106],
    events: ["停灵铁槛寺", "偷娶尤二姐", "尤二姐之死", "家族获罪"],
    fate: "家族败落后潦倒",
    relations: [
      { name: "贾赦", id: "jia_she", label: "父亲" },
      { name: "邢夫人", id: "xing_furen", label: "母亲" },
      { name: "王熙凤", id: "wang_xifeng", label: "妻子" },
      { name: "平儿", id: "pinger", label: "姬妾" },
      { name: "尤二姐", id: "you_erjie", label: "私妾" },
      { name: "贾母", id: "jia_mu", label: "祖母" }
    ]
  },

  qin_keqing: {
    id: "qin_keqing",
    name: "秦可卿",
    pinyin: "Qín Kěqīng",
    family: "jia_ning",
    role: "宁国府少奶奶，贾蓉之妻",
    description: "兼具黛玉之美和宝钗之德，是大观园中最完美的女子，却命薄早夭。",
    chapters: [5, 10, 11, 12, 13, 14],
    events: ["太虚幻境引领宝玉", "染病卧床", "托梦王熙凤", "天妒英才而亡", "奢靡出殡"],
    fate: "早夭，托梦凤姐，预言贾家命运",
    relations: [
      { name: "贾蓉", id: "jia_rong_son", label: "丈夫" },
      { name: "贾珍", id: "jia_zhen", label: "公公，有暧昧" },
      { name: "王熙凤", id: "wang_xifeng", label: "堂妯娌" },
      { name: "贾宝玉", id: "jia_baoyu", label: "堂叔" }
    ]
  },

  tanchun: {
    id: "tanchun",
    name: "探春",
    pinyin: "Tànchūn",
    family: "jia_rong",
    role: "荣国府三小姐，贾政庶女",
    description: "精明能干，有志气，有才华，被称为'玫瑰花'。",
    chapters: [27, 37, 55, 56, 74, 102, 119],
    events: ["发起诗社", "临时管家", "改革大观园", "远嫁和亲"],
    fate: "远嫁海外，骨肉分离",
    relations: [
      { name: "贾政", id: "jia_zheng", label: "父亲" },
      { name: "赵姨娘", id: "zhao_yiniang", label: "生母" },
      { name: "贾宝玉", id: "jia_baoyu", label: "兄长" },
      { name: "贾母", id: "jia_mu", label: "祖母" }
    ]
  },

  yingchun: {
    id: "yingchun",
    name: "迎春",
    pinyin: "Yíngchūn",
    family: "jia_rong",
    role: "荣国府二小姐，贾赦之女",
    description: "懦弱温和，无力反抗命运，被称为'二木头'。",
    chapters: [37, 79, 80],
    events: ["大观园诗社", "被父嫁给中山狼", "受虐而死"],
    fate: "嫁给孙绍祖，受尽虐待，悲惨而死",
    relations: [
      { name: "贾赦", id: "jia_she", label: "父亲" },
      { name: "邢夫人", id: "xing_furen", label: "继母" },
      { name: "贾宝玉", id: "jia_baoyu", label: "堂弟" },
      { name: "贾母", id: "jia_mu", label: "祖母" }
    ]
  },

  xichun: {
    id: "xichun",
    name: "惜春",
    pinyin: "Xīchūn",
    family: "jia_ning",
    role: "荣国府四小姐，贾珍之妹",
    description: "冷漠出尘，聪慧敏锐，目睹家族衰落后选择出家。",
    chapters: [5, 37, 74, 116, 120],
    events: ["大观园诗社", "目睹抄检", "最终出家为尼"],
    fate: "遁入空门，出家为尼",
    relations: [
      { name: "贾珍", id: "jia_zhen", label: "兄长" },
      { name: "贾宝玉", id: "jia_baoyu", label: "堂兄" },
      { name: "贾母", id: "jia_mu", label: "祖母" },
      { name: "妙玉", id: "miaoyu", label: "共同出家" }
    ]
  },

  shi_xiangyun: {
    id: "shi_xiangyun",
    name: "史湘云",
    pinyin: "Shǐ Xiāngyún",
    family: "shi",
    role: "贾母娘家侄孙女",
    description: "豪爽活泼，才华横溢，是诗社中最豪气的女子。有一对金麒麟。",
    chapters: [20, 21, 22, 31, 32, 37, 49, 50, 62, 76, 77],
    events: ["醉眠芍药裀", "与宝钗同作海棠诗", "芦雪庵联诗", "与黛玉月下联诗", "最终漂泊"],
    fate: "嫁后夫死，孤独漂泊",
    relations: [
      { name: "贾宝玉", id: "jia_baoyu", label: "表兄/知己" },
      { name: "贾母", id: "jia_mu", label: "姑祖母" },
      { name: "林黛玉", id: "lin_daiyu", label: "诗友" },
      { name: "薛宝钗", id: "xue_baochai", label: "姐妹" }
    ]
  },

  miaoyu: {
    id: "miaoyu",
    name: "妙玉",
    pinyin: "Miàoyù",
    family: "other",
    role: "大观园栊翠庵尼姑",
    description: "出身官宦，精通诗词，孤傲清高，'欲洁何曾洁，云空未必空'。",
    chapters: [18, 41, 50, 63, 76, 87],
    events: ["大观园奉茶", "联诗中秋", "被劫出走"],
    fate: "被劫掠，下落不明",
    relations: [
      { name: "贾宝玉", id: "jia_baoyu", label: "精神知己" },
      { name: "林黛玉", id: "lin_daiyu", label: "诗友" },
      { name: "惜春", id: "xichun", label: "同道" }
    ]
  },

  xiren: {
    id: "xiren",
    name: "袭人",
    pinyin: "Xírén",
    family: "jia_rong",
    role: "宝玉贴身丫鬟",
    description: "温柔体贴，心机深沉，是宝玉的准姨娘，忠心侍主。",
    chapters: [3, 6, 19, 21, 36, 77, 120],
    events: ["初试云雨情", "规劝宝玉读书", "宝玉挨打后照料", "离开贾府后嫁蒋玉菡"],
    fate: "贾府败落后嫁给蒋玉菡，得以善终",
    relations: [
      { name: "贾宝玉", id: "jia_baoyu", label: "主子/情人" },
      { name: "晴雯", id: "qingwen", label: "同僚丫鬟" }
    ]
  },

  qingwen: {
    id: "qingwen",
    name: "晴雯",
    pinyin: "Qíngwén",
    family: "jia_rong",
    role: "宝玉房中首席丫鬟",
    description: "美丽高傲，心直口快，不畏权贵，是'芙蓉女儿'。",
    chapters: [20, 31, 52, 63, 74, 77],
    events: ["晴雯撕扇", "病中补裘", "抄检大观园后被逐", "含冤而死"],
    fate: "被王夫人以'妖精'之名驱逐，含冤病死",
    relations: [
      { name: "贾宝玉", id: "jia_baoyu", label: "主子/深厚情谊" },
      { name: "袭人", id: "xiren", label: "竞争丫鬟" },
      { name: "王夫人", id: "wang_furen", label: "被驱逐者" }
    ]
  },

  xue_pan: {
    id: "xue_pan",
    name: "薛蟠",
    pinyin: "Xuē Pán",
    family: "xue",
    role: "薛宝钗之兄，薛姨妈长子",
    description: "呆霸王，横行霸道，为抢英莲打死冯渊。",
    chapters: [4, 24, 25, 47, 80],
    events: ["打死冯渊抢香菱", "结交贾家", "寻花问柳惹祸"],
    fate: "不断惹祸，使薛家越发衰败",
    relations: [
      { name: "薛宝钗", id: "xue_baochai", label: "妹妹" },
      { name: "薛姨妈", id: "xue_yima", label: "母亲" },
      { name: "香菱", id: "xiangling", label: "妾" }
    ]
  },

  xiangling: {
    id: "xiangling",
    name: "香菱",
    pinyin: "Xiānglíng",
    family: "xue",
    role: "薛蟠之妾，原名甄英莲",
    description: "命运悲苦，自幼被拐，辗转成为薛蟠之妾，但聪慧好学，苦志学诗。",
    chapters: [1, 4, 48, 49, 80],
    events: ["自幼被拐", "辗转流离", "跟黛玉学诗", "最终被正妻打死"],
    fate: "被薛蟠正妻夏金桂折磨致死",
    relations: [
      { name: "薛蟠", id: "xue_pan", label: "主人/丈夫" },
      { name: "薛宝钗", id: "xue_baochai", label: "情同姐妹" },
      { name: "林黛玉", id: "lin_daiyu", label: "诗歌老师" }
    ]
  },

  jia_zhen: {
    id: "jia_zhen",
    name: "贾珍",
    pinyin: "Jiǎ Zhēn",
    family: "jia_ning",
    role: "宁国府族长",
    description: "荒淫无道，与儿媳秦可卿有不正当关系，是宁国府败落的象征。",
    chapters: [5, 13, 14, 53, 75, 105],
    events: ["为秦可卿大办葬礼", "宁府被抄"],
    fate: "获罪流放",
    relations: [
      { name: "尤氏", id: "you_shi", label: "妻子" },
      { name: "贾蓉", id: "jia_rong_son", label: "儿子" },
      { name: "惜春", id: "xichun", label: "妹妹" },
      { name: "秦可卿", id: "qin_keqing", label: "儿媳/暧昧" }
    ]
  },

  jia_rong_son: {
    id: "jia_rong_son",
    name: "贾蓉",
    pinyin: "Jiǎ Róng",
    family: "jia_ning",
    role: "宁国府少爷，秦可卿之夫",
    description: "风流纨绔，其妻秦可卿早逝。",
    chapters: [13, 14, 53, 75],
    events: ["秦可卿之死", "宁府聚会", "宁府被抄"],
    fate: "随父获罪",
    relations: [
      { name: "贾珍", id: "jia_zhen", label: "父亲" },
      { name: "尤氏", id: "you_shi", label: "继母" },
      { name: "秦可卿", id: "qin_keqing", label: "已故妻子" }
    ]
  },

  you_erjie: {
    id: "you_erjie",
    name: "尤二姐",
    pinyin: "Yóu Èrjiě",
    family: "you",
    role: "贾琏之私妾",
    description: "温柔美貌，被贾琏私娶，后被王熙凤以手段逼迫，吞金自尽。",
    chapters: [65, 66, 69],
    events: ["被贾琏私娶", "被骗进大观园", "吞金自尽"],
    fate: "吞金自尽，悲剧收场",
    relations: [
      { name: "贾琏", id: "jia_lian", label: "丈夫" },
      { name: "王熙凤", id: "wang_xifeng", label: "情敌/迫害者" },
      { name: "尤三姐", id: "you_sanjie", label: "妹妹" }
    ]
  },

  you_sanjie: {
    id: "you_sanjie",
    name: "尤三姐",
    pinyin: "Yóu Sānjiě",
    family: "you",
    role: "尤二姐之妹",
    description: "刚烈侠义，深爱柳湘莲，但遭退婚后以剑自刎。",
    chapters: [65, 66],
    events: ["与柳湘莲订婚", "遭退婚", "自刎身亡"],
    fate: "自刎而死，殉情",
    relations: [
      { name: "尤二姐", id: "you_erjie", label: "姐姐" },
      { name: "柳湘莲", id: "liu_xianglian", label: "未婚夫" }
    ]
  },

  pinger: {
    id: "pinger",
    name: "平儿",
    pinyin: "Píng'er",
    family: "jia_rong",
    role: "王熙凤之通房，贾琏之侍妾",
    description: "温柔善良，处于夫妻之间两难，尽量保持公正，深得人心。",
    chapters: [21, 44, 52, 61, 100],
    events: ["代凤姐管家", "帮助受压迫者", "家族败落后的结局"],
    fate: "家族败落后与贾琏相守",
    relations: [
      { name: "王熙凤", id: "wang_xifeng", label: "主子" },
      { name: "贾琏", id: "jia_lian", label: "姬妾关系" }
    ]
  },

  zijuan: {
    id: "zijuan",
    name: "紫鹃",
    pinyin: "Zǐjuān",
    family: "jia_rong",
    role: "林黛玉贴身丫鬟",
    description: "忠心耿耿，真心爱护黛玉，为黛玉和宝玉的感情奔走。",
    chapters: [57, 82, 97],
    events: ["试探宝玉对黛玉的真情", "照料病中黛玉", "黛玉临终相伴"],
    fate: "黛玉死后，终身不嫁，守候黛玉遗志",
    relations: [
      { name: "林黛玉", id: "lin_daiyu", label: "主子" },
      { name: "贾宝玉", id: "jia_baoyu", label: "相关" }
    ]
  },

  yuanchun: {
    id: "yuanchun",
    name: "元春",
    pinyin: "Yuánchūn",
    family: "jia_rong",
    role: "贾政长女，皇贵妃",
    description: "才德兼备，入宫为妃，是贾家兴旺的顶峰象征。省亲时回荣国府，大观园因此而建。",
    chapters: [2, 16, 17, 18, 55, 95],
    events: ["入宫选妃", "封为贵妃", "省亲荣国府", "大观园题额", "突然薨逝"],
    fate: "在宫中突然去世，贾家随之失去靠山",
    relations: [
      { name: "贾政", id: "jia_zheng", label: "父亲" },
      { name: "王夫人", id: "wang_furen", label: "母亲" },
      { name: "贾宝玉", id: "jia_baoyu", label: "弟弟" },
      { name: "贾母", id: "jia_mu", label: "祖母" }
    ]
  },

  xue_yima: {
    id: "xue_yima",
    name: "薛姨妈",
    pinyin: "Xuē Yímā",
    family: "xue",
    role: "薛家家长，薛宝钗之母",
    description: "宽厚慈善，寄居贾府，是薛家的主事人。",
    chapters: [4, 57],
    events: ["寄居荣府", "关怀黛玉"],
    fate: "晚年孤苦",
    relations: [
      { name: "薛宝钗", id: "xue_baochai", label: "女儿" },
      { name: "薛蟠", id: "xue_pan", label: "儿子" },
      { name: "王夫人", id: "wang_furen", label: "姐妹" }
    ]
  },

  xing_furen: {
    id: "xing_furen",
    name: "邢夫人",
    pinyin: "Xíng Fūren",
    family: "jia_rong",
    role: "荣国府大太太，贾赦之妻",
    description: "贾赦之妻，懦弱无主见，处处以丈夫马首是瞻。",
    chapters: [3, 46],
    events: ["逼迫鸳鸯"],
    fate: "随贾赦获罪",
    relations: [
      { name: "贾赦", id: "jia_she", label: "丈夫" },
      { name: "贾琏", id: "jia_lian", label: "继子" },
      { name: "迎春", id: "yingchun", label: "继女" }
    ]
  },

  zhao_yiniang: {
    id: "zhao_yiniang",
    name: "赵姨娘",
    pinyin: "Zhào Yíniáng",
    family: "other",
    role: "贾政之妾，探春之母",
    description: "心胸狭窄，行为乖张，常与凤姐、王夫人作对。",
    chapters: [20, 25, 55],
    events: ["魇镇宝玉凤姐", "与探春冲突"],
    fate: "被贾府所遗弃",
    relations: [
      { name: "贾政", id: "jia_zheng", label: "主人/姨娘" },
      { name: "探春", id: "tanchun", label: "女儿" }
    ]
  },

  you_shi: {
    id: "you_shi",
    name: "尤氏",
    pinyin: "Yóu Shì",
    family: "jia_ning",
    role: "宁国府主母，贾珍之妻",
    description: "宽厚温和，无力制约丈夫贾珍的荒淫行为。",
    chapters: [13, 53, 75],
    events: ["处理秦可卿丧事"],
    fate: "随贾珍获罪",
    relations: [
      { name: "贾珍", id: "jia_zhen", label: "丈夫" },
      { name: "贾蓉", id: "jia_rong_son", label: "继子" },
      { name: "尤二姐", id: "you_erjie", label: "妹妹" },
      { name: "尤三姐", id: "you_sanjie", label: "妹妹" }
    ]
  },

  liu_xianglian: {
    id: "liu_xianglian",
    name: "柳湘莲",
    pinyin: "Liǔ Xiānglián",
    family: "other",
    role: "侠义少年，尤三姐的未婚夫",
    description: "豪侠仗义，英俊潇洒，与宝玉有交情。与尤三姐订婚后悔婚，尤三姐自尽后出家。",
    chapters: [47, 66],
    events: ["与宝玉结交", "退婚尤三姐", "尤三姐自尽后出家"],
    fate: "出家为道",
    relations: [
      { name: "尤三姐", id: "you_sanjie", label: "前未婚妻" },
      { name: "贾宝玉", id: "jia_baoyu", label: "朋友" }
    ]
  }
};

const RELATIONSHIPS = [
  { source: "jia_baoyu", target: "lin_daiyu", type: "love", label: "青梅竹马/挚爱" },
  { source: "jia_baoyu", target: "xue_baochai", type: "marriage", label: "金玉良缘/夫妻" },
  { source: "jia_baoyu", target: "jia_mu", type: "family", label: "祖孙/最宠爱" },
  { source: "jia_baoyu", target: "jia_zheng", type: "family", label: "父子" },
  { source: "jia_baoyu", target: "wang_furen", type: "family", label: "母子" },
  { source: "jia_baoyu", target: "xiren", type: "servant", label: "主仆/情人" },
  { source: "jia_baoyu", target: "qingwen", type: "servant", label: "主仆/深情" },
  { source: "jia_baoyu", target: "shi_xiangyun", type: "family", label: "表兄妹/知己" },
  { source: "jia_baoyu", target: "yuanchun", type: "family", label: "兄妹" },
  { source: "lin_daiyu", target: "jia_mu", type: "family", label: "外祖孙" },
  { source: "lin_daiyu", target: "xue_baochai", type: "rival", label: "竞争/姐妹情" },
  { source: "lin_daiyu", target: "zijuan", type: "servant", label: "主仆/挚友" },
  { source: "lin_daiyu", target: "xiangling", type: "friend", label: "诗歌师生" },
  { source: "xue_baochai", target: "xue_pan", type: "family", label: "姐弟" },
  { source: "xue_baochai", target: "xue_yima", type: "family", label: "母女" },
  { source: "xue_baochai", target: "xiangling", type: "friend", label: "情同姐妹" },
  { source: "wang_xifeng", target: "jia_lian", type: "marriage", label: "夫妻" },
  { source: "wang_xifeng", target: "jia_mu", type: "family", label: "祖孙媳" },
  { source: "wang_xifeng", target: "wang_furen", type: "family", label: "姑侄" },
  { source: "wang_xifeng", target: "pinger", type: "servant", label: "主仆" },
  { source: "wang_xifeng", target: "you_erjie", type: "rival", label: "情敌/迫害" },
  { source: "wang_xifeng", target: "qin_keqing", type: "family", label: "堂妯娌" },
  { source: "jia_mu", target: "jia_zheng", type: "family", label: "母子" },
  { source: "jia_mu", target: "jia_she", type: "family", label: "母子" },
  { source: "jia_mu", target: "shi_xiangyun", type: "family", label: "姑祖母" },
  { source: "jia_zheng", target: "wang_furen", type: "marriage", label: "夫妻" },
  { source: "jia_zheng", target: "yuanchun", type: "family", label: "父女" },
  { source: "jia_zheng", target: "tanchun", type: "family", label: "父女" },
  { source: "jia_zheng", target: "jia_she", type: "family", label: "兄弟" },
  { source: "jia_she", target: "xing_furen", type: "marriage", label: "夫妻" },
  { source: "jia_she", target: "jia_lian", type: "family", label: "父子" },
  { source: "jia_she", target: "yingchun", type: "family", label: "父女" },
  { source: "jia_lian", target: "pinger", type: "servant", label: "主仆/姬妾" },
  { source: "jia_lian", target: "you_erjie", type: "marriage", label: "私妾/夫妻" },
  { source: "jia_zhen", target: "you_shi", type: "marriage", label: "夫妻" },
  { source: "jia_zhen", target: "jia_rong_son", type: "family", label: "父子" },
  { source: "jia_zhen", target: "xichun", type: "family", label: "兄妹" },
  { source: "jia_zhen", target: "qin_keqing", type: "scandal", label: "公媳/暧昧" },
  { source: "jia_rong_son", target: "qin_keqing", type: "marriage", label: "夫妻" },
  { source: "you_erjie", target: "you_sanjie", type: "family", label: "姐妹" },
  { source: "you_sanjie", target: "liu_xianglian", type: "marriage", label: "未婚夫妻" },
  { source: "xue_pan", target: "xiangling", type: "servant", label: "主人/妾" },
  { source: "tanchun", target: "zhao_yiniang", type: "family", label: "母女" },
  { source: "xue_yima", target: "wang_furen", type: "family", label: "姐妹" },
  { source: "you_shi", target: "you_erjie", type: "family", label: "姐妹" },
  { source: "you_shi", target: "you_sanjie", type: "family", label: "姐妹" },
  { source: "miaoyu", target: "xichun", type: "friend", label: "同道" }
];

const FAMILIES = {
  jia_rong: {
    name: "贾家荣府",
    color: "#e63946",
    members: [
      "jia_baoyu", "jia_mu", "jia_zheng", "jia_she", "jia_lian",
      "xing_furen", "tanchun", "yingchun", "yuanchun",
      "xiren", "qingwen", "pinger", "zijuan"
    ]
  },
  jia_ning: {
    name: "贾家宁府",
    color: "#c77dff",
    members: ["jia_zhen", "jia_rong_son", "qin_keqing", "xichun"]
  },
  lin: {
    name: "林家",
    color: "#2196f3",
    members: ["lin_daiyu"]
  },
  xue: {
    name: "薛家",
    color: "#ff9800",
    members: ["xue_baochai", "xue_pan", "xue_yima", "xiangling"]
  },
  shi: {
    name: "史家",
    color: "#4caf50",
    members: ["shi_xiangyun"]
  },
  wang: {
    name: "王家",
    color: "#f06292",
    members: ["wang_xifeng", "wang_furen"]
  },
  you: {
    name: "尤家",
    color: "#80cbc4",
    members: ["you_erjie", "you_sanjie", "you_shi"]
  },
  other: {
    name: "其他",
    color: "#9e9e9e",
    members: ["miaoyu", "liu_xianglian", "zhao_yiniang"]
  }
};
