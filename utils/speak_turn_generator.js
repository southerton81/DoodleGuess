var HttpUtils = require('./../utils/http_utils');

var vocabulary = ["area",
    "book",
    "business",
    "case",
    "child",
    "company",
    "country",
    "day",
    "eye",
    "fact",
    "family",
    "group",
    "hand",
    "home",
    "life",
    "lot",
    "man",
    "money",
    "month",
    "mother",
    "night",
    "number",
    "part",
    "people",
    "place",
    "point",
    "problem",
    "program",
    "question",
    "right",
    "room",
    "school",
    "state",
    "story",
    "student",
    "study",
    "system",
    "thing",
    "time",
    "water",
    "way",
    "week",
    "word",
    "work",
    "world",
    "year"];

var SpeakTurnGenerator = {}

SpeakTurnGenerator.generateSpeakTurn = function () {
    var index = vocabulary.length * Math.random();
    index = Math.round(index);
    var request = "https://api.flickr.com/services/feeds/photos_public.gne?tags=" + vocabulary[index] + "&format=json&nojsoncallback=1";
    return HttpUtils.get(request);
}

module.exports = SpeakTurnGenerator;