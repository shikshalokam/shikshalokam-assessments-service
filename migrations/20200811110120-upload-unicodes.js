module.exports = {
  async up(db) {

    global.migrationMsg = "Upload unicodes of emojis and gestures";

    let unicodeArray = [
      {
        description : "grinning face",
        type : "emoji",
        unicode : "\u{1F600}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "grinning face with big eyes",
        type : "emoji",
        unicode : "\u{1F603}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "grinning face with smiling eyes",
        type : "emoji",
        unicode : "\u{1F604}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "beaming face with smiling eyes",
        type : "emoji",
        unicode : "\u{1F601}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "grinning squinting face",
        type : "emoji",
        unicode : "\u{1F606}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "grinning face with sweat",
        type : "emoji",
        unicode : "\u{1F605}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "rolling on the floor laughing",
        type : "emoji",
        unicode : "\u{1F923}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "face with tears of joy",
        type : "emoji",
        unicode : "\u{1F602}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "slightly smiling face",
        type : "emoji",
        unicode : "\u{1F642}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "active"
      },
      {
        description : "upside-down face",
        type : "emoji",
        unicode : "\u{1F643}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "winking face",
        type : "emoji",
        unicode : "\u{1F609}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "smiling face with smiling eyes",
        type : "emoji",
        unicode : "\u{1F60A}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "active"
      },
      {
        description : "smiling face with halo",
        type : "emoji",
        unicode : "\u{1F607}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "smiling face with hearts",
        type : "emoji",
        unicode : "\u{1F970}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "smiling face with heart-eyes",
        type : "emoji",
        unicode : "\u{1F60D}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "star-struck",
        type : "emoji",
        unicode : "\u{1F929}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "smiling face",
        type : "emoji",
        unicode : "\u{263A}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "smiling face with tear",
        type : "emoji",
        unicode : "\u{1F972}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "face savoring food",
        type : "emoji",
        unicode : "\u{1F60B}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "face with tongue",
        type : "emoji",
        unicode : "\u{1F61B}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "winking face with tongue",
        type : "emoji",
        unicode : "\u{1F61C}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "zany face",
        type : "emoji",
        unicode : "\u{1F92A}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "squinting face with tongue",
        type : "emoji",
        unicode : "\u{1F61D}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "money-mouth face",
        type : "emoji",
        unicode : "\u{1F911}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "hugging face",
        type : "emoji",
        unicode : "\u{1F917}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "face with hand over mouth",
        type : "emoji",
        unicode : "\u{1F92D}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "shushing face",
        type : "emoji",
        unicode : "\u{1F92B}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "thinking face",
        type : "emoji",
        unicode : "\u{1F914}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "zipper-mouth face",
        type : "emoji",
        unicode : "\u{1F910}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "face with raised eyebrow",
        type : "emoji",
        unicode : "\u{1F928}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "neutral face",
        type : "emoji",
        unicode : "\u{1F610}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "expressionless face",
        type : "emoji",
        unicode : "\u{1F611}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "face without mouth",
        type : "emoji",
        unicode : "\u{1F636}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "smirking face",
        type : "emoji",
        unicode : "\u{1F60F}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "unamused face",
        type : "emoji",
        unicode : "\u{1F612}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "face with rolling eyes",
        type : "emoji",
        unicode : "\u{1F644}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "grimacing face",
        type : "emoji",
        unicode : "\u{1F62C}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "lying face",
        type : "emoji",
        unicode : "\u{1F925}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "relieved face",
        type : "emoji",
        unicode : "\u{1F60C}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "pensive face",
        type : "emoji",
        unicode : "\u{1F614}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "sleepy face",
        type : "emoji",
        unicode : "\u{1F62A}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "drooling face",
        type : "emoji",
        unicode : "\u{1F924}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "sleeping face",
        type : "emoji",
        unicode : "\u{1F634}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "face with medical mask",
        type : "emoji",
        unicode : "\u{1F637}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "face with thermometer",
        type : "emoji",
        unicode : "\u{1F912}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "face with head-bandage",
        type : "emoji",
        unicode : "\u{1F915}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "nauseated face",
        type : "emoji",
        unicode : "\u{1F922}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "face vomiting",
        type : "emoji",
        unicode : "\u{1F92E}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "sneezing face",
        type : "emoji",
        unicode : "\u{1F927}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "hot face",
        type : "emoji",
        unicode : "\u{1F975}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "cold face",
        type : "emoji",
        unicode : "\u{1F976}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "woozy face",
        type : "emoji",
        unicode : "\u{1F974}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "knocked-out face",
        type : "emoji",
        unicode : "\u{1F635}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "exploding head",
        type : "emoji",
        unicode : "\u{1F92F}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "cowboy hat face",
        type : "emoji",
        unicode : "\u{1F920}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "partying face",
        type : "emoji",
        unicode : "\u{1F973}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "disguised face",
        type : "emoji",
        unicode : "\u{1F978}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "smiling face with sunglasses",
        type : "emoji",
        unicode : "\u{1F60E}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "nerd face",
        type : "emoji",
        unicode : "\u{1F913}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "face with monocle",
        type : "emoji",
        unicode : "\u{1F9D0}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "confused face",
        type : "emoji",
        unicode : "\u{1F615}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "worried face",
        type : "emoji",
        unicode : "\u{1F61F}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "slightly frowning face",
        type : "emoji",
        unicode : "\u{1F641}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "active"
      },
      {
        description : "frowning face",
        type : "emoji",
        unicode : "\u{2639}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "face with open mouth",
        type : "emoji",
        unicode : "\u{1F62E}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "hushed face",
        type : "emoji",
        unicode : "\u{1F62F}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "astonished face",
        type : "emoji",
        unicode : "\u{1F632}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "flushed face",
        type : "emoji",
        unicode : "\u{1F633}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "pleading face",
        type : "emoji",
        unicode : "\u{1F97A}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },  
      {
        description : "frowning face with open mouth",
        type : "emoji",
        unicode : "\u{1F626}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "anguished face",
        type : "emoji",
        unicode : "\u{1F627}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "fearful face",
        type : "emoji",
        unicode : "\u{1F628}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "anxious face with sweat",
        type : "emoji",
        unicode : "\u{1F630}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "sad but relieved face",
        type : "emoji",
        unicode : "\u{1F625}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "crying face",
        type : "emoji",
        unicode : "\u{1F622}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "loudly crying face",
        type : "emoji",
        unicode : "\u{1F62D}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "face screaming in fear",
        type : "emoji",
        unicode : "\u{1F631}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "confounded face",
        type : "emoji",
        unicode : "\u{1F616}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "persevering face",
        type : "emoji",
        unicode : "\u{1F623}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "disappointed face",
        type : "emoji",
        unicode : "\u{1F61E}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "active"
      },
      {
        description : "downcast face with sweat",
        type : "emoji",
        unicode : "\u{1F613}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "weary face",
        type : "emoji",
        unicode : "\u{1F629}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "tired face",
        type : "emoji",
        unicode : "\u{1F62B}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "yawning face",
        type : "emoji",
        unicode : "\u{1F971}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "face with steam from nose",
        type : "emoji",
        unicode : "\u{1F624}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "pouting face",
        type : "emoji",
        unicode : "\u{1F621}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "waving hand",
        type : "gesture",
        unicode : "\u{1F44B}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "raised back of hand",
        type : "gesture",
        unicode : "\u{1F91A}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "hand with fingers splayed",
        type : "gesture",
        unicode : "\u{1F590}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "raised hand",
        type : "gesture",
        unicode : "\u{270B}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "vulcan salute",
        type : "gesture",
        unicode : "\u{1F596}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "OK hand",
        type : "gesture",
        unicode : "\u{1F44C}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "pinched fingers",
        type : "gesture",
        unicode : "\u{1F90C}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "pinching hand",
        type : "gesture",
        unicode : "\u{1F90F}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "victory hand",
        type : "gesture",
        unicode : "\u{270C}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "crossed fingers",
        type : "gesture",
        unicode : "\u{1F91E}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "love-you gesture",
        type : "gesture",
        unicode : "\u{1F91F}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },	
      {
        description : "sign of the horns",
        type : "gesture",
        unicode : "\u{1F918}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "call me hand",
        type : "gesture",
        unicode : "\u{1F919}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "backhand index pointing left",
        type : "gesture",
        unicode : "\u{1F448}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },	
      {
        description : "backhand index pointing right",
        type : "gesture",
        unicode : "\u{1F449}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "backhand index pointing up",
        type : "gesture",
        unicode : "\u{1F446}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "backhand index pointing down",
        type : "gesture",
        unicode : "\u{1F447}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "index pointing up",
        type : "gesture",
        unicode : "\u{261D}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "thumbs up",
        type : "gesture",
        unicode : "\u{1F44D}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "active"
      },		
      {
        description : "thumbs down",
        type : "gesture",
        unicode : "\u{1F44E}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "active"
      },
      {
        description : "raised fist",
        type : "gesture",
        unicode : "\u{270A}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "oncoming fist",
        type : "gesture",
        unicode : "\u{1F44A}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "left-facing fist",
        type : "gesture",
        unicode : "\u{1F91B}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "right-facing fist",
        type : "gesture",
        unicode : "\u{1F91C}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "clapping hands",
        type : "gesture",
        unicode : "\u{1F44F}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "raising hands",
        type : "gesture",
        unicode : "\u{1F64C}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "open hands",
        type : "gesture",
        unicode : "\u{1F450}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "palms up together",
        type : "gesture",
        unicode : "\u{1F61F}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "handshake",
        type : "gesture",
        unicode : "\u{1F91D}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "folded hands",
        type : "gesture",
        unicode : "\u{1F64F}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      },
      {
        description : "writing hand",
        type : "gesture",
        unicode : "\u{270D}",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "inactive"
      }
    ];

    
    await db.collection('unicodes').insertMany(unicodeArray);
    await db.collection('unicodes').createIndex({ unicode : 1 });    
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
